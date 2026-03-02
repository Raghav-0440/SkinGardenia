import React from 'react';
import { Heart, Shield } from 'lucide-react';

interface PlantVisualsProps {
  image: string;
  name: string;
  onAyushClick: () => void;
  onHealthClick: () => void;
}

const PlantVisuals: React.FC<PlantVisualsProps> = ({
  image,
  name,
  onAyushClick,
  onHealthClick,
}) => {
  return (
    <div className="w-full sm:w-[400px] h-full sm:p-4 px-0 flex flex-col items-center justify-between">
      <div className="w-full h-[250px] glassmorphism rounded-lg shadow-lg overflow-hidden mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="w-full flex justify-between gap-4 mt-2">
        <button
          onClick={onAyushClick}
          className="flex-1 glassmorphism text-white text-[13px] px-4 py-2 hover:text-black hover:bg-white cursor-pointer rounded-full flex items-center justify-center"
        >
          <Heart className="h-4 w-4 mr-2" />
          AYUSH Applications
        </button>
        
        <button
          onClick={onHealthClick}
          className="flex-1 glassmorphism text-white text-[13px] px-4 py-2 hover:text-black hover:bg-white cursor-pointer rounded-full flex items-center justify-center"
        >
          <Shield className="h-4 w-4 mr-2" />
          Health Benefits
        </button>
      </div>
    </div>
  );
};

export default PlantVisuals;