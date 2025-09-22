import { NextRequest, NextResponse } from 'next/server';

interface ProductInfo {
  name: string;
  brand?: string;
  barcode?: string | null;
  ingredients?: string[];
  nutritionFacts?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sodium?: number;
  };
  allergens?: string[];
  images?: string[];
}

async function fetchByBarcode(barcode: string): Promise<ProductInfo | null> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.status !== 1 || !data.product) return null;
  const p = data.product;
  const nutrients = p.nutriments || {};
  const allergens = (p.allergens_tags || []).map((t: string) => t.replace(/^en:/, ''));
  const images: string[] = [];
  if (p.image_front_url) images.push(p.image_front_url);
  if (p.image_nutrition_url) images.push(p.image_nutrition_url);
  if (p.image_ingredients_url) images.push(p.image_ingredients_url);
  return {
    name: p.product_name || p.generic_name || 'Unknown product',
    brand: Array.isArray(p.brands_tags) && p.brands_tags.length ? p.brands_tags[0] : p.brands || undefined,
    barcode,
    ingredients: Array.isArray(p.ingredients) ? p.ingredients.map((i: any) => i.text).filter(Boolean) : undefined,
    nutritionFacts: {
      calories: nutrients['energy-kcal_100g'] ?? nutrients['energy-kcal_serving'],
      protein: nutrients.proteins_100g ?? nutrients.proteins_serving,
      carbs: nutrients.carbohydrates_100g ?? nutrients.carbohydrates_serving,
      fat: nutrients.fat_100g ?? nutrients.fat_serving,
      sodium: nutrients.sodium_100g ?? nutrients.sodium_serving,
    },
    allergens,
    images,
  };
}

async function fetchByProductName(productName: string): Promise<ProductInfo | null> {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1&page_size=1`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  const product = data?.products?.[0];
  if (!product) return null;
  return fetchByBarcode(product.code);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, barcode, productName } = body || {};

    if (!images && !barcode && !productName) {
      return NextResponse.json(
        { error: '이미지, 바코드, 또는 제품명 중 하나는 필수입니다.' },
        { status: 400 }
      );
    }

    // 현재는 이미지 분석 미구현: productName 또는 barcode만 처리
    let product: ProductInfo | null = null;
    if (barcode) {
      product = await fetchByBarcode(barcode);
    } else if (productName) {
      product = await fetchByProductName(productName);
    }

    if (!product) {
      return NextResponse.json(
        { error: '해당 제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const response = {
      scanId: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      productInfo: product,
      analysis: {
        confidence: 0.9,
        processingTime: 0.8,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
