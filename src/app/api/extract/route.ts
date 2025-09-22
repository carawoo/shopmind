import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, barcode, productName } = body;

    // 입력 데이터 검증
    if (!images && !barcode && !productName) {
      return NextResponse.json(
        { error: '이미지, 바코드, 또는 제품명 중 하나는 필수입니다.' },
        { status: 400 }
      );
    }

    // 임시 응답 데이터 (실제 AI 분석 로직으로 교체 필요)
    const mockResponse = {
      scanId: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productInfo: {
        name: productName || '분석된 제품',
        brand: '브랜드명',
        barcode: barcode || null,
        ingredients: ['성분1', '성분2', '성분3'],
        nutritionFacts: {
          calories: 100,
          protein: 5,
          carbs: 15,
          fat: 3,
          sodium: 200
        },
        allergens: ['글루텐', '우유'],
        price: 2500,
        healthScore: 85,
        comparison: {
          similarProducts: [
            {
              name: '비슷한 제품 1',
              price: 2200,
              healthScore: 78,
              pros: ['저렴한 가격', '비슷한 맛'],
              cons: ['높은 나트륨']
            },
            {
              name: '비슷한 제품 2',
              price: 2800,
              healthScore: 92,
              pros: ['높은 건강 점수', '천연 재료'],
              cons: ['높은 가격']
            }
          ],
          recommendation: '비슷한 제품 2가 건강 점수 면에서 더 우수합니다.'
        }
      },
      analysis: {
        confidence: 0.95,
        processingTime: 1.2,
        timestamp: new Date().toISOString()
      }
    };

    // 성공 응답
    return NextResponse.json(mockResponse, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    
    // JSON 파싱 오류 처리
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }

    // 일반 서버 오류
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 지원 (CORS)
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
