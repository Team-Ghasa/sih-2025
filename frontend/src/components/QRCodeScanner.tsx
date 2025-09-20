import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  QrCode, 
  Scan, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  User, 
  Leaf,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  parseQRCodeData, 
  formatProductDataForDisplay, 
  isQRCodeExpired,
  QRCodePayload 
} from '@/utils/qrCodeUtils';

interface QRCodeScannerProps {
  onProductScanned?: (productData: any) => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onProductScanned }) => {
  const [qrInput, setQrInput] = useState('');
  const [scannedData, setScannedData] = useState<any>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  const handleScan = () => {
    if (!qrInput.trim()) {
      toast.error('Please enter QR code data');
      return;
    }

    try {
      const payload = parseQRCodeData(qrInput);
      
      if (!payload) {
        setIsValid(false);
        setError('Invalid QR code format or corrupted data');
        setScannedData(null);
        return;
      }

      // Check if QR code is expired
      const expired = isQRCodeExpired(payload);
      if (expired) {
        setIsValid(false);
        setError('QR code has expired');
        setScannedData(null);
        return;
      }

      // Format data for display
      const formattedData = formatProductDataForDisplay(payload.data);
      setScannedData(formattedData);
      setIsValid(true);
      setError('');
      
      toast.success('Product verified successfully!');
      onProductScanned?.(formattedData);
      
    } catch (error: any) {
      setIsValid(false);
      setError(error.message || 'Failed to scan QR code');
      setScannedData(null);
      toast.error('Failed to scan QR code');
    }
  };

  const clearScan = () => {
    setQrInput('');
    setScannedData(null);
    setIsValid(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Scanner Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Scan Product QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste QR code data here..."
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleScan} disabled={!qrInput.trim()}>
              <QrCode className="h-4 w-4 mr-1" />
              Scan
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scannedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Verification Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verification Status</span>
              <Badge variant={isValid ? "default" : "destructive"} className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {isValid ? 'Verified' : 'Failed'}
              </Badge>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-medium">{scannedData.crop}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Farmer</p>
                    <p className="font-medium">{scannedData.farmer}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{scannedData.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Harvest Date</p>
                    <p className="font-medium">{scannedData.harvestDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Quality Score</p>
                    <p className="font-medium">{scannedData.quality}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Scanned</p>
                    <p className="font-medium">{scannedData.scanTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-sm">{scannedData.description}</p>
            </div>

            {/* Blockchain Info */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Blockchain Verification</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono">Hash: {scannedData.blockchainHash}</span>
                <Badge variant="secondary" className="text-xs">
                  Immutable Record
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={clearScan} className="flex-1">
                Scan Another
              </Button>
              <Button 
                variant="default" 
                onClick={() => window.open(`https://agritrace.app/verify/${scannedData.id}`, '_blank')}
                className="flex-1"
              >
                View Full Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
