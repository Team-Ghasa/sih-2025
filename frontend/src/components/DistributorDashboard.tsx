import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Search,
  User,
  Phone,
  Leaf,
  QrCode,
  Eye,
  Calendar,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from 'sonner';
import { QRCodeScanner } from './QRCodeScanner';

export const DistributorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    isConnected, 
    account, 
    connectWallet, 
    getProduct, 
    getProductsByFarmer, 
    getUser,
    isLoading: web3Loading,
    error: web3Error 
  } = useWeb3();

  // Farmer details state
  const [farmerAddress, setFarmerAddress] = useState<string>('');
  const [farmerDetails, setFarmerDetails] = useState<any>(null);
  const [farmerProducts, setFarmerProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productStatusHistory, setProductStatusHistory] = useState<any[]>([]);
  const [isLoadingFarmer, setIsLoadingFarmer] = useState(false);
  const [activeTab, setActiveTab] = useState('shipments');

  const shipments = [
    {
      id: 'SH001',
      from: 'Green Valley Farm',
      to: 'Fresh Market Store',
      product: 'Organic Tomatoes',
      quantity: '500 kg',
      status: 'In Transit',
      progress: 75,
      eta: '2 hours',
      location: 'Highway 101, Mile 45'
    },
    {
      id: 'SH002',
      from: 'Sunrise Agriculture',
      to: 'Green Grocer',
      product: 'Fresh Lettuce',
      quantity: '200 kg',
      status: 'Delivered',
      progress: 100,
      eta: 'Completed',
      location: 'Delivered'
    },
    {
      id: 'SH003',
      from: 'Mountain View Farm',
      to: 'Organic Store',
      product: 'Carrots',
      quantity: '300 kg',
      status: 'Pending',
      progress: 0,
      eta: 'Tomorrow 9 AM',
      location: 'Warehouse'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'In Transit': return 'bg-blue-500';
      case 'Pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      case 'In Transit': return <Truck className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Farmer lookup functions
  const lookupFarmer = async () => {
    if (!farmerAddress.trim()) {
      toast.error('Please enter a farmer address');
      return;
    }

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoadingFarmer(true);
    try {
      console.log('Looking up farmer with address:', farmerAddress);
      
      // Get farmer details
      const farmer = await getUser(farmerAddress);
      console.log('Farmer details received:', farmer);
      setFarmerDetails(farmer);

      // Get farmer's products
      const productIds = await getProductsByFarmer(farmerAddress);
      console.log('Product IDs for farmer:', productIds);
      
      const products = await Promise.all(
        productIds.map(async (id) => {
          try {
            const product = await getProduct(id);
            console.log(`Product ${id} details:`, product);
            return product;
          } catch (error) {
            console.error(`Failed to get product ${id}:`, error);
            return null;
          }
        })
      );
      
      const validProducts = products.filter(Boolean);
      console.log('Valid products:', validProducts);
      setFarmerProducts(validProducts);
      
      toast.success(`Farmer details loaded successfully! Found ${validProducts.length} products.`);
    } catch (error: any) {
      console.error('Error looking up farmer:', error);
      toast.error(error.message || 'Failed to load farmer details');
      setFarmerDetails(null);
      setFarmerProducts([]);
    } finally {
      setIsLoadingFarmer(false);
    }
  };

  const handleProductSelect = async (productId: number) => {
    try {
      const product = await getProduct(productId);
      setSelectedProduct(product);
      
      // Get status history for the product
      setProductStatusHistory([]);
      
      toast.success('Product details loaded');
    } catch (error: any) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');
    }
  };

  const handleQRScan = (productData: any) => {
    if (productData && productData.productId) {
      handleProductSelect(productData.productId);
      setActiveTab('farmer-details');
      toast.success('Product loaded from QR code scan');
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const getUserRole = (role: number) => {
    switch (role) {
      case 0: return 'Farmer';
      case 1: return 'Distributor';
      case 2: return 'Retailer';
      case 3: return 'Consumer';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Distributor Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name} from {user?.company}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Distributor
            </Badge>
            {!isConnected && (
              <Button onClick={connectWallet} variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            {isConnected && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {formatAddress(account || '')}
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shipments" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipments
            </TabsTrigger>
            <TabsTrigger value="farmer-details" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Farmer Details
            </TabsTrigger>
            <TabsTrigger value="qr-scanner" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Scanner
            </TabsTrigger>
          </TabsList>

          {/* Shipments Tab */}
          <TabsContent value="shipments" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Partner Stores</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">
                    +3 new this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12.5%</div>
                  <p className="text-xs text-muted-foreground">
                    Compared to last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Shipments Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>
                  Track and manage your current shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipments.map((shipment) => (
                    <div key={shipment.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(shipment.status)} text-white`}>
                            {getStatusIcon(shipment.status)}
                            <span className="ml-1">{shipment.status}</span>
                          </Badge>
                          <span className="font-medium">#{shipment.id}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="font-medium">{shipment.from}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">To</p>
                          <p className="font-medium">{shipment.to}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Product</p>
                          <p className="font-medium">{shipment.product}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-medium">{shipment.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">ETA</p>
                          <p className="font-medium">{shipment.eta}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {shipment.location}
                          </p>
                        </div>
                      </div>
                      
                      {shipment.status === 'In Transit' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{shipment.progress}%</span>
                          </div>
                          <Progress value={shipment.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmer Details Tab */}
          <TabsContent value="farmer-details" className="space-y-6">
            {/* Farmer Lookup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Lookup Farmer Details
                </CardTitle>
                <CardDescription>
                  Enter a farmer's wallet address to view their details and products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter farmer wallet address (0x...)"
                    value={farmerAddress}
                    onChange={(e) => setFarmerAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={lookupFarmer} 
                    disabled={isLoadingFarmer || !isConnected}
                    className="flex items-center gap-2"
                  >
                    {isLoadingFarmer ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Lookup
                      </>
                    )}
                  </Button>
                </div>
                
                {!isConnected && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Wallet not connected</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please connect your wallet to lookup farmer details from the blockchain.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button onClick={connectWallet} size="sm" variant="outline">
                        Connect Wallet
                      </Button>
                    </div>
                  </div>
                )}

                {web3Error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Connection Error</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      {web3Error}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button onClick={() => window.location.reload()} size="sm" variant="secondary">
                        Reload Page
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Farmer Details Display */}
            {farmerDetails && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Farmer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Farmer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{farmerDetails.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <Badge variant="outline">
                          {getUserRole(farmerDetails.role)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {farmerDetails.location || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {farmerDetails.contact || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wallet Address</p>
                      <p className="font-mono text-sm bg-muted p-2 rounded">
                        {farmerDetails.address || farmerAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Registered</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(farmerDetails.registeredAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Farmer Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Products ({farmerProducts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {farmerProducts.length > 0 ? (
                        farmerProducts.map((product, index) => (
                          <div 
                            key={product.id || index} 
                            className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleProductSelect(Number(product.id))}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  ID: {product.id}
                                </Badge>
                                <span className="font-medium">{product.cropType}</span>
                                <span className="text-muted-foreground">({product.variety})</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Quantity: {product.quantity} {product.unit} • Quality: {product.qualityScore}%
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Leaf className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No products found for this farmer</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Selected Product Details */}
            {selectedProduct && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Details - {selectedProduct.cropType} ({selectedProduct.variety})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Product Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Product ID:</span>
                          <span className="font-medium">{selectedProduct.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Crop Type:</span>
                          <span className="font-medium">{selectedProduct.cropType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Variety:</span>
                          <span className="font-medium">{selectedProduct.variety}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="font-medium">{selectedProduct.quantity} {selectedProduct.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quality Score:</span>
                          <span className="font-medium flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {selectedProduct.qualityScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Harvest & Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Harvest Date:</span>
                          <span className="font-medium">{formatDate(selectedProduct.harvestDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="outline">
                            {selectedProduct.status === 0 ? 'Registered' : 
                             selectedProduct.status === 1 ? 'In Transit' : 
                             selectedProduct.status === 2 ? 'Delivered' : 'Unknown'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Verified:</span>
                          <Badge variant={selectedProduct.isVerified ? "default" : "secondary"}>
                            {selectedProduct.isVerified ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span className="font-medium">{formatDate(selectedProduct.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* QR Scanner Tab */}
          <TabsContent value="qr-scanner">
            <QRCodeScanner onProductScanned={handleQRScan} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
