import { IEmpresa } from "src/empresa/model/IEmpresa";
export declare class GempresaService {
    createClient: () => import("axios").AxiosInstance;
    clientAxios: import("axios").AxiosInstance;
    getEmpresaDetails(codigoEmpresa: string): Promise<IEmpresa>;
    getCotizaciones(codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
}
