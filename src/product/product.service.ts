import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  findAll(productFilterDto: ProductFilterDto): Promise<ProductEntity[]> {
    return this.productRepository.find(productFilterDto);
  }

  async getListOfAvailableProducts(): Promise<string[]> {
    const list = await this.productRepository.find({
      where: { availability: 'Available' },
      select: ['idName'],
    });

    return list.map(x => x.idName);
  }

  getBasicProductInfos(): Promise<Partial<ProductEntity>[]> {
    return this.productRepository.getBasicProductInfos();
  }

  findOne(id: number): Promise<ProductEntity> {
    return this.productRepository.findOne(id);
  }
}
