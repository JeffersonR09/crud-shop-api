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
import { SizesService } from './sizes.service';
import { CreateSizesDto } from './dto/sizes.dto';

@Controller('sizes')
export class SizesController {
  constructor(private readonly shirtServiceRepo: SizesService) {}

  @Post()
  create(@Body() shirtDto: CreateSizesDto) {
    return this.shirtServiceRepo.create(shirtDto);
  }

  // Metodo para visualizar todos tus productos
  @Get()
  findAll() {
    return this.shirtServiceRepo.findAll();
  }

  //metodo para visualizar un producto en espesifico
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.shirtServiceRepo.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.shirtServiceRepo.remove(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() UpdateShirtDTO: CreateSizesDto,
  ) {
    return this.shirtServiceRepo.update(id, UpdateShirtDTO);
  }
}
