import { EmpresaService } from './empresa.service';
import { GempresaService } from 'src/services/gempresa.service';
import { IEmpresa } from './model/IEmpresa';
export declare class EmpresaController {
    private readonly empresaService;
    private readonly gempresaService;
    constructor(empresaService: EmpresaService, gempresaService: GempresaService);
    getAllEmpresas(): Promise<IEmpresa[]>;
    getDetalleEmpresa(codigoEmpresa: string): Promise<any>;
    getParticipacionEmpresas(): Promise<any[]>;
    getCotizacionActual(): Promise<any[]>;
    getUltCotizaciones(codigoEmpresa: string, dias: number): Promise<any[]>;
}
