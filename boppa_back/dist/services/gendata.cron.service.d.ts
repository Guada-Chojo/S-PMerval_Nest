import { EmpresaService } from "src/empresa/empresa.service";
import { IndiceService } from "src/indice/indice.service";
export declare class GenDataService {
    private empresaService;
    private indiceService;
    private logger;
    constructor(empresaService: EmpresaService, indiceService: IndiceService);
    obtenerDatos(): void;
    crearIndice(): void;
    obtenerIndices(): void;
}
