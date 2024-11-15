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
exports.IndiceService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const indice_entity_1 = require("./entities/indice.entity");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const cotizacion_entity_1 = require("../empresa/entities/cotizacion.entity");
let IndiceService = class IndiceService {
    constructor(indiceRepository, cotizacionRepository) {
        this.indiceRepository = indiceRepository;
        this.cotizacionRepository = cotizacionRepository;
    }
    async createIndices() {
        const ultIndice = await this.indiceRepository.find({
            order: {
                dateUTC: "DESC",
                hora: "DESC"
            },
            take: 1
        });
        let fechaUltIndice = '2023-12-31';
        if (ultIndice.length != 0) {
            fechaUltIndice = ultIndice[0].fecha;
        }
        const sql = `select 'N100' codigoIndice,avg(c.cotization)as valor, c.dateUTC ,c.fecha ,c.hora from cotizaciones c  where fecha > '${fechaUltIndice}' group by c.dateUTC ,c.fecha , c.hora order by c.dateUTC,c.fecha,c.hora`;
        const indices = await this.cotizacionRepository.query(sql);
        indices.forEach(async (indice) => {
            if (indice.fecha == fechaUltIndice && indice.hora >= ultIndice[0].hora) {
                await this.indiceRepository.save(indice);
            }
            else if (indice.fecha != fechaUltIndice) {
                await this.indiceRepository.save(indice);
            }
        });
    }
};
exports.IndiceService = IndiceService;
exports.IndiceService = IndiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(indice_entity_1.Indice)),
    __param(1, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], IndiceService);
//# sourceMappingURL=indice.service.js.map