import React from 'react';
import { QRCodeGenerator } from './QRCodeGenerator';

export const QRCodeDemo: React.FC = () => {
  const demoProductData = {
    cropType: "Rice",
    variety: "Basmati",
    farmerName: "John Farmer",
    farmerLocation: "Chennai, India",
    harvestDate: "2024-01-15",
    qualityScore: 95,
    description: "Premium quality basmati rice from organic farming",
    blockchainHash: "0x1234567890abcdef"
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">QR Code Generation Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Product Information</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Product ID:</strong> 1</div>
            <div><strong>Crop:</strong> {demoProductData.cropType}</div>
            <div><strong>Variety:</strong> {demoProductData.variety}</div>
            <div><strong>Farmer:</strong> {demoProductData.farmerName}</div>
            <div><strong>Location:</strong> {demoProductData.farmerLocation}</div>
            <div><strong>Harvest Date:</strong> {demoProductData.harvestDate}</div>
            <div><strong>Quality Score:</strong> {demoProductData.qualityScore}%</div>
            <div><strong>Description:</strong> {demoProductData.description}</div>
            <div><strong>Blockchain Hash:</strong> {demoProductData.blockchainHash}</div>
          </div>
        </div>
        
        <div>
          <QRCodeGenerator
            productId={1}
            productData={demoProductData}
            onGenerated={(qrString) => {
              console.log('Generated QR Code Data:', qrString);
            }}
          />
        </div>
      </div>
    </div>
  );
};
