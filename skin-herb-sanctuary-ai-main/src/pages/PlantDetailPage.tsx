import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlantDetail from "./PlantDetail";

const PlantDetailPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PlantDetail />
      </main>
      <Footer />
    </div>
  );
};

export default PlantDetailPage;
