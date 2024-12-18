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
exports.IndiceController = void 0;
const common_1 = require("@nestjs/common");
const indice_service_1 = require("./indice.service");
let IndiceController = class IndiceController {
    constructor(indiceService) {
        this.indiceService = indiceService;
    }
    async getCotizacionActual() {
        return await this.indiceService.cotizacionActualIndice();
    }
    async getCotizaciones(dias, allIndices) {
        return await this.indiceService.getDatosGrafico({ dias: dias, allIndices: allIndices });
    }
    async getCotizacionesByFecha(codIndice, fechaDesde, fechaHasta) {
        return await this.indiceService.getIndicesbyFecha(codIndice, fechaDesde, fechaHasta);
    }
};
exports.IndiceController = IndiceController;
__decorate([
    (0, common_1.Get)('/cotizacionActual'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IndiceController.prototype, "getCotizacionActual", null);
__decorate([
    (0, common_1.Get)('/getCotizaciones'),
    __param(0, (0, common_1.Query)('dias')),
    __param(1, (0, common_1.Query)('allIndices')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], IndiceController.prototype, "getCotizaciones", null);
__decorate([
    (0, common_1.Get)('/indicebyfechas/:codIndice'),
    __param(0, (0, common_1.Param)('codIndice')),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IndiceController.prototype, "getCotizacionesByFecha", null);
exports.IndiceController = IndiceController = __decorate([
    (0, common_1.Controller)('indices'),
    __metadata("design:paramtypes", [indice_service_1.IndiceService])
], IndiceController);
//# sourceMappingURL=indice.controller.js.map