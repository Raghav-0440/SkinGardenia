import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Filter, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { homeRemedies } from "../data/homeRemediesData";

// Available filter categories
const categories = [
  "All",
  "Brightening",
  "Hydration",
  "Exfoliation",
  "Anti-inflammatory",
  "Acne",
  "Anti-aging",
  "Body Care",
  "Soothing",
  "Toner",
];

const HomeRemedies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredRemedies = homeRemedies.filter((remedy) => {
    const matchesSearch = remedy.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      remedy.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      remedy.category.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = 
      activeCategory === "All" || 
      remedy.category.some(tag => 
        tag.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === "Anti-aging" && tag.includes("anti"))
      );
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with background */}
          <div className="relative mb-12 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#151d29]/90 to-[#151d29]/70"></div>
            <div className="relative z-10 py-12 px-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Natural <span className="text-herb">Home Remedies</span>
              </h1>
              <div className="w-20 h-1 bg-herb mb-6"></div>
              <p className="text-gray-300 mb-0 max-w-2xl">
                Discover DIY herbal remedies you can make at home using simple, natural ingredients. 
                These recipes harness the power of plants to address various skin concerns safely and effectively.
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search for remedies..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-5 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-herb focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-herb">
                <Search size={20} />
              </div>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2">
              <Filter className="text-herb mr-1 h-4 w-4 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-herb text-herb-foreground shadow-lg shadow-herb/20"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Remedies Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 rounded-xl overflow-hidden h-96 animate-pulse">
                  <div className="h-48 bg-white/10"></div>
                  <div className="p-5">
                    <div className="h-6 bg-white/10 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-white/10 rounded mb-4 w-2/3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-white/10 rounded w-1/4"></div>
                      <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRemedies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRemedies.map((remedy) => (
                <Link
                  key={remedy.id}
                  to={`/remedies/${remedy.id}`}
                  className="transition-all duration-300 hover:scale-[1.02] focus:outline-none group"
                >
                  <Card className="bg-white/5 border-white/10 overflow-hidden h-full">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={remedy.image}
                        alt={remedy.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-herb transition-colors">
                        {remedy.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {remedy.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="h-3 w-3 text-herb" />
                          <span>15 min</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>4.8</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {remedy.category.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {remedy.instructions && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <p className="text-gray-300 text-xs font-medium mb-1">Instructions:</p>
                          <p className="text-gray-400 text-xs line-clamp-2">{remedy.instructions.join(' ')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-xl text-white font-medium mb-2">
                No remedies found
              </h3>
              <p className="text-gray-400">
                Try searching with a different term or filter
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomeRemedies;
