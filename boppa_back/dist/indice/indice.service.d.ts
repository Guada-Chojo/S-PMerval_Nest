import { Indice } from "./entities/indice.entity";
import { Repository } from "typeorm";
import { Cotizacion } from "src/empresa/entities/cotizacion.entity";
import { GempresaService } from "src/services/gempresa.service";
export declare class IndiceService {
    private readonly indiceRepository;
    private readonly cotizacionRepository;
    private readonly gempresaService;
    private logger;
    constructor(indiceRepository: Repository<Indice>, cotizacionRepository: Repository<Cotizacion>, gempresaService: GempresaService);
    calcularIndices(): Promise<void>;
    getUltimoValorIndice(codigoIndice: string): Promise<Indice>;
    obtenerIndices(): Promise<void>;
    getIndicesbyFecha(codigoIndice: string, fechaDesde: string, fechaHasta: string): Promise<Indice[]>;
    cotizacionActualIndice(): Promise<any>;
    getDatosGrafico(criterio: {
        dias: number;
        allIndices: number;
    }): Promise<Indice[][]>;
}
