import React from 'react';
import { Ruler, MapPin, Cloud, Sun, Leaf } from 'lucide-react';

interface PlantBasicsProps {
  size: string;
  region: string;
  climate: string;
  sunlight: string;
  soil: string;
}

const PlantBasics: React.FC<PlantBasicsProps> = ({
  size,
  region,
  climate,
  sunlight,
  soil,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <Ruler className="w-5 h-5 text-green-500 mt-1" />
        <div>
          <h3 className="font-semibold text-gray-200">Size</h3>
          <p className="text-gray-400">{size}</p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <MapPin className="w-5 h-5 text-green-500 mt-1" />
        <div>
          <h3 className="font-semibold text-gray-200">Native Region</h3>
          <p className="text-gray-400">{region}</p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Cloud className="w-5 h-5 text-green-500 mt-1" />
        <div>
          <h3 className="font-semibold text-gray-200">Preferred Climate</h3>
          <p className="text-gray-400">{climate}</p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Sun className="w-5 h-5 text-green-500 mt-1" />
        <div>
          <h3 className="font-semibold text-gray-200">Required Sunlight</h3>
          <p className="text-gray-400">{sunlight}</p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Leaf className="w-5 h-5 text-green-500 mt-1" />
        <div>
          <h3 className="font-semibold text-gray-200">Soil</h3>
          <p className="text-gray-400">{soil}</p>
        </div>
      </div>
    </div>
  );
};

export default PlantBasics; 