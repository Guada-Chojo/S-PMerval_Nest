import { EmpresaService } from "src/empresa/empresa.service";
import { GempresaService } from "./gempresa.service";
import { IndiceService } from "src/indice/indice.service";
export declare class GenDataService {
    private empresaService;
    private gempresaService;
    private indiceService;
    private logger;
    constructor(empresaService: EmpresaService, gempresaService: GempresaService, indiceService: IndiceService);
    obtenerDatosEmpresas(): Promise<void>;
    obtenerDatosHora(): void;
}
