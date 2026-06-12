import { useState, useEffect, useRef } from 'react';
import {
  Megaphone, ArrowRight, Globe, Moon, Sun, Hexagon, ChevronRight,
  Package, Factory, Clock, Settings, Zap, Target, CheckCircle, Handshake,
  Shield, Wrench, Monitor, Search, Plus, Truck, FlaskConical,
  FileText, Rocket,  MessageCircle
} from 'lucide-react';

import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import ImageWithFallback from "../components/figma/ImageWithFallback";
// En haut du fichier avec les autres imports
import { getProducts } from '../services/api';
import logooo from "../assets/logooo.png";


// ─── Data ──────────────────────────────────────────────────────────────────
 
const loomBrands = [
  'PICANOL', 'ITEMA', 'DORNIER', 'SULZER', 'STÄUBLI', 'VAMATEX','EXCEL','SUPER_EXCEL','LEONARDO','ALPHA',
  
  'PICANOL', 'ITEMA', 'DORNIER', 'SULZER', 'STÄUBLI', 'VAMATEX','EXCEL','SUPER_EXCEL','LEONARDO','ALPHA'
];
 
// ─── Home ──────────────────────────────────────────────────────────────────
 
function Home() {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('EN');
 
  // Navbar state
  const [isScrolled, setIsScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
 
  // Hero counters
  const [partsCount, setPartsCount] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
 
  // About visibility
  const [aboutVisible, setAboutVisible] = useState(false);
  const aboutRef = useRef(null);
 
  // Expertise visibility + progress
  const [expertiseVisible, setExpertiseVisible] = useState(false);
  const [progressValues, setProgressValues] = useState({ parts: 0, services: 0, digital: 0 });
  const expertiseRef = useRef(null);
 
  // Catalogue state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [rfqItems, setRfqItems] = useState([]);
 
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };
 
  // Dark mode
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);
 
  // Scroll navbar
  useEffect(() => {
    const handleScroll = () => {
      const cur = window.scrollY;
      setIsScrolled(cur > 10);
      setNavVisible(prevScrollPos > cur || cur < 10);
      setPrevScrollPos(cur);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
 
  // Hero counters
  useEffect(() => {
    const partsInterval = setInterval(() => {
      setPartsCount(prev => { if (prev >= 500) { clearInterval(partsInterval); return 500; } return prev + 10; });
    }, 20);
    const partnersInterval = setInterval(() => {
      setPartnersCount(prev => { if (prev >= 50) { clearInterval(partnersInterval); return 50; } return prev + 1; });
    }, 40);
    return () => { clearInterval(partsInterval); clearInterval(partnersInterval); };
  }, []);
 
  // About intersection
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setAboutVisible(true);
    }, { threshold: 0.2 });
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);
 
  // Expertise intersection
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setExpertiseVisible(true);
        setTimeout(() => setProgressValues({ parts: 92, services: 97, digital: 85 }), 200);
      }
    }, { threshold: 0.2 });
    if (expertiseRef.current) observer.observe(expertiseRef.current);
    return () => observer.disconnect();
  }, []);
 
  // Fetch products from API
  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(() => setProductsError('Erreur lors du chargement des produits.'))
      .finally(() => setProductsLoading(false));
  }, []);
 
  // Dynamically build categories from API data
  const categories = ['All', ...new Set(products.map(p => p.category?.name).filter(Boolean))];
 
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || p.category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });
 
  const toggleRfq = (id) => {
    setRfqItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
 
  const aboutFeatures = [
    { icon: Zap, title: 'Minimized Downtime', description: 'Fast turnaround times to minimize your production downtime' },
    { icon: Target, title: 'Guaranteed Compatibility', description: 'Exact specifications for perfect compatibility with your machinery' },
    { icon: CheckCircle, title: 'International Standards , Local Expertise', description: 'International standards with local Moroccan service excellence' },
    { icon: Handshake, title: 'Building Industrial Resilience', description: 'Building lasting relationships with textile manufacturers' },
  ];
 
  const expertiseCards = [
    {
      icon: Package,
      title: 'Precision Components Sourcing',
      items: ['Rapier grippers & components', 'Brush rings & plates', 'Electronic boards & sensors', 'Gears & mechanical parts'],
      progress: progressValues.parts,
      color: '#1B3A6B',
    },
    {
      icon: Wrench,
      title: 'Full Cycle Technical Support',
      items: ['On-site technical support', 'Machinery diagnostics', 'Installation assistance', 'Preventive maintenance'],
      progress: progressValues.services,
      color: '#F97316',
    },
    {
      icon: Monitor,
      title: 'Advanced Procurement Solutions',
      items: ['Online parts catalogue', 'Quick RFQ system', 'Order tracking portal', 'Technical documentation'],
      progress: progressValues.digital,
      color: '#3B72B0',
    },
  ];
 
  const services = [
    { icon: Package, title: 'On Demande Parts Availibility', description: 'Comprehensive inventory of textile machinery spare parts from leading global manufacturers, ready for immediate dispatch to your facility.' },
    { icon: Truck, title: 'Emergency Logistics Support', description: 'Express delivery across Morocco with average 24-hour turnaround. Emergency orders prioritized to minimize your production downtime.' },
    { icon: FlaskConical, title: 'Operational Optimization Consulting', description: 'Expert guidance on part selection, compatibility verification, and maintenance planning to optimize your machinery performance.' },
  ];
 
  const milestones = [
    { icon: Rocket, title: 'The Genesis of Partiva', description: "Established in Casablanca to serve Morocco's growing textile industry with precision spare parts and rapid delivery." },
    { icon: Handshake,  title: 'Growth Phase — Strategic Partnerships', description: 'Expanded our supplier network globally and partnered with 50+ textile manufacturers across Morocco.' },
    { icon: Target,  title: 'Redefining Industry Standards', description: 'Aiming for complete nationwide coverage with regional distribution centers and 1000+ parts in our catalogue.' },
  ];
 
  const resources = [
    { title: 'Complete Parts Catalogue 2026', description: 'Comprehensive listing of all available spare parts with specifications and compatibility charts.', fileSize: '12.5 MB' },
    { title: 'Rapier Gripper Maintenance Guide', description: 'Step-by-step maintenance procedures and troubleshooting for rapier components.', fileSize: '4.2 MB' },
    { title: 'Loom Compatibility Matrix', description: 'Cross-reference guide for part compatibility across major loom manufacturers.', fileSize: '2.8 MB' },
  ];
 
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] scroll-smooth">
 
      {/* ── Announcement Bar ────────────────────────────────────────────── */}
      <div className="bg-[#1B3A6B] text-[#F97316] py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <Megaphone className="w-4 h-4" />
          <p className="text-sm tracking-wide">
            Trusted in Morocco Since Day One — Precision Parts, Rapid Delivery
          </p>
        </div>
      </div>
 
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 bg-white dark:bg-[#1C1C1C] transition-all duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hexagon className="w-8 h-8 text-[#F97316] fill-[#F97316]" />
              <img
  src={logooo}
  alt="PARTIVA"
 className="h-36 w-30 object-contain max-w-[140px] dark:brightness-0 dark:invert"
/>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['about', 'expertise', 'catalogue', 'services', 'journey'].map(id => (
                <button key={id} onClick={() => scrollToSection(id)} className="text-[#1C1C1C] dark:text-white hover:text-[#F97316] transition-colors capitalize">
                  {id}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setLanguage(language === 'EN' ? 'FR' : 'EN')} className="flex items-center gap-1 text-sm text-[#1C1C1C] dark:text-white hover:text-[#F97316] transition-colors">
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </button>
              <button onClick={() => setIsDark(!isDark)} className="text-[#1C1C1C] dark:text-white hover:text-[#F97316] transition-colors">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Button onClick={() => scrollToSection('catalogue')} className="bg-[#F97316] hover:bg-[#ea640c] text-white">
                View Catalogue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
 
      <main>
 
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative bg-white dark:bg-[#0a0a0a] py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(27,58,107,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(27,58,107,0.03)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.05)_1px,transparent_1px)]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-5xl md:text-6xl font-black mb-6 text-[#1B3A6B] dark:text-white tracking-tight leading-tight">
                  Empowering Morrocco's Textile Industry with Precision & Speed
                </h1>
                <p className="text-lg text-[#1C1C1C] dark:text-gray-300 mb-8 leading-relaxed">
                  PARTIVA delivers high-quality textile machinery components to keep your production running smoothly.
                  From rapier grippers to electronic boards, we supply precision parts with rapid turnaround.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => scrollToSection('catalogue')} className="bg-[#1B3A6B] hover:bg-[#153157] text-white px-8 py-6">
                    View Catalogue <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button onClick={() => scrollToSection('services')} className="bg-[#F97316] hover:bg-[#ea640c] text-white px-8 py-6">
                    Our Services <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                <div className="mt-12 grid grid-cols-3 gap-6">
                  {[
                    { icon: Package, value: `${partsCount}+`, label: 'Inventory Ready to Ship' },
                    { icon: Factory, value: `${partnersCount}+`, label: 'Trusted Global Partnerships' },
                    { icon: Clock, value: '24h', label: 'Rapid Logistics Solutions' },
                  ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} className="bg-white dark:bg-[#1C1C1C] p-4 rounded-lg shadow-lg border border-[#F4F6F9] dark:border-gray-800">
                      <stat.icon className="w-6 h-6 text-[#F97316] mb-2" />
                      <div className="text-2xl font-black text-[#1B3A6B] dark:text-white">{stat.value}</div>
                      <div className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1675176785803-bffbbb0cd2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwbG9vbSUyMG1hY2hpbmVyeSUyMHdlYXZpbmd8ZW58MXx8fHwxNzgxMDQ1ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Textile loom machinery in action"
                    className="w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1B3A6B]/20 to-transparent" />
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-10 right-10 w-32 h-32 border-4 border-[#F97316] opacity-30"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
 
        {/* ── Loom Strip ──────────────────────────────────────────────────── */}
        <div className="bg-[#1B3A6B] dark:bg-[#0f2347] py-6 overflow-hidden relative">
          <div className="animate-loom-scroll flex gap-12">
            {loomBrands.map((brand, index) => (
              <div key={index} className="flex items-center gap-3 whitespace-nowrap">
                <Settings className="w-5 h-5 text-white" />
                <span className="text-white font-black text-lg tracking-wider">{brand}</span>
                {index < loomBrands.length - 1 && <div className="w-1 h-1 bg-[#F97316] rounded-full ml-6" />}
              </div>
            ))}
          </div>
        </div>
 
        {/* ── About ───────────────────────────────────────────────────────── */}
        <section id="about" ref={aboutRef} className="py-20 bg-white dark:bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={aboutVisible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1610891015188-5369212db097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZmFjdG9yeSUyMHRleHRpbGUlMjBtYW51ZmFjdHVyaW5nfGVufDF8fHx8MTc4MTA0NTgwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Industrial factory floor with textile machinery"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#F97316]" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#F97316]" />
                  <div className="absolute bottom-6 left-6 bg-white dark:bg-[#1C1C1C] rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-[#F97316]" />
                      <div>
                        <div className="font-black text-[#1B3A6B] dark:text-white">Quality Certified</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">ISO Standards</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={aboutVisible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#1B3A6B] dark:text-white tracking-tight">
                  Bridging Global Supply with Local Textile Excellence
                </h2>
                <p className="text-lg text-[#1C1C1C] dark:text-gray-300 mb-8 leading-relaxed">
                  Based in Casablanca, PARTIVA serves Morocco's thriving textile industry with precision spare parts sourced from leading global manufacturers.
                  We understand the critical nature of machinery uptime and deliver the exact components you need, when you need them.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {aboutFeatures.map((feature, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={aboutVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }} className="bg-[#F4F6F9] dark:bg-[#1C1C1C] p-6 rounded-lg border border-transparent hover:border-[#F97316] transition-all duration-300">
                      <feature.icon className="w-8 h-8 text-[#F97316] mb-3" />
                      <h3 className="font-black text-[#1B3A6B] dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
 
        {/* ── Expertise ───────────────────────────────────────────────────── */}
        <section id="expertise" ref={expertiseRef} className="py-20 bg-white dark:bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={expertiseVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#1B3A6B] dark:text-white tracking-tight">Our Expertise</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Comprehensive solutions for the textile manufacturing industry</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {expertiseCards.map((card, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={expertiseVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }} className="bg-white dark:bg-[#1C1C1C] p-8 rounded-xl border-2 border-[#F4F6F9] dark:border-gray-800 hover:border-[#F97316] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <card.icon className="w-12 h-12 mb-6" style={{ color: card.color }} />
                  <h3 className="text-2xl font-black mb-6 text-[#1B3A6B] dark:text-white">{card.title}</h3>
                  <ul className="space-y-3 mb-8">
                    {card.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Capability</span>
                      <span className="font-black" style={{ color: card.color }}>{card.progress}%</span>
                    </div>
                    <Progress value={card.progress} className="h-2" style={{ backgroundColor: '#F4F6F9' }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
 
        {/* ── Product Catalogue ───────────────────────────────────────────── */}
        <section id="catalogue" className="py-20 bg-[#F4F6F9] dark:bg-[#0f0f0f]">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#1B3A6B] dark:text-white tracking-tight">Our Spare Parts Range</h2>
              <div className="w-24 h-1 bg-[#F97316] mx-auto mb-6" />
            </motion.div>
 
            {/* Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by part name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white dark:bg-[#1C1C1C]"
                />
              </div>
            </div>
 
            {/* Category filters — built dynamically from API */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium uppercase text-sm tracking-wide transition-all duration-300 ${activeCategory === category ? 'bg-[#F97316] text-white shadow-lg' : 'bg-white dark:bg-[#1C1C1C] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  {category}
                </button>
              ))}
            </div>
 
            {/* Loading state */}
            {productsLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
 
            {/* Error state */}
            {productsError && (
              <div className="text-center py-20 text-red-500">{productsError}</div>
            )}
 
            {/* Empty state */}
            {!productsLoading && !productsError && filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Aucun produit trouvé.</p>
              </div>
            )}
 
            {/* Products grid */}
            {!productsLoading && !productsError && filteredProducts.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-white dark:bg-[#1C1C1C] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Product image */}
                    <div className="bg-white dark:bg-gray-900 p-6 flex items-center justify-center h-64">
                      {product.image ? (
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-300">
                          <Package className="w-16 h-16" />
                          <span className="text-sm">No image</span>
                        </div>
                      )}
                    </div>
 
                    {/* Product info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-black text-[#1B3A6B] dark:text-white">{product.name}</h3>
                        <Badge className={`text-white text-xs ${product.is_active ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {product.is_active ? 'In Stock' : 'Unavailable'}
                        </Badge>
                      </div>
 
                      {/* Category */}
                      {product.category?.name && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                          {product.category.name}
                        </p>
                      )}
 
                      {/* Description */}
                      {product.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                      )}
 
                      {/* Price + Stock */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-[#F97316]">{product.price} MAD</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
                      </div>
 
                      {/* RFQ button */}
                      <Button
                        onClick={() => toggleRfq(product.id)}
                        className={`w-full ${rfqItems.includes(product.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-[#F97316] hover:bg-[#ea640c]'} text-white`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {rfqItems.includes(product.id) ? 'Added to RFQ' : 'Add to RFQ'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
 
            {/* RFQ floating badge */}
            {rfqItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 right-8 bg-[#F97316] text-white px-6 py-4 rounded-full shadow-2xl z-50"
              >
                <span className="font-black">{rfqItems.length} items in RFQ</span>
              </motion.div>
            )}
          </div>
        </section>
 
        {/* ── Services ────────────────────────────────────────────────────── */}
        <section id="services" className="py-20 bg-[#1B3A6B] dark:bg-[#0f2347] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <motion.div animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }} transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }} className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(249,115,22,0.3) 35px, rgba(249,115,22,0.3) 70px)', backgroundSize: '200% 200%' }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">Our Services</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">End-to-end solutions for your textile machinery needs</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white dark:bg-[#1C1C1C] p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <service.icon className="w-12 h-12 text-[#F97316] mb-6 relative z-10" />
                  <h3 className="text-2xl font-black mb-4 text-[#1B3A6B] dark:text-white relative z-10">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
 
        {/* ── Journey ─────────────────────────────────────────────────────── */}
        <section id="journey" className="py-20 bg-white dark:bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#1B3A6B] dark:text-white tracking-tight">Our Journey</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Building the future of textile spare parts distribution in Morocco</p>
            </motion.div>
            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }} className="relative pl-24 pb-16 last:pb-0">
                  {index < milestones.length - 1 && <div className="absolute left-8 top-16 w-0.5 h-full bg-[#1B3A6B] dark:bg-gray-700" />}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-[#F97316] animate-pulse-ring" />
                  <div className="absolute left-0 top-0 w-16 h-16 bg-[#F97316] rounded-full flex items-center justify-center shadow-lg">
                    <milestone.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white dark:bg-[#1C1C1C] p-8 rounded-xl shadow-lg border-2 border-[#F4F6F9] dark:border-gray-800 hover:border-[#F97316] transition-all duration-300">
                    <div className="text-sm uppercase tracking-wider text-[#F97316] font-black mb-2">{milestone.year}</div>
                    <h3 className="text-2xl font-black mb-3 text-[#1B3A6B] dark:text-white">{milestone.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
 
        {/* ── Technical Resources ─────────────────────────────────────────── */}
        <section className="py-20 bg-[#F4F6F9] dark:bg-[#0f0f0f]">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#1B3A6B] dark:text-white tracking-tight">Technical Resources</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {resources.map((resource, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -8 }} className="bg-white dark:bg-[#1C1C1C] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <FileText className="w-12 h-12 text-[#F97316] mb-6" />
                  <h3 className="text-xl font-black mb-3 text-[#1B3A6B] dark:text-white">{resource.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{resource.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
 
      </main>
 
      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#1B3A6B] dark:bg-[#0f2347] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hexagon className="w-8 h-8 text-[#F97316] fill-[#F97316]" />
                <span className="text-2xl font-black tracking-tight">PARTIVA</span>
              </div>
              <p className="text-sm text-white/80 italic">"Precision in Motion"</p>
            </div>
            <div>
              <h4 className="font-black mb-4 uppercase tracking-wider text-sm">Navigate</h4>
              <ul className="space-y-2">
                {[['about', 'About Us'], ['expertise', 'Expertise'], ['catalogue', 'Catalogue'], ['journey', 'Our Journey']].map(([id, label]) => (
                  <li key={id}>
                    <button onClick={() => scrollToSection(id)} className="text-white/80 hover:text-[#F97316] transition-colors text-sm">{label}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 uppercase tracking-wider text-sm">Services</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>On Demand Parts Availability</li>
                <li>Emergency Logistics Support</li>
                <li>Operational Optimization</li>
                <li>Parts Catalogue</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>Casablanca, Morocco</li>
                <li>contact@partiva.ma</li>
                <li>+212 5XX-XXX-XXX</li>
              </ul>
 <div className="flex gap-3 mt-6">
  <a href="https://wa.me/212608455439" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#25D366] transition-colors" aria-label="WhatsApp">
    <MessageCircle className="w-5 h-5" />
  </a>
</div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8">
            <p className="text-center text-sm text-white/70">
              2026 PARTIVA — All rights reserved. Built for Morocco. Engineered for Excellence.
            </p>
          </div>
        </div>
      </footer>
 <a href="https://wa.me/212671423516"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-8 left-8 z-50 flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all duration-300"
  aria-label="Contact us on WhatsApp"
>
  <MessageCircle className="w-6 h-6" />
  <span className="font-bold text-sm hidden sm:block">Chat with us</span>
</a>
      <style>{`
        @keyframes loom-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-loom-scroll {
          animation: loom-scroll 30s linear infinite;
        }
        .animate-loom-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
          100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }
      `}</style>
    </div>
  );
}
 
export default Home;