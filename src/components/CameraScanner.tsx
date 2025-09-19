'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CameraScannerProps {
  onDetect: (barcode: string) => void;
  onError: (error: Error) => void;
}

export default function CameraScanner({ onDetect, onError }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // 후면 카메라 우선
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setHasPermission(false);
      onError(new Error('카메라 접근 권한이 필요합니다'));
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  // 바코드 스캔 시뮬레이션 (실제로는 바코드 라이브러리 필요)
  const simulateBarcodeDetection = () => {
    // 실제 구현에서는 ZXing-js나 QuaggaJS 같은 라이브러리 사용
    const mockBarcodes = [
      '8801043036917', // 농심 신라면
      '8801043037136', // 농심 짜파게티  
      '8809123456789', // 임의 바코드
    ];
    
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    onDetect(randomBarcode);
  };

  // 스캔 시작/중지 토글
  const toggleScanning = () => {
    if (isScanning) {
      setIsScanning(false);
    } else {
      setIsScanning(true);
      // 3초 후 모의 바코드 감지
      setTimeout(() => {
        if (isScanning) {
          simulateBarcodeDetection();
          setIsScanning(false);
        }
      }, 3000);
    }
  };

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 권한이 없는 경우
  if (hasPermission === false) {
    return (
      <Card className="p-8 text-center bg-red-50 border-red-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">카메라 접근 권한 필요</h3>
        <p className="text-red-700 mb-4">
          바코드 스캔을 위해 카메라 권한이 필요합니다.
        </p>
        <Button onClick={startCamera} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
          권한 요청하기
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 카메라 화면 */}
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* 스캔 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* 스캔 프레임 */}
            <div className={`w-64 h-32 border-4 rounded-lg transition-all duration-300 ${
              isScanning ? 'border-green-400 shadow-lg shadow-green-400/30' : 'border-white/50'
            }`}>
              {/* 스캔 라인 애니메이션 */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" />
              )}
            </div>
            
            {/* 안내 텍스트 */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {isScanning ? '바코드 스캔 중...' : '바코드를 프레임 안에 맞춰주세요'}
              </p>
            </div>
          </div>
        </div>

        {/* 스캔 중 로딩 인디케이터 */}
        {isScanning && (
          <div className="absolute top-4 left-4 flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            <Zap className="w-4 h-4 mr-1 animate-pulse" />
            스캔 중...
          </div>
        )}
      </div>

      {/* 제어 버튼들 */}
      <div className="flex gap-3 justify-center">
        {!stream ? (
          <Button onClick={startCamera} className="carrot-gradient text-white border-0">
            <Camera className="w-4 h-4 mr-2" />
            카메라 시작
          </Button>
        ) : (
          <>
            <Button
              onClick={toggleScanning}
              disabled={isScanning}
              className={isScanning ? "bg-green-500 text-white" : "carrot-gradient text-white border-0"}
            >
              {isScanning ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  스캔 중...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  스캔 시작
                </>
              )}
            </Button>
            
            <Button onClick={stopCamera} variant="outline">
              카메라 중지
            </Button>
          </>
        )}
      </div>

      {/* 도움말 */}
      <div className="p-4 bg-blue-50 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <Camera className="w-4 h-4 mr-2" />
          스캔 가이드
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 바코드가 프레임 안에 완전히 들어가도록 하세요</li>
          <li>• 충분한 조명이 있는 곳에서 스캔하세요</li>
          <li>• 카메라와 바코드 사이의 거리를 조절해보세요</li>
          <li>• 바코드가 구겨지거나 손상되지 않았는지 확인하세요</li>
        </ul>
      </div>
    </div>
  );
}
