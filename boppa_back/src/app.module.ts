import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './empresa/empresa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndiceModule } from './indice/indice.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GenDataService } from './services/gendata.cron.service';
import { GempresaService } from './services/gempresa.service';

@Module({
  imports: [EmpresaModule, IndiceModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mySQL2022',
      database: 'spmerval',
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
      logging: 'all',
    }),
    EmpresaModule,
    IndiceModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, GenDataService, GempresaService],
})
export class AppModule {}
