import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { plantsData } from '@/data/plantsData';
import PlantBasic from '@/components/PlantBasic';
import PlantMedicinal from '@/components/PlantMedicinal';
import PlantBenefits from '@/components/PlantBenefits';
import PlantVisuals from '@/components/PlantVisuals';
import { ArrowLeft } from 'lucide-react';

const PlantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showAyushModal, setShowAyushModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);

  // Find the plant by ID in the plantsData object
  const plant = id ? Object.values(plantsData).find(p => p.id === parseInt(id)) : null;

  if (!plant) {
    return (
      <div className="min-h-screen bg-[#111] text-white">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-center">Plant not found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <Navbar />
      <main className="container mx-auto py-6 px-6 pt-24">
        {/* Back to Plants Button */}
        <div className="mb-10 px-4">
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 text-herb hover:text-herb-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Plants</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Section - Plant Basics */}
          <div>
            <PlantBasic
              size={plant.size}
              region={plant.nativeRegion}
              climate={plant.climate}
              sunlight={plant.sunlight}
              soil={plant.soil}
            />
          </div>

          {/* Middle Section - Plant Header & Visuals */}
          <div className="flex flex-col items-center">
            <div className="mb-16 text-center">
              <h1 className="text-3xl font-bold mb-2">{plant.name}</h1>
              <p className="text-gray-400 italic">{plant.scientificName}</p>
            </div>
            <PlantVisuals
              image={plant.image}
              name={plant.name}
              onAyushClick={() => setShowAyushModal(true)}
              onHealthClick={() => setShowHealthModal(true)}
            />
          </div>

          {/* Right Section - Additional Information */}
          <div>
            <PlantMedicinal
              plantParts={plant.partsUsed}
              activeCompounds={plant.activeCompounds}
              therapeutics={plant.therapeuticProperties}
              dosages={plant.dosageForms}
            />
          </div>
        </div>

        {/* AYUSH Modal */}
        {showAyushModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">AYUSH Applications</h2>
                <button 
                  onClick={() => setShowAyushModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {plant.ayushApplications.map((application, index) => (
                  <div key={index} className="w-full h-max mt-5 border border-[#333] relative rounded-lg p-5">
                    <div className="text-green-500 text-xs px-3 rounded-full absolute -top-3 left-5 bg-[#1a1a1a]">
                      AYUSH Application
                    </div>
                    <p className="text-white">{application}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Health Benefits Modal */}
        {showHealthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Health Benefits</h2>
                <button 
                  onClick={() => setShowHealthModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {plant.healthBenefits.map((benefit, index) => (
                  <div key={index} className="w-full h-max mt-5 border border-[#333] relative rounded-lg p-5">
                    <div className="text-green-500 text-xs px-3 rounded-full absolute -top-3 left-5 bg-[#1a1a1a]">
                      Benefit
                    </div>
                    <p className="text-white">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlantDetail;