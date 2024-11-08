import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { RegistroFecha } from 'src/model/registro.fecha';

@Injectable()
export class IndiceService {
  
}
