import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Shirt } from './entities/shirt.entity';
import { CreateSizesDto } from './dto/sizes.dto';
import { ProductSizes } from './entities/product-sizes.entity';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Shirt)
    private readonly shirtRepository: Repository<Shirt>,
    @InjectRepository(ProductSizes)
    private readonly sizesRepository: Repository<ProductSizes>,

    private readonly dataSource: DataSource,
  ) {}

  //metodo para crear un producto
  // async create(shirtDto: CreateSizesDto) {
  //   const shirt = this.shirtRepository.create(shirtDto);
  //   await this.shirtRepository.save(shirt);
  //   return shirt;
  // }

  async create(shirtDto: CreateSizesDto) {
    const { sizes = [], ...detalleShirt } = shirtDto;
    const shirt = this.shirtRepository.create({
      ...detalleShirt,
      sizes: sizes.map((size) => this.sizesRepository.create({ size: size })),
    });
    await this.shirtRepository.save(shirt);
    return shirt;
  }

  // Metodo para visualizar todos tus productos
  findAll() {
    return this.shirtRepository.find({
      relations: ['sizes'],
    });
  }

  //metodo para visualizar un producto en espesifico
  findOne(id: string) {
    return this.shirtRepository.findOneBy({ id });
  }

  //remover un producto
  async remove(id: string) {
    const shirt = await this.findOne(id);
    await this.shirtRepository.remove(shirt);
    return 'Producto eliminado';
  }

  // actualizar producto
  // async update(id: string, cambios: CreateSizesDto) {
  //   const findProduct = await this.findOne(id);
  //   const updatedProduct = await this.shirtRepository.merge(
  //     findProduct,
  //     cambios,
  //   );
  //   return this.shirtRepository.save(updatedProduct);
  // }

  async update(id: string, cambios: CreateSizesDto) {
    const { sizes, ...updateAll } = cambios;
    const shirt = await this.shirtRepository.preload({
      id: id,
      ...updateAll,
    });

    //Consultar ala base de datos
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Si vienen nuevas sizes que se eliminen las anteriores
    if (sizes) {
      await queryRunner.manager.delete(ProductSizes, { shirt: id });

      shirt.sizes = sizes.map((size) =>
        this.sizesRepository.create({ size: size }),
      );
    } else {
      shirt.sizes = await this.sizesRepository.findBy({ shirt: { id } });
    }

    // Salvamos y cerramos la consulta
    await queryRunner.manager.save(shirt);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return shirt;
  }
}
