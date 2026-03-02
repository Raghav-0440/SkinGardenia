import { AirVent, LandPlot, MapPin, Ruler, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";

export default function PlantBasic({size, region, climate, sunlight, soil}) {
  return (
    <div className="w-full sm:w-[400px] h-full sm:p-4 px-0 sm:gap-y-0 gap-y-5 flex flex-col justify-between">
      <BasicDetailsCard icon={<Ruler className="h-4 w-4"/>} title="Plant Size" description={size} />
      <BasicDetailsCard icon={<MapPin className="h-4 w-4"/>} title="Native Region" description={region} />
      <BasicDetailsCard icon={<AirVent className="h-4 w-4"/>} title="Preferred Climate" description={climate} />
      <BasicDetailsCard icon={<Sun className="h-4 w-4"/>} title="Required Sunlight" description={sunlight} />
      <BasicDetailsCard icon={<LandPlot className="h-4 w-4"/>} title="Required Soil" description={soil} />
    </div>
  );
}

export const BasicDetailsCard = ({icon, title, description}) => {
  return (
    <div className="w-full h-[80px] p-3 flex items-center glassmorphism rounded-lg shadow-lg">
      <Badge
        className="glassmorphism text-white text-sm p-[10px] hover:text-black hover:bg-white cursor-pointer rounded-full"
        variant="secondary"
      >
        {icon}
      </Badge>
      <div className="h-full flex flex-col font-medium justify-center text-white ml-3">
        <p className="text-sm text-primary">{title}</p>
        <p className="text-[14px]">{description}</p>
      </div>
    </div>
  );
}; 