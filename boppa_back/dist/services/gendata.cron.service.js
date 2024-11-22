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
var GenDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenDataService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const empresa_service_1 = require("../empresa/empresa.service");
const gempresa_service_1 = require("./gempresa.service");
const dateUtils_1 = require("../utils/dateUtils");
const indice_service_1 = require("../indice/indice.service");
let GenDataService = GenDataService_1 = class GenDataService {
    constructor(empresaService, gempresaService, indiceService) {
        this.empresaService = empresaService;
        this.gempresaService = gempresaService;
        this.indiceService = indiceService;
        this.logger = new common_1.Logger(GenDataService_1.name);
        this.logger.log('Servicio Gen Data Inicializado');
        const hoy = new Date();
        console.log(hoy);
    }
    async obtenerDatosEmpresas() {
        const empresas = await this.empresaService.getAllEmpresas();
        empresas.forEach(async (empresa) => {
            let ultimaCot = await this.empresaService.getUltimaCotizacion(empresa.codEmpresa);
            if (!ultimaCot) {
                ultimaCot = {
                    cotization: Number(empresa.cotizationInicial),
                    dateUTC: '2023-12-31T23:00:00.000Z',
                    fecha: '2023-12-31',
                    hora: '23:00',
                    empresa: empresa,
                    id: 0
                };
            }
            ultimaCot.dateUTC = (dateUtils_1.default.agregarUnaHora(dateUtils_1.default.getFechaFromRegistroFecha({ fecha: ultimaCot.fecha, hora: ultimaCot.hora }))).toISOString().substring(0, 16);
            const fechaDesde = ultimaCot.dateUTC;
            const fechaHasta = (new Date()).toISOString().substring(0, 16);
            const cotizaciones = await this.gempresaService.getCotizaciones(empresa.codEmpresa, fechaDesde, fechaHasta);
            const cotizacionesValidas = cotizaciones.filter((cot) => {
                let validoDia = true;
                let validoHora = true;
                const dia = (dateUtils_1.default.getFechaFromRegistroFecha({ fecha: cot.fecha, hora: cot.hora })).getDay();
                if (dia == 0 || dia == 6) {
                    validoDia = false;
                }
                if (cot.hora < '08:00' || cot.hora > '14:00') {
                    validoHora = false;
                }
                return validoDia && validoHora;
            });
            cotizacionesValidas.forEach(async (cotizacion) => {
                this.empresaService.newCotizacion({
                    fecha: cotizacion.fecha,
                    hora: cotizacion.hora,
                    dateUTC: cotizacion.dateUTC,
                    cotization: cotizacion.cotization,
                    empresa: empresa,
                    id: null
                });
            });
        });
    }
    obtenerDatosHora() {
        this.logger.log('Obtener datos empresas iniciado');
        this.obtenerDatosEmpresas();
    }
};
exports.GenDataService = GenDataService;
__decorate([
    (0, schedule_1.Cron)('0 43 * * * *', {
        timeZone: 'America/Buenos_Aires',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GenDataService.prototype, "obtenerDatosHora", null);
exports.GenDataService = GenDataService = GenDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService,
        gempresa_service_1.GempresaService,
        indice_service_1.IndiceService])
], GenDataService);
//# sourceMappingURL=gendata.cron.service.js.map