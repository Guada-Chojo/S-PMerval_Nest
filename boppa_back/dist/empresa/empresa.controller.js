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
const gempresa_service_1 = require("../services/gempresa.service");
let EmpresaController = class EmpresaController {
    constructor(empresaService, gempresaService) {
        this.empresaService = empresaService;
        this.gempresaService = gempresaService;
    }
    async getDetalleEmpresa(codigoEmpresa) {
        return await this.gempresaService.getEmpresaDetails(codigoEmpresa);
    }
    async getUltimaCotizacion(codigoEmpresa) {
        return await this.empresaService.getUltimaCotizacion(codigoEmpresa);
    }
    async getHoraDiaCotizacionEmpresa(idEmpresa) {
        return await this.empresaService.getHoraDiaCotizacionEmpresa(idEmpresa);
    }
    async getDiaMesCotizacionEmpresa(idEmpresa) {
        return await this.empresaService.getDiaMesCotizacionEmpresa(idEmpresa);
    }
};
exports.EmpresaController = EmpresaController;
__decorate([
    (0, common_1.Get)('/:codigoEmpresa/details'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getDetalleEmpresa", null);
__decorate([
    (0, common_1.Get)('/:codigoEmpresa/ultima'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getUltimaCotizacion", null);
__decorate([
    (0, common_1.Get)('/:codigoEmpresa/horaDia'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getHoraDiaCotizacionEmpresa", null);
__decorate([
    (0, common_1.Get)('/:codigoEmpresa/diaMes'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getDiaMesCotizacionEmpresa", null);
exports.EmpresaController = EmpresaController = __decorate([
    (0, common_1.Controller)('empresas'),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService, gempresa_service_1.GempresaService])
], EmpresaController);
//# sourceMappingURL=empresa.controller.js.map