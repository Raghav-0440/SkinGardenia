import React, { memo } from "react";
// import Aloevera from "../assets/plantsImage/Aloevera.png";
import Aloevera from "../assets/plantsImage/ginger.png";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Bot,
  Leaf,
  Sparkle,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import HoverTip from "@/Landing/HoverTip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

function PlantCard({ plantDetails, ...props }) {
  return (
    <div className="relative w-[250px] h-[350px] flex flex-col justify-end">
      <img
        className="absolute -top-2 translate-x-[50%] right-[50%] z-10"
        src={plantDetails?.ai_images?.length > 0 ? plantDetails.ai_images[0] : Aloevera}
        alt={plantDetails.common_names[0]}
        width={180}
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="absolute top-10 w-max">
            {/* smart pick */}
            {/* <Badge
              variant="secondary"
              className="glassmorphism text-white hover:text-black hover:bg-white rounded-full p-2"
            >
              <WandSparkles className="w-4 h-4" />
              
            </Badge> */}
          </TooltipTrigger>
          <TooltipContent className="rounded-full font-medium text-[12px] glassmorphism text-white shadow-xl mb-1">
            <p>Ai Suggested</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="relative w-[250px] h-[270px] flex flex-col items-center glassmorphism rounded-lg border-none p-5 leaf-card">
        <Bookmark className="w-4 h-4 absolute right-4 top-[70px] text-white" />
        <div className="w-full h-[70%] flex flex-col items-center justify-between mt-[70px]">
          <p className="text-white font-medium text-lg">{plantDetails.common_names[0]}</p>
          <div className="w-full flex items-center justify-between">
            <Label className="text-white">Family</Label>
            <Badge className="glassmorphism text-white" variant={"outline"}>
              {plantDetails.family}
            </Badge>
          </div>
          <div className="w-full flex items-center justify-between">
            <Label className="text-white">Genus</Label>
            <Badge className="glassmorphism text-white" variant={"outline"}>
              {plantDetails.genus}
            </Badge>
          </div>
          <div className="w-full flex items-center justify-between">
            <Label className="text-white">Size</Label>
            <Badge className="glassmorphism text-white" variant={"outline"}>
              {plantDetails.size_unit ? plantDetails.size_unit : "8 meter"}
            </Badge>
          </div>
          <Link to={`/explore-plants/${plantDetails.plant_id}`} >
            <Badge
              className="cursor-pointer py-2 px-4 relative -bottom-1"
              variant="outline"
            >
              View More <Leaf className="w-3 h-3 ml-1" />
            </Badge>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(PlantCard) 