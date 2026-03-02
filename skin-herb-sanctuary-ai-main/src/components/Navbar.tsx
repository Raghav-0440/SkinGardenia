
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchIcon, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed w-full z-50 py-4 px-6 md:px-10 transition-all duration-300 ${
        isScrolled ? "bg-[#151d29]/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-herb to-emerald-700 rounded-full opacity-20 blur-sm"></div>
              <svg className="relative z-10" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M20 5C18 10 10 15 10 25C10 35 30 35 30 25C30 15 22 10 20 5Z" 
                  stroke="#4ADE80" 
                  strokeWidth="2" 
                  fill="url(#grad)" 
                  fillOpacity="0.2" 
                />
                <path d="M20 5C18 12 15 18 20 28" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 5C22 12 25 18 20 28" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad" x1="10" y1="5" x2="30" y2="35" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4ADE80" />
                    <stop offset="1" stopColor="#22C55E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">
              <span className="text-herb">Skin</span>Gardenia
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              isActive("/") 
                ? "text-herb" 
                : "text-white/80 hover:text-herb"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/explore" 
            className={`text-sm font-medium transition-colors ${
              isActive("/explore") 
                ? "text-herb" 
                : "text-white/80 hover:text-herb"
            }`}
          >
            Explore Plants
          </Link>
          <Link 
            to="/analyzer" 
            className={`text-sm font-medium transition-colors ${
              isActive("/analyzer") 
                ? "text-herb" 
                : "text-white/80 hover:text-herb"
            }`}
          >
            AI Skin Analyzer
          </Link>
          <Link 
            to="/remedies" 
            className={`text-sm font-medium transition-colors ${
              isActive("/remedies") 
                ? "text-herb" 
                : "text-white/80 hover:text-herb"
            }`}
          >
            Home Remedies
          </Link>
          <Link 
            to="/chatbot" 
            className={`text-sm font-medium transition-colors ${
              isActive("/chatbot") 
                ? "text-herb" 
                : "text-white/80 hover:text-herb"
            }`}
          >
            Chatbot
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/search" 
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5 text-white" />
          </Link>
          <Link 
            to="/get-started" 
            className="hidden md:block herb-button"
          >
            Get started
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#151d29]/95 backdrop-blur-md border-t border-white/10 shadow-lg py-4 px-6 z-50 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive("/") 
                  ? "text-herb" 
                  : "text-white/80 hover:text-herb"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors ${
                isActive("/explore") 
                  ? "text-herb" 
                  : "text-white/80 hover:text-herb"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore Plants
            </Link>
            <Link 
              to="/analyzer" 
              className={`text-sm font-medium transition-colors ${
                isActive("/analyzer") 
                  ? "text-herb" 
                  : "text-white/80 hover:text-herb"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Skin Analyzer
            </Link>
            <Link 
              to="/remedies" 
              className={`text-sm font-medium transition-colors ${
                isActive("/remedies") 
                  ? "text-herb" 
                  : "text-white/80 hover:text-herb"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home Remedies
            </Link>
            <Link 
              to="/chatbot" 
              className={`text-sm font-medium transition-colors ${
                isActive("/chatbot") 
                  ? "text-herb" 
                  : "text-white/80 hover:text-herb"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chatbot
            </Link>
            <Link 
              to="/get-started" 
              className="herb-button w-full text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
