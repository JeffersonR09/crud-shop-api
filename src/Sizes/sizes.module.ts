import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shirt } from './entities/shirt.entity';
import { SizesController } from './sizes.controller';
import { SizesService } from './sizes.service';
import { ProductSizes } from './entities/product-sizes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shirt, ProductSizes])],
  controllers: [SizesController],
  providers: [SizesService],
})
export class SizesModule {}
