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

// Get datos de empresas
  async getAllEmpresas(): Promise<any> {
    try {
      const empresaResponse: Empresa[] = await this.empresaRepository.find();
      return empresaResponse;
    } catch (error) {
      this.logger.error(error);
    }
  }

  //Get ultimos valores de cotización de una empresa
  async getUltimaCotizacion (codigoEmpresa: string): Promise<Cotizacion[]> {
    try {
    const criterio: FindManyOptions<Cotizacion> = { 
      where: {empresa : {codEmpresa : codigoEmpresa}},
      order: {
          dateUTC: "DESC",
          hora: "DESC"
      },
      take: 1,
      };

      const ultCotizaciones = await this.cotizacionRepository.find(criterio);
      return ultCotizaciones;
    } catch (error) {
      this.logger.error(error);
    }
   };

   //Creo la cotización de una empresa en la base de datos
  async newCotizacion(cotizacion: Cotizacion): Promise<Cotizacion> {
    try {
      return await this.cotizacionRepository.save(cotizacion);
    } catch (error) {
      this.logger.error(error);
    }
  }

   // Obtengo las cotizaciones de todas las empresas de la bolsa de Gempresa
   async obtenerDatosEmpresas() {
    //Traigo todas las empresas
    const empresas: Empresa[] = await this.getAllEmpresas();

    //Recorro el array buscando las cotizaciones faltantes
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
      fechaDesde = momentTZ.tz(fechaDesde,'America/Argentina/Buenos_Aires').utc().add(1,'hour').toISOString().substring(0,16);

      //Fecha Hasta es este momento
      const fechaHasta = (new Date()).toISOString().substring(0, 16);

      //Busco las cotizaciones faltantes
      const cotizaciones: Cotizacion[] = await this.gempresaService.getCotizaciones(empresa.codEmpresa, fechaDesde, fechaHasta);

      //9 a 15 hora Argentina (8 a 14 hora UTC)
      const cotizacionesValidas = cotizaciones.filter((cot) => {
        let validoDia = true;
        let validoHora = true;
        const horaAperturaUTC = momentTZ.tz(cot.fecha + ' ' + '09:00','America/Argentina/Buenos_Aires').utc().format('HH:mm');
        const horaCierreUTC = momentTZ.tz(cot.fecha + ' ' + '15:00','America/Argentina/Buenos_Aires').utc().format('HH:mm');
        console.log(horaAperturaUTC);
        console.log(horaCierreUTC);
        
        const dia = (DateUtils.getFechaFromRegistroFecha({ fecha: cot.fecha, hora: cot.hora })).getDay();

        if (dia == 0 || dia == 6) {
          validoDia = false;
        }
        if (cot.hora < horaAperturaUTC|| cot.hora > horaCierreUTC) {
          validoHora = false;
        }
        return validoDia && validoHora;
      })

      //Las inserto en la tabla cotizaciones con la hora de Argentina
      cotizacionesValidas.forEach(async cotizacion => {
        const fechaBuenosAires = momentTZ.utc(cotizacion.fecha + ' ' + cotizacion.hora).tz('America/Argentina/Buenos_Aires');
        this.newCotizacion({
          fecha: fechaBuenosAires.format('YYYY-MM-DD'),
          hora: fechaBuenosAires.format('HH:mm'),
          dateUTC: cotizacion.dateUTC,
          cotization: cotizacion.cotization,
          empresa: empresa,
          id: null
        });
      })

    });
  }

  // Pido las ultimas cotizaciones de cada empresa y la variacion diaria
  async cotizacionActual(): Promise<any[]> {
    //Busco todas las empresas de la bolsa
    const empresas: Empresa[] = await this.getAllEmpresas();

    //Las recorro para buscar las cotizaciones actuales
    let cotizaciones = await Promise.all(empresas.map(async empresa => {
      //Busco la ultima cotizacion guardada de la empresa
      const ultimaCot = await this.getUltimaCotizacion(empresa.codEmpresa);

      //Busco la cotizacion de cierre anterior
      const criterio: FindManyOptions<Cotizacion> = {
        where: { empresa: { codEmpresa: empresa.codEmpresa }, hora: '15:00', fecha: Not(ultimaCot[0].fecha) },
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


// Obtengo las cotizaciones de una empresa en un rango de fechas y horas dados
  async getCotizacionesByFecha(codigoEmpresa: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<Cotizacion[]> {
    const fechaDesdeArray = fechaDesde.split('T');
    const fechaHastaArray = fechaHasta.split('T');

    try {
      const criterio: FindManyOptions<Cotizacion> = {
        where: {
          empresa: {
            codEmpresa: codigoEmpresa,
          },
          dateUTC: Between(fechaDesdeArray[0], fechaHastaArray[0]),
        },
        order: {
          fecha: "ASC",
          hora: "ASC"
        },
      };

      const cotizaciones: Cotizacion[] =
        await this.cotizacionRepository.find(criterio);
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

  // Obtengo los datos para cargar el grafico, segun cantidad de días a mostrar y la empresa seleccionad
  async getDatosGrafico(codEmpresa: string,dias: number) {
    const fechaDesde = momentTZ.tz(new Date(), 'America/Argentina/Buenos_Aires').add(-dias, 'days').toISOString().substring(0, 16);
    const fechaHasta = momentTZ.tz(new Date(), 'America/Argentina/Buenos_Aires').toISOString().substring(0, 16);
    const cotizaciones = await this.getCotizacionesByFecha(codEmpresa, fechaDesde, fechaHasta);
    const datos = await Promise.all(cotizaciones);
    console.log(datos);
    
    return datos;
  }

  // Calculo la participacion de cada empresa en la bolsa 
  async participacionEmpresas(){
    const empresas: Empresa[] = await this.getAllEmpresas();

    const empresasConValor = await Promise.all(empresas.map (async empresa => {
      const ultCotizacion = await this.getUltimaCotizacion(empresa.codEmpresa);

      const valorEmpresa = empresa.cantidadAcciones*ultCotizacion[0].cotization;

      return {
        ...empresa,
        valorEmpresa: valorEmpresa,
      }
    }))
    
    let valorTotal = 0;
    empresasConValor.map(empresa => {
       valorTotal += empresa.valorEmpresa
    })

    const participacionEmpresas = empresasConValor.map(empresa => {
      return {
        ...empresa,
        participacionMercado: (empresa.valorEmpresa/valorTotal*100).toFixed(2),
      }
    })

    return participacionEmpresas;

  }
}