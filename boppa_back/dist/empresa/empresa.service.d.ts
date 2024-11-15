import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';
import { RegistroFecha } from 'src/model/registro.fecha';
export declare class EmpresaService {
    private readonly empresaRepository;
    private readonly cotizacionRepository;
    private logger;
    constructor(empresaRepository: Repository<Empresa>, cotizacionRepository: Repository<Cotizacion>);
    getAllEmpresas(): Promise<any>;
    getUltimaCotizacion(codigoEmpresa: string): Promise<Cotizacion>;
    getLast20CotizacionEmpresa(empresaId: number): Promise<any>;
    newCotizacion(newCot: Cotizacion): Promise<Cotizacion>;
    getFechaCotization(codigoEmpresa: string, regFecha: RegistroFecha): Promise<Cotizacion>;
    getCotizationesEntreFechas(codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]>;
}
