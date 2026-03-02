import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Upload, X, Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Types for API response
interface Prediction {
  condition: string;
  probability: number;
}

interface AnalysisResult {
  top_predictions: Prediction[];
  confidence: "CONFIDENT" | "UNCERTAIN";
  decision: string;
  decision_tone?: "reassuring" | "neutral" | "caution";
  requires_review?: boolean;
}

const AISkinAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Call the /api/analyze-skin endpoint (the existing endpoint)
      // The backend will handle the prediction logic
      let response: Response;
      try {
        response = await fetch('http://localhost:3001/api/analyze-skin', {
          method: 'POST',
          body: formData,
        });
      } catch (fetchError) {
        // Handle network errors (backend not running, CORS, etc.)
        console.error('Fetch error:', fetchError);
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          throw new Error('Cannot connect to the server. Please make sure the backend server is running on port 3001.');
        }
        throw new Error('Network error: ' + (fetchError instanceof Error ? fetchError.message : 'Unknown error'));
      }

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response from server. Expected JSON format.');
      }
      
      console.log('Received data from server:', data);
      
      // Handle both new format (top_predictions) and old format
      let formattedResult: AnalysisResult;
      
      if (data.top_predictions && Array.isArray(data.top_predictions)) {
        // New format - use as is
        formattedResult = {
          top_predictions: data.top_predictions.map((p: any) => ({
            condition: p.condition || p.class || p.label || 'Unknown',
            probability: typeof p.probability === 'number' ? p.probability : parseFloat(p.probability) || 0
          })),
          confidence: data.confidence || (data.confidence_score > 0.7 ? "CONFIDENT" : "UNCERTAIN"),
          decision: data.decision || data.screening_result || "Screening completed"
        };
      } else if (data.top3_predictions && Array.isArray(data.top3_predictions)) {
        // Old format - convert to new format
        formattedResult = {
          top_predictions: data.top3_predictions.map((p: any) => ({
            condition: p.class || p.condition || 'Unknown',
            probability: typeof p.probability === 'number' ? p.probability : parseFloat(p.confidence) || 0
          })),
          confidence: data.confidence === "CONFIDENT" || (data.confidence && typeof data.confidence === 'number' && data.confidence > 0.7) ? "CONFIDENT" : "UNCERTAIN",
          decision: data.decision || "Screening completed"
        };
      } else if (data.result && data.result.predicted_class) {
        // Another old format - convert from result object
        const confidence = typeof data.result.confidence === 'number' ? data.result.confidence : 0.8;
        formattedResult = {
          top_predictions: [
            {
              condition: data.result.predicted_class,
              probability: confidence
            }
          ],
          confidence: confidence > 0.7 ? "CONFIDENT" : "UNCERTAIN",
          decision: "Screening completed"
        };
      } else if (data.predicted_class) {
        // Direct format
        const confidence = typeof data.confidence === 'number' ? data.confidence : 0.8;
        formattedResult = {
          top_predictions: [
            {
              condition: data.predicted_class,
              probability: confidence
            }
          ],
          confidence: confidence > 0.7 ? "CONFIDENT" : "UNCERTAIN",
          decision: data.decision || "Screening completed"
        };
      } else {
        console.error('Unexpected data format:', data);
        throw new Error('Invalid response format from server. Expected top_predictions array or predicted_class field.');
      }

      setAnalysisResult(formattedResult);
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Format probability as percentage
  const formatProbability = (prob: number): string => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  // Get color for probability bar based on value
  const getProbabilityColor = (prob: number): string => {
    if (prob >= 0.7) return 'bg-blue-500';
    if (prob >= 0.4) return 'bg-blue-400';
    return 'bg-blue-300';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              AI <span className="text-green-500">Skin Analyzer</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload a photo of your skin for preliminary screening insights. 
              This tool provides analysis, not medical diagnosis.
            </p>
          </div>

          {/* Upload Section */}
          <Card className="bg-[#1a1a1a] border-[#333] mb-6">
            <CardHeader>
              <CardTitle className="text-white text-xl">Upload Skin Image</CardTitle>
              <CardDescription className="text-gray-400">
                Supported formats: JPG, PNG (max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-[#444] rounded-lg p-12 text-center hover:border-green-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-20 h-20 bg-[#222] rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-300 mb-2 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm">Mobile-friendly upload</p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-[#333]">
                    <img
                      src={selectedImage}
                      alt="Uploaded skin image"
                      className="w-full h-auto max-h-96 object-contain bg-[#0a0a0a]"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-[#222] hover:bg-[#333] p-2 rounded-full transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Analyze Image
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="bg-red-900/20 border-red-900/50 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1">Analysis Error</h3>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <Card className="bg-[#1a1a1a] border-[#333] mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
                  <p className="text-gray-300 text-lg font-medium">Analyzing your image...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Display */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-6">
              {/* Analysis Result Card */}
              <Card className="bg-[#1a1a1a] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    Analysis Result
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Preliminary screening insights based on visual patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Clarity of Result */}
                  <div className="bg-[#222] rounded-lg p-4 border border-[#333]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 font-medium">Clarity of Result</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        analysisResult.confidence === "CONFIDENT"
                          ? "bg-green-900/30 text-green-400 border border-green-800"
                          : analysisResult.decision_tone === "reassuring"
                          ? "bg-blue-900/30 text-blue-400 border border-blue-800"
                          : "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                      }`}>
                        {analysisResult.confidence === "CONFIDENT" 
                          ? "Clear" 
                          : analysisResult.decision_tone === "reassuring"
                          ? "Most Likely Benign"
                          : "Uncertain"}
                      </span>
                    </div>
                    {analysisResult.confidence === "UNCERTAIN" && (
                      <p className="text-gray-400 text-sm mt-2">
                        {analysisResult.decision_tone === "reassuring"
                          ? "Visual patterns show some overlap, but the most likely condition appears benign."
                          : "The image shows overlapping features across multiple skin conditions."}
                      </p>
                    )}
                  </div>

                  {/* Top Predictions with Probability Bars */}
                  <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">
                      Top 3 Potential Conditions
                    </h3>
                    <div className="space-y-4">
                      {analysisResult.top_predictions.slice(0, 3).map((prediction, index) => (
                        <div key={index} className="bg-[#222] rounded-lg p-4 border border-[#333]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-200 font-medium">
                              {prediction.condition}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">
                              {formatProbability(prediction.probability)}
                            </span>
                          </div>
                          <div className="w-full bg-[#0a0a0a] rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full ${getProbabilityColor(prediction.probability)} transition-all duration-500`}
                              style={{ width: `${prediction.probability * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decision/Screening Result */}
                  {analysisResult.decision && (
                    <div className={`rounded-lg p-4 border ${
                      analysisResult.decision_tone === "caution"
                        ? 'bg-yellow-900/20 border-yellow-800/50'
                        : analysisResult.decision_tone === "reassuring"
                        ? 'bg-green-900/20 border-green-800/50'
                        : 'bg-blue-900/20 border-blue-800/50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          analysisResult.decision_tone === "caution"
                            ? 'text-yellow-400'
                            : analysisResult.decision_tone === "reassuring"
                            ? 'text-green-400'
                            : 'text-blue-400'
                        }`} />
                        <div>
                          <h4 className={`font-semibold mb-1 ${
                            analysisResult.decision_tone === "caution"
                              ? 'text-yellow-400'
                              : analysisResult.decision_tone === "reassuring"
                              ? 'text-green-400'
                              : 'text-blue-400'
                          }`}>
                            {analysisResult.decision_tone === "reassuring"
                              ? "Analysis Summary"
                              : analysisResult.requires_review
                              ? "Professional Review Recommended"
                              : "Screening Summary"}
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {analysisResult.decision}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medical Disclaimer */}
              <Card className="bg-[#1a1a1a] border-[#333]">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-gray-300 font-semibold mb-2">Important Disclaimer</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        This tool provides preliminary screening insights and is not a medical diagnosis. 
                        The analysis is based on visual patterns and should not replace professional 
                        medical evaluation. For persistent skin concerns, unusual changes, or if you 
                        have any doubts, please consult with a qualified dermatologist or healthcare provider.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AISkinAnalyzer;
