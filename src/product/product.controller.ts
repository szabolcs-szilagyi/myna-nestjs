import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductFilterDto } from './dto/product-filter.dto';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductService)
    private productService: ProductService,
  ) {}

  @Get()
  getProductData(@Query(ValidationPipe) productFilterDto: ProductFilterDto) {
    return this.productService.findAll(productFilterDto);
  }

  @Get('available')
  getListOfAvailableProducts() {
    return this.productService.getListOfAvailableProducts();
  }

  @Get('basic-infos')
  async getBasicProductInfos(): Promise<Partial<ProductEntity>[]> {
    return this.productService.getBasicProductInfos();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productService.findOne(id);
  }
}
