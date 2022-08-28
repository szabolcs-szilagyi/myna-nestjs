import { kebabCase, omit } from 'lodash/fp';
import { MigrationInterface, QueryRunner, In } from 'typeorm';
import { StockEntity } from '../cart/entities/stock.entity';
import { ProductEntity } from '../product/entities/product.entity';

const productList: (Partial<ProductEntity> & { isUpdate?: boolean })[] = [
  {
    isUpdate: true,
    name: 'MARIGOLD Trench Coat',
    price: 260,
    description:
      'MARIGOLD trench is made from 100% TENCEL. You will love our coat mainly for its softness and beautiful drape. Fabric made of Tencel lyocell also has excellent drape, doesn’t wrinkle easily, breathable and manages moisture so it helps with temperature regulation - so our MARIGOLD trench. Style of MARIGOLD trench coat can be versatile and depend on how do you dress it up or down can also appear stylish and elegant.  All buttons are also from sustainable material, made from corozo nuts. Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br /><br />MARIGOLD coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    compCare:
      '100% Tencel, wood cellulose, dyed with GOTS certified dyes with GOTS certificate, made in Turkey.<br /><br />These fibers are known for feeling super soft and are widely used in sustainable fashion.Tencel is similar to viscose but uses chemicals that are less- toxic and get recycled in the process so there’s minimal waste.It also uses wood from trees in sustainably - harvested forests.It has a natural origin because it’s made from wood, but the finished fiber is technically man - made so it doesn’t qualify as a natural fiber.That’s why the textiles industry refers to it as regenerated cellulose instead of “natural” or “synthetic.”<br /><br />Should You buy product made from Tencel ? Yes, absolutely! Tencel fibers feel amazing, use sustainable practices, and have high - quality performance features that make it so popular.<br /><br />Wash MARIGOLD  on a gentle cycle at 30 degrees, iron on a low level and do not tumble dry.Our fabrics are durable and do not require dry cleaning.Iron inside out.',
  },
  {
    isUpdate: true,
    name: 'DELPHI Culottes',
    price: 115,
    description:
      "DELPHI is made from 100% Tencel quality. You will love our culottes mainly for its softness and beautiful drape. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our DELPHI culottes.They are high - waisted and extremely comfortable culottes.Perfect cut and velvety soft Tencel fabric provide natural comfort.Tencel is made of cellulose fibers, quite versatile, soft, and pleasant to the skin.Beautifully finished and timeless cut.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />DELPHI pants are made to order and may take 1 - 2 weeks to be hand sewn with care in Budapest.",
    compCare:
      '100% Tencel, wood cellulose, dyed with GOTS certified dyes with GOTS certificate, made in Turkey. These fibers are known for feeling super soft and are widely used sustainably.  Tencel is like viscose but uses chemicals that are less toxic and get recycled in the process so there’s minimal waste. It also uses wood from trees in sustainably harvested forests. It has a natural origin because it’s made from wood, but the finished fiber is technically man-made, so it doesn’t qualify as a natural fiber. That’s why the textiles industry refers to it as regenerated cellulose instead of “natural” or “synthetic.”<br /><br />Should You buy a product made from Tencel? Yes, absolutely! Tencel fibers feel amazing, use sustainable practices, and have high- quality performance features that make it so popular.<br /><br />Wash DELPHI on a gentle cycle at 30 degrees, iron on a low level, and do not tumble dry.Our fabrics are durable and do not require dry cleaning.Iron inside out.',
  },
  {
    isUpdate: true,
    name: 'ERICA Sweatshirt',
    price: 140,
    description:
      'ERICA blouse is made from 100% organic cotton, GOTS certified. You will love our comfortable and casual sweatshirt for its sensational softness of this outstanding quality. Cropped style and a long pocket on one side create a stylish approach to our sweatshirt. Wear ERICA with our high waist ASTER FRILL sweatpants for a perfect match or separately for a versatile look.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ERICA blouse is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    compCare:
      'GOTS certified natural fiber fabric. A soft interlock jersey made of 100% organic cotton, slightly stretchy and very soft on the skin. Free from microplastics, 100 % biodegradable.<br /><br />Wash ERICA on a delicate cycle at 30 Celsius, iron at a low setting, and do not tumble dry.Our fabrics are sustainable and do not require dry cleaning.',
    pic1: 'erica-sweatshirt-01.jpg',
    pic2: 'erica-sweatshirt-02.jpg',
    pic3: 'erica-sweatshirt-03.jpg',
    pic4: 'erica-sweatshirt-04.jpg',
  },
  {
    isUpdate: true,
    name: 'ASTER Frill',
    price: 149,
    description:
      'ASTER FRILL sweatpants are made from 100% organic cotton. GOTS certified. You will love our comfortable and casual sweatpants for their sensational softness of this outstanding quality. Comfortable fit and easy look for everyday wear will be your favorite piece in your sustainable wardrobe. Our feminine design of ASTER FRILL surprises with unique details and flexibility. Extremely soft fabric creates that extra comfort, that you need to feel amazing throughout the whole day.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ASTER FRILL sweatpants are made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    compCare:
      'GOTS certified natural fiber fabric. A soft interlock jersey made of 100% organic cotton, slightly stretchy and very soft on the skin. Free from microplastics, 100 % biodegradable.<br />Wash ASTER TWILL sweatpants on a delicate cycle at 30 Celsius, iron at a low setting and do not tumble dry.Our fabrics are sustainable and do not require dry cleaning.',
    pic1: 'aster-frill-01.jpg',
    pic2: 'aster-frill-02.jpg',
    pic3: 'aster-frill-03.jpg',
    pic4: 'aster-frill-04.jpg',
  },
  {
    isUpdate: true,
    name: 'ADEL Jacket',
    price: 190,
    description:
      'ADEL denim jacket is made from 100% organic cotton, prime quality, and GOTS certified. It is a loose denim jacket with feminine and soft details. Designed for a light, elegant, yet comfortable look. Additionally ADEL jacket has eco-friendly, sustainable buttons from corozo nuts.Style ADEL with KAMALA or SILENE coat for overlay or pair it with our SARI denim shorts or CALLA denim long jeans for monochrome style.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />ADELE denim jacket is made to order and may take 1 - 2 weeks to be hand sewn with care in Budapest.',
    compCare:
      '100% organic cotton woven denim, GOTS certified (Global Organization Textile Standards), made in Turkey. GOTS is the leading standard for organic textiles, and fabrics carrying the GOTS label represent the ultimate in ecological and sustainable production. It assures you that the cotton from which this fabric was made was grown organically, without using insecticides or pesticides. In addition, it is your assurance that the most ecological and socially responsible methods have been used throughout the entire production process.<br /><br />Wash in a regular cycle at 30 degrees Celsius, iron on a low level, and do not tumble dry.Our fabrics are durable and do not require dry cleaning.',
    pic1: 'adel-jacket-01.jpg',
    pic2: 'adel-jacket-02.jpg',
    pic3: 'adel-jacket-03.jpg',
    pic4: 'adel-jacket-04.jpg',
  },
  {
    isUpdate: true,
    name: 'RAISA Dress',
    price: 260,
    description:
      "RAISA dress is made from 100% organic cotton voile, GOTS certified. This mid-length dress is designed for a loose fit. Embroidery on the top of the dress, designed by our creative designer Justyna. Details from our inspiration give an extra unique approach to our beloved and timeless collection peace and your capsule wardrobe. Give an extra layer of our fine DAPHNE merino wool cardigan for colder days. RAISA's transitional look can inspire those who love a lighter approach to the autumn season and additionally surprises with 2 side pockets for your comfort.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />RAISA dress is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    compCare:
      '100% organic soft cotton voile, GOTS certified, made in Turkey. GOTS is the leading standard for organic textiles, and fabrics carrying the GOTS label represent the ultimate in ecological and sustainable production.It assures you that the cotton from which this fabric was made was grown organically, without using insecticides or pesticides.In addition, it is your assurance that the most ecological and socially responsible methods have been used throughout the entire production process.<br /><br />Wash RAISA on a delicate cycle at 30 °C degrees, iron at a low setting, and do not tumble dry.Our fabrics are sustainable and do not require dry cleaning.',
    pic1: 'raisa-dress-01.jpg',
    pic2: 'raisa-dress-02.jpg',
    pic3: 'raisa-dress-03.jpg',
    pic4: 'raisa-dress-04.jpg',
  },
  {
    isUpdate: true,
    name: 'SUSAN Dress',
    price: 249,
    description:
      "SUSAN dress made from 100% organic Tencel quality, GOTS certified. You will love our dress for its softness, beautiful drape, and comfortable design. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our SUSAN dress. This middle-length dress features with loose fit design and waist cut that perfectly flatters the silhouette. Additionally, SUSAN dress surprises with extra hidden pockets on the side of the dress and embroidery from our inspiration. Longer cleavage at the front and the back of the dress creates a feminine approach to our design.  SUSAN it's a perfect combination where an elegant look meets comfort and feminine style. Dress it up with layers for autumn – winter with our DAPHNE cardigan for a warmer feel.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br /><br />SUSAN dress is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    compCare:
      'This soft drape is woven twill with a velvety matte surface in a fine twill weave made of 100% TENCEL™ Lyocell.<br />Very supple and beautifully flowing in the drape, breathable and pleasant on the skin Origin of the fiber: Austria.TENCEL™ is a trademark of Lenzing AG.<br />Sustainability and certification: TENCEL™ Lyocell is currently considered one of the most sustainable fibers in the textile sector.Lenzing was the first fiber producer worldwide to be awarded the EU Ecolabel for its environmentally friendly fiber production.<br />Renewable raw material: TENCEL™ lyocell fibers are made from cellulose, a building block of the renewable raw material wood.According to Lenzing, the wood for TENCEL™ Lyocell comes primarily from sustainably and legally managed forests.<br />The fiber is a regenerated cellulose fiber: natural, renewable raw materials are industrially processed.<br />Compostable and biodegradable: fabrics made from TENCEL™ Lyocell - without spandex! - are biodegradable.',
    pic1: 'susan-dress-01.jpg',
    pic2: 'susan-dress-02.jpg',
    pic3: 'susan-dress-03.jpg',
    pic4: 'susan-dress-04.jpg',
  },
  {
    name: 'HANNA Oversize Shirt',
    color: 'Satin Cream',
    price: 169,
    description:
      "This double gauze fabric is made from 100% organic cotton and is GOTS certified.<br />HANNA it's a classic and timeless oversize shirt. Thanks to the interesting details of the fabric itself, you can enjoy the HANNA shirt in two different looks: crepe texture without even ironing or flat smooth style after ironing. Additionally, we have added eco-friendly buttons from corozo nuts for sustainable design.<br />Perfect and transitional match to our LILIUM trousers for a total monochrome look.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br /><br />HANNA shirt is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    compCare:
      'Feel good in certified organic quality. Double layers of fabric have been loosely joined to create this organic muslin fabric called Double Gauze. As a result, this muslin has more volume than a one-ply muslin but is just as soft and pliable. The double gauze fabric features a beautiful crepe texture, which means the fabric does not need ironing. This double gauze fabric is made from 100% organic cotton and is GOTS certified. This organic fabric is Global Organic Textile Standard (GOTS) certified along the entire textile chain - from the cotton fiber, through all production processes such as weaving or knitting, dyeing, and printing, to the store counter of Siebenblau.<br /><br />Wash HANNA on a delicate cycle at 30°C.Our fabrics are sustainable and do not require dry cleaning.',
  },
  {
    isUpdate: true,
    name: 'LOLA Oversize Shirt',
    price: 169,
    description:
      "This beautiful soft quality shirt is made of 100% organic cotton and is GOTS certified. LOLA it's a classic and timeless oversize shirt. It's one of the designs you can wear all year round.Fine quality gives a light feeling while wearing our LOLA shirt.<br />Additionally, we have added eco-friendly buttons from corozo nuts for total sustainable design.Perfect and transitional match to our DELPHI culottes for a classic and effortless look.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />LOLA shirt is made to order and may take 1 - 2 weeks to be hand sewn with care in Budapest.",
    compCare:
      '100% organic soft cotton voile, GOTS certified, made in Turkey. GOTS is the leading standard for organic textiles, and fabrics carrying the GOTS label represent the ultimate in ecological and sustainable production.It assures you that the cotton from which this fabric was made was grown organically, without using insecticides or pesticides.In addition, it is your assurance that the most ecological and socially responsible methods have been used throughout the entire production process.<br /><br />Wash LOLA on a delicate cycle at 30 °C degrees, iron at a low setting, and do not tumble dry.Our fabrics are sustainable and do not require dry cleaning.',
  },
  {
    name: 'DAPHNE Cardigan',
    price: 319,
    color: 'Satin Cream',
    description:
      "DAPHNE cardigan is made from 100% merino wool. These high-quality natural fibers create our DAPHNE that is a joy to wear, (hooray for wool that doesn't itch!) and will stand the test of time. Additionally, it makes DAPHNE super light! Merino wool is perfect for both summer and winter due to its breathability and temperature regulating properties. It will keep you warm and insulated in cold weather, and cool and comfortable in the summer months - plus it is hypo-allergenic, making it the perfect fiber for sensitive skin. Merino wool also repels dirt, stains, and wrinkles and is naturally antibacterial – which means minimal washing and ironing! However, when needed it is machine washable, giving it big practicality points. Merino wool is naturally biodegradable.  For a total sustainable finish, we have added eco–friendly buttons from corozo nuts.<br />Look it up also DAPHNE’s sister ZEPHYRA vest from the same merino wool quality.<br /><br />Designed by Justyna and sustainably crafted in Europe. Made with love and attention to small details.<br /><br />DAPHNE cardigan is made to order and may take 1-2 weeks to be handcrafted with care, especially for you.",
    compCare:
      '100% Merino wool is a natural material originating from Australian Merino sheep. Despite wool’s undisputable sustainable qualities, there are careful ethical considerations to be made when choosing to use wool. Therefore, we only use cruelty-free, certified mulesing-free Merino wool.<br /><br />Wash DAPHNE on a delicate cycle at 30 °C degrees, iron at a low setting and do not tumble dry.<br />Our fabrics are sustainable and do not require dry cleaning.',
  },
  {
    name: 'ZEPHYRA Vest',
    price: 239,
    color: 'Satin Cream',
    description:
      "ZEPHYRA vest is made from 100% merino wool. These high-quality natural fibers create our design that is a joy to wear, (hooray for wool that doesn't itch!) and will stand the test of time. Additionally, it makes our ZEPHYRA super light! Merino wool is perfect for both summer and winter due to its breathability and temperature regulating properties. It will keep you warm and insulated in cold weather, and cool and comfortable in the summer months - plus it is hypo-allergenic, making it the perfect fiber for sensitive skin. Merino wool also repels dirt, stains, and wrinkles and is naturally antibacterial – which means minimal washing and ironing! However, when needed it is machine washable, giving it big practicality points. Merino wool is naturally biodegradable. Also meet ZEPHYRA'S sister DAPHNE cardigan from merino wool. For a total sustainable finish, we have added eco–friendly buttons from corozo nuts.<br /><br />Designed by Justyna and sustainably crafted in Europe. Made with love and attention to small details.<br /><br />ZEPHYRA vest is made to order and may take 1-2 weeks to be handcrafted with care, especially for you.",
    compCare:
      "100% Merino wool is a natural material originating from Australian Merino sheep. Despite wool's undisputable sustainable qualities, there are careful ethical considerations to be made when choosing to use wool.Therefore, we only use cruelty- free, certified mulesing - free Merino wool.<br />Wash ZEPHYRA on a delicate cycle at 30 °C degrees, iron at a low setting, and do not tumble dry.Our fabrics are sustainable and do not require dry cleaning.",
  },
  {
    isUpdate: true,
    name: 'LILIUM Trousers',
    price: 170,
    description:
      'This double gauze fabric is made from 100% organic cotton and is GOTS certified.  LILIUM trousers are perfectly designed for effortlessly beautiful design and still comfortable style. Loose fit, wide leg with elastic band in the back and two pockets will be ever most beloved trousers in your transitional wardrobe. Thanks to the interesting details of the fabric itself, you can enjoy our LILIUM trousers in two different looks: crepe texture without even ironing or flat smooth style after ironing.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br /><br />LILIUM trousers are made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    compCare:
      'Feel good in certified organic quality. Two layers of fabric have been loosely joined to create this organic muslin fabric called Double Gauze. As a result, this muslin has more volume than a one-ply muslin but is just as soft and pliable. The double gauze fabric features a beautiful crepe texture, which means the fabric does not need ironing. This double gauze fabric is made from 100% organic cotton and is GOTS certified. This organic fabric is Global Organic Textile Standard (GOTS) certified along the entire textile chain - from the cotton fiber, through all production processes such as weaving or knitting, dyeing, and printing, to the store counter of Ziegenbalg.<br /><br />Wash LILIUM on a delicate cycle at 30°C. Our fabrics are sustainable and do not require dry cleaning.',
    pic1: 'lilium-trousers-01.jpg',
    pic2: 'lilium-trousers-02.jpg',
    pic3: 'lilium-trousers-03.jpg',
    pic4: 'lilium-trousers-04.jpg',
  },
  {
    isUpdate: true,
    idName: 'gea-cream',
    pic1: 'gea-cream-01.jpg',
    pic2: 'gea-cream-02.jpg',
    pic3: 'gea-cream-03.jpg',
    pic4: 'gea-cream-04.jpg',
  },
  {
    isUpdate: true,
    idName: 'ivy-cream',
    pic1: 'ivy-cream-01.jpg',
    pic2: 'ivy-cream-02.jpg',
    pic3: 'ivy-cream-03.jpg',
    pic4: 'ivy-cream-04.jpg',
  },
];

export class addNewProducts1661610056445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);
    const stockRepo = queryRunner.manager.getRepository(StockEntity);

    for (const product of productList) {
      const { name, compCare, description, isUpdate } = product;
      const idName = product.idName || kebabCase(name);

      if (isUpdate) {
        const newProductData = {
          ...product,
          ...(compCare
            ? { compCare: `<div class="ju">${compCare}</div>` }
            : {}),
          ...(description
            ? { description: `<div class="ju">${description}</div>` }
            : {}),
        };
        await productRepo.update(
          { idName },
          omit(['idName', 'isUpdate'], newProductData),
        );
      } else {
        await productRepo.insert({
          ...product,
          idName,
          compCare: `<div class="ju">${compCare}</div>`,
          description: `<div class="ju">${description}</div>`,
          availability: 'Available',
          pic1: `${idName}-01.jpg`,
          pic2: `${idName}-02.jpg`,
          pic3: `${idName}-03.jpg`,
          pic4: `${idName}-04.jpg`,
        });
      }

      await stockRepo.manager.upsert(
        StockEntity,
        { idName, xs: 5, s: 5, m: 5, ml: 5, l: 5 },
        ['idName'],
      );
    }
  }

  /**
   * NOTE: on revert we won't undo the updates that were made on the products.
   * We will only remove the new products.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    const productRepo = queryRunner.manager.getRepository(ProductEntity);
    const stockRepo = queryRunner.manager.getRepository(StockEntity);

    const toRemove = productList.reduce((memo, { idName, name, isUpdate }) => {
      if (!isUpdate) {
        const idNameToDelete = idName || kebabCase(name);
        memo.push(idNameToDelete);
      }
      return memo;
    }, []);

    await stockRepo.delete({
      idName: In(toRemove),
    });
    await productRepo.delete({
      idName: In(toRemove),
    });
  }
}
