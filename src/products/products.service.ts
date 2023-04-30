import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/product.dto';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  //metodo para crear un producto
  // async create(productDto: CreateProductDto) {
  //   const product = this.productRepository.create(productDto);
  //   await this.productRepository.save(product);
  //   return product;
  // }

  async create(productDto: CreateProductDto) {
    const { images = [], ...detalleProducto } = productDto;
    const product = this.productRepository.create({
      ...detalleProducto,
      images: images.map((image) =>
        this.imageRepository.create({ url: image }),
      ),
    });
    await this.productRepository.save(product);
    return product;
  }

  // Metodo para visualizar todos tus productos
  findAll() {
    return this.productRepository.find({
      relations: ['images'],
    });
  }

  //metodo para visualizar un producto en espesifico
  findOne(id: string) {
    return this.productRepository.findOneBy({ id });
  }

  //remover un producto
  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return 'Producto eliminado';
  }

  // actualizar producto
  // async update(id: string, cambios: CreateProductDto) {
  //   const findProduct = await this.findOne(id);
  //   const updatedProduct = await this.productRepository.merge(
  //     findProduct,
  //     cambios,
  //   );
  //   return this.productRepository.save(updatedProduct);
  // }

  async update(id: string, cambios: CreateProductDto) {
    const { images, ...updateAll } = cambios;
    const product = await this.productRepository.preload({
      id: id,
      ...updateAll,
    });

    //Consultar ala base de datos
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Si vienen nuevas images que se eliminen las anteriores
    if (images) {
      await queryRunner.manager.delete(ProductImage, { product: id });

      product.images = images.map((image) =>
        this.imageRepository.create({ url: image }),
      );
    } else {
      product.images = await this.imageRepository.findBy({ product: { id } });
    }

    // Salvamos y cerramos la consulta
    await queryRunner.manager.save(product);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return product;
  }
}
