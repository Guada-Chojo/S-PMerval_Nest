import { RegistroFecha } from "src/model/registro.fecha";
declare class DateUtils {
    static getFechaFromRegistroFecha(fecha: RegistroFecha): Date;
    static getRegistroFechaFromFecha(fecha: Date): RegistroFecha;
    static agregarUnaHora(fecha: Date): Date;
}
export default DateUtils;
