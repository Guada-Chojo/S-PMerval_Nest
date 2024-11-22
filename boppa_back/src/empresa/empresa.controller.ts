import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { GempresaService } from 'src/services/gempresa.service';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService, private readonly gempresaService: GempresaService) {}

  //Prueba de conexion con gempresa: OK
  @Get('/:codigoEmpresa/details')
  async getDetalleEmpresa(
    @Param('codigoEmpresa') codigoEmpresa: string,
  ): Promise<any> {
    return await this.gempresaService.getEmpresaDetails(codigoEmpresa);
  }

  @Get('/:codigoEmpresa/ultima')
  async getUltimaCotizacion(
    @Param('codigoEmpresa') codigoEmpresa: string,
  ): Promise<any> {
    return await this.empresaService.getUltimaCotizacion(codigoEmpresa);
  }

  @Get('/:codigoEmpresa/horaDia')
  async getHoraDiaCotizacionEmpresa(
    @Param('codigoEmpresa') idEmpresa: number,
  ): Promise<any> {
    return await this.empresaService.getHoraDiaCotizacionEmpresa(idEmpresa);
  }

  @Get('/:codigoEmpresa/diaMes')
  async getDiaMesCotizacionEmpresa(
    @Param('codigoEmpresa') idEmpresa: number,
  ): Promise<any> {
    return await this.empresaService.getDiaMesCotizacionEmpresa(idEmpresa);
  }
}
