import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Truck, ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'distributor' | 'retailer'>('distributor');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(username, password, role);
    if (success) {
      onSuccess?.();
    } else {
      setError('Invalid credentials. Please check your username and password.');
    }
  };

  const demoCredentials = {
    distributor: [
      { username: 'dist1', password: 'dist123', name: 'John Smith' },
      { username: 'dist2', password: 'dist456', name: 'Sarah Johnson' },
      { username: 'dist3', password: 'dist789', name: 'Mike Wilson' }
    ],
    retailer: [
      { username: 'retail1', password: 'retail123', name: 'Emma Davis' },
      { username: 'retail2', password: 'retail456', name: 'David Brown' },
      { username: 'retail3', password: 'retail789', name: 'Lisa Garcia' }
    ]
  };

  const fillDemoCredentials = (cred: { username: string; password: string }) => {
    setUsername(cred.username);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your {role} account to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(value) => setRole(value as 'distributor' | 'retailer')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="distributor" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Distributor
              </TabsTrigger>
              <TabsTrigger value="retailer" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Retailer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="distributor" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dist-username">Username</Label>
                  <Input
                    id="dist-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dist-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="dist-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In as Distributor'
                  )}
                </Button>
              </form>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">Demo Credentials:</p>
                <div className="space-y-1">
                  {demoCredentials.distributor.map((cred, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs justify-start"
                      onClick={() => fillDemoCredentials(cred)}
                      disabled={isLoading}
                    >
                      {cred.name} ({cred.username})
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="retailer" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retail-username">Username</Label>
                  <Input
                    id="retail-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retail-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="retail-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In as Retailer'
                  )}
                </Button>
              </form>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">Demo Credentials:</p>
                <div className="space-y-1">
                  {demoCredentials.retailer.map((cred, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs justify-start"
                      onClick={() => fillDemoCredentials(cred)}
                      disabled={isLoading}
                    >
                      {cred.name} ({cred.username})
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
