import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Star,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const RetailerDashboard: React.FC = () => {
  const { user } = useAuth();

  const inventory = [
    {
      id: 'INV001',
      product: 'Organic Tomatoes',
      supplier: 'Green Valley Farm',
      quantity: 45,
      unit: 'kg',
      price: 4.50,
      status: 'In Stock',
      expiryDate: '2024-01-15',
      quality: 'Excellent'
    },
    {
      id: 'INV002',
      product: 'Fresh Lettuce',
      supplier: 'Sunrise Agriculture',
      quantity: 23,
      unit: 'kg',
      price: 3.20,
      status: 'Low Stock',
      expiryDate: '2024-01-12',
      quality: 'Good'
    },
    {
      id: 'INV003',
      product: 'Carrots',
      supplier: 'Mountain View Farm',
      quantity: 67,
      unit: 'kg',
      price: 2.80,
      status: 'In Stock',
      expiryDate: '2024-01-18',
      quality: 'Excellent'
    }
  ];

  const orders = [
    {
      id: 'ORD001',
      customer: 'John Doe',
      items: 3,
      total: 45.60,
      status: 'Completed',
      date: '2024-01-10',
      payment: 'Card'
    },
    {
      id: 'ORD002',
      customer: 'Jane Smith',
      items: 2,
      total: 28.40,
      status: 'Processing',
      date: '2024-01-10',
      payment: 'Cash'
    },
    {
      id: 'ORD003',
      customer: 'Mike Johnson',
      items: 5,
      total: 67.80,
      status: 'Pending',
      date: '2024-01-10',
      payment: 'Card'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-500';
      case 'Low Stock': return 'bg-yellow-500';
      case 'Out of Stock': return 'bg-red-500';
      case 'Completed': return 'bg-green-500';
      case 'Processing': return 'bg-blue-500';
      case 'Pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Stock': return <CheckCircle className="h-4 w-4" />;
      case 'Low Stock': return <AlertTriangle className="h-4 w-4" />;
      case 'Out of Stock': return <AlertTriangle className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Processing': return <Package className="h-4 w-4" />;
      case 'Pending': return <Calendar className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Excellent': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'Good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Fair': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Retailer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name} from {user?.company}
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Retailer
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +12 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                12 low stock items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Track your current stock levels and product quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventory.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(item.status)} text-white`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </Badge>
                      <span className="font-medium">{item.product}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Quality:</span>
                      <div className="flex items-center gap-1">
                        {getQualityIcon(item.quality)}
                        <span className="text-sm font-medium">{item.quality}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="font-medium">{item.supplier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">{item.quantity} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price per {item.unit}</p>
                      <p className="font-medium">${item.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expiry Date</p>
                      <p className="font-medium">{item.expiryDate}</p>
                    </div>
                  </div>
                  
                  {item.status === 'Low Stock' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          Low stock alert! Consider reordering soon.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Track your recent customer orders and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                      <span className="font-medium">#{order.id}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">{order.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-medium">{order.items} items</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">${order.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <p className="font-medium">{order.payment}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Order Date: {order.date}</span>
                    {order.status === 'Processing' && (
                      <div className="flex items-center gap-2">
                        <span>Processing...</span>
                        <Progress value={60} className="w-20 h-2" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
