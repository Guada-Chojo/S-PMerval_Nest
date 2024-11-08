import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indice } from './entities/indice.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Indice])],
  controllers: [],
  providers: [],
  exports: [],
})
export class IndiceModule {}
