import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { plantsData } from '@/data/plantsData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const categories = [
  'All',
  'Skin Cleansing',
  'Detoxification',
  'Anti-aging',
  'Acne Control',
  'Skin Tightening',
  'Skin Conditioning',
  'Emollient',
  'Softening',
  'Smoothing',
  'Antioxidant',
  'Hyperpigmentation',
  'Skin Brightening',
  'Antimicrobial',
  'Anti-inflammatory',
  'Skin Diseases',
  'Scabies',
  'Ringworm',
  'Vitiligo',
  'Healing',
  'Scar Reduction',
  'Hydration',
  'Pigmentation Reduction',
  'Psoriasis Relief',
  'Eczema Relief',
  'Skin Barrier Strengthening',
  'Inflammation Reduction',
  'Antibacterial',
  'Skin Purification',
  'Wound Healing',
  'Sensitive Skin Care',
  'Radiance Enhancement',
  'Complexion Improvement',
  'Cooling Effect',
  'Brightening Effect'
];

export default function ExplorePlants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPlants = Object.values(plantsData).filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || selectedCategory === null || 
                          plant.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="section-spacing container-width pt-24">
        <h1 className="section-title mb-4">Explore Medicinal Plants</h1>
        <p className="section-description mb-16">
          Discover traditional herbs and plants used in skincare and healing
        </p>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-3 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {filteredPlants.map((plant) => (
            <Link
              key={plant.id}
              to={`/explore-plants/${plant.id}`}
              className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{plant.name}</h3>
                <p className="text-gray-400 text-sm italic mb-4">{plant.scientificName}</p>
                <div className="flex flex-wrap gap-2">
                  {plant.category.map((cat, index) => (
                    <span key={index} className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
