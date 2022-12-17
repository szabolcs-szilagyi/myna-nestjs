import { MigrationInterface, QueryRunner } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';

const productList: (Partial<ProductEntity> & {
  old?: { price: number; description: string };
})[] = [
  {
    idName: 'kamala-trench-coat',
    price: 159,
    description:
      "KAMALA trench is made from outstanding mix quality: cotton and fiber from the lotus flower. Lotus fiber is a natural bast fiber that is obtained from the stems of the lotus plant.<br />Very durable and soft feel while wearing our coat it's a guarantee! The style of the KAMALA trench coat can be versatile and depending on how you dress it up or down can also appear stylish and elegant. All buttons are also from sustainable material, made from corozo nuts.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br />KAMALA coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    old: {
      price: 299,
      description:
        "KAMALA trench is made from outstanding mix quality: cotton and fiber from the lotus flower. Lotus fiber is a natural bast fiber that is obtained from the stems of the lotus plant.<br />Very durable and soft feel while wearing our coat it's a guarantee! The style of the KAMALA trench coat can be versatile and depending on how you dress it up or down can also appear stylish and elegant. All buttons are also from sustainable material, made from corozo nuts.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br />KAMALA coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    },
  },
  {
    idName: 'lilium-trousers',
    price: 99,
    description:
      'This double gauze fabric is made from 100% organic cotton and is GOTS certified.  LILIUM trousers are perfectly designed for effortlessly beautiful design and still comfortable style. Loose fit, wide leg with elastic band in the back and two pockets will be ever most beloved trousers in your transitional wardrobe. Thanks to the interesting details of the fabric itself, you can enjoy our LILIUM trousers in two different looks: crepe texture without even ironing or flat smooth style after ironing.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />LILIUM trousers are made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    old: {
      price: 170,
      description:
        'This double gauze fabric is made from 100% organic cotton and is GOTS certified.  LILIUM trousers are perfectly designed for effortlessly beautiful design and still comfortable style. Loose fit, wide leg with elastic band in the back and two pockets will be ever most beloved trousers in your transitional wardrobe. Thanks to the interesting details of the fabric itself, you can enjoy our LILIUM trousers in two different looks: crepe texture without even ironing or flat smooth style after ironing.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />LILIUM trousers are made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    },
  },
  {
    idName: 'susan-dress',
    price: 139,
    description:
      "SUSAN dress made from 100% organic Tencel quality, GOTS certified. You will love our dress for its softness, beautiful drape, and comfortable design. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our SUSAN dress. This middle-length dress features with loose fit design and waist cut that perfectly flatters the silhouette. Additionally, SUSAN dress surprises with extra hidden pockets on the side of the dress and embroidery from our inspiration. Longer cleavage at the front and the back of the dress creates a feminine approach to our design.  SUSAN it's a perfect combination where an elegant look meets comfort and feminine style. Dress it up with layers for autumn – winter with our DAPHNE cardigan for a warmer feel.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br /><br />SUSAN dress is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    old: {
      price: 249,
      description:
        "SUSAN dress made from 100% organic Tencel quality, GOTS certified. You will love our dress for its softness, beautiful drape, and comfortable design. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our SUSAN dress. This middle-length dress features with loose fit design and waist cut that perfectly flatters the silhouette. Additionally, SUSAN dress surprises with extra hidden pockets on the side of the dress and embroidery from our inspiration. Longer cleavage at the front and the back of the dress creates a feminine approach to our design.  SUSAN it's a perfect combination where an elegant look meets comfort and feminine style. Dress it up with layers for autumn – winter with our DAPHNE cardigan for a warmer feel.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br /><br />SUSAN dress is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    },
  },
  {
    idName: 'erica-sweatshirt',
    price: 79,
    description:
      'ERICA blouse is made from 100% organic cotton, GOTS certified. You will love our comfortable and casual sweatshirt for its sensational softness of this outstanding quality. Cropped style and a long pocket on one side create a stylish approach to our sweatshirt. Wear ERICA with our high waist ASTER FRILL sweatpants for a perfect match or separately for a versatile look.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ERICA blouse is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    old: {
      price: 140,
      description:
        'ERICA blouse is made from 100% organic cotton, GOTS certified. You will love our comfortable and casual sweatshirt for its sensational softness of this outstanding quality. Cropped style and a long pocket on one side create a stylish approach to our sweatshirt. Wear ERICA with our high waist ASTER FRILL sweatpants for a perfect match or separately for a versatile look.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ERICA blouse is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    },
  },
  {
    idName: 'aster-frill',
    price: 99,
    description:
      'ASTER FRILL sweatpants are made from 100% organic cotton. GOTS certified. You will love our comfortable and casual sweatpants for their sensational softness of this outstanding quality. Comfortable fit and easy look for everyday wear will be your favorite piece in your sustainable wardrobe. Our feminine design of ASTER FRILL surprises with unique details and flexibility. Extremely soft fabric creates that extra comfort, that you need to feel amazing throughout the whole day.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ASTER FRILL sweatpants are made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    old: {
      price: 149,
      description:
        'ASTER FRILL sweatpants are made from 100% organic cotton. GOTS certified. You will love our comfortable and casual sweatpants for their sensational softness of this outstanding quality. Comfortable fit and easy look for everyday wear will be your favorite piece in your sustainable wardrobe. Our feminine design of ASTER FRILL surprises with unique details and flexibility. Extremely soft fabric creates that extra comfort, that you need to feel amazing throughout the whole day.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ASTER FRILL sweatpants are made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    },
  },
  {
    idName: 'gea-cream',
    price: 39,
    description:
      'Since every woman needs a white T-shirt, we created GEA to give your collection a contemporary twist. A beautiful and classic V-neck design that goes great with your favorite jeans or a skirt for a more feminine look. Made with care in Europe from organic cotton and hemp. <br /><br /> GEA is made to order and will take 1-2 weeks to be handcrafted in Europe and shipped with due care.',
    old: {
      price: 69,
      description:
        'Since every woman needs a white T-shirt, we created GEA to give your collection a contemporary twist. A beautiful and classic V-neck design that goes great with your favorite jeans or a skirt for a more feminine look. Made with care in Europe from organic cotton and hemp. <br /><br /> GEA is made to order and will take 1-2 weeks to be handcrafted in Europe and shipped with due care.',
    },
  },
  {
    idName: 'ivy-cream',
    price: 39,
    description:
      'Beautifully designed for your comfort and a relaxed yet elegant look. IVY is perfect for warm and sunny days and for winter layers with classic and timeless combination. It goes great with jeans, a skirt or our favorite pair of ASTER coullete trousers. Made with care in Europe from organic cotton and hemp. <br /><br /> IVY is made to order and will take 1-2 weeks to be handcrafted in Europe and shipped with proper care.',
    old: {
      price: 69,
      description:
        'Beautifully designed for your comfort and a relaxed yet elegant look. IVY is perfect for warm and sunny days and for winter layers with classic and timeless combination. It goes great with jeans, a skirt or our favorite pair of ASTER coullete trousers. Made with care in Europe from organic cotton and hemp. <br /><br /> IVY is made to order and will take 1-2 weeks to be handcrafted in Europe and shipped with proper care.',
    },
  },
  {
    idName: 'raisa-dress',
    price: 149,
    description:
      "RAISA dress is made from 100% organic cotton voile, GOTS certified. This mid-length dress is designed for a loose fit. Embroidery on the top of the dress, designed by our creative designer Justyna. Details from our inspiration give an extra unique approach to our beloved and timeless collection peace and your capsule wardrobe. Give an extra layer of our fine DAPHNE merino wool cardigan for colder days. RAISA's transitional look can inspire those who love a lighter approach to the autumn season and additionally surprises with 2 side pockets for your comfort.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />RAISA dress is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    old: {
      price: 260,
      description:
        "RAISA dress is made from 100% organic cotton voile, GOTS certified. This mid-length dress is designed for a loose fit. Embroidery on the top of the dress, designed by our creative designer Justyna. Details from our inspiration give an extra unique approach to our beloved and timeless collection peace and your capsule wardrobe. Give an extra layer of our fine DAPHNE merino wool cardigan for colder days. RAISA's transitional look can inspire those who love a lighter approach to the autumn season and additionally surprises with 2 side pockets for your comfort.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />RAISA dress is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    },
  },
  {
    idName: 'adel-jacket',
    price: 99,
    description:
      'ADEL denim jacket is made from 100% organic cotton, prime quality, and GOTS certified. It is a loose denim jacket with feminine and soft details. Designed for a light, elegant, yet comfortable look. Additionally ADEL jacket has eco-friendly, sustainable buttons from corozo nuts.Style ADEL with KAMALA or SILENE coat for overlay or pair it with our SARI denim shorts or CALLA denim long jeans for monochrome style.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ADELE denim jacket is made to order and may take 1 - 2 weeks to be hand sewn with care in Budapest.',
    old: {
      price: 190,
      description:
        'ADEL denim jacket is made from 100% organic cotton, prime quality, and GOTS certified. It is a loose denim jacket with feminine and soft details. Designed for a light, elegant, yet comfortable look. Additionally ADEL jacket has eco-friendly, sustainable buttons from corozo nuts.Style ADEL with KAMALA or SILENE coat for overlay or pair it with our SARI denim shorts or CALLA denim long jeans for monochrome style.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ADELE denim jacket is made to order and may take 1 - 2 weeks to be hand sewn with care in Budapest.',
    },
  },
  {
    idName: 'calla-cream',
    price: 79,
    description:
      "Our CALLA jeans have a straight cut with a high waist. Beautifully tailored, classic and stylish, without elastin, like it used to be. Every woman needs white jeans in her wardrobe because it's been a timeless and classic style for centuries! The timeless and simple cut of CALLA will change your style from a relaxed to even elegant style that you create for yourself for years. Made with care in Europe.<br /><br /> CALLA are made to order and will take 1-2 weeks to be handcrafted in Europe and shipped with care.",
    old: {
      price: 120,
      description:
        "Our CALLA jeans have a straight cut with a high waist. Beautifully tailored, classic and stylish, without elastin, like it used to be. Every woman needs white jeans in her wardrobe because it's been a timeless and classic style for centuries! The timeless and simple cut of CALLA will change your style from a relaxed to even elegant style that you create for yourself for years. Made with care in Europe.<br /><br /> CALLA are made to order and will take 1-2 weeks to be handcrafted in Europe and shipped with care.",
    },
  },
  {
    idName: 'delphi-culottes',
    price: 79,
    description:
      "DELPHI is made from 100% Tencel quality. You will love our culottes mainly for its softness and beautiful drape. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our DELPHI culottes.They are high - waisted and extremely comfortable culottes.Perfect cut and velvety soft Tencel fabric provide natural comfort.Tencel is made of cellulose fibers, quite versatile, soft, and pleasant to the skin.Beautifully finished and timeless cut.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />DELPHI pants are made to order and may take 1 - 2 weeks to be hand sewn with care in Budapest.",
    old: {
      price: 115,
      description:
        "DELPHI is made from 100% Tencel quality. You will love our culottes mainly for its softness and beautiful drape. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our DELPHI culottes.They are high - waisted and extremely comfortable culottes.Perfect cut and velvety soft Tencel fabric provide natural comfort.Tencel is made of cellulose fibers, quite versatile, soft, and pleasant to the skin.Beautifully finished and timeless cut.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />DELPHI pants are made to order and may take 1 - 2 weeks to be hand sewn with care in Budapest.",
    },
  },
  {
    idName: 'marigold-trench-coat',
    price: 159,
    description:
      'MARIGOLD trench is made from 100% TENCEL. You will love our coat mainly for its softness and beautiful drape. Fabric made of Tencel lyocell also has excellent drape, doesn’t wrinkle easily, breathable and manages moisture so it helps with temperature regulation - so our MARIGOLD trench. Style of MARIGOLD trench coat can be versatile and depend on how do you dress it up or down can also appear stylish and elegant.  All buttons are also from sustainable material, made from corozo nuts. Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br /><br />MARIGOLD coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    old: {
      price: 260,
      description:
        'MARIGOLD trench is made from 100% TENCEL. You will love our coat mainly for its softness and beautiful drape. Fabric made of Tencel lyocell also has excellent drape, doesn’t wrinkle easily, breathable and manages moisture so it helps with temperature regulation - so our MARIGOLD trench. Style of MARIGOLD trench coat can be versatile and depend on how do you dress it up or down can also appear stylish and elegant.  All buttons are also from sustainable material, made from corozo nuts. Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br /><br />MARIGOLD coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    },
  },
  {
    idName: 'hebe-socks',
    price: 69,
    description:
      "HEBE socks are made from 100% merino wool. These high-quality natural fibers create our garment that is a joy to wear, (hooray for wool that doesn't itch!) and will stand the test of time. And it makes HEBE super light! It will keep you warm and insulated in cold weather, and cool and comfortable in the summer months - plus it is hypo-allergenic, making it the perfect fiber for sensitive skin. Merino wool also repels dirt, stains, and wrinkles and is naturally antibacterial – which means minimal washing and ironing! However, when needed it is machine washable, giving it big practicality points. Merino wool is naturally biodegradable. Match with the ZEPHYRA vest and the DAPHNE cardigan from the same merino wool.<br /><br />Designed by Justyna and sustainably crafted in Europe.Made with love and attention to small details.<br />HEBE socks are made to order and may take 1-2 weeks to be handcrafted with care, especially for you.",
    old: {
      price: 85,
      description:
        "HEBE socks are made from 100% merino wool. These high-quality natural fibers create our garment that is a joy to wear, (hooray for wool that doesn't itch!) and will stand the test of time. And it makes HEBE super light! It will keep you warm and insulated in cold weather, and cool and comfortable in the summer months - plus it is hypo-allergenic, making it the perfect fiber for sensitive skin. Merino wool also repels dirt, stains, and wrinkles and is naturally antibacterial – which means minimal washing and ironing! However, when needed it is machine washable, giving it big practicality points. Merino wool is naturally biodegradable. Match with the ZEPHYRA vest and the DAPHNE cardigan from the same merino wool.<br /><br />Designed by Justyna and sustainably crafted in Europe.Made with love and attention to small details.<br />HEBE socks are made to order and may take 1-2 weeks to be handcrafted with care, especially for you.",
    },
  },
  {
    idName: 'silene-long-coat',
    price: 169,
    description:
      "SILENE coat is made from 100% Tencel quality. You will love our coat mainly for its softness. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our SILENE coat. Our design can be also versatile, you can transform our coat into a dressing gown that gets cold outside, and you can still enjoy this beautiful quality at home.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br />SILENE coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    old: {
      price: 260,
      description:
        "SILENE coat is made from 100% Tencel quality. You will love our coat mainly for its softness. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our SILENE coat. Our design can be also versatile, you can transform our coat into a dressing gown that gets cold outside, and you can still enjoy this beautiful quality at home.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br />SILENE coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    },
  },
];

export class discountedPrices1671266655168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);

    for (const product of productList) {
      const {
        idName,
        price,
        description,
        old: { price: oldPrice },
      } = product;

      const newProductData = {
        price,
        description: `<div class="ju"><b>Was €${oldPrice}!</b><br /><br />${description}</div>`,
      };
      await productRepo.update({ idName }, newProductData);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);

    for (const product of productList) {
      const {
        idName,
        old: { price, description },
      } = product;

      const newProductData = {
        price,
        description: `<div class="ju">${description}</div>`,
      };
      await productRepo.update({ idName }, newProductData);
    }
  }
}
