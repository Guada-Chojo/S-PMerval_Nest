import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';
export declare class EmpresaService {
    private readonly empresaRepository;
    private readonly cotizacionRepository;
    private logger;
    constructor(empresaRepository: Repository<Empresa>, cotizacionRepository: Repository<Cotizacion>);
    getAllEmpresas(): Promise<any>;
    getUltimaCotizacion(codigoEmpresa: string): Promise<Cotizacion>;
    getHoraDiaCotizacionEmpresa(empresaId: number): Promise<any>;
    getDiaMesCotizacionEmpresa(empresaId: number): Promise<any>;
    newCotizacion(newCot: Cotizacion): Promise<Cotizacion>;
    getCotizationesEntreFechas(codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]>;
}
