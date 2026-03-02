import React from 'react';
import { Leaf, Pill, Bean, Citrus, TreePalm } from 'lucide-react';

interface PlantMedicinalProps {
  plantParts: string[];
  activeCompounds: string[];
  therapeutics: string[];
  dosages: string[];
}

const PlantMedicinal: React.FC<PlantMedicinalProps> = ({
  plantParts,
  activeCompounds,
  therapeutics,
  dosages,
}) => {
  const getBadgeIcon = (part: string) => {
    switch (part.toLowerCase()) {
      case 'whole plant':
        return <TreePalm className="h-4 w-4 mr-2" />;
      case 'leaves':
        return <Leaf className="h-4 w-4 mr-2" />;
      case 'seeds':
        return <Bean className="h-4 w-4 mr-2" />;
      case 'fruits':
        return <Citrus className="h-4 w-4 mr-2" />;
      default:
        return <Pill className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="w-full sm:w-[400px] h-full sm:p-4 px-0 flex flex-col sm:gap-y-0 gap-y-5 items-center justify-between">
      <fieldset className="w-full h-max p-3 flex items-center justify-between glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Parts used in medicinal
        </legend>

        {plantParts.map((part, index) => (
          <PlantPart key={index} icon={getBadgeIcon(part)} text={part} />
        ))}
      </fieldset>
      
      <fieldset className="w-full h-max p-3 flex items-center justify-evenly glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Active compounds in plants
        </legend>

        {activeCompounds.map((compound, index) => (
          <ActiveCompoundBadge key={index} text={compound} />
        ))}
      </fieldset>
      
      <fieldset className="w-full h-max p-3 flex items-center justify-evenly glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Therapeutic properties in plants
        </legend>

        {therapeutics.map((property, index) => (
          <ActiveCompoundBadge key={index} text={property} />
        ))}
      </fieldset>
      
      <fieldset className="w-full h-max p-3 flex items-center justify-evenly glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Dosage Form
        </legend>

        {dosages.map((dosage, index) => (
          <ActiveCompoundBadge key={index} text={dosage} />
        ))}
      </fieldset>
    </div>
  );
};

const PlantPart = ({ icon, text }) => {
  return (
    <div className="glassmorphism text-white text-[13px] px-4 py-2 hover:text-black hover:bg-white cursor-pointer rounded-full flex items-center">
      {icon}
      <span className="ml-1">{text}</span>
    </div>
  );
};

const ActiveCompoundBadge = ({ text }) => {
  return (
    <div className="text-[13px] px-3 glassmorphism text-white hover:text-black hover:bg-white cursor-pointer rounded-full">
      {text}
    </div>
  );
};

export default PlantMedicinal;