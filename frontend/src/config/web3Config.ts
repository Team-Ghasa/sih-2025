// Web3 Configuration for Agricultural Supply Chain

export const WEB3_CONFIG = {
  // Local Hardhat Network Configuration
  NETWORK: {
    chainId: 31337,
    chainName: 'Hardhat Local',
    rpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrls: null,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  
  // Contract Addresses
  CONTRACTS: {
    ProductRegistration: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    SupplyChainTracker: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  
  // User Roles
  USER_ROLES: {
    FARMER: 0,
    DISTRIBUTOR: 1,
    RETAILER: 2,
    CONSUMER: 3,
    ADMIN: 4,
  },
  
  // Helper functions
  getRoleText: (role: number): string => {
    const roles = ['Farmer', 'Distributor', 'Retailer', 'Consumer', 'Admin'];
    return roles[role] || 'Unknown';
  },
  
  getStatusText: (status: number): string => {
    const statuses = [
      'Harvested',
      'Packaged', 
      'In Transit to Distributor',
      'At Distributor',
      'In Transit to Retailer',
      'At Retailer',
      'Delivered to Consumer',
      'Expired'
    ];
    return statuses[status] || 'Unknown';
  },
};

// Contract ABIs - using function signatures only
export const CONTRACT_ABIS = {
  ProductRegistration: [
    "function registerUser(string memory _name, uint8 _role, string memory _location, string memory _contact) external",
    "function registerProduct(string memory _cropType, string memory _variety, uint256 _quantity, string memory _unit, uint256 _harvestDate, uint256 _qualityScore, string memory _description, string memory _imageHash) external returns (uint256)",
    "function getProduct(uint256 _productId) external view returns (tuple(uint256 id, string cropType, string variety, uint256 quantity, string unit, string farmerName, string farmerLocation, string farmerContact, uint256 harvestDate, uint256 qualityScore, string description, string imageHash, uint8 status, address currentOwner, bool isVerified, uint256 createdAt, uint256 updatedAt))",
    "function getUser(address _userAddress) external view returns (tuple(string name, uint8 role, string location, string contact, bool isRegistered, uint256 registeredAt))",
    "event ProductRegistered(uint256 indexed productId, string cropType, string variety, uint256 quantity, address indexed farmer, uint256 qualityScore)",
    "event UserRegistered(address indexed _userAddress, uint8 _role, string _name, string _location, string _contact)"
  ],
  SupplyChainTracker: [
    "function updateProductStatus(uint256 _productId, uint8 _status, string memory _location, string memory _notes, uint256 _temperature, uint256 _humidity, string memory _transportMethod, string memory _batchNumber) external",
    "function getCurrentStatus(uint256 _productId) external view returns (tuple(uint8 status, string location, string notes, uint256 temperature, uint256 humidity, string transportMethod, string batchNumber, uint256 timestamp))",
    "function getStatusHistory(uint256 _productId) external view returns (tuple(uint8 status, string location, string notes, uint256 temperature, uint256 humidity, string transportMethod, string batchNumber, uint256 timestamp)[] memory)"
  ]
};

export const CONTRACT_ADDRESSES = WEB3_CONFIG.CONTRACTS;
