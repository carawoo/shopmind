'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import { 
  ArrowLeft, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Zap,
  Heart,
  Shield,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductInfo {
  name: string;
  brand?: string;
  barcode?: string;
  ingredients?: string[];
  nutritionFacts?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sodium?: number;
  };
  allergens?: string[];
  price?: number;
  healthScore?: number;
  comparison?: {
    similarProducts: Array<{
      name: string;
      price: number;
      healthScore: number;
      pros: string[];
      cons: string[];
    }>;
    recommendation: string;
  };
}

interface AnalysisResult {
  scanId: string;
  productInfo: ProductInfo;
  analysis: {
    confidence: number;
    processingTime: number;
    timestamp: string;
  };
}

export default function ScanResultPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const key = `scan:${params.id as string}`;
        const raw = sessionStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as AnalysisResult;
          setResult(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {}
    setError('결과 데이터를 찾을 수 없습니다. 다시 시도해주세요.');
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">제품 분석 중...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">분석 실패</h2>
            <p className="text-gray-600 mb-4">{error || '결과를 불러올 수 없습니다.'}</p>
            <Button onClick={() => router.push('/upload')} className="w-full">
              다시 시도하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { productInfo } = result;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="hover:bg-orange-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Button>
              <Logo size="md" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 제품 기본 정보 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{productInfo.name}</CardTitle>
                <p className="text-gray-600">{productInfo.brand}</p>
                {productInfo.barcode && (
                  <p className="text-sm text-gray-500 mt-1">바코드: {productInfo.barcode}</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-orange-500">
                    {productInfo.healthScore}
                  </span>
                  <span className="text-gray-500">/100</span>
                </div>
                <p className="text-sm text-gray-600">건강 점수</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 영양 정보 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">영양 정보 (1개당)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>칼로리</span>
                    <span className="font-medium">{productInfo.nutritionFacts?.calories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>단백질</span>
                    <span className="font-medium">{productInfo.nutritionFacts?.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>탄수화물</span>
                    <span className="font-medium">{productInfo.nutritionFacts?.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>지방</span>
                    <span className="font-medium">{productInfo.nutritionFacts?.fat}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>나트륨</span>
                    <span className="font-medium">{productInfo.nutritionFacts?.sodium}mg</span>
                  </div>
                </div>
              </div>

              {/* 알레르기 정보 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">알레르기 정보</h3>
                {productInfo.allergens && productInfo.allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {productInfo.allergens.map((allergen, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>알레르기 성분 없음</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 제품 비교 */}
        {productInfo.comparison && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-500" />
                비슷한 제품 비교
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productInfo.comparison.similarProducts.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-orange-500 font-bold">
                            {product.price.toLocaleString()}원
                          </span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{product.healthScore}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          장점
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {product.pros.map((pro, i) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          단점
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {product.cons.map((con, i) => (
                            <li key={i}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    추천사항
                  </h4>
                  <p className="text-blue-800">{productInfo.comparison.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push('/upload')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
            size="lg"
          >
            다른 제품 분석하기
          </Button>
          <Button 
            onClick={() => router.push('/profile')}
            variant="outline"
            size="lg"
          >
            프로필 설정하기
          </Button>
        </div>
      </div>
    </div>
  );
}
