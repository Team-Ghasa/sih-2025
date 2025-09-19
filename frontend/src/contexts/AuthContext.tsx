import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  role: 'distributor' | 'retailer';
  name: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'distributor' | 'retailer') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy credentials
const DUMMY_CREDENTIALS = {
  distributor: [
    { username: 'dist1', password: 'dist123', name: 'John Smith', company: 'Fresh Logistics Co.' },
    { username: 'dist2', password: 'dist456', name: 'Sarah Johnson', company: 'Agri Supply Chain' },
    { username: 'dist3', password: 'dist789', name: 'Mike Wilson', company: 'Farm to Market Ltd.' }
  ],
  retailer: [
    { username: 'retail1', password: 'retail123', name: 'Emma Davis', company: 'Green Grocer' },
    { username: 'retail2', password: 'retail456', name: 'David Brown', company: 'Fresh Market' },
    { username: 'retail3', password: 'retail789', name: 'Lisa Garcia', company: 'Organic Store' }
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('agritrace_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role: 'distributor' | 'retailer'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const credentials = DUMMY_CREDENTIALS[role];
    const foundUser = credentials.find(cred => cred.username === username && cred.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: `${role}_${foundUser.username}`,
        username: foundUser.username,
        role,
        name: foundUser.name,
        company: foundUser.company
      };
      
      setUser(userData);
      localStorage.setItem('agritrace_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agritrace_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
