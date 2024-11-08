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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indice = void 0;
const typeorm_1 = require("typeorm");
let Indice = class Indice {
};
exports.Indice = Indice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint'
    }),
    __metadata("design:type", Number)
], Indice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'fecha',
        type: 'varchar',
        precision: 10,
    }),
    __metadata("design:type", String)
], Indice.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'hora',
        type: 'varchar',
        precision: 5,
    }),
    __metadata("design:type", String)
], Indice.prototype, "hora", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'codigoIndice',
        type: 'varchar',
        precision: 10,
    }),
    __metadata("design:type", String)
], Indice.prototype, "codigoIndice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'valorIndice',
        type: 'decimal',
        precision: 7,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Indice.prototype, "valorIndice", void 0);
exports.Indice = Indice = __decorate([
    (0, typeorm_1.Entity)()
], Indice);
//# sourceMappingURL=indice.entity.js.map