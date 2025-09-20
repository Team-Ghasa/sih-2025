import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeLib from 'qrcode';
import { generateQRCodeData, generateQRCodeString, QRCodePayload } from '@/utils/qrCodeUtils';

interface QRCodeGeneratorProps {
  productId: number;
  productData: {
    cropType: string;
    variety: string;
    farmerName: string;
    farmerLocation: string;
    harvestDate: string;
    qualityScore: number;
    description: string;
    blockchainHash: string;
  };
  onGenerated?: (qrString: string) => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  productId,
  productData,
  onGenerated
}) => {
  const [qrString, setQrString] = useState<string>('');
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [productId, productData]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrData = generateQRCodeData(productId, productData);
      const qrString = generateQRCodeString(qrData);
      
      // Generate QR code image
      const qrImageUrl = await QRCodeLib.toDataURL(qrString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrString(qrString);
      setQrCodeImage(qrImageUrl);
      setIsGenerated(true);
      onGenerated?.(qrString);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrString);
    toast.success('QR code data copied to clipboard');
  };

  const downloadQRData = () => {
    const blob = new Blob([qrString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agritrace-product-${productId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('QR code data downloaded');
  };

  const downloadQRImage = () => {
    if (!qrCodeImage) return;
    
    const a = document.createElement('a');
    a.href = qrCodeImage;
    a.download = `agritrace-qr-${productId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('QR code image downloaded');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Product QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <div className="w-48 h-48 flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-2 animate-pulse" />
                  <p className="text-xs text-gray-500">Generating QR Code...</p>
                </div>
              ) : qrCodeImage ? (
                <img 
                  src={qrCodeImage} 
                  alt={`QR Code for Product ${productId}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <QrCode className="h-24 w-24 mx-auto text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">QR Code</p>
                  <p className="text-xs text-gray-400">Product ID: {productId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2">
          {isGenerating ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Generating...
            </Badge>
          ) : isGenerated ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Generated
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Ready
            </Badge>
          )}
        </div>

        {/* Product Info Preview */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{productData.cropType} - {productData.variety}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Farmer:</span>
            <span className="font-medium">{productData.farmerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quality:</span>
            <span className="font-medium">{productData.qualityScore}%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyQRData}
            disabled={!isGenerated}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadQRImage}
            disabled={!isGenerated}
          >
            <Download className="h-4 w-4 mr-1" />
            Download QR
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadQRData}
            disabled={!isGenerated}
            className="col-span-2"
          >
            <Download className="h-4 w-4 mr-1" />
            Download Data JSON
          </Button>
        </div>

        {/* QR Code Data Preview */}
        {isGenerated && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">QR Code contains:</p>
            <div className="text-xs space-y-1">
              <div>• Product ID: {productId}</div>
              <div>• Crop: {productData.cropType}</div>
              <div>• Farmer: {productData.farmerName}</div>
              <div>• Quality: {productData.qualityScore}%</div>
              <div>• Blockchain Hash: {productData.blockchainHash.slice(0, 10)}...</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
