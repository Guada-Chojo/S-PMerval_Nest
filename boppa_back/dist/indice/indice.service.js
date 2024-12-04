"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IndiceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndiceService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const indice_entity_1 = require("./entities/indice.entity");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const cotizacion_entity_1 = require("src/empresa/entities/cotizacion.entity");
const gempresa_service_1 = require("src/services/gempresa.service");
const dateUtils_1 = require("src/utils/dateUtils");
const momentTZ = require("moment-timezone");
let IndiceService = IndiceService_1 = class IndiceService {
    constructor(indiceRepository, cotizacionRepository, gempresaService) {
        this.indiceRepository = indiceRepository;
        this.cotizacionRepository = cotizacionRepository;
        this.gempresaService = gempresaService;
        this.logger = new common_1.Logger(IndiceService_1.name);
    }
    async calcularIndices() {
        try {
            const ultIndice = await this.indiceRepository.find({
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
            if (ultIndice.length != 0) {
                fechaUltIndice = ultIndice[0].fecha;
            }
            const sql = `select 'IMV' codigoIndice,avg(c.cotization)as valorIndice,c.fecha ,c.hora from cotizaciones c  where fecha >= '${fechaUltIndice}' group by c.fecha , c.hora order by c.fecha,c.hora`;
            const indices = await this.cotizacionRepository.query(sql);
            if (!indices) {
                throw new common_1.HttpException('No existen cotizaciones para calcular indices', common_1.HttpStatus.NOT_FOUND);
            }
            indices.forEach(async (indice) => {
                if (indice.fecha == fechaUltIndice && indice.hora > ultIndice[0].hora) {
                    await this.indiceRepository.save(indice);
                    await this.gempresaService.postIndice(indice);
                }
                else if (indice.fecha != fechaUltIndice) {
                    await this.indiceRepository.save(indice);
                    await this.gempresaService.postIndice(indice);
                }
            });
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async getUltimoValorIndice(codigoIndice) {
        const criterio = {
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
    async obtenerIndices() {
        try {
            const indices = await this.gempresaService.getIndices();
            console.log(indices);
            indices.forEach(async (indice) => {
                if (indice.code != 'IMV') {
                    let ultimaCot = await this.getUltimoValorIndice(indice.code);
                    let fechaDesde = '';
                    if (!ultimaCot) {
                        fechaDesde = '2024-01-01T00:00';
                    }
                    else {
                        fechaDesde = (dateUtils_1.default.agregarUnaHora(dateUtils_1.default.getFechaFromRegistroFecha({ fecha: ultimaCot.fecha, hora: ultimaCot.hora }))).toISOString().substring(0, 16);
                    }
                    console.log(fechaDesde);
                    const fechaHasta = (new Date()).toISOString().substring(0, 16);
                    console.log(fechaHasta);
                    const cotizaciones = await this.gempresaService.getCotizacionesIndices(indice.code, fechaDesde, fechaHasta);
                    console.log(cotizaciones);
                    if (cotizaciones) {
                        const cotizacionesValidas = cotizaciones.filter((cot) => {
                            let validoDia = true;
                            let validoHora = true;
                            const horaApertura = '09:00';
                            const horaCierre = '15:00';
                            const dia = (dateUtils_1.default.getFechaFromRegistroFecha({ fecha: cot.fecha, hora: cot.hora })).getDay();
                            if (dia == 0 || dia == 6) {
                                validoDia = false;
                            }
                            if (cot.hora < horaApertura || cot.hora > horaCierre) {
                                validoHora = false;
                            }
                            return validoDia && validoHora;
                        });
                        if (cotizacionesValidas) {
                            cotizacionesValidas.forEach(async (cotizacion) => {
                                this.indiceRepository.save({
                                    codigoIndice: cotizacion.code,
                                    valorIndice: cotizacion.valor,
                                    fecha: cotizacion.fecha,
                                    hora: cotizacion.hora.substring(0, 5),
                                    id: null
                                });
                            });
                        }
                    }
                }
            });
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async getIndicesbyFecha(codigoIndice, fechaDesde, fechaHasta) {
        const fechaDesdeArray = fechaDesde.split('T');
        const fechaHastaArray = fechaHasta.split('T');
        try {
            const criterio = {
                where: {
                    codigoIndice: codigoIndice,
                    fecha: (0, typeorm_2.Between)(fechaDesdeArray[0], fechaHastaArray[0])
                },
                order: {
                    fecha: "ASC",
                    hora: "ASC"
                },
            };
            const cotizaciones = await this.indiceRepository.find(criterio);
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
        catch (error) {
            this.logger.error(error);
        }
    }
    async cotizacionActualIndice() {
        const ultimaCot = await this.getUltimoValorIndice('IMV');
        const criterio = {
            where: { codigoIndice: 'IMV', hora: '15:00', fecha: (0, typeorm_2.Not)(ultimaCot.fecha) },
            order: {
                fecha: "DESC"
            },
            take: 1,
        };
        const cotAnterior = await this.indiceRepository.find(criterio);
        const variacion = Number(((ultimaCot.valorIndice - cotAnterior[0].valorIndice) / cotAnterior[0].valorIndice * 100).toFixed(2));
        return ({
            codigoIndice: 'N100',
            ultimaCot: ultimaCot.valorIndice,
            variacion: variacion
        });
    }
    async getDatosGrafico(criterio) {
        const ultIndice = await this.getUltimoValorIndice('IMV');
        const fechaHasta = `${ultIndice.fecha}T${ultIndice.hora}`;
        const fechaDesde = momentTZ.tz(new Date(), 'America/Argentina/Buenos_Aires').add(-criterio.dias, 'days').toISOString().substring(0, 16);
        let codIndices = [];
        if (criterio.allIndices == 1) {
            codIndices = await this.gempresaService.getIndices();
        }
        else {
            codIndices.push({ codigoIndice: 'IMV', nombre: 'S&P MERVAL Index' });
        }
        const indices = codIndices.filter((indice) => indice.code);
        const cotizaciones = indices.map(async (indice) => {
            const datosIndice = await this.getIndicesbyFecha(indice.code, fechaDesde, fechaHasta);
            return datosIndice;
        });
        const datos = await Promise.all(cotizaciones);
        const datosFiltrados = datos.filter(dataset => dataset.length != 0);
        console.log('Datos filtrados:', datosFiltrados);
        return datosFiltrados;
    }
};
exports.IndiceService = IndiceService;
exports.IndiceService = IndiceService = IndiceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(indice_entity_1.Indice)),
    __param(1, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        gempresa_service_1.GempresaService])
], IndiceService);
//# sourceMappingURL=indice.service.js.map