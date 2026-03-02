import React from 'react';

interface PlantCanvasProps {
  file?: string;
}

const PlantCanvas: React.FC<PlantCanvasProps> = ({ file }) => {
  return (
    <div className="w-full h-full relative">
      <img 
        src={file || '/placeholder-plant.jpg'} 
        alt="Plant" 
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );
};

export default PlantCanvas; 