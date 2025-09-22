'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CameraScanner from '@/components/CameraScanner';
import UploadDropzone from '@/components/UploadDropzone';
import { 
  Camera, 
  Upload, 
  Type, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Sparkles,
  Search,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function UploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  // 바코드 스캔 처리
  const handleBarcodeDetect = async (barcode: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      toast.success(`바코드 감지: ${barcode}`);
      
      // 바코드로 제품 검색 API 호출
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: [],
          barcode,
        }),
      });

      if (!response.ok) {
        throw new Error('바코드 처리 중 오류가 발생했습니다');
      }

      const data = await response.json();
      
      // 결과 저장 후 결과 페이지로 이동
      try {
        if (typeof window !== 'undefined') {
          const key = `scan:${data.scanId}`;
          sessionStorage.setItem(key, JSON.stringify(data));
        }
      } catch {}
      router.push(`/scan/${data.scanId}`);
      
    } catch (error) {
      console.error('Barcode processing error:', error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다');
      toast.error('바코드 처리 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 사진 업로드 처리
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // 파일을 base64로 변환
      const imagePromises = files.map(file => {
        return new Promise<{ name: string; type: string; base64: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve({
              name: file.name,
              type: file.type,
              base64: base64.split(',')[1], // data:image/jpeg;base64, 부분 제거
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagePromises);
      
      toast.loading('이미지 분석 중...', { id: 'upload' });

      // API 호출
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 처리 중 오류가 발생했습니다');
      }

      const data = await response.json();
      
      toast.success('분석 완료!', { id: 'upload' });
      
      // 결과 페이지로 이동
      router.push(`/scan/${data.scanId}`);
      
    } catch (error) {
      console.error('File upload error:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      setError(errorMessage);
      toast.error('업로드 실패', { id: 'upload' });
    } finally {
      setIsLoading(false);
    }
  };

  // 텍스트 입력 처리
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!textInput.trim()) {
      toast.error('제품명을 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      toast.loading('제품 검색 중...', { id: 'text-search' });

      // 텍스트 검색 API 호출 (임시로 extract API 사용)
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: [],
          productName: textInput.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('제품 검색 중 오류가 발생했습니다');
      }

      const data = await response.json();
      
      toast.success('검색 완료!', { id: 'text-search' });
      
      // 결과 저장 후 결과 페이지로 이동
      try {
        if (typeof window !== 'undefined') {
          const key = `scan:${data.scanId}`;
          sessionStorage.setItem(key, JSON.stringify(data));
        }
      } catch {}
      router.push(`/scan/${data.scanId}`);
      
    } catch (error) {
      console.error('Text search error:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      setError(errorMessage);
      toast.error('검색 실패', { id: 'text-search' });
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
                <h1 className="text-2xl font-bold text-gray-900">제품 분석하기</h1>
                <p className="text-gray-600 text-sm">
                  어떤 방법으로 제품을 분석해볼까요?
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI 분석</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 에러 표시 */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center text-red-700">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 메인 탭 */}
        <Tabs defaultValue="photo" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="camera" className="flex items-center justify-center py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Camera className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">바코드 스캔</span>
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center justify-center py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">사진 업로드</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center justify-center py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">제품명 입력</span>
            </TabsTrigger>
          </TabsList>

          {/* 바코드 스캔 */}
          <TabsContent value="camera">
            <Card className="card-friendly border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mr-4">
                    <Camera className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>바코드 스캔</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      카메라로 제품의 바코드를 스캔하면 자동으로 제품 정보를 인식해요
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
                    <span className="text-gray-600">바코드 처리 중...</span>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <CameraScanner
                      onDetect={handleBarcodeDetect}
                      onError={(error: Error) => {
                        setError(error.message);
                        toast.error('카메라 오류');
                      }}
                    />
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-orange-50 rounded-xl">
                  <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    빠른 스캔 팁
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• 바코드가 선명하게 보이도록 카메라를 조정하세요</li>
                    <li>• 충분한 조명이 있는 곳에서 스캔하세요</li>
                    <li>• 바코드가 화면 중앙에 위치하도록 하세요</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 사진 업로드 */}
          <TabsContent value="photo">
            <Card className="card-friendly border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                    <Upload className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle>제품 사진 업로드</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      제품 라벨이나 성분표 사진을 업로드하면 AI가 자동으로 분석해요
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-4" />
                    <span className="text-gray-600">이미지 분석 중...</span>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <UploadDropzone
                      onUpload={handleFileUpload}
                      maxFiles={2}
                      acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    />
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    좋은 사진을 위한 팁
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 성분표나 영양성분표가 선명하게 보이도록 촬영하세요</li>
                    <li>• 글자가 잘 읽히도록 충분한 조명을 확보하세요</li>
                    <li>• 여러 각도에서 촬영하면 더 정확한 분석이 가능해요</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 텍스트 입력 */}
          <TabsContent value="text">
            <Card className="card-friendly border-0">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                    <Search className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>제품명 직접 입력</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      제품명을 직접 입력하여 검색할 수 있어요
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTextSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="product-name" className="text-base font-semibold text-gray-900 mb-2 block">
                      제품명
                    </Label>
                    <Input
                      id="product-name"
                      type="text"
                      placeholder="예: 오리온 초코파이, 농심 신라면"
                      value={textInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTextInput(e.target.value)}
                      disabled={isLoading}
                      className="input-friendly text-base"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading || !textInput.trim()}
                    className="w-full carrot-gradient text-white border-0 button-friendly text-base py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        검색 중...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        제품 검색하기
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    검색 팁
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>브랜드명과 제품명을 함께 입력하세요</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>정확한 제품명일수록 더 정확한 결과를 얻을 수 있어요</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>영어와 한글 모두 지원합니다</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
