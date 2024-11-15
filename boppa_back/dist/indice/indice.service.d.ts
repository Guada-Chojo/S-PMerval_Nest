import { Indice } from "./entities/indice.entity";
import { Repository } from "typeorm";
import { Cotizacion } from "src/empresa/entities/cotizacion.entity";
export declare class IndiceService {
    private readonly indiceRepository;
    private readonly cotizacionRepository;
    constructor(indiceRepository: Repository<Indice>, cotizacionRepository: Repository<Cotizacion>);
    createIndices(): Promise<void>;
}
