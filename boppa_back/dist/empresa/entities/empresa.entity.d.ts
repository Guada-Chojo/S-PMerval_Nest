import { Cotizacion } from './cotizacion.entity';
export declare class Empresa {
    idEmpresa: number;
    codEmpresa: string;
    empresaNombre: string;
    cotizacionInicial: number;
    cantidadAcciones: number;
    cotizaciones: Cotizacion[];
    constructor(codigo: string, nombre: string);
    getIdEmpresa(): number;
    getCodigoEmpresa(): string;
    setCodigoEmpresa(codigo: string): void;
    getNombreEmpresa(): string;
    setNombreEmpresa(nombre: string): void;
    getCantAcciones(): number;
    setCantAcciones(cantAcciones: number): void;
    getCotizacionInicial(): number;
    setCotizacionInicial(cotizacionInicial: number): void;
}
