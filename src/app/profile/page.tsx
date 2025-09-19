'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Heart, 
  AlertTriangle, 
  DollarSign,
  Save,
  Plus,
  X,
  Settings,
  Shield,
  Star,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const COMMON_ALLERGIES = [
  '글루텐', '달걀', '우유', '견과류', '땅콩', '대두', '조개류', '생선',
  '참깨', '메밀', '복숭아', '토마토', '새우', '게', '오징어'
];

const DIET_TAGS = [
  'low_sugar', 'low_sodium', 'high_protein', 'low_fat', 'high_fiber',
  'vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'keto'
];

const DIET_LABELS = {
  low_sugar: '저당분',
  low_sodium: '저나트륨',
  high_protein: '고단백',
  low_fat: '저지방',
  high_fiber: '고섬유질',
  vegetarian: '채식주의',
  vegan: '비건',
  gluten_free: '글루텐프리',
  dairy_free: '유제품프리',
  keto: '케토'
};

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // 프로필 상태
  const [profile, setProfile] = useState({
    budget_krw: 50000,
    allergies: [] as string[],
    diet_tags: [] as string[],
    preferences: {
      notification: true,
      price_alert: true,
      health_score: true,
    }
  });

  const [customAllergy, setCustomAllergy] = useState('');

  // 알레르기 추가/제거
  const toggleAllergy = (allergy: string) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !profile.allergies.includes(customAllergy.trim())) {
      setProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, customAllergy.trim()]
      }));
      setCustomAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  // 식단 태그 토글
  const toggleDietTag = (tag: string) => {
    setProfile(prev => ({
      ...prev,
      diet_tags: prev.diet_tags.includes(tag)
        ? prev.diet_tags.filter(t => t !== tag)
        : [...prev.diet_tags, tag]
    }));
  };

  // 프로필 저장
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // TODO: 실제 API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('프로필이 저장되었습니다!');
    } catch (error) {
      toast.error('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">개인 설정</h1>
                <p className="text-gray-600 text-sm">
                  나만의 맞춤형 쇼핑을 위한 정보를 설정해주세요
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
              <Settings className="w-4 h-4" />
              <span>개인화 설정</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 기본 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 예산 설정 */}
            <Card className="card-friendly border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle>쇼핑 예산</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      월 평균 식료품 구매 예산을 설정해주세요
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="budget" className="text-base font-semibold text-gray-900 mb-2 block">
                    월 예산 (원)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={profile.budget_krw}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      budget_krw: parseInt(e.target.value) || 0
                    }))}
                    className="input-friendly text-base"
                    min="0"
                    step="10000"
                  />
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-800">
                    💡 예산 기반으로 가성비 좋은 제품을 우선 추천해드려요
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 알레르기 정보 */}
            <Card className="card-friendly border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <CardTitle>알레르기 정보</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      알레르기가 있는 성분을 선택하면 해당 제품에 대해 경고를 표시해요
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 일반 알레르기 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">일반적인 알레르기 성분</h4>
                  <div className="flex flex-wrap gap-3">
                    {COMMON_ALLERGIES.map(allergy => (
                      <Badge
                        key={allergy}
                        variant={profile.allergies.includes(allergy) ? "destructive" : "outline"}
                        className="cursor-pointer hover:shadow-md transition-all"
                        onClick={() => toggleAllergy(allergy)}
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* 커스텀 알레르기 추가 */}
                <div>
                  <Label htmlFor="custom-allergy" className="text-base font-semibold text-gray-900 mb-2 block">
                    기타 알레르기 추가
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="custom-allergy"
                      value={customAllergy}
                      onChange={(e) => setCustomAllergy(e.target.value)}
                      placeholder="예: 키위, 파인애플"
                      onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
                      className="input-friendly flex-1"
                    />
                    <Button onClick={addCustomAllergy} className="carrot-gradient text-white border-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 선택된 알레르기 */}
                {profile.allergies.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-xl">
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      선택된 알레르기 ({profile.allergies.length}개)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.allergies.map(allergy => (
                        <Badge key={allergy} variant="destructive" className="pr-1">
                          {allergy}
                          <button
                            onClick={() => removeAllergy(allergy)}
                            className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 식단 선호도 */}
            <Card className="card-friendly border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mr-4">
                    <Heart className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <CardTitle>식단 선호도</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      선호하는 식단 스타일을 선택하면 맞춤형 비교 기준을 제공해요
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DIET_TAGS.map(tag => (
                    <Badge
                      key={tag}
                      variant={profile.diet_tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer justify-center py-3 text-sm font-medium hover:shadow-md transition-all"
                      onClick={() => toggleDietTag(tag)}
                    >
                      {DIET_LABELS[tag as keyof typeof DIET_LABELS]}
                    </Badge>
                  ))}
                </div>
                
                {profile.diet_tags.length > 0 && (
                  <div className="mt-6 p-4 bg-pink-50 rounded-xl">
                    <h4 className="font-semibold text-pink-900 mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      선택된 식단 선호도
                    </h4>
                    <p className="text-sm text-pink-800">
                      선택하신 {profile.diet_tags.length}개의 선호도에 맞는 제품을 우선 추천해드려요
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 프로필 요약 */}
            <Card className="card-friendly border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle>프로필 요약</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 block mb-1">월 예산</span>
                  <p className="font-bold text-lg text-gray-900">{profile.budget_krw.toLocaleString()}원</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 block mb-1">알레르기</span>
                  <p className="font-semibold text-gray-900">
                    {profile.allergies.length > 0 
                      ? `${profile.allergies.length}개 등록됨`
                      : '등록된 알레르기 없음'
                    }
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 block mb-1">식단 선호도</span>
                  <p className="font-semibold text-gray-900">
                    {profile.diet_tags.length > 0 
                      ? `${profile.diet_tags.length}개 선택됨`
                      : '선택된 선호도 없음'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="w-full carrot-gradient text-white border-0 button-friendly text-base py-3"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  설정 저장하기
                </>
              )}
            </Button>

            {/* 도움말 */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  개인화 팁
                </h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>정확한 알레르기 정보로 안전한 쇼핑을 하세요</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>식단 선호도를 설정하면 더 정확한 추천을 받을 수 있어요</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>예산 설정으로 가성비 좋은 제품을 우선 확인하세요</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
