export declare class Empresa {
    id: number;
    codEmpresa: string;
    empresaNombre: string;
    cotizationInicial: number;
    cantidadAcciones: number;
    constructor(codempresa: string, empresaNombre: string);
    getId(): number;
    getCodempresa(): string;
    setCodempresa(codempresa: string): void;
    getEmpresaNombre(): string;
    setEmpresaNombre(empresaNombre: string): void;
    getCotizacionInicial(): number;
    getCantidadAcciones(): number;
}
