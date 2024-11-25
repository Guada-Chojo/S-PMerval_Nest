import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOptionsWhere, Not, Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';
import { GempresaService } from "src/services/gempresa.service";
import DateUtils from "src/utils/dateUtils";
import * as momentTZ from 'moment-timezone';

@Injectable()
export class EmpresaService {
  private logger: Logger = new Logger(EmpresaService.name);

  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    private readonly gempresaService: GempresaService
  ) {}


  async getAllEmpresas(): Promise<any> {
    try {
      const empresaResponse: Empresa[] = await this.empresaRepository.find();
      return empresaResponse;
    } catch (error) {
      this.logger.error(error);
    }
    return [];
  }

  async getUltimaCotizacion (codigoEmpresa: string): Promise<Cotizacion[]> {
    try {
    const criterio: FindManyOptions<Cotizacion> = { 
      where: {empresa : {codEmpresa : codigoEmpresa}},
      order: {
          dateUTC: "DESC",
          hora: "DESC"
      },
      take: 1,
        relations: { empresa: true }
      };

      const ultCotizacion = await this.cotizacionRepository.find(criterio);
      return ultCotizacion;
    } catch (error) {
      this.logger.error(error);
    }
   };

  async getHoraDiaCotizacionEmpresa(empresaId: number) {
    try {
      const sql = `select * from cotizaciones where idEmpresa = ${empresaId} order by dateUTC desc, hora desc limit 7`;
      const response = await this.cotizacionRepository.query(sql);
      return response;
    } catch (error) {
      this.logger.error(error);
    }
    return [];
  }

  async getDiaMesCotizacionEmpresa(empresaId: number) {
    try {
      const sql = `select * from cotizaciones where idEmpresa = ${empresaId} order by dateUTC desc, hora desc limit 24`;
      const response = await this.cotizacionRepository.query(sql);
      return response;
    } catch (error) {
      this.logger.error(error);
    }
    return [];
  }

   //Obtengo las cotizaciones de una empresa en un rango de fechas y horas dados
   async getCotizacionesByFecha(codigoEmpresa: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<Cotizacion[]> {
    const fechaDesdeArray = fechaDesde.split('T');
    const fechaHastaArray = fechaHasta.split('T');

    try {
      const criterio: FindOptionsWhere<Cotizacion> = {
        empresa: {
          codEmpresa: codigoEmpresa,
        },
        dateUTC: Between(fechaDesdeArray[0], fechaHastaArray[0]),
      };

      const cotizaciones: Cotizacion[] =
        await this.cotizacionRepository.findBy(criterio);
      return cotizaciones.filter((cot) => {
        let validoDesde = true;
        let validoHasta = true;
        if (cot.fecha == fechaDesdeArray[0]) {
          if (cot.hora < fechaDesdeArray[1]) {
            validoDesde = false;
          }
        }
        if (cot.fecha == fechaHastaArray[0]) {
          if (cot.hora > fechaHastaArray[1]) {
            validoHasta = false;
          }
        }
        return validoDesde && validoHasta;
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async newCotizacion(newCot: Cotizacion): Promise<Cotizacion> {
    return await this.cotizacionRepository.save(newCot);
  }

  /**
   * Obtengo las cotizaciones de todas las empresas de la bolsa de Gempresa
   */
  async obtenerDatosEmpresas() {
    //Busco todas las empresas de la bolsa
    const empresas: Empresa[] = await this.getAllEmpresas();

    //Las recorro para buscar las cotizaciones faltantes
    empresas.forEach(async empresa => {
      //Busco la ultima cotizacion guardada de la empresa
      const ultimasCot: Cotizacion[] = await this.getUltimaCotizacion(empresa.codEmpresa);
      let ultimaCot = ultimasCot[0];

      let fechaDesde = '';
      if (!ultimaCot) {
        fechaDesde = '2024-01-01T01:00:00.000Z';
      } else {
        fechaDesde = ultimaCot.fecha+'T'+ultimaCot.hora
      }
      //La fecha desde será la fecha y hora de la ult cotizacion convertida a UTC mas una hora (en este caso vuelve a quedar la misma fecha desde porq Amsterdam es UTC+1)
      fechaDesde = momentTZ.tz(fechaDesde,process.env.TIME_ZONE).utc().add(1,'hour').toISOString().substring(0,16);

      //Fecha Hasta es este momento
      const fechaHasta = (new Date()).toISOString().substring(0, 16);

      //Busco las cotizaciones faltantes
      const cotizaciones: Cotizacion[] = await this.gempresaService.getCotizaciones(empresa.codEmpresa, fechaDesde, fechaHasta);

      //Tengo que chequear que esten dentro de los rangos que me interesan (Lu a Vi de 9 a 15hs (hora de amsterdam))
      //O sea de 8 a 14 hora UTC
      const cotizacionesValidas = cotizaciones.filter((cot) => {
        let validoDia = true;
        let validoHora = true;
        const dia = (DateUtils.getFechaFromRegistroFecha({ fecha: cot.fecha, hora: cot.hora })).getDay();

        if (dia == 0 || dia == 6) {
          validoDia = false;
        }
        if (cot.hora < process.env.HORA_APERTURA_UTC || cot.hora > process.env.HORA_CIERRE_UTC) {
          validoHora = false;
        }
        return validoDia && validoHora;
      })

      //Las inserto en la tabla cotizaciones con la hora de amsterdam
      cotizacionesValidas.forEach(async cotizacion => {
        const fechaAmsterdam = momentTZ.utc(cotizacion.fecha + ' ' + cotizacion.hora).tz(process.env.TIME_ZONE);
        this.newCotizacion({
          fecha: fechaAmsterdam.format('YYYY-MM-DD'),
          hora: fechaAmsterdam.format('HH:mm'),
          dateUTC: cotizacion.dateUTC,
          cotization: cotizacion.cotization,
          empresa: empresa,
          id: null
        });
      })

    });
  }

  /**
   * Funcion que retorna las ultimas cotizaciones de cada empresa y la variacion diaria
   */
  async cotizacionActual(): Promise<any[]> {
    //Busco todas las empresas de la bolsa
    const empresas: Empresa[] = await this.getAllEmpresas();

    //Las recorro para buscar las cotizaciones faltantes
    let cotizaciones = await Promise.all(empresas.map(async empresa => {
      //Busco la ultima cotizacion guardada de la empresa
      const ultimaCot = await this.getUltimaCotizacion(empresa.codEmpresa);

      //Busco la cotizacion de cierre anterior
      const horaCierre = '14:00'
      const criterio: FindManyOptions<Cotizacion> = {
        where: { empresa: { codEmpresa: empresa.codEmpresa }, hora: process.env.HORA_CIERRE, fecha: Not(ultimaCot[0].fecha) },
        order: {
          fecha: "DESC"
        },
        take: 1,
      };
      const cotAnterior = await this.cotizacionRepository.find(criterio);

      const variacion = Number(((ultimaCot[0].cotization - cotAnterior[0].cotization) / cotAnterior[0].cotization * 100).toFixed(2));
      return ({
        codEmpresa: empresa.codEmpresa,
        empresaNombre: empresa.empresaNombre,
        ultimaCot: ultimaCot[0].cotization,
        variacion: variacion
      });
    })
    );
    return cotizaciones;
  }
}
