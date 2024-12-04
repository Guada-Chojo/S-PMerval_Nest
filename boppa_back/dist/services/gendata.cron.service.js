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
const indice_service_1 = require("../indice/indice.service");
let GenDataService = GenDataService_1 = class GenDataService {
    constructor(empresaService, indiceService) {
        this.empresaService = empresaService;
        this.indiceService = indiceService;
        this.logger = new common_1.Logger(GenDataService_1.name);
        this.logger.log('Servicio Gen Data Inicializado');
    }
    obtenerDatos() {
        this.logger.log('Obtener datos empresas iniciado');
        this.empresaService.obtenerDatosEmpresas();
    }
    crearIndice() {
        this.logger.log('Generar Indice iniciado ');
        this.indiceService.calcularIndices();
    }
    obtenerIndices() {
        this.logger.log('Traer indices iniciado');
        this.indiceService.obtenerIndices();
    }
};
exports.GenDataService = GenDataService;
__decorate([
    (0, schedule_1.Cron)('0 6 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GenDataService.prototype, "obtenerDatos", null);
__decorate([
    (0, schedule_1.Cron)('0 7 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GenDataService.prototype, "crearIndice", null);
__decorate([
    (0, schedule_1.Cron)('0 8 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GenDataService.prototype, "obtenerIndices", null);
exports.GenDataService = GenDataService = GenDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService,
        indice_service_1.IndiceService])
], GenDataService);
//# sourceMappingURL=gendata.cron.service.js.map