import { EmpresaService } from './empresa.service';
import { GempresaService } from 'src/services/gempresa.service';
export declare class EmpresaController {
    private readonly empresaService;
    private readonly gempresaService;
    constructor(empresaService: EmpresaService, gempresaService: GempresaService);
    getDetalleEmpresa(codigoEmpresa: string): Promise<any>;
    getUltimaCotizacion(codigoEmpresa: string): Promise<any>;
}
