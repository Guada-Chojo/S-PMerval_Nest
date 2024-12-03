import { IndiceService } from "./indice.service";
import { Indice } from "./entities/indice.entity";
export declare class IndiceController {
    private readonly indiceService;
    constructor(indiceService: IndiceService);
    getCotizaciones(dias: number, allIndices: number): Promise<Indice[][]>;
    getCotizacionesByFecha(codIndice: string, fechaDesde: string, fechaHasta: string): Promise<any[]>;
}
