import { db } from '@root/db/config';
import { Catalog, Variant, Product, Volt, Color, Category, Photo, CategoryTranslation, ColorTranslation, ProductTranslation, StatusTranslation } from '@root/db/schema';
import { eq, and, min } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface ProductInfo {
  review: string;
  included: string | null;
  specs: string;
}

interface ProductData {
  code: string;
  name: string;
  productCode: string | null;
  price: string;
  color: string;
  show: boolean;
  productPerBox: number;
  volt: string | null;
  registered: boolean;
  originalName: string;
  info: ProductInfo;
  photo: string | undefined;
}

interface GroupedByCategory {
  [key: string]: {
    products: ProductData[];
    categoryName: string;
    categoryDescription: string;
    categoryShortDescription: string;
  };
}

const allowedOrigins = ['https://interbrasoficial.com', 'http://localhost:4321', null];


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const currentLocale  = searchParams.get('lang') || 'es';

    const origin = request.headers.get('Origin');

    if (!allowedOrigins.includes(origin)) {
      return NextResponse.json({ message: 'Origin not allowed' }, { status: 403 });
    }

    const t = (key: string) => key;
    const t_catalog = (key: string) => key;

    const catalog = await db
      .select({
        catalog: {
          id: Catalog.id,
          name: Catalog.name,
          price: Catalog.price,
          show: Catalog.show,
          productPerBox: Catalog.productPerBox,
        },
        product: {
          id: Product.id,
          name: ProductTranslation.name,
          review: ProductTranslation.review,
          included: ProductTranslation.included,
          specs: ProductTranslation.specs,
        },
        volt: {
          id: Volt.id,
          name: Volt.name,
        },
        color: {
          id: Color.id,
          color: ColorTranslation.name,
        },
        category: {
          id: Category.id,
          name: CategoryTranslation.name,
          description: CategoryTranslation.description,
          shortDescription: CategoryTranslation.shortDescription,
        },
        photo: {
          url: Photo.url,
          order: Photo.order,
        },
      })
      .from(Catalog)
      .fullJoin(Variant, eq(Variant.catalog_id, Catalog.id))
      .fullJoin(Product, eq(Product.id, Variant.product_id))
      .fullJoin(Volt, eq(Volt.id, Variant.volt_id))
      .fullJoin(Color, eq(Color.id, Variant.color_id))
      .fullJoin(Category, eq(Category.id, Product.category_id))
      .fullJoin(Photo, eq(Photo.variant_id, Variant.id))

      .fullJoin(CategoryTranslation, eq(CategoryTranslation.category_id, Category.id))
      .fullJoin(ColorTranslation, eq(ColorTranslation.key, Color.color))
      .fullJoin(ProductTranslation , eq(ProductTranslation.product_id, Product.id))
      .fullJoin(StatusTranslation, eq(StatusTranslation.status_id, Catalog.status_id))

      .where(
        and(
          eq(
            Photo.order,
            db
              .select({ order: min(Photo.order) })
              .from(Photo)
              .where(eq(Photo.variant_id, Variant.id))
          ),
          eq(
            CategoryTranslation.lang,
            currentLocale
          ),
          eq(
            ColorTranslation.lang,
            currentLocale
          ),
          eq(
            ProductTranslation.lang,
            currentLocale
          ),
          eq(
            StatusTranslation.lang,
            currentLocale
          )
        )
      );

    const groupedByCategory: GroupedByCategory = {};
    
    catalog.forEach((item) => {
      if (!item.catalog?.show) {
        return;
      }
    
      const categoryID = item?.category?.id || "noCategory";
    
      const CategoryName = item?.category?.name
        ? t(item.category.name)
        : t_catalog("noCategory");
    
      const CategoryDescription = item?.category?.description
        ? t(item.category.description)
        : t_catalog("noDescription");
    
      const CategoryShortDescription = item?.category?.shortDescription
        ? t(item.category.shortDescription)
        : t_catalog("noShortDescription");
    
      const code = item?.catalog?.id || t_catalog("noCode");
    
      const name = item?.catalog?.name || t_catalog("noName");
      const price = item?.catalog?.price || t_catalog("noPrice");
      const show = item?.catalog?.show === true || false;
      const registered = item?.product?.id ? true : false;
      const originalName = item?.product?.name
        ? t(item?.product?.name)
        : t_catalog("noName");
    
      const review = item?.product?.review
        ? t(item.product.review)
        : t_catalog("noReview");
    
      const included = item?.product?.included ? t(item.product.included) : null;
    
      const specs = item?.product?.specs
        ? t(item.product.specs)
        : t_catalog("noSpecs");
    
      const photo = item?.photo?.url || "noPhoto";
    
      const color = t(item?.color?.color || "") || "noColor";
    
      const product: ProductData = {
        code: code.toString(),
        productCode: item?.product?.id || null,
        name,
        price: price.toString(),
        color,
        show,
        productPerBox: item.catalog?.productPerBox || 1,
        registered,
        originalName,
        volt: item?.volt?.name || null,
        info: {
          review,
          included,
          specs,
        },
        photo,
      };
    
      if (!groupedByCategory[categoryID]) {
        groupedByCategory[categoryID] = {
          products: [product],
          categoryName: CategoryName,
          categoryDescription: CategoryDescription,
          categoryShortDescription: CategoryShortDescription,
        };
      } else {
        groupedByCategory[categoryID].products.push(product);
      }
    });
    
    // Orden de categorías solicitado
    const categoryOrder = [
      "tvs",
      "aires",
      "scooters",
      "hoverboards",
      "triciclos",
      "airfryer",
    ];
    
    const orderedProducts: GroupedByCategory = {
      ...categoryOrder.reduce((acc: GroupedByCategory, category: string) => {
        if (groupedByCategory[category]) {
          acc[category] = groupedByCategory[category];
        }
        return acc;
      }, {}),
      ...Object.keys(groupedByCategory)
        .filter((category) => !categoryOrder.includes(category))
        .reduce((acc: GroupedByCategory, category: string) => {
          acc[category] = groupedByCategory[category];
          return acc;
        }, {}),
    };

  return NextResponse.json(
    orderedProducts,
    {
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
