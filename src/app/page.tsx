import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { 
  Camera, 
  Upload, 
  Zap, 
  DollarSign,
  Sparkles,
  ChevronRight,
  Heart,
  Shield,
  Star,
  Users
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      {/* 헤더 네비게이션 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/upload" className="text-gray-600 hover:text-orange-500 transition-colors">
                제품 비교
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-orange-500 transition-colors">
                내 프로필
              </Link>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                시작하기
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative px-4 pt-16 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              AI 기반 스마트 쇼핑 도우미
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              제품 사진만 찍으면<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">똑똑한 비교</span>가 시작돼요
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              당신만의 알레르기 정보와 선호도를 고려해서<br />
              <span className="font-semibold text-orange-500">최적의 제품</span>을 추천해드려요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 text-lg px-8 py-6">
                <Link href="/upload">
                  <Camera className="mr-2 h-5 w-5" />
                  지금 시작하기
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-gray-200 hover:border-orange-300">
                <Link href="#features">
                  <Users className="mr-2 h-5 w-5" />
                  더 알아보기
                </Link>
              </Button>
            </div>
          </div>

          {/* 메인 이미지/일러스트 영역 */}
          <div className="relative mb-20">
            <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. 사진 찍기</h3>
                  <p className="text-gray-600 text-sm">제품 라벨을 카메라로 촬영하세요</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. AI 분석</h3>
                  <p className="text-gray-600 text-sm">개인화된 기준으로 분석해드려요</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. 최적 선택</h3>
                  <p className="text-gray-600 text-sm">가장 적합한 제품을 추천해드려요</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              이런 점이 특별해요
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              단순한 가격 비교가 아닌, 당신을 위한 맞춤형 쇼핑 도우미
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="text-xl text-gray-900">개인 맞춤형 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  알레르기 정보, 식단 선호도, 건강 상태를 고려해서 
                  정말 필요한 정보만 골라서 보여드려요.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-xl text-gray-900">안전한 성분 체크</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  위험한 첨가물이나 알레르기 유발 성분을 
                  미리 확인할 수 있어요.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-xl text-gray-900">빠른 가격 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  신품부터 중고까지 다양한 쇼핑몰의 
                  가격을 한 번에 비교해드려요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 사용자 후기 섹션 */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              사용자들의 이야기
            </h3>
            <p className="text-xl text-gray-600">
              이미 많은 분들이 ShopMind와 함께 스마트한 쇼핑을 하고 있어요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &ldquo;알레르기가 있어서 항상 성분표를 자세히 봐야 했는데, 
                  이제는 사진만 찍으면 바로 체크해주네요!&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-500 font-semibold">김</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">김민지님</p>
                    <p className="text-sm text-gray-500">건강관리</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &ldquo;가격 비교도 정말 편하고, 내가 원하는 조건에 맞는 
                  제품만 골라서 보여줘서 좋아요.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-500 font-semibold">이</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">이준호님</p>
                    <p className="text-sm text-gray-500">가격비교</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &ldquo;영양성분이 궁금했는데 AI가 쉽게 설명해주니까 
                  이해하기가 훨씬 쉬워졌어요.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-500 font-semibold">박</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">박서연님</p>
                    <p className="text-sm text-gray-500">영양관리</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl mb-10 opacity-90">
            무료로 시작하고, 더 스마트한 쇼핑 경험을 만나보세요
          </p>
          
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-50 text-lg px-8 py-6">
            <Link href="/upload">
              <Camera className="mr-2 h-5 w-5" />
              첫 제품 비교하기
            </Link>
          </Button>

          <div className="mt-8 flex justify-center items-center space-x-8 text-sm opacity-80">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              무료로 시작
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              개인정보 보호
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              즉시 결과
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="lg" showText={true} />
              </div>
              <p className="text-gray-400 text-sm">
                AI 기반 스마트 쇼핑 도우미로<br />
                더 똑똑한 구매 결정을 내려보세요.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/upload" className="hover:text-white transition-colors">제품 비교</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">프로필 관리</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">가격 알림</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">도움말</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">문의하기</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">이용약관</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">연결하기</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">블로그</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">공지사항</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">파트너십</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ShopMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}