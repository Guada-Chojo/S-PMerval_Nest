import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
 export class Indice {

    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    public id: number;

    @Column({
        name: 'fecha',
        type: 'varchar',
        precision: 10,
    })
    public fecha: string;

    @Column({
        name: 'hora',
        type: 'varchar',
        precision: 5,
    })
    public hora: string;

    @Column({
        name: 'codigoIndice',
        type: 'varchar',
        precision: 10,
    })
    public codigoIndice: string;

    @Column({
        name: 'valorIndice',
        type: 'decimal',
        precision: 7,
        scale: 2,
    })
    public valorIndice: number;
 }