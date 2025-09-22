'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, AlertCircle, Camera, Sparkles } from 'lucide-react';
import type { UploadDropzoneProps } from '@/types';

// react-dropzone 설치 필요
// npm install react-dropzone

interface UploadedFile extends File {
  preview: string;
}

export default function UploadDropzone({
  onUpload,
  maxFiles = 2,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}: UploadDropzoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      // 거부된 파일 처리
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(({ errors }) => 
          errors.map((e: any) => e.message).join(', ')
        ).join('; ');
        setError(errors);
        return;
      }

      // 파일 수 제한 확인
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        setError(`최대 ${maxFiles}개의 파일만 업로드 가능합니다`);
        return;
      }

      // 파일 크기 제한 (10MB)
      const oversizedFiles = acceptedFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError('파일 크기는 10MB를 초과할 수 없습니다');
        return;
      }

      // 미리보기 URL 생성
      const filesWithPreview = acceptedFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      ) as UploadedFile[];

      setUploadedFiles(prev => [...prev, ...filesWithPreview]);
    },
    [uploadedFiles.length, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes.map((type: string) => type.replace('image/', '.')),
    },
    maxFiles,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploadedFiles.length >= maxFiles,
  });

  // 파일 제거
  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview); // 메모리 정리
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  // 업로드 실행
  const handleUpload = useCallback(() => {
    if (uploadedFiles.length === 0) {
      setError('업로드할 파일을 선택해주세요');
      return;
    }
    onUpload(uploadedFiles);
  }, [uploadedFiles, onUpload]);

  // 컴포넌트 언마운트 시 메모리 정리
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [uploadedFiles]);

  return (
    <div className="space-y-6">
      {/* 드롭존 */}
      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 rounded-2xl
          ${isDragActive 
            ? 'border-green-400 bg-green-50 scale-105' 
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
          }
          ${uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-lg font-semibold text-green-700 mb-2">
                파일을 여기에 놓으세요!
              </p>
              <p className="text-green-600">곧 분석을 시작해요</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                제품 사진을 업로드하세요
              </p>
              <p className="text-gray-600 mb-4">
                클릭하거나 파일을 드래그해서 업로드해주세요
              </p>
              <Button type="button" variant="outline" className="button-friendly">
                <Upload className="mr-2 h-4 w-4" />
                파일 선택하기
              </Button>
            </>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <ImageIcon className="w-4 h-4 mr-1" />
              <span>JPEG, PNG, WebP</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">최대 {maxFiles}개 파일</span>
            </div>
            <div className="flex items-center">
              <span>10MB 이하</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 에러 메시지 */}
      {error && (
        <Card className="border-red-200 bg-red-50 p-4 rounded-xl">
          <div className="flex items-center text-red-700">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </Card>
      )}

      {/* 업로드된 파일 미리보기 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-lg">
              업로드된 파일 ({uploadedFiles.length}/{maxFiles})
            </h3>
            <div className="flex items-center text-green-600 text-sm">
              <Sparkles className="w-4 h-4 mr-1" />
              <span>분석 준비 완료</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles.map((file, index) => (
              <Card key={file.name} className="relative p-4 card-friendly border-0">
                <div className="flex items-start space-x-4">
                  {/* 이미지 미리보기 */}
                  <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={file.preview}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* 파일 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <ImageIcon className="mr-1 h-3 w-3" />
                      {file.type}
                    </div>
                  </div>
                  
                  {/* 삭제 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* 업로드 버튼 */}
          <Button 
            onClick={handleUpload} 
            className="w-full carrot-gradient text-white border-0 button-friendly text-base py-3" 
            size="lg"
            disabled={uploadedFiles.length === 0}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            AI 분석 시작하기
          </Button>
        </div>
      )}

      {/* 촬영 가이드 */}
      <Card className="p-6 bg-blue-50 border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <Camera className="w-4 h-4 mr-2" />
          좋은 사진 촬영 팁
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>제품 라벨이 선명하게 보이도록 촬영하세요</span>
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>성분표나 영양성분표도 함께 촬영하면 더 정확해요</span>
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>충분한 조명 아래에서 촬영하세요</span>
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>라벨이 구겨지거나 가려지지 않도록 주의하세요</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
