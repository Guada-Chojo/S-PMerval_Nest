import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indice } from './entities/indice.entity';
import { Cotizacion } from 'src/empresa/entities/cotizacion.entity';
import { IndiceService } from './indice.service';



@Module({
  imports: [TypeOrmModule.forFeature([Indice, Cotizacion])],
    controllers: [],
    providers: [IndiceService],
    exports: [IndiceService]
})
export class IndiceModule {}
