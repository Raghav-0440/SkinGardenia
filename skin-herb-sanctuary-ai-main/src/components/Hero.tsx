import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Will implement search functionality in future
  };

  return (
    <div className="flex flex-col md:flex-row w-full py-12 px-6 md:px-10 gap-8 mt-8">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-herb">Floriva!</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Nature's Touch for Healthier Skin!
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Wander through a Virtual Herbal Garden and{" "}
          <span className="text-herb">Uncover Timeless</span> Skincare Remedies.
        </p>

        <form onSubmit={handleSearch} className="relative mb-8 max-w-md">
          <input
            type="text"
            placeholder="Find Your Herbal Plant!"
            className="w-full bg-[#222] border border-[#333] rounded-full py-3 pl-5 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-herb focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bg-herb hover:bg-herb-dark text-[#111] rounded-full p-2 transition-colors"
          >
            <Search size={20} />
          </button>
        </form>

        <Link to="/explore" className="herb-button-outline self-start">
          Explore
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center mt-8 md:mt-0">
        <div className="relative w-full max-w-md aspect-square">
          <div className="absolute top-0 right-0 bg-[#222222] rounded-lg px-3 py-1 text-xs text-herb z-20">
            3D Model
          </div>
          <div className="w-full h-full rounded-xl overflow-hidden border border-[#333] animate-float">
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop"
              alt="3D Garden Model"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
