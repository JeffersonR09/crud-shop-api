import {
  Delete,
  Patch,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';

@Controller('productos')
export class ProductsController {
  constructor(private readonly productServiceRepo: ProductsService) {}

  @Post()
  create(@Body() productoDto: CreateProductDto) {
    return this.productServiceRepo.create(productoDto);
  }

  // Metodo para visualizar todos tus productos
  @Get()
  findAll() {
    return this.productServiceRepo.findAll();
  }

  //metodo para visualizar un producto en espesifico
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productServiceRepo.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productServiceRepo.remove(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() UpdateProductDTO: CreateProductDto,
  ) {
    return this.productServiceRepo.update(id, UpdateProductDTO);
  }
}
