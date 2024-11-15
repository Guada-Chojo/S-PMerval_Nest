import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';
import { RegistroFecha } from 'src/model/registro.fecha';

@Injectable()
export class EmpresaService {
  private logger: Logger = new Logger(EmpresaService.name);

  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
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

  async getUltimaCotizacion (codigoEmpresa: string): Promise<Cotizacion> {
    const criterio: FindManyOptions<Cotizacion> = { 
      where: {empresa : {codEmpresa : codigoEmpresa}},
      order: {
          dateUTC: "DESC",
          hora: "DESC"
      },
      take: 1,
   };

    const ultCotizacion = await this.cotizacionRepository.find(criterio);
    return ultCotizacion[0];
  }

  async getLast20CotizacionEmpresa(empresaId: number) {
    try {
      const sql = `select * from cotizaciones where idEmpresa = ${empresaId} order by dateUTC desc, hora desc limit 20`;
      const response = await this.cotizacionRepository.query(sql);
      return response;
    } catch (error) {
      this.logger.error(error);
    }
    return [];
  }

  async newCotizacion(newCot: Cotizacion): Promise<Cotizacion> {
    return await this.cotizacionRepository.save(newCot);
  }

  async getFechaCotization(
    codigoEmpresa: string,
    regFecha: RegistroFecha,
  ): Promise<Cotizacion> {
    const criterio: FindOptionsWhere<Cotizacion> = {
      empresa: {
        codEmpresa: codigoEmpresa,
      },
      fecha: regFecha.fecha,
      hora: regFecha.hora,
    };
    const cotizacion: Cotizacion =
      await this.cotizacionRepository.findOneBy(criterio);

    if (cotizacion) {
      return cotizacion;
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error:
          'No se encuentra cotizacion para ' +
          codigoEmpresa +
          ' ' +
          regFecha.fecha +
          ' ' +
          regFecha.hora,
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async getCotizationesEntreFechas(
    codigoEmpresa: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<Cotizacion[]> {
    const fechaDesdeArray = fechaDesde.split('T');
    const fechaHastaArray = fechaHasta.split('T');
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
  }
}
