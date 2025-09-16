import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'or';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation files
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.farmer': 'Farmer',
    'nav.distributor': 'Distributor',
    'nav.retailer': 'Retailer',
    'nav.consumer': 'Consumer',
    'nav.logout': 'Logout',
    'nav.distributor_login': 'Distributor Login',
    'nav.retailer_login': 'Retailer Login',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.submit': 'Submit',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Farmer Dashboard
    'farmer.title': 'Farmer Dashboard',
    'farmer.subtitle': 'Register your produce and get blockchain verification',
    'farmer.gi_tagged': 'GI Tagged Product - Premium Quality',
    'farmer.crop_type': 'Crop Type',
    'farmer.variety': 'Variety',
    'farmer.quantity': 'Quantity',
    'farmer.unit': 'Unit',
    'farmer.location': 'Farm Location',
    'farmer.get_location': 'Get Location',
    'farmer.getting_location': 'Getting...',
    'farmer.harvest_date': 'Harvest Date',
    'farmer.description': 'Description',
    'farmer.upload_images': 'Upload Images',
    'farmer.quality_check': 'Run Quality Check',
    'farmer.register_produce': 'Register Produce',
    'farmer.voice_assistant': 'Voice Assistant',
    
    // Distributor Dashboard
    'distributor.title': 'Distributor Dashboard',
    'distributor.subtitle': 'Track and manage your shipments',
    'distributor.active_shipments': 'Active Shipments',
    'distributor.total_packages': 'Total Packages',
    'distributor.partner_stores': 'Partner Stores',
    'distributor.revenue_growth': 'Revenue Growth',
    'distributor.recent_shipments': 'Recent Shipments',
    'distributor.track_manage': 'Track and manage your current shipments',
    
    // Retailer Dashboard
    'retailer.title': 'Retailer Dashboard',
    'retailer.subtitle': 'Manage your inventory and orders',
    'retailer.total_sales': 'Total Sales',
    'retailer.orders_today': 'Orders Today',
    'retailer.active_customers': 'Active Customers',
    'retailer.inventory_items': 'Inventory Items',
    'retailer.inventory_management': 'Inventory Management',
    'retailer.track_stock': 'Track your current stock levels and product quality',
    'retailer.recent_orders': 'Recent Orders',
    'retailer.track_orders': 'Track your recent customer orders and payments',
    
    // Login Form
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to your {role} account to access your dashboard',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.sign_in_distributor': 'Sign In as Distributor',
    'login.sign_in_retailer': 'Sign In as Retailer',
    'login.demo_credentials': 'Demo Credentials',
    'login.invalid_credentials': 'Invalid credentials. Please check your username and password.',
    'login.fill_fields': 'Please fill in all fields',
    
    // Hero Section
    'hero.tagline': 'Revolutionizing Agriculture',
    'hero.title': 'Fully Verified',
    'hero.subtitle': 'Complete supply chain transparency through blockchain technology, IoT monitoring, and AI-powered quality verification. Building trust from seed to plate.',
    'hero.scan_qr': 'Scan QR Code',
    'hero.register_produce': 'Register Produce',
    'hero.uptime': '99.9% Uptime',
    'hero.blockchain_secured': 'Blockchain Secured',
    'hero.mobile_friendly': 'Mobile Friendly',
    'hero.supply_chain': 'Live Supply Chain Tracker',
    'hero.blockchain_verified': 'Blockchain Verified',
    'hero.harvest': 'Harvest',
    'hero.processing': 'Processing',
    'hero.transport': 'Transport',
    'hero.retail': 'Retail',
    'hero.consumer': 'Consumer',
    'hero.live': 'Live',
    
    // Units
    'unit.kg': 'kg',
    'unit.quintal': 'quintal',
    'unit.ton': 'ton',
    'unit.piece': 'piece',
    'unit.bag': 'bag',
    'unit.liter': 'liter',
    
    // Status
    'status.delivered': 'Delivered',
    'status.in_transit': 'In Transit',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.processing': 'Processing',
    'status.in_stock': 'In Stock',
    'status.low_stock': 'Low Stock',
    'status.out_of_stock': 'Out of Stock',
    
    // Quality
    'quality.excellent': 'Excellent',
    'quality.good': 'Good',
    'quality.fair': 'Fair',
    'quality.poor': 'Poor',
    
    // Messages
    'message.location_detected': 'Location detected successfully!',
    'message.location_coordinates': 'Location detected (coordinates only)',
    'message.location_denied': 'Location access denied by user.',
    'message.location_unavailable': 'Location information is unavailable.',
    'message.location_timeout': 'Location request timed out.',
    'message.geolocation_not_supported': 'Geolocation is not supported by this browser.',
    'message.produce_registered': 'Produce registered successfully on blockchain!',
    'message.quality_check_complete': 'Quality analysis complete! Score: {score}%',
    'message.voice_assistant_activated': 'Voice assistant activated',
    'message.upload_images_first': 'Please upload at least one image first',
    'message.run_quality_check_first': 'Please run quality check first',
  },
  
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.farmer': 'किसान',
    'nav.distributor': 'वितरक',
    'nav.retailer': 'खुदरा विक्रेता',
    'nav.consumer': 'उपभोक्ता',
    'nav.logout': 'लॉग आउट',
    'nav.distributor_login': 'वितरक लॉगिन',
    'nav.retailer_login': 'खुदरा विक्रेता लॉगिन',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.submit': 'जमा करें',
    'common.close': 'बंद करें',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    
    // Farmer Dashboard
    'farmer.title': 'किसान डैशबोर्ड',
    'farmer.subtitle': 'अपनी उपज पंजीकृत करें और ब्लॉकचेन सत्यापन प्राप्त करें',
    'farmer.gi_tagged': 'जीआई टैग उत्पाद - प्रीमियम गुणवत्ता',
    'farmer.crop_type': 'फसल प्रकार',
    'farmer.variety': 'किस्म',
    'farmer.quantity': 'मात्रा',
    'farmer.unit': 'इकाई',
    'farmer.location': 'खेत का स्थान',
    'farmer.get_location': 'स्थान प्राप्त करें',
    'farmer.getting_location': 'प्राप्त कर रहे हैं...',
    'farmer.harvest_date': 'कटाई की तारीख',
    'farmer.description': 'विवरण',
    'farmer.upload_images': 'छवियां अपलोड करें',
    'farmer.quality_check': 'गुणवत्ता जांच चलाएं',
    'farmer.register_produce': 'उपज पंजीकृत करें',
    'farmer.voice_assistant': 'वॉइस असिस्टेंट',
    
    // Distributor Dashboard
    'distributor.title': 'वितरक डैशबोर्ड',
    'distributor.subtitle': 'अपने शिपमेंट को ट्रैक और प्रबंधित करें',
    'distributor.active_shipments': 'सक्रिय शिपमेंट',
    'distributor.total_packages': 'कुल पैकेज',
    'distributor.partner_stores': 'पार्टनर स्टोर',
    'distributor.revenue_growth': 'राजस्व वृद्धि',
    'distributor.recent_shipments': 'हाल के शिपमेंट',
    'distributor.track_manage': 'अपने वर्तमान शिपमेंट को ट्रैक और प्रबंधित करें',
    
    // Retailer Dashboard
    'retailer.title': 'खुदरा विक्रेता डैशबोर्ड',
    'retailer.subtitle': 'अपने इन्वेंटरी और ऑर्डर का प्रबंधन करें',
    'retailer.total_sales': 'कुल बिक्री',
    'retailer.orders_today': 'आज के ऑर्डर',
    'retailer.active_customers': 'सक्रिय ग्राहक',
    'retailer.inventory_items': 'इन्वेंटरी आइटम',
    'retailer.inventory_management': 'इन्वेंटरी प्रबंधन',
    'retailer.track_stock': 'अपने वर्तमान स्टॉक स्तर और उत्पाद गुणवत्ता को ट्रैक करें',
    'retailer.recent_orders': 'हाल के ऑर्डर',
    'retailer.track_orders': 'अपने हाल के ग्राहक ऑर्डर और भुगतान को ट्रैक करें',
    
    // Login Form
    'login.title': 'वापस स्वागत है',
    'login.subtitle': 'अपने {role} खाते में साइन इन करें और अपने डैशबोर्ड तक पहुंचें',
    'login.username': 'उपयोगकर्ता नाम',
    'login.password': 'पासवर्ड',
    'login.sign_in_distributor': 'वितरक के रूप में साइन इन करें',
    'login.sign_in_retailer': 'खुदरा विक्रेता के रूप में साइन इन करें',
    'login.demo_credentials': 'डेमो क्रेडेंशियल',
    'login.invalid_credentials': 'अमान्य क्रेडेंशियल। कृपया अपना उपयोगकर्ता नाम और पासवर्ड जांचें।',
    'login.fill_fields': 'कृपया सभी फ़ील्ड भरें',
    
    // Hero Section
    'hero.tagline': 'कृषि में क्रांति',
    'hero.title': 'पूरी तरह सत्यापित',
    'hero.subtitle': 'ब्लॉकचेन तकनीक, IoT मॉनिटरिंग और AI-संचालित गुणवत्ता सत्यापन के माध्यम से पूर्ण आपूर्ति श्रृंखला पारदर्शिता। बीज से प्लेट तक विश्वास का निर्माण।',
    'hero.scan_qr': 'QR कोड स्कैन करें',
    'hero.register_produce': 'उपज पंजीकृत करें',
    'hero.uptime': '99.9% अपटाइम',
    'hero.blockchain_secured': 'ब्लॉकचेन सुरक्षित',
    'hero.mobile_friendly': 'मोबाइल फ्रेंडली',
    'hero.supply_chain': 'लाइव सप्लाई चेन ट्रैकर',
    'hero.blockchain_verified': 'ब्लॉकचेन सत्यापित',
    'hero.harvest': 'कटाई',
    'hero.processing': 'प्रसंस्करण',
    'hero.transport': 'परिवहन',
    'hero.retail': 'खुदरा',
    'hero.consumer': 'उपभोक्ता',
    'hero.live': 'लाइव',
    
    // Units
    'unit.kg': 'किलो',
    'unit.quintal': 'क्विंटल',
    'unit.ton': 'टन',
    'unit.piece': 'टुकड़ा',
    'unit.bag': 'बैग',
    'unit.liter': 'लीटर',
    
    // Status
    'status.delivered': 'डिलीवर',
    'status.in_transit': 'ट्रांजिट में',
    'status.pending': 'लंबित',
    'status.completed': 'पूर्ण',
    'status.processing': 'प्रसंस्करण',
    'status.in_stock': 'स्टॉक में',
    'status.low_stock': 'कम स्टॉक',
    'status.out_of_stock': 'स्टॉक खत्म',
    
    // Quality
    'quality.excellent': 'उत्कृष्ट',
    'quality.good': 'अच्छा',
    'quality.fair': 'ठीक',
    'quality.poor': 'खराब',
    
    // Messages
    'message.location_detected': 'स्थान सफलतापूर्वक पता चला!',
    'message.location_coordinates': 'स्थान पता चला (केवल निर्देशांक)',
    'message.location_denied': 'उपयोगकर्ता द्वारा स्थान पहुंच अस्वीकृत।',
    'message.location_unavailable': 'स्थान जानकारी उपलब्ध नहीं है।',
    'message.location_timeout': 'स्थान अनुरोध समय सीमा समाप्त।',
    'message.geolocation_not_supported': 'इस ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।',
    'message.produce_registered': 'उपज सफलतापूर्वक ब्लॉकचेन पर पंजीकृत!',
    'message.quality_check_complete': 'गुणवत्ता विश्लेषण पूर्ण! स्कोर: {score}%',
    'message.voice_assistant_activated': 'वॉइस असिस्टेंट सक्रिय',
    'message.upload_images_first': 'कृपया पहले कम से कम एक छवि अपलोड करें',
    'message.run_quality_check_first': 'कृपया पहले गुणवत्ता जांच चलाएं',
  },
  
  or: {
    // Navigation
    'nav.home': 'ମୂଳପୃଷ୍ଠା',
    'nav.farmer': 'କୃଷକ',
    'nav.distributor': 'ବିତରକ',
    'nav.retailer': 'ଖୁଚୁରା ବିକ୍ରେତା',
    'nav.consumer': 'ଉପଭୋକ୍ତା',
    'nav.logout': 'ଲଗ୍ ଆଉଟ୍',
    'nav.distributor_login': 'ବିତରକ ଲଗ୍ ଇନ୍',
    'nav.retailer_login': 'ଖୁଚୁରା ବିକ୍ରେତା ଲଗ୍ ଇନ୍',
    
    // Common
    'common.loading': 'ଲୋଡ୍ ହେଉଛି...',
    'common.error': 'ତ୍ରୁଟି',
    'common.success': 'ସଫଳତା',
    'common.cancel': 'ବାତିଲ୍ କରନ୍ତୁ',
    'common.save': 'ସେଭ୍ କରନ୍ତୁ',
    'common.submit': 'ଦାଖଲ୍ କରନ୍ତୁ',
    'common.close': 'ବନ୍ଦ୍ କରନ୍ତୁ',
    'common.yes': 'ହଁ',
    'common.no': 'ନାହିଁ',
    
    // Farmer Dashboard
    'farmer.title': 'କୃଷକ ଡ୍ୟାସବୋର୍ଡ',
    'farmer.subtitle': 'ଆପଣଙ୍କର ଉତ୍ପାଦ ପଞ୍ଜିକରଣ କରନ୍ତୁ ଏବଂ ବ୍ଲକଚେନ୍ ଯାଞ୍ଚ ପାଆନ୍ତୁ',
    'farmer.gi_tagged': 'ଜି.ଆଇ. ଟ୍ୟାଗ୍ ଉତ୍ପାଦ - ପ୍ରିମିୟମ୍ ଗୁଣବତ୍ତା',
    'farmer.crop_type': 'ଫସଲ ପ୍ରକାର',
    'farmer.variety': 'ପ୍ରଜାତି',
    'farmer.quantity': 'ପରିମାଣ',
    'farmer.unit': 'ଏକକ',
    'farmer.location': 'ଖେତର ସ୍ଥାନ',
    'farmer.get_location': 'ସ୍ଥାନ ପାଆନ୍ତୁ',
    'farmer.getting_location': 'ପାଉଛି...',
    'farmer.harvest_date': 'କଟାଇ ତାରିଖ',
    'farmer.description': 'ବର୍ଣ୍ଣନା',
    'farmer.upload_images': 'ଛବି ଅପଲୋଡ୍ କରନ୍ତୁ',
    'farmer.quality_check': 'ଗୁଣବତ୍ତା ଯାଞ୍ଚ ଚଲାନ୍ତୁ',
    'farmer.register_produce': 'ଉତ୍ପାଦ ପଞ୍ଜିକରଣ କରନ୍ତୁ',
    'farmer.voice_assistant': 'ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ',
    
    // Distributor Dashboard
    'distributor.title': 'ବିତରକ ଡ୍ୟାସବୋର୍ଡ',
    'distributor.subtitle': 'ଆପଣଙ୍କର ଶିପମେଣ୍ଟ୍ ଟ୍ରାକ୍ ଏବଂ ପରିଚାଳନା କରନ୍ତୁ',
    'distributor.active_shipments': 'ସକ୍ରିୟ ଶିପମେଣ୍ଟ୍',
    'distributor.total_packages': 'ମୋଟ ପ୍ୟାକେଜ୍',
    'distributor.partner_stores': 'ପାର୍ଟନର୍ ସ୍ଟୋର୍',
    'distributor.revenue_growth': 'ରାଜସ୍ୱ ବୃଦ୍ଧି',
    'distributor.recent_shipments': 'ସାମ୍ପ୍ରତିକ ଶିପମେଣ୍ଟ୍',
    'distributor.track_manage': 'ଆପଣଙ୍କର ବର୍ତ୍ତମାନର ଶିପମେଣ୍ଟ୍ ଟ୍ରାକ୍ ଏବଂ ପରିଚାଳନା କରନ୍ତୁ',
    
    // Retailer Dashboard
    'retailer.title': 'ଖୁଚୁରା ବିକ୍ରେତା ଡ୍ୟାସବୋର୍ଡ',
    'retailer.subtitle': 'ଆପଣଙ୍କର ଇନଭେଣ୍ଟରି ଏବଂ ଅର୍ଡର୍ ପରିଚାଳନା କରନ୍ତୁ',
    'retailer.total_sales': 'ମୋଟ ବିକ୍ରୟ',
    'retailer.orders_today': 'ଆଜିର ଅର୍ଡର୍',
    'retailer.active_customers': 'ସକ୍ରିୟ ଗ୍ରାହକ',
    'retailer.inventory_items': 'ଇନଭେଣ୍ଟରି ଆଇଟମ୍',
    'retailer.inventory_management': 'ଇନଭେଣ୍ଟରି ପରିଚାଳନା',
    'retailer.track_stock': 'ଆପଣଙ୍କର ବର୍ତ୍ତମାନର ସ୍ଟକ୍ ସ୍ତର ଏବଂ ଉତ୍ପାଦ ଗୁଣବତ୍ତା ଟ୍ରାକ୍ କରନ୍ତୁ',
    'retailer.recent_orders': 'ସାମ୍ପ୍ରତିକ ଅର୍ଡର୍',
    'retailer.track_orders': 'ଆପଣଙ୍କର ସାମ୍ପ୍ରତିକ ଗ୍ରାହକ ଅର୍ଡର୍ ଏବଂ ଦେୟ ଟ୍ରାକ୍ କରନ୍ତୁ',
    
    // Login Form
    'login.title': 'ପୁନର୍ବାର ସ୍ୱାଗତ',
    'login.subtitle': 'ଆପଣଙ୍କର {role} ଖାତାରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ ଏବଂ ଆପଣଙ୍କର ଡ୍ୟାସବୋର୍ଡ୍ ପାଆନ୍ତୁ',
    'login.username': 'ଉପଯୋଗକର୍ତ୍ତା ନାମ',
    'login.password': 'ପାସୱାର୍ଡ',
    'login.sign_in_distributor': 'ବିତରକ ଭାବରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
    'login.sign_in_retailer': 'ଖୁଚୁରା ବିକ୍ରେତା ଭାବରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
    'login.demo_credentials': 'ଡେମୋ କ୍ରେଡେନ୍ସିଆଲ୍',
    'login.invalid_credentials': 'ଅବୈଧ କ୍ରେଡେନ୍ସିଆଲ୍। ଦୟାକରି ଆପଣଙ୍କର ଉପଯୋଗକର୍ତ୍ତା ନାମ ଏବଂ ପାସୱାର୍ଡ ଯାଞ୍ଚ କରନ୍ତୁ।',
    'login.fill_fields': 'ଦୟାକରି ସମସ୍ତ ଫିଲ୍ଡ୍ ପୂରଣ କରନ୍ତୁ',
    
    // Hero Section
    'hero.tagline': 'କୃଷିରେ ବିପ୍ଳବ',
    'hero.title': 'ସମ୍ପୂର୍ଣ୍ଣ ଯାଞ୍ଚିତ',
    'hero.subtitle': 'ବ୍ଲକଚେନ୍ ଟେକ୍ନୋଲୋଜି, IoT ମନିଟରିଂ ଏବଂ AI-ଚାଳିତ ଗୁଣବତ୍ତା ଯାଞ୍ଚ ମାଧ୍ୟମରେ ସମ୍ପୂର୍ଣ୍ଣ ସପ୍ଲାଇ ଚେନ୍ ସ୍ୱଚ୍ଛତା। ବିହନରୁ ପ୍ଲେଟ୍ ପର୍ଯ୍ୟନ୍ତ ବିଶ୍ୱାସ ଗଠନ।',
    'hero.scan_qr': 'QR କୋଡ୍ ସ୍କ୍ୟାନ୍ କରନ୍ତୁ',
    'hero.register_produce': 'ଉତ୍ପାଦ ପଞ୍ଜିକରଣ କରନ୍ତୁ',
    'hero.uptime': '99.9% ଅପଟାଇମ୍',
    'hero.blockchain_secured': 'ବ୍ଲକଚେନ୍ ସୁରକ୍ଷିତ',
    'hero.mobile_friendly': 'ମୋବାଇଲ୍ ଫ୍ରେଣ୍ଡଲି',
    'hero.supply_chain': 'ଲାଇଭ୍ ସପ୍ଲାଇ ଚେନ୍ ଟ୍ରାକର୍',
    'hero.blockchain_verified': 'ବ୍ଲକଚେନ୍ ଯାଞ୍ଚିତ',
    'hero.harvest': 'କଟାଇ',
    'hero.processing': 'ପ୍ରକ୍ରିୟାକରଣ',
    'hero.transport': 'ପରିବହନ',
    'hero.retail': 'ଖୁଚୁରା',
    'hero.consumer': 'ଉପଭୋକ୍ତା',
    'hero.live': 'ଲାଇଭ୍',
    
    // Units
    'unit.kg': 'କି.ଗ୍ରା.',
    'unit.quintal': 'କୁଇଣ୍ଟାଲ୍',
    'unit.ton': 'ଟନ୍',
    'unit.piece': 'ଟୁକୁଡା',
    'unit.bag': 'ବ୍ୟାଗ୍',
    'unit.liter': 'ଲିଟର୍',
    
    // Status
    'status.delivered': 'ଡିଲିଭର୍',
    'status.in_transit': 'ଟ୍ରାନ୍ଜିଟ୍ ରେ',
    'status.pending': 'ବିଚାରାଧୀନ',
    'status.completed': 'ସମ୍ପୂର୍ଣ୍ଣ',
    'status.processing': 'ପ୍ରକ୍ରିୟାକରଣ',
    'status.in_stock': 'ସ୍ଟକ୍ ରେ',
    'status.low_stock': 'କମ୍ ସ୍ଟକ୍',
    'status.out_of_stock': 'ସ୍ଟକ୍ ଶେଷ',
    
    // Quality
    'quality.excellent': 'ଉତ୍କୃଷ୍ଟ',
    'quality.good': 'ଭଲ',
    'quality.fair': 'ଠିକ୍',
    'quality.poor': 'ଖରାପ',
    
    // Messages
    'message.location_detected': 'ସ୍ଥାନ ସଫଳତାର ସହିତ ଚିହ୍ନଟ ହେଲା!',
    'message.location_coordinates': 'ସ୍ଥାନ ଚିହ୍ନଟ ହେଲା (କେବଳ କୋଅର୍ଡିନେଟ୍)',
    'message.location_denied': 'ଉପଯୋଗକର୍ତ୍ତା ଦ୍ୱାରା ସ୍ଥାନ ପ୍ରବେଶ ଅସ୍ୱୀକୃତ।',
    'message.location_unavailable': 'ସ୍ଥାନ ସୂଚନା ଉପଲବ୍ଧ ନାହିଁ।',
    'message.location_timeout': 'ସ୍ଥାନ ଅନୁରୋଧ ସମୟ ସୀମା ସମାପ୍ତ।',
    'message.geolocation_not_supported': 'ଏହି ବ୍ରାଉଜର୍ ଦ୍ୱାରା ଜିଓଲୋକେସନ୍ ସମର୍ଥିତ ନାହିଁ।',
    'message.produce_registered': 'ଉତ୍ପାଦ ସଫଳତାର ସହିତ ବ୍ଲକଚେନ୍ ରେ ପଞ୍ଜିକରଣ ହେଲା!',
    'message.quality_check_complete': 'ଗୁଣବତ୍ତା ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ! ସ୍କୋର୍: {score}%',
    'message.voice_assistant_activated': 'ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ ସକ୍ରିୟ',
    'message.upload_images_first': 'ଦୟାକରି ପ୍ରଥମେ ଅତି କମ୍ରେ ଗୋଟିଏ ଛବି ଅପଲୋଡ୍ କରନ୍ତୁ',
    'message.run_quality_check_first': 'ଦୟାକରି ପ୍ରଥମେ ଗୁଣବତ୍ତା ଯାଞ୍ଚ ଚଲାନ୍ତୁ',
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('agritrace_language') as Language;
    if (savedLanguage && ['en', 'hi', 'or'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('agritrace_language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
