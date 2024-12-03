import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';
import { GempresaService } from "src/services/gempresa.service";
export declare class EmpresaService {
    private readonly empresaRepository;
    private readonly cotizacionRepository;
    private readonly gempresaService;
    private logger;
    constructor(empresaRepository: Repository<Empresa>, cotizacionRepository: Repository<Cotizacion>, gempresaService: GempresaService);
    getAllEmpresas(): Promise<any>;
    getUltimaCotizacion(codigoEmpresa: string): Promise<Cotizacion[]>;
    newCotizacion(cotizacion: Cotizacion): Promise<Cotizacion>;
    obtenerDatosEmpresas(): Promise<void>;
    cotizacionActual(): Promise<any[]>;
    getCotizacionesByFecha(codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]>;
    getDatosGrafico(codEmpresa: string, dias: number): Promise<Cotizacion[]>;
    participacionEmpresas(): Promise<{
        participacionMercado: string;
        valorEmpresa: number;
        idEmpresa: number;
        codEmpresa: string;
        empresaNombre: string;
        cotizacionInicial: number;
        cantidadAcciones: number;
        cotizaciones: Cotizacion[];
    }[]>;
}
