
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

interface PlantCardProps {
  id: string;
  name: string;
  image: string;
  family: string;
  familyLatin: string;
  genus: string;
  size: string;
}

const PlantCard = ({ id, name, image, family, familyLatin, genus, size }: PlantCardProps) => {
  return (
    <div className="card-3d flex flex-col items-center">
      <div className="relative w-full pb-[100%] mb-2">
        <img 
          src={image} 
          alt={name} 
          className="absolute w-full h-full object-contain"
        />
        <button className="absolute top-2 right-2 p-2 rounded-full bg-[#222] hover:bg-[#333] transition-colors">
          <Bookmark size={20} className="text-herb" />
        </button>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      
      <div className="w-full grid grid-cols-1 gap-2 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Family</span>
          <span className="bg-[#222] px-3 py-1 rounded-full text-sm">{familyLatin}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Genus</span>
          <span className="bg-[#222] px-3 py-1 rounded-full text-sm">{genus}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Size</span>
          <span className="bg-[#222] px-3 py-1 rounded-full text-sm">{size}</span>
        </div>
      </div>
      
      <Link to={`/plant/${id}`} className="herb-button-outline w-full mt-4 flex items-center justify-center gap-2">
        View More
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  );
};

export default PlantCard;
