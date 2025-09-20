import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WEB3_CONFIG, CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../config/web3Config';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  
  // Contract instances
  productRegistrationContract: ethers.Contract | null;
  supplyChainTrackerContract: ethers.Contract | null;
  
  // Connection methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToHardhatNetwork: () => Promise<void>;
  
  // Contract methods
  registerUser: (name: string, role: number, location: string, contact: string) => Promise<void>;
  registerProduct: (cropType: string, variety: string, quantity: string, unit: string, harvestDate: number, qualityScore: number, description: string, imageHash: string) => Promise<number>;
  updateProductStatus: (productId: number, status: number, location: string, notes: string, temperature: number, humidity: number, transportMethod: string, batchNumber: string) => Promise<void>;
  getProduct: (productId: number) => Promise<any>;
  getProductsByFarmer: (farmerAddress: string) => Promise<number[]>;
  getStatusHistory: (productId: number) => Promise<any[]>;
  getUser: (userAddress: string) => Promise<any>;
  getAllFarmers: () => Promise<any[]>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [productRegistrationContract, setProductRegistrationContract] = useState<ethers.Contract | null>(null);
  const [supplyChainTrackerContract, setSupplyChainTrackerContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productCounter, setProductCounter] = useState(1); // Local counter for product IDs

  // Initialize contracts when provider and signer are available
  useEffect(() => {
    if (provider && signer) {
      const productContract = new ethers.Contract(
        CONTRACT_ADDRESSES.ProductRegistration,
        CONTRACT_ABIS.ProductRegistration,
        signer
      );
      
      const supplyChainContract = new ethers.Contract(
        CONTRACT_ADDRESSES.SupplyChainTracker,
        CONTRACT_ABIS.SupplyChainTracker,
        signer
      );
      
      setProductRegistrationContract(productContract);
      setSupplyChainTrackerContract(supplyChainContract);
    }
  }, [provider, signer]);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const browserSigner = await browserProvider.getSigner();
      
      // Get network info
      const network = await browserProvider.getNetwork();
      
      setProvider(browserProvider);
      setSigner(browserSigner);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Check if we're on the correct network
      if (Number(network.chainId) !== WEB3_CONFIG.NETWORK.chainId) {
        await switchToHardhatNetwork();
      }

    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setProductRegistrationContract(null);
    setSupplyChainTrackerContract(null);
    setError(null);
  };

  const switchToHardhatNetwork = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${WEB3_CONFIG.NETWORK.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [WEB3_CONFIG.NETWORK],
          });
        } catch (addError) {
          setError('Failed to add Hardhat network to MetaMask');
          console.error('Add network error:', addError);
        }
      } else {
        setError('Failed to switch to Hardhat network');
        console.error('Switch network error:', switchError);
      }
    }
  };

  // Contract methods
  const registerUser = async (name: string, role: number, location: string, contact: string) => {
    if (!productRegistrationContract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    try {
      const tx = await productRegistrationContract.registerUser(name, role, location, contact);
      await tx.wait();
    } catch (error: any) {
      setError(error.message || 'Failed to register user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerProduct = async (
    cropType: string,
    variety: string,
    quantity: string,
    unit: string,
    harvestDate: number,
    qualityScore: number,
    description: string,
    imageHash: string
  ): Promise<number> => {
    if (!productRegistrationContract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    try {
      console.log('Registering product with data:', {
        cropType, variety, quantity, unit, harvestDate, qualityScore, description, imageHash
      });
      
      // Use local counter for product ID
      const productId = productCounter;
      setProductCounter(prev => prev + 1);
      
      const tx = await productRegistrationContract.registerProduct(
        cropType,
        variety,
        ethers.parseEther(quantity),
        unit,
        harvestDate,
        qualityScore,
        description,
        imageHash
      );
      
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
      console.log('Product registered with ID:', productId);
      
      return productId;
    } catch (error: any) {
      console.error('Register product error:', error);
      setError(error.message || 'Failed to register product');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductStatus = async (
    productId: number,
    status: number,
    location: string,
    notes: string,
    temperature: number,
    humidity: number,
    transportMethod: string,
    batchNumber: string
  ) => {
    if (!supplyChainTrackerContract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    try {
      const tx = await supplyChainTrackerContract.updateProductStatus(
        productId,
        status,
        location,
        notes,
        temperature,
        humidity,
        transportMethod,
        batchNumber
      );
      await tx.wait();
    } catch (error: any) {
      setError(error.message || 'Failed to update product status');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getProduct = async (productId: number) => {
    if (!productRegistrationContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const productData = await productRegistrationContract.getProduct(productId);
      console.log('Raw product data from blockchain:', productData);
      
      // Convert tuple to object format
      return {
        id: Number(productData[0]),
        cropType: productData[1],
        variety: productData[2],
        quantity: productData[3].toString(),
        unit: productData[4],
        farmerName: productData[5],
        farmerLocation: productData[6],
        farmerContact: productData[7],
        harvestDate: Number(productData[8]),
        qualityScore: Number(productData[9]),
        description: productData[10],
        imageHash: productData[11],
        status: Number(productData[12]),
        currentOwner: productData[13],
        isVerified: productData[14],
        createdAt: Number(productData[15]),
        updatedAt: Number(productData[16])
      };
    } catch (error: any) {
      console.error('Error getting product:', error);
      setError(error.message || 'Failed to get product');
      throw error;
    }
  };

  const getProductsByFarmer = async (farmerAddress: string): Promise<number[]> => {
    if (!productRegistrationContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const productIds = await productRegistrationContract.getProductsByFarmer(farmerAddress);
      return productIds.map((id: any) => Number(id));
    } catch (error: any) {
      setError(error.message || 'Failed to get farmer products');
      throw error;
    }
  };

  const getStatusHistory = async (productId: number) => {
    if (!supplyChainTrackerContract) {
      throw new Error('Contract not initialized');
    }

    try {
      return await supplyChainTrackerContract.getStatusHistory(productId);
    } catch (error: any) {
      setError(error.message || 'Failed to get status history');
      throw error;
    }
  };

  const getUser = async (userAddress: string) => {
    if (!productRegistrationContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const userData = await productRegistrationContract.getUser(userAddress);
      console.log('Raw user data from blockchain:', userData);
      
      // Convert tuple to object format
      return {
        name: userData[0],
        role: Number(userData[1]),
        location: userData[2],
        contact: userData[3],
        isRegistered: userData[4],
        registeredAt: Number(userData[5]),
        address: userAddress
      };
    } catch (error: any) {
      console.error('Error getting user:', error);
      setError(error.message || 'Failed to get user');
      throw error;
    }
  };

  const getAllFarmers = async () => {
    if (!productRegistrationContract) {
      throw new Error('Contract not initialized');
    }

    try {
      // This is a simplified implementation - in a real scenario, you'd need to track farmer addresses
      // For now, we'll return an empty array and let the user manually enter farmer addresses
      console.log('getAllFarmers called - returning empty array (manual lookup required)');
      return [];
    } catch (error: any) {
      setError(error.message || 'Failed to get all farmers');
      throw error;
    }
  };

  const value: Web3ContextType = {
    isConnected,
    account,
    chainId,
    provider,
    signer,
    productRegistrationContract,
    supplyChainTrackerContract,
    connectWallet,
    disconnectWallet,
    switchToHardhatNetwork,
    registerUser,
    registerProduct,
    updateProductStatus,
    getProduct,
    getProductsByFarmer,
    getStatusHistory,
    getUser,
    getAllFarmers,
    isLoading,
    error,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
