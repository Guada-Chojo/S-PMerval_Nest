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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaController = void 0;
const common_1 = require("@nestjs/common");
const empresa_service_1 = require("./empresa.service");
const gempresa_service_1 = require("src/services/gempresa.service");
let EmpresaController = class EmpresaController {
    constructor(empresaService, gempresaService) {
        this.empresaService = empresaService;
        this.gempresaService = gempresaService;
    }
    async getAllEmpresas() {
        return await this.empresaService.getAllEmpresas();
    }
    async getDetalleEmpresa(codigoEmpresa) {
        return await this.gempresaService.getEmpresaDetails(codigoEmpresa);
    }
    async getParticipacionEmpresas() {
        return await this.empresaService.participacionEmpresas();
    }
    async getCotizacionActual() {
        return await this.empresaService.cotizacionActual();
    }
    async getUltCotizaciones(codigoEmpresa, dias) {
        return await this.empresaService.getDatosGrafico(codigoEmpresa, dias);
    }
};
exports.EmpresaController = EmpresaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getAllEmpresas", null);
__decorate([
    (0, common_1.Get)('/:codigoEmpresa/details'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getDetalleEmpresa", null);
__decorate([
    (0, common_1.Get)('/participacionEmpresas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getParticipacionEmpresas", null);
__decorate([
    (0, common_1.Get)('/cotizacionActual'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getCotizacionActual", null);
__decorate([
    (0, common_1.Get)('/ultimasCotizaciones/:codigoEmpresa'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __param(1, (0, common_1.Query)('dias')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getUltCotizaciones", null);
exports.EmpresaController = EmpresaController = __decorate([
    (0, common_1.Controller)('empresas'),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService, gempresa_service_1.GempresaService])
], EmpresaController);
//# sourceMappingURL=empresa.controller.js.map