
import { Facebook, Twitter, Instagram, Youtube, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll start receiving our newsletter soon.",
      });
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-b from-transparent to-[#111827] py-16 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-herb to-emerald-700 rounded-full opacity-20 blur-sm"></div>
                <svg className="relative z-10" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M20 5C18 10 10 15 10 25C10 35 30 35 30 25C30 15 22 10 20 5Z" 
                    stroke="#4ADE80" 
                    strokeWidth="2" 
                    fill="url(#footerGrad)" 
                    fillOpacity="0.2" 
                  />
                  <path d="M20 5C18 12 15 18 20 28" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 5C22 12 25 18 20 28" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="footerGrad" x1="10" y1="5" x2="30" y2="35" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4ADE80" />
                      <stop offset="1" stopColor="#22C55E" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className="text-xl font-bold">
                <span className="text-herb">Herb</span>
                <span className="text-white">Sanctuary</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-6 text-sm">
              Discover the healing power of natural herbs for skin health and overall wellness through our curated digital garden.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-white/5 p-2 rounded-full text-herb hover:bg-herb hover:text-herb-foreground transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-white/5 p-2 rounded-full text-herb hover:bg-herb hover:text-herb-foreground transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-white/5 p-2 rounded-full text-herb hover:bg-herb hover:text-herb-foreground transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-white/5 p-2 rounded-full text-herb hover:bg-herb hover:text-herb-foreground transition-colors" aria-label="Youtube">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-5 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">Home</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">Explore Plants</Link></li>
              <li><Link to="/analyzer" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">AI Skin Analyzer</Link></li>
              <li><Link to="/remedies" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">Home Remedies</Link></li>
              <li><Link to="/chatbot" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">Chatbot</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-5 text-lg">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">Newsletter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">Research</a></li>
              <li><a href="#" className="text-gray-400 hover:text-herb transition-colors text-sm inline-block">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-5 text-lg">Subscribe</h4>
            <p className="text-gray-400 mb-4 text-sm">Stay updated with the latest herbal remedies and skincare tips</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-herb focus:border-transparent text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-herb text-herb-foreground p-1.5 rounded-md hover:bg-herb-dark transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Herb Sanctuary. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 text-xs hover:text-herb transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 text-xs hover:text-herb transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 text-xs hover:text-herb transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
