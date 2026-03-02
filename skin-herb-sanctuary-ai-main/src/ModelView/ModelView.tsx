import React from 'react';

interface ModelViewProps {
  model: React.FC;
  dayNightMode?: boolean;
  file?: string;
}

const ModelView: React.FC<ModelViewProps> = ({ model: Model, dayNightMode = false, file }) => {
  return (
    <div className="w-full h-full">
      <Model />
    </div>
  );
};

export default ModelView; 