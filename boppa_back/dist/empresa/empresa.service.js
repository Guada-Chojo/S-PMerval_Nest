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
var EmpresaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const empresa_entity_1 = require("./entities/empresa.entity");
const cotizacion_entity_1 = require("./entities/cotizacion.entity");
const gempresa_service_1 = require("../services/gempresa.service");
const dateUtils_1 = require("../utils/dateUtils");
const momentTZ = require("moment-timezone");
let EmpresaService = EmpresaService_1 = class EmpresaService {
    constructor(empresaRepository, cotizacionRepository, gempresaService) {
        this.empresaRepository = empresaRepository;
        this.cotizacionRepository = cotizacionRepository;
        this.gempresaService = gempresaService;
        this.logger = new common_1.Logger(EmpresaService_1.name);
    }
    async getAllEmpresas() {
        try {
            const empresaResponse = await this.empresaRepository.find();
            return empresaResponse;
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async getUltimaCotizacion(codigoEmpresa) {
        try {
            const criterio = {
                where: { empresa: { codEmpresa: codigoEmpresa } },
                order: {
                    dateUTC: "DESC",
                    hora: "DESC"
                },
                take: 1,
            };
            const ultCotizaciones = await this.cotizacionRepository.find(criterio);
            return ultCotizaciones;
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    ;
    async newCotizacion(cotizacion) {
        try {
            return await this.cotizacionRepository.save(cotizacion);
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async obtenerDatosEmpresas() {
        const empresas = await this.getAllEmpresas();
        empresas.forEach(async (empresa) => {
            const ultimasCot = await this.getUltimaCotizacion(empresa.codEmpresa);
            let ultimaCot = ultimasCot[0];
            let fechaDesde = '';
            if (!ultimaCot) {
                fechaDesde = '2024-01-01T01:00:00.000Z';
            }
            else {
                fechaDesde = ultimaCot.fecha + 'T' + ultimaCot.hora;
            }
            fechaDesde = momentTZ.tz(fechaDesde, 'America/Argentina/Buenos_Aires').utc().add(1, 'hour').toISOString().substring(0, 16);
            const fechaHasta = (new Date()).toISOString().substring(0, 16);
            const cotizaciones = await this.gempresaService.getCotizaciones(empresa.codEmpresa, fechaDesde, fechaHasta);
            const cotizacionesValidas = cotizaciones.filter((cot) => {
                let validoDia = true;
                let validoHora = true;
                const horaAperturaUTC = momentTZ.tz(cot.fecha + ' ' + '09:00', 'America/Argentina/Buenos_Aires').utc().format('HH:mm');
                const horaCierreUTC = momentTZ.tz(cot.fecha + ' ' + '15:00', 'America/Argentina/Buenos_Aires').utc().format('HH:mm');
                console.log(horaAperturaUTC);
                console.log(horaCierreUTC);
                const dia = (dateUtils_1.default.getFechaFromRegistroFecha({ fecha: cot.fecha, hora: cot.hora })).getDay();
                if (dia == 0 || dia == 6) {
                    validoDia = false;
                }
                if (cot.hora < horaAperturaUTC || cot.hora > horaCierreUTC) {
                    validoHora = false;
                }
                return validoDia && validoHora;
            });
            cotizacionesValidas.forEach(async (cotizacion) => {
                const fechaBuenosAires = momentTZ.utc(cotizacion.fecha + ' ' + cotizacion.hora).tz('America/Argentina/Buenos_Aires');
                this.newCotizacion({
                    fecha: fechaBuenosAires.format('YYYY-MM-DD'),
                    hora: fechaBuenosAires.format('HH:mm'),
                    dateUTC: cotizacion.dateUTC,
                    cotization: cotizacion.cotization,
                    empresa: empresa,
                    id: null
                });
            });
        });
    }
    async cotizacionActual() {
        const empresas = await this.getAllEmpresas();
        let cotizaciones = await Promise.all(empresas.map(async (empresa) => {
            const ultimaCot = await this.getUltimaCotizacion(empresa.codEmpresa);
            const criterio = {
                where: { empresa: { codEmpresa: empresa.codEmpresa }, hora: '15:00', fecha: (0, typeorm_2.Not)(ultimaCot[0].fecha) },
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
        }));
        return cotizaciones;
    }
    async getCotizacionesByFecha(codigoEmpresa, fechaDesde, fechaHasta) {
        const fechaDesdeArray = fechaDesde.split('T');
        const fechaHastaArray = fechaHasta.split('T');
        try {
            const criterio = {
                where: {
                    empresa: {
                        codEmpresa: codigoEmpresa,
                    },
                    dateUTC: (0, typeorm_2.Between)(fechaDesdeArray[0], fechaHastaArray[0]),
                },
                order: {
                    fecha: "ASC",
                    hora: "ASC"
                },
            };
            const cotizaciones = await this.cotizacionRepository.find(criterio);
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
    async getDatosGrafico(codEmpresa, dias) {
        const fechaDesde = momentTZ.tz(new Date(), 'America/Argentina/Buenos_Aires').add(-dias, 'days').toISOString().substring(0, 16);
        const fechaHasta = momentTZ.tz(new Date(), 'America/Argentina/Buenos_Aires').toISOString().substring(0, 16);
        const cotizaciones = await this.getCotizacionesByFecha(codEmpresa, fechaDesde, fechaHasta);
        const datos = await Promise.all(cotizaciones);
        console.log(datos);
        return datos;
    }
    async participacionEmpresas() {
        const empresas = await this.getAllEmpresas();
        const empresasConValor = await Promise.all(empresas.map(async (empresa) => {
            const ultCotizacion = await this.getUltimaCotizacion(empresa.codEmpresa);
            const valorEmpresa = empresa.cantidadAcciones * ultCotizacion[0].cotization;
            return {
                ...empresa,
                valorEmpresa: valorEmpresa,
            };
        }));
        let valorTotal = 0;
        empresasConValor.map(empresa => {
            valorTotal += empresa.valorEmpresa;
        });
        const participacionEmpresas = empresasConValor.map(empresa => {
            return {
                ...empresa,
                participacionMercado: (empresa.valorEmpresa / valorTotal * 100).toFixed(2),
            };
        });
        return participacionEmpresas;
    }
};
exports.EmpresaService = EmpresaService;
exports.EmpresaService = EmpresaService = EmpresaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(empresa_entity_1.Empresa)),
    __param(1, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        gempresa_service_1.GempresaService])
], EmpresaService);
//# sourceMappingURL=empresa.service.js.map