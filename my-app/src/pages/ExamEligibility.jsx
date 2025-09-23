import React, { useMemo, useState } from "react";
import { Search, BookOpen, GraduationCap } from "lucide-react";
import axios from "axios";

export default function ExamEligibility() {
  const [examData, setExamData] = useState({ overall: "", maths: "", physics: "", chemistry: "" });
  const [useAdvanced, setUseAdvanced] = useState(false);
  const [examError, setExamError] = useState("");
  const [results, setResults] = useState([]);
  const [examLoading, setExamLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  const handleExamChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const computeWeightedScore = useMemo(() => {
    const m = parseFloat(examData.maths);
    const p = parseFloat(examData.physics);
    const c = parseFloat(examData.chemistry);
    if (!useAdvanced || [m, p, c].some((v) => isNaN(v))) {
      const overall = parseFloat(examData.overall);
      return isNaN(overall) ? NaN : overall;
    }
    // Default weights: Maths 50%, Physics 25%, Chemistry 25%
    return 0.5 * m + 0.25 * p + 0.25 * c;
  }, [examData, useAdvanced]);

  const validateMarks = () => {
    const val = computeWeightedScore;
    if (isNaN(val) || val < 0 || val > 100) {
      return "Please input valid marks from 0 to 100";
    }
    return null;
  };

  const logistic = (x) => 1 / (1 + Math.exp(-x));
  const probabilityFromCutoff = (score, cutoff) => {
    const x = (score - cutoff) / 7; // fallback slope
    return Math.max(0, Math.min(1, logistic(x)));
  };
  const probabilityFromDistribution = (score, dist) => {
    if (!dist || typeof dist.mean !== 'number' || typeof dist.std !== 'number') return null;
    const slope = typeof dist.slope === 'number' ? dist.slope : 1.5;
    const z = (score - dist.mean) / Math.max(1e-6, dist.std);
    return Math.max(0, Math.min(1, logistic(slope * z)));
  };

  const colorForProb = (prob) => {
    if (prob >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (prob >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const barColor = (prob) => {
    if (prob >= 0.8) return 'bg-green-500';
    if (prob >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleExamSearch = async () => {
    const validation = validateMarks();
    if (validation) {
      setExamError(validation);
      return;
    }

    setExamLoading(true);
    setExamError('');

    try {
      const score = computeWeightedScore;
      const API_BASE_URL = 'http://localhost:5001';
      const response = await axios.get(`${API_BASE_URL}/api/v1/engineering-exams/eligible`, {
        params: { marks: score }
      });

      const exams = response.data.data || [];

      // Flatten into exam-university rows with probability
      const computed = exams.flatMap((exam) => {
        const uniList = Array.isArray(exam.universities) ? exam.universities : [];
        return uniList.map((u) => {
          const cutoff = typeof u.cutoff === 'number' ? u.cutoff : exam.minMarks;
          const distProb = probabilityFromDistribution(score, exam.distribution);
          const prob = distProb !== null ? distProb : probabilityFromCutoff(score, cutoff);
          return {
            examName: exam.name,
            university: u.name || String(u),
            cutoff,
            distribution: exam.distribution,
            probability: prob,
          };
        });
      }).sort((a, b) => b.probability - a.probability);

      setResults(computed);
      setDisplayCount(5);
    } catch (err) {
      console.error('Error fetching exam recommendations:', err);
      setExamError('Failed to fetch exam recommendations. Please try again.');
    } finally {
      setExamLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Success Probability</h1>
          <p className="text-gray-600">Enter your 12th marks to estimate success probability across exams and universities.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          {/* Align inputs and button nicely across breakpoints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Overall Percentage (0-100)</label>
              <input
                type="number"
                name="overall"
                min="0"
                max="100"
                value={examData.overall}
                onChange={handleExamChange}
                placeholder="e.g., 88"
                className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex items-center gap-2 pt-2">
                <input id="adv" type="checkbox" checked={useAdvanced} onChange={(e) => setUseAdvanced(e.target.checked)} className="h-4 w-4" />
                <label htmlFor="adv" className="text-sm text-gray-700">Use weighted subjects (Maths 50%, Physics 25%, Chemistry 25%)</label>
              </div>
            </div>
            <div className="flex md:justify-start justify-center md:items-center">
              <button
                onClick={handleExamSearch}
                disabled={examLoading}
                className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 ${
                  examLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {examLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Search className="-ml-1 mr-2 h-5 w-5" />
                    Calculate Probability
                  </>
                )}
              </button>
            </div>
          </div>

          {useAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {['maths','physics','chemistry'].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field} (0-100)</label>
                  <input
                    type="number"
                    name={field}
                    min="0"
                    max="100"
                    value={examData[field]}
                    onChange={handleExamChange}
                    className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          )}

          {validateMarks() && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <p className="text-red-700 text-sm">{validateMarks()}</p>
              </div>
            </div>
          )}
        </div>

        {examError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="h-5 w-5 text-red-400">✕</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{examError}</p>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Predicted Success Probability</h2>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Showing top {Math.min(displayCount, results.length)} of {results.length}</p>
              {results.length > 5 && (
                <div className="flex gap-2">
                  {displayCount > 5 && (
                    <button onClick={() => setDisplayCount(5)} className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Show top 5</button>
                  )}
                  {displayCount < results.length && (
                    <button onClick={() => setDisplayCount(results.length)} className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Show all</button>
                  )}
                </div>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {results.slice(0, displayCount).map((row, index) => (
                <div key={index} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="flex-shrink-0 h-4 w-4 text-blue-500" />
                          <span>{row.examName}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mt-1">{row.university}</h3>
                        <p className="mt-1 text-xs text-gray-500">Historical cutoff: {Math.round(row.cutoff)} / 100</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm border ${colorForProb(row.probability)}`}>
                        {Math.round(row.probability * 100)}%
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className={`${barColor(row.probability)} h-2.5 rounded-full`} style={{ width: `${Math.round(row.probability * 100)}%` }} />
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No predictions yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">Enter your marks and click "Calculate Probability".</p>
          </div>
        )}
      </div>
    </div>
  );
}
