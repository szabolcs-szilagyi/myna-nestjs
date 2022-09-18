import { kebabCase, omit } from 'lodash/fp';
import { MigrationInterface, QueryRunner, In } from 'typeorm';
import { StockEntity } from '../cart/entities/stock.entity';
import { ProductEntity } from '../product/entities/product.entity';

const productList: (Partial<ProductEntity> & { isUpdate?: boolean })[] = [
  {
    name: 'NARCI Midi Skirt',
    price: 160,
    color: 'Dusty Rose',
    description:
      'NARCI is made from a beautiful mix of cotton and lotus fiber. It is a middle-length skirt with an elastic waistline for your comfort. This time appears in outstanding quality with extra fiber from Lotus flower. Lotus fiber is a natural bast fiber that is obtained from the stems of the lotus plant.<br />Two side pockets are also introduced for your convenience to wear it with ease each day. The extravagant look and feel of this amazing mix of cotton with lotus quality will stay for long years and will be your favorite piece in your capsule wardrobe. The timeless design of our NARCI skirt will be a perfect companion to our NOLIA blouse for a total, stylish and monochrome look.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br />NARCI skirt is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.',
    compCare:
      "95% organic cotton (not certified) and 5% lotus flower, from Samatoa.<br />Lotus fabric has unique properties: it is naturally soft, light, especially breathable, and almost wrinkle- free. It is also a very Eco - friendly fabric containing no chemicals or toxic products. It's probably the most ecological material in the world. First, they transform a stem that would have turned to waste into a quality textile. Furthermore, they ensure not to use any polluting energy during the entirety of the production process.<br />Wash NARCI on a delicate cycle at 30°C. Our fabrics are sustainable and do not require dry cleaning.",
  },
  {
    name: 'NOLIA Blouse',
    price: 119,
    color: 'Dusty Rose',
    description:
      "NOLIA blouse is made from outstanding mix quality: cotton and fiber from the lotus flower. Lotus fiber is a natural bast fiber that is obtained from the stems of the lotus plant.<br />Very durable and soft feel while wearing NOLIA it's a guarantee! Additionally, our blouse has a beautiful little button from corozo nut, for a sustainable and eco-friendly approach. Pair it up with our NARCI skirt for a stylish and monochrome look.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br />NOLIA blouse is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    compCare:
      "95% organic cotton (not certified) and 5% lotus flower from Samatoa.<br />Lotus fabric has unique properties: it is naturally soft, light, especially breathable, and almost wrinkle-free. It is also a very Eco - friendly fabric containing no chemicals or toxic products. It's probably the most ecological material in the world. First, they transform a stem that would have turned to waste into a quality textile. Furthermore, they ensure not to use any polluting energy during the entirety of the production process.<br />Wash NOLIA on a delicate cycle at 30°C. Our fabrics are sustainable and do not require dry cleaning.",
  },
  {
    name: 'KAMALA Trench Coat',
    price: 299,
    color: 'Dusty Rose',
    description:
      "KAMALA trench is made from outstanding mix quality: cotton and fiber from the lotus flower. Lotus fiber is a natural bast fiber that is obtained from the stems of the lotus plant.<br />Very durable and soft feel while wearing our coat it's a guarantee! The style of the KAMALA trench coat can be versatile and depending on how you dress it up or down can also appear stylish and elegant. All buttons are also from sustainable material, made from corozo nuts.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br />KAMALA coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    compCare:
      "95% organic cotton (not certified) and 5% lotus flower, from Samatoa.<br />Lotus fabric has unique properties: it is naturally soft, light, especially breathable, and almost wrinkle-free. It is also a very Eco - friendly fabric containing no chemicals or toxic products. It's probably the most ecological material in the world. First, they transform a stem that would have turned to waste into a quality textile. Furthermore, they ensure not to use any polluting energy during the entirety of the production process.<br />Wash KAMALA on a delicate cycle at 30°C. Our fabrics are sustainable and do not require dry cleaning.",
  },
  {
    name: 'SILENE Long Coat',
    price: 260,
    color: 'Shadow Sand',
    description:
      "SILENE coat is made from 100% Tencel quality. You will love our coat mainly for its softness. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our SILENE coat. Our design can be also versatile, you can transform our coat into a dressing gown that gets cold outside, and you can still enjoy this beautiful quality at home.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors. Made with love and attention to small details.<br />SILENE coat is made to order and may take 1-2 weeks to be hand sewn with care in Budapest.",
    compCare:
      '100% Tencel, wood cellulose, dyed with GOTS certified dyes with GOTS certificate, made in Turkey. These fibers are known for feeling super soft and are widely used sustainably. Tencel is like viscose but uses chemicals that are less toxic and get recycled in the process so there’s minimal waste. It also uses wood from trees in sustainably harvested forests. It has a natural origin because it’s made from wood, but the finished fiber is technically man-made, so it doesn’t qualify as a natural fiber. That’s why the textiles industry refers to it as regenerated cellulose instead of “natural” or “synthetic”.<br /><br />Should you buy a product made from Tencel? Yes, absolutely! Tencel fibers feel amazing, use sustainable practices, and have high- quality performance features that make them so popular.<br />Wash SILENE on a gentle cycle at 30 degrees, iron on a low level, and do not tumble dry. Our fabrics are durable and do not require dry cleaning. Iron inside out.',
  },
  {
    name: 'ZINIA Long Skirt',
    price: 149,
    color: 'Shadow Sand',
    description:
      "ZINIA skirt is made from 100% Tencel quality. You will love our skirt mainly for its softness and beautiful drape. Fabric made of Tencel lyocell also has excellent drape, doesn't wrinkle easily, is breathable, and manages moisture so it helps with temperature regulation - so our ZINIA skirt.<br />Our classic design surprises with an unexpected twist while moving, thanks to a beautiful and feminine cut.<br />It is a long-length skirt with an elastic waistline for your comfort.<br />ZINIA can be as versatile as your imagination, depending on how well you dress it up or down.<br /><br />Designed by Justyna and sustainably crafted in Hungary by local tailors.Made with love and attention to small details.<br />ZINIA skirt is made to order and may take 1 - 2 weeks to be hand sewn with care in Budapest.",
    compCare:
      '100% Tencel, wood cellulose, dyed with GOTS certified dyes with GOTS certificate, made in Turkey. These fibers are known for feeling super soft and are widely used sustainably. Tencel is like viscose but uses chemicals that are less toxic and get recycled in the process so there’s minimal waste. It also uses wood from trees in sustainably harvested forests. It has a natural origin because it’s made from wood, but the finished fiber is technically man-made, so it doesn’t qualify as a natural fiber. That’s why the textiles industry refers to it as regenerated cellulose instead of “natural” or “synthetic.”<br />Should You buy a product made from Tencel? Yes, absolutely! Tencel fibers feel amazing, use sustainable practices, and have high-quality performance features that make them so popular.<br />Wash ZINIA on a gentle cycle at 30 degrees, iron on a low level, and do not tumble dry. Our fabrics are durable and do not require dry cleaning. Iron inside out.',
  },
  {
    name: 'HEBE Socks',
    price: 85,
    color: 'Satin Cream',
    description:
      "HEBE socks are made from 100% merino wool. These high-quality natural fibers create our garment that is a joy to wear, (hooray for wool that doesn't itch!) and will stand the test of time. And it makes HEBE super light! It will keep you warm and insulated in cold weather, and cool and comfortable in the summer months - plus it is hypo-allergenic, making it the perfect fiber for sensitive skin. Merino wool also repels dirt, stains, and wrinkles and is naturally antibacterial – which means minimal washing and ironing! However, when needed it is machine washable, giving it big practicality points. Merino wool is naturally biodegradable. Match with the ZEPHYRA vest and the DAPHNE cardigan from the same merino wool.<br /><br />Designed by Justyna and sustainably crafted in Europe.Made with love and attention to small details.<br />HEBE socks are made to order and may take 1-2 weeks to be handcrafted with care, especially for you.",
    compCare:
      "100% Merino wool is a natural material originating from Australian Merino sheep. Despite wool's undisputable sustainable qualities, there are careful ethical considerations to be made when choosing to use wool. Therefore, we only use cruelty-free, certified mulesing-free Merino wool.<br />Wash HEBE on a delicate cycle at 30 °C degrees, iron at a low setting, and do not tumble dry. Our fabrics are sustainable and do not require dry cleaning.",
  },
];

export class addNewProducts1663520874915 implements MigrationInterface {
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
