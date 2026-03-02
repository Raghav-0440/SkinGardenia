import React from 'react';
import { Ruler, MapPin, Cloud, Sun, Leaf } from 'lucide-react';

interface PlantBasicProps {
  size: string;
  region: string;
  climate: string;
  sunlight: string;
  soil: string;
}

const PlantBasic: React.FC<PlantBasicProps> = ({
  size,
  region,
  climate,
  sunlight,
  soil,
}) => {
  return (
    <div className="w-full sm:w-[400px] h-full sm:p-4 px-0 sm:gap-y-0 gap-y-5 flex flex-col justify-between">
      <BasicDetailsCard icon={<Ruler className="h-4 w-4"/>} title="Plant Size" description={size} />
      <BasicDetailsCard icon={<MapPin className="h-4 w-4"/>} title="Native Region" description={region} />
      <BasicDetailsCard icon={<Cloud className="h-4 w-4"/>} title="Preferred Climate" description={climate} />
      <BasicDetailsCard icon={<Sun className="h-4 w-4"/>} title="Required Sunlight" description={sunlight} />
      <BasicDetailsCard icon={<Leaf className="h-4 w-4"/>} title="Required Soil" description={soil} />
    </div>
  );
};

const BasicDetailsCard = ({icon, title, description}) => {
  return (
    <div className="w-full p-3 flex items-center glassmorphism rounded-lg shadow-lg">
      <div className="glassmorphism text-white text-sm p-[10px] hover:text-black hover:bg-white cursor-pointer rounded-full">
        {icon}
      </div>
      <div className="h-full flex flex-col font-medium justify-center text-white ml-3">
        <p className="text-sm text-primary">{title}</p>
        <p className="text-[14px]">{description}</p>
      </div>
    </div>
  );
};

export default PlantBasic;