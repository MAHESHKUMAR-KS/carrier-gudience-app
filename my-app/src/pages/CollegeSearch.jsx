import React, { useEffect, useRef, useState } from "react";
import { Search, MapPin, Star, GraduationCap } from "lucide-react";
import axios from "axios";

export default function CollegeSearch() {
  const [predictionData, setPredictionData] = useState({
    course: 'btech',
    community: "bc",
    city: "",
    cutoff: ""
  });
  const cityInputRef = useRef(null);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  // Load Google Places API for city autocomplete if key is provided
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return; // fallback to plain input

    const existing = document.getElementById('google-places-script');
    if (existing) {
      // already loaded
      initializeAutocomplete();
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-places-script';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.onload = initializeAutocomplete;
    document.body.appendChild(script);
  }, []);

  const initializeAutocomplete = () => {
    try {
      if (!window.google || !cityInputRef.current) return;
      const autocomplete = new window.google.maps.places.Autocomplete(cityInputRef.current, {
        types: ['(cities)'],
        componentRestrictions: { country: ['in'] },
        fields: ['address_components', 'name']
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const name = place?.name || '';
        setPredictionData((prev) => ({ ...prev, city: name }));
      });
    } catch (_e) {
      // ignore autocomplete errors; plain input still works
    }
  };

  const handlePredictionChange = (e) => {
    const { name, value } = e.target;
    setPredictionData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCutoff = () => {
    const cutoff = parseInt(predictionData.cutoff);
    if (!predictionData.cutoff || isNaN(cutoff) || cutoff < 70 || cutoff > 200) {
      return "Please input a valid cutoff from 70 to 200";
    }
    return null;
  };

  const handleSearch = async () => {
    // Reset messages
    setInfo("");

    if (!predictionData.cutoff.toString().trim()) {
      setError('Please enter cutoff marks');
      return;
    }
    const validation = validateCutoff();
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_BASE_URL = 'http://localhost:5001';
      const response = await axios.get(`${API_BASE_URL}/api/v1/college-cutoffs/search`, {
        params: {
          course: predictionData.course || 'btech',
          community: predictionData.community,
          marks: predictionData.cutoff,
          location: predictionData.city?.trim() || undefined,
          source: 'excel'
        }
      });

      const items = response.data.data || [];
      setResults(items);
      setInfo(`${items.length} college${items.length === 1 ? '' : 's'} found for ${predictionData.community.toUpperCase()}, course ${predictionData.course.toUpperCase()}, cutoff ≥ ${predictionData.cutoff}${predictionData.city ? `, near ${predictionData.city}` : ''}.`);
    } catch (err) {
      console.error('Error fetching college predictions:', err);
      setError('Failed to fetch college predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">College Search (TNEA Cutoff)</h1>
          <p className="text-gray-600">Find eligible Tamil Nadu colleges by cutoff, community, course, and city</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <select
                name="course"
                value={predictionData.course}
                onChange={handlePredictionChange}
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="btech">All Engineering (B.E./B.Tech)</option>
                <option value="cse">CSE (Computer Science & Engineering)</option>
                <option value="it">IT (Information Technology)</option>
                <option value="ece">ECE (Electronics & Communication)</option>
                <option value="eee">EEE (Electrical & Electronics)</option>
                <option value="mech">Mechanical Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="ai">AI (Artificial Intelligence)</option>
                <option value="aiml">AI & ML</option>
                <option value="data">Data Science</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Community</label>
              <select
                name="community"
                value={predictionData.community}
                onChange={handlePredictionChange}
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="bc">BC</option>
                <option value="oc">OC</option>
                <option value="mbc">MBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cutoff (70-200)</label>
              <input
                type="number"
                name="cutoff"
                min="70"
                max="200"
                value={predictionData.cutoff}
                onChange={handlePredictionChange}
                placeholder="Enter cutoff"
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Preferred City (Optional)</label>
              <input
                type="text"
                name="city"
                value={predictionData.city}
                onChange={handlePredictionChange}
                placeholder="e.g., Chennai, Coimbatore"
                ref={cityInputRef}
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {validateCutoff() && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <p className="text-red-700 text-sm">{validateCutoff()}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="-ml-1 mr-2 h-5 w-5" />
                  Get College Recommendations
                </>
              )}
            </button>
          </div>

          {info && !error && (
            <p className="text-sm text-gray-600 mt-4 text-center">{info}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="h-5 w-5 text-red-400">✕</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Eligible Colleges</h2>
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {results.map((college) => (
                <div key={college.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="pr-4">
                        <h3 className="text-xl font-semibold text-gray-900">{college.name}</h3>
                        <p className="mt-1.5 flex items-center text-sm text-gray-600">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {college.location}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">Community: {college.community || predictionData.community.toUpperCase()}</p>
                        <p className="mt-0.5 text-xs text-gray-500">Course: {college.course || predictionData.course.toUpperCase()}</p>
                      </div>
                      <div className="flex items-center bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg">
                        <Star className="text-yellow-400 mr-1.5" />
                        <span className="font-medium text-sm">{college.rating || '—'}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Cutoff</p>
                        <p className="text-lg font-semibold text-gray-900">{Number.isFinite(college.cutoff) ? college.cutoff : 'N/A'}/200</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Fees (Annual)</p>
                        <p className="text-lg font-semibold text-gray-900"><span className="inline mr-1">₹</span>{college.fees?.toLocaleString?.('en-IN') || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <GraduationCap className="mx-auto h-14 w-14 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No recommendations yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">Enter your cutoff, select your community, course and optionally a city, then click "Get College Recommendations".</p>
          </div>
        )}
      </div>
    </div>
  );
}
