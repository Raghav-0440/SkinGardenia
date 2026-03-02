import React from 'react';
import { ShieldPlus, Activity } from 'lucide-react';

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
    <div className="relative">
      <div className="aspect-square rounded-lg overflow-hidden mb-6">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col space-y-4">
        <button
          onClick={onAyushClick}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
        >
          <ShieldPlus className="w-5 h-5" />
          <span>AYUSH Applications</span>
        </button>
        
        <button
          onClick={onHealthClick}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
        >
          <Activity className="w-5 h-5" />
          <span>Health Benefits</span>
        </button>
      </div>
    </div>
  );
};

export default PlantVisuals; 