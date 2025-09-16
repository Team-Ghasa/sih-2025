import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const DistributorDashboard: React.FC = () => {
  const { user } = useAuth();

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
          <Badge variant="outline" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Distributor
          </Badge>
        </div>

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
      </div>
    </div>
  );
};
