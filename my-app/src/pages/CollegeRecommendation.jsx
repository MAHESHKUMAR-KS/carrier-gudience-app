import React, { useState } from "react";
import { Search, MapPin, ChevronDown, Star, ChevronRight, GraduationCap } from "lucide-react";

export default function CollegeRecommendation() {
  const [predictionData, setPredictionData] = useState({
    community: "bc",
    city: "",
    cutoff: "",
  });

  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  // Handle input changes
  const handlePredictionChange = (e) => {
    const { name, value } = e.target;
    setPredictionData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate cutoff
  const validateCutoff = () => {
    const cutoff = parseInt(predictionData.cutoff, 10);
    if (!predictionData.cutoff || cutoff < 70 || cutoff > 200) {
      return "Please enter a valid cutoff between 70 and 200";
    }
    return null;
  };

  // Search colleges
  const handleSearch = async () => {
    const validationError = validateCutoff();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const API_BASE_URL = "http://localhost:5001";

      const params = new URLSearchParams({
        course: "btech",
        community: predictionData.community,
        marks: predictionData.cutoff,
        location: predictionData.city,
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/college-cutoffs/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch colleges");

      const data = await response.json();
      const colleges = data.data || [];

      if (colleges.length === 0) {
        setError("No colleges found matching your criteria.");
      }

      const formattedResults = colleges.map((c, index) => ({
        id: c.id || `college-${index}`,
        name: c.collegeName || c.name || `College ${index + 1}`,
        location: c.location || "Tamil Nadu, India",
        rating: c.rating || 4.0,
        cutoff: c.cutoff,
        fees: c.fees || 0,
        specializations: c.specializations || ["Computer Science", "Electronics"],
        course: c.course || "BTech",
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch colleges. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream College</h1>
          <p className="text-gray-600">Get personalized college recommendations based on your preferences</p>
        </div>

        {/* Prediction Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">PREDICT YOUR COLLEGE</h2>
          </div>

          <div className="space-y-6">
            {/* Community */}
            <div className="space-y-2">
              <div className="relative">
                <select
                  name="community"
                  value={predictionData.community}
                  onChange={handlePredictionChange}
                  className="block w-full pl-3 pr-10 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bc">BC</option>
                  <option value="oc">OC</option>
                  <option value="mbc">MBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <div className="relative">
                <select
                  name="city"
                  value={predictionData.city}
                  onChange={handlePredictionChange}
                  className="block w-full pl-3 pr-10 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Cities</option>
                  <option value="chennai">Chennai</option>
                  <option value="coimbatore">Coimbatore</option>
                  <option value="madurai">Madurai</option>
                  <option value="salem">Salem</option>
                  <option value="trichy">Trichy</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Cutoff */}
            <div className="space-y-2">
              <div className="relative">
                <div className="bg-black text-white px-4 py-3 rounded-t-lg">
                  <span className="text-white font-medium">Cutoff</span>
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-b-lg">
                  <input
                    type="number"
                    name="cutoff"
                    min="70"
                    max="200"
                    value={predictionData.cutoff}
                    onChange={handlePredictionChange}
                    placeholder="Enter cutoff marks (70-200)"
                    className="block w-full bg-transparent border-0 p-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Cutoff = Maths + (Physics + Chemistry) / 2
              </p>
            </div>

            {/* Validation */}
            {validateCutoff() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <p className="text-red-700 text-sm">{validateCutoff()}</p>
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="-ml-1 mr-2 h-5 w-5" />
                    Search Colleges
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {results.length} Predicted {results.length === 1 ? "College" : "Colleges"}
              </h2>
              <div className="w-full sm:w-auto flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <div className="relative w-full sm:w-40">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="cutoff">Cutoff</option>
                    <option value="fees">Fees</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {results.map((college) => (
                <div
                  key={college.id}
                  className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="pr-4">
                        <h3 className="text-xl font-semibold text-gray-900">{college.name}</h3>
                        <p className="mt-1.5 flex items-center text-sm text-gray-600">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {college.location}
                        </p>
                      </div>
                      <div className="flex items-center bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg">
                        <Star className="text-yellow-400 mr-1.5" />
                        <span className="font-medium text-sm">{college.rating}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Cutoff ({college.course})</p>
                        <p className="text-lg font-semibold text-gray-900">{college.cutoff}/200</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Fees (Annual)</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{college.fees?.toLocaleString("en-IN") || "N/A"}
                        </p>
                      </div>
                    </div>

                    {college.specializations?.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 mb-2">Specializations</p>
                        <div className="flex flex-wrap gap-2">
                          {college.specializations.slice(0, 3).map((spec, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {spec}
                            </span>
                          ))}
                          {college.specializations.length > 3 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{college.specializations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        View Details
                        <ChevronRight className="ml-2 -mr-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <GraduationCap className="mx-auto h-14 w-14 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No predictions yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Fill in your details above and click "Search Colleges" to get personalized college predictions.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
