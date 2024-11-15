"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GempresaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let GempresaService = class GempresaService {
    constructor() {
        this.createClient = () => {
            const client = axios_1.default.create({
                baseURL: 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000'
            });
            return client;
        };
        this.clientAxios = this.createClient();
    }
    async getEmpresaDetails(codigoEmpresa) {
        try {
            const respuesta = await this.clientAxios.get(`/empresas/${codigoEmpresa}/details`);
            return respuesta.data;
        }
        catch (error) {
            return error.response.data.statusCode;
        }
    }
    async getCotizaciones(codigoEmpresa, fechaDesde, fechaHasta) {
        try {
            const respuesta = await this.clientAxios.get(`/empresas/${codigoEmpresa}/cotizaciones`, { params: { fechaDesde: fechaDesde, fechaHasta: fechaHasta } });
            return respuesta.data;
        }
        catch (error) {
            return error.response.data.statusCode;
        }
    }
};
exports.GempresaService = GempresaService;
exports.GempresaService = GempresaService = __decorate([
    (0, common_1.Injectable)()
], GempresaService);
//# sourceMappingURL=gempresa.service.js.map