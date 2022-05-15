import { ProductEntity } from 'src/product/entities/product.entity';
import { MigrationInterface, QueryRunner, In } from 'typeorm';

const productList: Partial<ProductEntity>[] = [
  {
    idName: 'liliana-overall',
    name: 'LILIANA Overall',
    price: 200,
    color: 'Satin Cream',
    description:
      '100% linen overall. Elastic band at the waist of the overall will give you flexibility and comfort each day. Additionally, LILIANA has two side pockets for your convenience. Feminine approach with longer cleavage at the front and also at the back of our design creates lightness to the whole look. LILIANA overall will be your timeless piece in your capsule wardrobe.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br /> Made with love and attention to small details.',
    compCare:
      '100% linen from Turkey. Crispy feel and quality linen. Linen is very strong, absorbent, and dries faster than cotton. Because of these properties, linen is comfortable to wear in hot weather.',
  },
  {
    idName: 'aster-trousers-satin',
    name: 'ASTER Trousers Satin',
    price: 100,
    color: 'Satin Cream',
    description:
      '100% linen long trousers, flat front & back of the shorts will flatter any silhouette. Side pockets and elastic band on the sides of the shorts will give you an extra flexibility and comfort each time you wear it. Our ASTER trousers will be your perfect choice for holiday getaway or easy days at home. Pair it up with our linen oversize shirt HANA.<br /><br />ASTER trousers will be your timeless piece in your capsule wardrobe.<br /><br />Look up alternative ASTER shorts from the same design also available for your choice.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br />Made with love and attention to small details.',
    compCare:
      '100% linen from Turkey. Crispy feel and quality linen. Linen is very strong, absorbent, and dries faster than cotton. Because of these properties, linen is comfortable to wear in hot weather.',
  },
  {
    idName: 'aster-trousers-sand',
    name: 'ASTER Trousers Sand',
    price: 100,
    color: 'Shadow Sand',
    description:
      '100% linen long trousers, flat front & back of the shorts will flatter any silhouette. Side pockets and elastic band on the sides of the shorts will give you an extra flexibility and comfort each time you wear it. Our ASTER trousers will be your perfect choice for holiday getaway or easy days at home. Pair it up with our linen oversize shirt HANA.<br /><br />ASTER trousers will be your timeless piece in your capsule wardrobe.<br /><br />Look up alternative ASTER shorts from the same design also available for your choice.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br />Made with love and attention to small details.',
    compCare:
      '100% linen from Turkey. Crispy feel and quality linen. Linen is very strong, absorbent, and dries faster than cotton. Because of these properties, linen is comfortable to wear in hot weather.',
  },
  {
    idName: 'aster-shorts-satin',
    name: 'ASTER Shorts Satin',
    price: 79,
    color: 'Satin Cream',
    description:
      '100% linen shorts, flat front & back of the shorts will flatter any silhouette. Side pockets and elastic band on the sides of the shorts will give you an extra flexibility and comfort each time you wear it. Our ASTER shorts will be your perfect choice for holiday getaway or easy days at home. Pair it up with our linen oversize shirt HANA.<br />ASTER shorts will be your timeless piece in your capsule wardrobe.<br /><br />Look up alternative ASTER long trousers from the same design also available for your choice.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br />Made with love and attention to small details. ',
    compCare:
      '100% linen from Turkey. Crispy feel and quality linen. Linen is very strong, absorbent, and dries faster than cotton. Because of these properties, linen is comfortable to wear in hot weather.',
  },
  {
    idName: 'aster-shorts-sand',
    name: 'ASTER Shorts Sand',
    price: 79,
    color: 'Shadow Sand',
    description:
      '100% linen shorts, flat front & back of the shorts will flatter any silhouette. Side pockets and elastic band on the sides of the shorts will give you an extra flexibility and comfort each time you wear it. Our ASTER shorts will be your perfect choice for holiday getaway or easy days at home. Pair it up with our linen oversize shirt HANA.<br />ASTER shorts will be your timeless piece in your capsule wardrobe.<br /><br />Look up alternative ASTER long trousers from the same design also available for your choice.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br />Made with love and attention to small details. ',
    compCare:
      '100% linen from Turkey. Crispy feel and quality linen. Linen is very strong, absorbent, and dries faster than cotton. Because of these properties, linen is comfortable to wear in hot weather.',
  },
  {
    idName: 'narci-skirt',
    name: 'NARCI Skirt',
    price: 160,
    color: 'Sunrise Yellow',
    description:
      'NARCI is a middle length skirt with an elastic waist line for your comfort. Two side pockets are also introduced for your convenience to wear it with ease each day. Extravagant look and feel to this amazing chambray quality will stay for long years and will be your favorite piece in your capsule wardrobe. Timeless design of our NARCI skirt will be a perfect companion to our IRISA top for total, stylish look.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br />Made with love and attention to small details.',
    compCare:
      '100% organic cotton chambray, GOTS certified. The fabric has an even surface, a good drape and feels smooth and soft. It is easy to wear and relatively wrinkle-resistant.',
  },
  {
    idName: 'irisa-top',
    name: 'IRISA Top',
    price: 115,
    color: 'Sunrise Yellow',
    description:
      '100% organic cotton cropped top. Invisible side zip introduced for an easy wear and perfect fit of our beautifully crafted IRISA. Very feminine design, will make your outfit unique and timeless. Pair it up with our NARCI skirt for a total and stylish look.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br />Made with love and attention to small details.',
    compCare:
      '100% organic cotton chambray, GOTS certified. The fabric has an even surface, a good drape and feels smooth and soft. It is easy to wear and relatively wrinkle-resistant.',
  },
  {
    idName: 'liana-blouse-sunrise',
    name: 'LIANA Blouse Sunrise',
    price: 135,
    color: 'Sunrise Yellow',
    description:
      '100% peace silk blouse, hand painted and print preserved by creative designer Justyna. Inspired by warm sand and incoming shells of Portuguese ocean. LIANA blouse is the most unique piece in our collection which you will not find elsewhere thanks to our own print and hand made piece from the start to finish of the garment. Feminine & flowy feel will make your summer special and timeless.<br /><br />LIANA blouse, longer version in ocean blue also available for your choice.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br />Made with love and attention to small details.',
    compCare:
      '100% peace silk, non-violent production, without harming or killing the silkworms.',
  },
  {
    idName: 'liana-blouse-ocean',
    name: 'LIANA Blouse Ocean',
    price: 140,
    color: 'Ocean Blue',
    description:
      '100% peace silk blouse, hand painted and print preserved by creative designer Justyna. Inspired by water and waves of Portuguese ocean. LIANA blouse is the most unique piece in our collection which you will not find elsewhere thanks to our own print and hand made piece from the start to finish of the garment. Feminine & flowy feel will make your summer special and timeless.<br /><br />LIANA blouse, cropped version in sunrise yellow also available for your choice.<br /><br />Designed by Justyna and sustainably crafted in Europe by local tailors.<br />Made with love and attention to small details.',
    compCare:
      '100% peace silk, non-violent production, without harming or killing the silkworms.',
  },
];

export class addNewProducts1652542708326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);
    for (const product of productList) {
      const { idName, compCare, description } = product;
      productRepo.insert({
        ...product,
        compCare: `<div class="ju">${compCare}</div>`,
        description: `<div class="ju">${description}</div>`,
        availability: 'Available',
        pic1: `${idName}-01.jpg`,
        pic2: `${idName}-02.jpg`,
        pic3: `${idName}-03.jpg`,
        pic4: `${idName}-04.jpg`,
      });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);
    productRepo.delete({
      idName: In(productList.map(p => p.idName)),
    });
  }
}
