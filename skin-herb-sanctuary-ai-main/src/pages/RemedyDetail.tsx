import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Star, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { homeRemedies } from "../data/homeRemediesData";

const RemedyDetail = () => {
  const { id } = useParams();
  const [remedy, setRemedy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundRemedy = homeRemedies.find((r) => r.id === parseInt(id));
      setRemedy(foundRemedy);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-xl overflow-hidden h-96 animate-pulse">
              <div className="h-64 bg-white/10"></div>
              <div className="p-6">
                <div className="h-8 bg-white/10 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                <div className="h-4 bg-white/10 rounded mb-4 w-2/3"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-white/10 rounded w-1/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!remedy) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-6 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Remedy Not Found</h1>
            <p className="text-gray-400 mb-6">The remedy you're looking for doesn't exist or has been removed.</p>
            <Link to="/remedies" className="inline-flex items-center text-herb hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Remedies
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Link to="/remedies" className="inline-flex items-center text-herb hover:underline mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Remedies
          </Link>
          
          <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
            <div className="h-64 md:h-80 overflow-hidden">
              <img
                src={remedy.image}
                alt={remedy.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {remedy.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Clock className="h-4 w-4 text-herb" />
                  <span>Prep: 15 min</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.8 / 5.0</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                {remedy.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {remedy.category.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-white/5 text-gray-300 text-xs px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-white mb-3">Ingredients</h2>
                  <ul className="space-y-2">
                    {remedy.ingredients.map((ingredient, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start">
                        <span className="text-herb mr-2">•</span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-white mb-3">Instructions</h2>
                  <ol className="space-y-2">
                    {remedy.instructions.map((instruction, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start">
                        <span className="text-herb mr-2">{i + 1}.</span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">Benefits</h2>
                <ul className="space-y-3">
                  {remedy.benefits.map((benefit, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start">
                      <AlertCircle className="h-4 w-4 text-herb mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RemedyDetail;
