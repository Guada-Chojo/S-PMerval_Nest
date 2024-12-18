import { InjectRepository } from "@nestjs/typeorm";
import { Indice } from "./entities/indice.entity";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Between, FindManyOptions, Not, Repository } from "typeorm";
import { Cotizacion } from "src/empresa/entities/cotizacion.entity";
import { GempresaService } from "src/services/gempresa.service";
import { IIndice } from "./model/IIndice";
import DateUtils from "src/utils/dateUtils";
import * as momentTZ from 'moment-timezone';


@Injectable()
export class IndiceService {
  private logger: Logger = new Logger(IndiceService.name);

  constructor(
    @InjectRepository(Indice)
    private readonly indiceRepository: Repository<Indice>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    private readonly gempresaService: GempresaService
  ) { }

  //Calcula el indice Merval para los dias y horas faltantes
  async calcularIndices() {
    try {
      //Busco el ultimo indice guardado
      const ultIndice: Indice[] = await this.indiceRepository.find({
        where: {
          codigoIndice: 'IMV'
        },
        order: {
          fecha: "DESC",
          hora: "DESC"
        },
        take: 1
      });

      let fechaUltIndice = '2023-12-31';
      //Si existen indices calculados, tomo la fecha y hora del ultimo
      if (ultIndice.length != 0) {
        fechaUltIndice = ultIndice[0].fecha;
      }

      //Calculo los indices faltantes
      const sql: string = `select 'IMV' codigoIndice,avg(c.cotization)as valorIndice,c.fecha ,c.hora from cotizaciones c  where fecha >= '${fechaUltIndice}' group by c.fecha , c.hora order by c.fecha,c.hora`

      const indices: Indice[] = await this.cotizacionRepository.query(sql);

      if (!indices) {
        throw new HttpException(
          'No existen cotizaciones para calcular indices',
          HttpStatus.NOT_FOUND,
        );
      }

      //Inserto los indices en la tabla y lo envio a Gempresa
      indices.forEach(async (indice: Indice) => {
        if (indice.fecha == fechaUltIndice && indice.hora > ultIndice[0].hora) {
          await this.indiceRepository.save(indice);
          await this.gempresaService.postIndice(indice);
        } else if (indice.fecha != fechaUltIndice) {
          await this.indiceRepository.save(indice);
          await this.gempresaService.postIndice(indice);
        }
      })
    } catch (error) {
      this.logger.error(error);
    }
  }

  //Obtengo la ultima cotizacion guardada de un indice
  async getUltimoValorIndice(codigoIndice: string): Promise<Indice> {
    const criterio: FindManyOptions<Indice> = {
      where: { codigoIndice: codigoIndice },
      order: {
        fecha: "DESC",
        hora: "DESC"
      },
      take: 1,
    };

    const ultCotizacion = await this.indiceRepository.find(criterio);
    return ultCotizacion[0];
  }


  //Obtengo de Gempresa los indices de las demas bolsas y los guardo en mi base de datos
  async obtenerIndices() {
    try {
      //Busco todas los indices
      const indices: any[] = await this.gempresaService.getIndices();
      console.log(indices)
      //Ls recorro para buscar las cotizaciones faltantes
      indices.forEach(async indice => {
        if (indice.code != 'IMV') {
          //Busco la ultima cotizacion guardada de la empresa
          let ultimaCot: Indice = await this.getUltimoValorIndice(indice.code);

          let fechaDesde = ''
          if (!ultimaCot) {
            fechaDesde = '2024-01-01T00:00';
          } else {
            //Le agrego una hora a la fecha y hora de la ultima cotizacion guardada
            fechaDesde = (DateUtils.agregarUnaHora(DateUtils.getFechaFromRegistroFecha({ fecha: ultimaCot.fecha, hora: ultimaCot.hora }))).toISOString().substring(0, 16);
          }
          console.log(fechaDesde);
          

          //Fecha Hasta es este momento
          const fechaHasta = (new Date()).toISOString().substring(0, 16);
          console.log(fechaHasta);
          
          //Busco las cotizaciones faltantes
          const cotizaciones = await this.gempresaService.getCotizacionesIndices(indice.code, fechaDesde, fechaHasta);
          console.log(cotizaciones);
          
          //Chequeo que las cotizaciones sean de dias habiles y de los horarios en que esta la bolsa abierta
          if(cotizaciones) {
            const cotizacionesValidas = cotizaciones.filter((cot) => {
              let validoDia = true;
              let validoHora = true;
              const horaApertura = '09:00'
              const horaCierre = '15:00'
              
              const dia = (DateUtils.getFechaFromRegistroFecha({ fecha: cot.fecha, hora: cot.hora })).getDay();
      
              if (dia == 0 || dia == 6) {
                validoDia = false;
              }
              if (cot.hora < horaApertura|| cot.hora > horaCierre) {
                validoHora = false;
              }
              return validoDia && validoHora;
            })

            if (cotizacionesValidas) {
              //Las inserto en la tabla cotizaciones
              cotizacionesValidas.forEach(async cotizacion => {
                this.indiceRepository.save({
                  codigoIndice: cotizacion.code,
                  valorIndice: cotizacion.valor,
                  fecha: cotizacion.fecha,
                  hora: cotizacion.hora.substring(0,5),
                  id: null
                });
              })
            }
          }
        }
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
  // Obtengo las cotizaciones de un indice en un rango de fechas establecido
  async getIndicesbyFecha(codigoIndice: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<Indice[]> {
    const fechaDesdeArray = fechaDesde.split('T');
    const fechaHastaArray = fechaHasta.split('T');

    try {
      const criterio: FindManyOptions<Indice> = {
        where: {
          codigoIndice: codigoIndice,
          fecha: Between(fechaDesdeArray[0], fechaHastaArray[0])
        },
        order: {
          fecha: "ASC",
          hora: "ASC"
        },
      };

      const cotizaciones: Indice[] =
        await this.indiceRepository.find(criterio);
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


 //Pido la ultima cotizacion del indice de la bolsa y la variacion diaria
    async cotizacionActualIndice(): Promise<any> {

      //Las recorro para buscar las cotizaciones actuales
      let ultimaCot = await this.getUltimoValorIndice('IMV');
      if (!ultimaCot) {
        ultimaCot = {
          id: -1,
          hora: '23:00',
          fecha:'2023-12-31',
          codigoIndice: 'IMV',
          valorIndice: 0,
        }
      }
  
      //Busco la cotizacion de cierre anterior
      const criterio: FindManyOptions<Indice> = {
        where: { codigoIndice: 'IMV' , hora: '15:00', fecha: Not(ultimaCot.fecha) },
        order: {
          fecha: "DESC"
        },
        take: 1,
      };
      let cotAnterior: Indice[] = await this.indiceRepository.find(criterio);
  
      const variacion = Number(((ultimaCot.valorIndice - cotAnterior[0].valorIndice) / cotAnterior[0].valorIndice * 100).toFixed(2));
      return ({
        codigoIndice: 'IMV',
        ultimaCot: ultimaCot.valorIndice,
        variacion: variacion
      });
      }

  // Obtengo los datos para cargar el grafico, segun cantidad de días
  async getDatosGrafico(criterio: { dias: number, allIndices: number }) {

    const ultIndice = await this.getUltimoValorIndice('IMV');

    const fechaHasta = `${ultIndice.fecha}T${ultIndice.hora}`
    const fechaDesde = momentTZ.tz(new Date(), 'America/Argentina/Buenos_Aires').add(-criterio.dias, 'days').toISOString().substring(0, 16);
    /* const fechaHasta = momentTZ.tz(new Date(), 'America/Argentina/Buenos_Aires').toISOString().substring(0, 16); */

    let codIndices: any[] = [];

    if (criterio.allIndices == 1) {
      codIndices = await this.gempresaService.getIndices();
    } else {
      codIndices.push({ codigoIndice: 'IMV', nombre: 'S&P MERVAL Index' });
    }

    const indices = codIndices.filter((indice:any) => indice.code);

    const cotizaciones = indices.map(async indice => {
      const datosIndice = await this.getIndicesbyFecha(indice.code, fechaDesde, fechaHasta);
      return datosIndice;
    });
    const datos = await Promise.all(cotizaciones);
    const datosFiltrados = datos.filter(dataset => dataset.length != 0)
    console.log('Datos filtrados:',datosFiltrados);
    
    return datosFiltrados;
  }


}