import { IEmpresa } from "src/empresa/model/IEmpresa";
import { Indice } from "src/indice/entities/indice.entity";
export declare class GempresaService {
    private logger;
    createClient: () => any;
    clientAxios: any;
    getEmpresaDetails(codigoEmpresa: string): Promise<IEmpresa>;
    getCotizaciones(codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
    postIndice(indice: Indice): Promise<any>;
    getIndices(): Promise<any>;
    getCotizacionesIndices(codigoIndice: string, fechaDesde: string, fechaHasta: string): Promise<any>;
}
