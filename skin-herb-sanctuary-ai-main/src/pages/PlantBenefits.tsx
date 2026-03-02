import React from 'react';
import { ShieldPlus, Activity } from 'lucide-react';

interface PlantBenefitsProps {
  ayushBenefits: string[];
  healthBenefits: string[];
}

const PlantBenefits: React.FC<PlantBenefitsProps> = ({
  ayushBenefits,
  healthBenefits,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <ShieldPlus className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-gray-200">AYUSH Applications</h3>
        </div>
        <ul className="space-y-2">
          {ayushBenefits.map((benefit, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-green-500">•</span>
              <span className="text-gray-400">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-gray-200">Health Benefits</h3>
        </div>
        <ul className="space-y-2">
          {healthBenefits.map((benefit, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-green-500">•</span>
              <span className="text-gray-400">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlantBenefits; 