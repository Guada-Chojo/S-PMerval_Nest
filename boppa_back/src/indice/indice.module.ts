import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indice } from './entities/indice.entity';
import { Cotizacion } from 'src/empresa/entities/cotizacion.entity';
import { IndiceService } from './indice.service';
import { IndiceController } from './indice.controller';
import { GempresaService } from 'src/services/gempresa.service';



@Module({
  imports: [TypeOrmModule.forFeature([Indice, Cotizacion])],
    controllers: [IndiceController],
    providers: [IndiceService, GempresaService],
    exports: [IndiceService]
})
export class IndiceModule {}
