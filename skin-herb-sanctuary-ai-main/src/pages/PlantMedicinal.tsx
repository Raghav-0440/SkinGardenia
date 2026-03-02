import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Bean,
  Citrus,
  Leaf,
  PillBottle,
  ShieldPlus,
  TreePalm,
} from "lucide-react";
export default function PlantMedicinal({
  plantParts,
  activeCompounds,
  therapeutics,
  dosages,
}) {
  function getBadgeIcon(plantParts) {
    switch (plantParts) {
      case "Whole plants":
        return (<TreePalm className="h-4 w-4 mr-2" />);
        break;
      case "Leaves":
        return (<Leaf className="h-4 w-4 mr-2" />);
        break;
      case "Seeds":
        return (<Bean className="h-4 w-4 mr-2" />);
        break;
      case "Fruits":
        return (<Citrus className="h-4 w-4 mr-2" />);
        break;
      default:
        return (<PillBottle className="h-4 w-4 mr-2" />);
    }
  }

  return (
    <div className="w-full sm:w-[400px] h-full sm:p-4 px-0 flex flex-col sm:gap-y-0 gap-y-5 items-center justify-between">
      <fieldset className="w-full h-max p-3 flex items-center justify-between glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Part used in medicinal
        </legend>

        {plantParts.split(",").map((elem, index) => {
          return <PlantPart icon={getBadgeIcon(elem)} key={index} text={elem} />;
        })}
      </fieldset>
      <fieldset className="w-full h-max p-3 flex items-center justify-evenly glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Active compounds in plants
        </legend>

        {activeCompounds.map((elem, index) => {
          return <ActiveCompundBadge key={index} text={elem} />;
        })}
      </fieldset>
      <fieldset className="w-full h-max p-3 flex items-center justify-evenly glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Therapeutic properties in plants
        </legend>

        {therapeutics.map((elem, index) => {
          return <ActiveCompundBadge key={index} text={elem} />;
        })}
      </fieldset>
      <fieldset className="w-full h-max p-3 flex items-center justify-evenly glassmorphism rounded-lg shadow-lg flex-wrap gap-1 gap-y-2">
        <legend className="text-primary px-3 font-medium text-[14px]">
          Dosage Form
        </legend>

        {dosages.map((elem, index) => {
          return <ActiveCompundBadge key={index} text={elem} />;
        })}
      </fieldset>
    </div>
  );
}

export const PlantPart = ({ icon, text }) => {
  return (
    <Badge
      className="glassmorphism text-white text-[13px] px-4 py-2 hover:text-black hover:bg-white cursor-pointer rounded-full"
      variant="secondary"
    >
      {icon} {text}
    </Badge>
  );
};

export const ActiveCompundBadge = ({ text }) => {
  return (
    <Badge
      className="text-[13px] px-3 glassmorphism text-white hover:text-black hover:bg-white cursor-pointer rounded-full"
      variant="secondary"
    >
      {text}
    </Badge>
  );
}; 