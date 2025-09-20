// QR Code Utilities for Agricultural Supply Chain
import { ethers } from 'ethers';

export interface QRCodeData {
  productId: number;
  cropType: string;
  variety: string;
  farmerName: string;
  farmerLocation: string;
  harvestDate: string;
  qualityScore: number;
  description: string;
  blockchainHash: string;
  verificationUrl: string;
  timestamp: number;
}

export interface QRCodePayload {
  type: 'AGRITRACE_PRODUCT';
  version: '1.0';
  data: QRCodeData;
  signature: string; // For verification
}

/**
 * Generate QR code data with embedded product information
 */
export const generateQRCodeData = (
  productId: number,
  productData: {
    cropType: string;
    variety: string;
    farmerName: string;
    farmerLocation: string;
    harvestDate: string;
    qualityScore: number;
    description: string;
    blockchainHash: string;
  }
): QRCodePayload => {
  const qrData: QRCodeData = {
    productId,
    cropType: productData.cropType,
    variety: productData.variety,
    farmerName: productData.farmerName,
    farmerLocation: productData.farmerLocation,
    harvestDate: productData.harvestDate,
    qualityScore: productData.qualityScore,
    description: productData.description,
    blockchainHash: productData.blockchainHash,
    verificationUrl: `https://agritrace.app/verify/${productId}`,
    timestamp: Date.now()
  };

  const payload: QRCodePayload = {
    type: 'AGRITRACE_PRODUCT',
    version: '1.0',
    data: qrData,
    signature: generateSignature(qrData)
  };

  return payload;
};

/**
 * Generate a simple signature for data verification
 */
const generateSignature = (data: QRCodeData): string => {
  // Create a simple hash of the data for verification
  const dataString = JSON.stringify(data);
  const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
  return hash.slice(2, 10); // Take first 8 characters for simplicity
};

/**
 * Verify QR code data integrity
 */
export const verifyQRCodeData = (payload: QRCodePayload): boolean => {
  try {
    const expectedSignature = generateSignature(payload.data);
    return payload.signature === expectedSignature;
  } catch (error) {
    console.error('QR code verification failed:', error);
    return false;
  }
};

/**
 * Parse QR code data from scanned string
 */
export const parseQRCodeData = (qrString: string): QRCodePayload | null => {
  try {
    const payload = JSON.parse(qrString) as QRCodePayload;
    
    // Validate structure
    if (payload.type !== 'AGRITRACE_PRODUCT' || payload.version !== '1.0') {
      throw new Error('Invalid QR code format');
    }

    // Verify signature
    if (!verifyQRCodeData(payload)) {
      throw new Error('QR code data verification failed');
    }

    return payload;
  } catch (error) {
    console.error('Failed to parse QR code:', error);
    return null;
  }
};

/**
 * Generate QR code string for display
 */
export const generateQRCodeString = (payload: QRCodePayload): string => {
  return JSON.stringify(payload);
};

/**
 * Format product data for display
 */
export const formatProductDataForDisplay = (data: QRCodeData) => {
  return {
    id: data.productId,
    crop: `${data.cropType} - ${data.variety}`,
    farmer: data.farmerName,
    location: data.farmerLocation,
    harvestDate: new Date(data.harvestDate).toLocaleDateString(),
    quality: `${data.qualityScore}%`,
    description: data.description,
    blockchainHash: data.blockchainHash,
    verified: true,
    scanTime: new Date(data.timestamp).toLocaleString()
  };
};

/**
 * Check if QR code is expired (optional feature)
 */
export const isQRCodeExpired = (payload: QRCodePayload, maxAgeHours: number = 24 * 365): boolean => {
  const ageHours = (Date.now() - payload.data.timestamp) / (1000 * 60 * 60);
  return ageHours > maxAgeHours;
};
