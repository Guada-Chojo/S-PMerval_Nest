import { Empresa } from './empresa.entity';
export declare class Cotizacion {
    id: number;
    fecha: string;
    hora: string;
    dateUTC: string;
    cotization: number;
    empresa: Empresa;
    constructor(fecha: string, hora: string, dateUTC: string, cotizacion: number);
}
