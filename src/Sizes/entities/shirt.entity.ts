import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductSizes } from './product-sizes.entity';

@Entity()
export class Shirt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  color: string;

  @Column({ type: 'numeric' })
  precio: number;

  //relaciones
  @OneToMany(() => ProductSizes, (productImage) => productImage.shirt, {
    cascade: true,
    eager: true,
  })
  sizes?: ProductSizes[];
}
