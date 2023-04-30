import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shirt } from './shirt.entity';

@Entity()
export class ProductSizes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  //relacion de mucho a uno
  //muchas imagenes puedan ser de un producto
  @ManyToOne(() => Shirt, (shirt) => shirt.sizes, {
    onDelete: 'CASCADE',
  })
  shirt: Shirt;
}
