import React from 'react';
import { Heart, Shield } from 'lucide-react';

interface PlantBenefitsProps {
  ayushApplications: string[];
  healthBenefits: string[];
}

const PlantBenefits: React.FC<PlantBenefitsProps> = ({
  ayushApplications,
  healthBenefits,
}) => {
  return (
    <div className="w-full sm:w-[400px] h-full sm:p-4 px-0 flex flex-col sm:gap-y-0 gap-y-5 items-center justify-between">
      <fieldset className="w-full h-max p-3 flex items-center justify-between glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          AYUSH Applications
        </legend>

        {ayushApplications.map((application, index) => (
          <BenefitBadge key={index} icon={<Heart className="h-4 w-4 mr-2" />} text={application} />
        ))}
      </fieldset>
      
      <fieldset className="w-full h-max p-3 flex items-center justify-between glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Health Benefits
        </legend>

        {healthBenefits.map((benefit, index) => (
          <BenefitBadge key={index} icon={<Shield className="h-4 w-4 mr-2" />} text={benefit} />
        ))}
      </fieldset>
    </div>
  );
};

const BenefitBadge = ({ icon, text }) => {
  return (
    <div className="glassmorphism text-white text-[13px] px-4 py-2 hover:text-black hover:bg-white cursor-pointer rounded-full">
      {icon} {text}
    </div>
  );
};

export default PlantBenefits; 