"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateUtils {
    static getFechaFromRegistroFecha(fecha) {
        return new Date(`${fecha.fecha}T${fecha.hora}:00.000Z`);
    }
    static getRegistroFechaFromFecha(fecha) {
        const fechaStr = fecha.toISOString();
        return {
            fecha: fechaStr.substring(0, 10),
            hora: fechaStr.substring(11, 16),
        };
    }
    static agregarUnaHora(fecha) {
        const currentMils = fecha.getTime();
        return new Date(currentMils + 1000 * 60 * 60);
    }
}
exports.default = DateUtils;
//# sourceMappingURL=dateUtils.js.map