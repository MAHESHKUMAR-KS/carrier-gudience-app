import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const STREAM_SUBJECTS = {
  Science: ["Physics", "Chemistry", "Maths", "Biology"],
  ComputerScience: ["Physics", "Chemistry", "Maths", "Computer Science"],
  Commerce: ["Accountancy", "Business Studies", "Economics"],
  Arts: ["History", "Political Science", "Geography"],
};

const CollegeRecommendation = ({ userData }) => {
  const [formData, setFormData] = useState({
    stream: userData?.stream || "Science",
    marks: userData?.marks || {},
    twelfthMarks: userData?.twelfthMarks || "",
    interests: userData?.interests?.join(", ") || "",
    location: userData?.location || "",
    budget: userData?.budget || "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(!userData?.profileComplete);

  useEffect(() => {
    if (userData) {
      setFormData({
        stream: userData.stream || "Science",
        marks: userData.marks || {},
        interests: userData.interests?.join(", ") || "",
        location: userData.location || "",
        budget: userData.budget || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "stream" && { marks: {} }),
    }));
  };

  const handleMarksChange = (subject, value) => {
    setFormData((prev) => ({
      ...prev,
      marks: { ...prev.marks, [subject]: value },
    }));
  };

  const FinancialBadge = ({ score }) => {
    let colorClass = "";
    let label = "";

    if (score >= 8) {
      colorClass = "bg-green-100 text-green-800";
      label = "Stable";
    } else if (score >= 5) {
      colorClass = "bg-yellow-100 text-yellow-800";
      label = "Moderate";
    } else {
      colorClass = "bg-red-100 text-red-800";
      label = "Limited";
    }

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
      >
        {label} • {score}/10
      </span>
    );
  };

  // 🔹 Mock Data with Financial Score + Sorting
  const getMockColleges = useCallback(() => {
    const stream = formData.stream.toLowerCase();
    const mockColleges = [
      {
        id: 1,
        name: `${stream.charAt(0).toUpperCase() + stream.slice(1)} College of Excellence`,
        location: formData.location || "Major City",
        courses: [`B.Sc in ${stream}`, `B.Tech in ${stream}`, `B.A. in ${stream}`],
        matchScore: Math.floor(Math.random() * 30) + 70,
        cutoff: 85 + Math.floor(Math.random() * 15),
        financialDetails: {
          annualRevenue: 100 + Math.floor(Math.random() * 100),
          fundingSources: ["Private Trust", "Student Fees"],
          score: 8 + Math.floor(Math.random() * 3),
        },
        fees: { min: 50000, max: 150000, currency: "INR" },
        rating: (Math.random() * 2 + 3).toFixed(1),
      },
      {
        id: 2,
        name: "National Institute of Technology",
        location: formData.location || "State Capital",
        courses: ["B.Tech", "M.Tech", "Ph.D"],
        matchScore: Math.floor(Math.random() * 20) + 60,
        cutoff: 75 + Math.floor(Math.random() * 20),
        financialDetails: {
          annualRevenue: 200 + Math.floor(Math.random() * 100),
          fundingSources: ["Government", "Research Grants", "Fees"],
          score: 9 + Math.floor(Math.random() * 2),
        },
        fees: { min: 100000, max: 250000, currency: "INR" },
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      },
    ];

    const userMarks =
      Object.values(formData.marks).reduce((a, b) => a + Number(b), 0) /
        Object.values(formData.marks).length || 0;

    return mockColleges
      .filter((college) => !userMarks || userMarks >= college.cutoff - 10)
      .sort((a, b) => b.financialDetails.score - a.financialDetails.score);
  };

  const validateForm = () => {
    if (!formData.twelfthMarks || isNaN(formData.twelfthMarks) || formData.twelfthMarks < 0 || formData.twelfthMarks > 100) {
      setError("Please enter a valid 12th standard percentage (0-100)");
      return false;
    }
    
    const subjectMarks = Object.values(formData.marks);
    if (subjectMarks.length !== STREAM_SUBJECTS[formData.stream].length) {
      setError("Please enter marks for all subjects");
      return false;
    }
    
    const invalidMarks = subjectMarks.some(mark => 
      mark === "" || isNaN(mark) || mark < 0 || mark > 100
    );
    
    if (invalidMarks) {
      setError("Please enter valid marks (0-100) for all subjects");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockColleges = getMockColleges();
      setResults(mockColleges);
      setShowForm(false);
    } catch (err) {
      setError("Failed to load recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">College Recommendations</h2>

      {!userData?.profileComplete && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-800">
            Complete your profile to get better recommendations!
          </p>
          <Link
            to="/profile"
            className="mt-2 inline-block bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block font-medium">12th Stream:</label>
            <select
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              className="w-full border rounded p-2"
              aria-label="Select 12th Stream"
              required
            >
              <option value="Science">Science</option>
              <option value="ComputerScience">Computer Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">
              12th Standard Marks (%):
            </label>
            <input
              type="number"
              name="twelfthMarks"
              value={formData.twelfthMarks}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="Enter percentage"
              min="0"
              max="100"
              step="0.01"
              aria-label="12th Standard Marks Percentage"
              required
            />
          </div>

          {/* Subject-wise Marks */}
          <div>
            <label className="block font-medium">Subject-wise Marks:</label>
            <div className="grid grid-cols-2 gap-4">
              {STREAM_SUBJECTS[formData.stream].map((subject) => (
                <div key={subject}>
                  <label>{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.marks[subject] || ""}
                    onChange={(e) =>
                      handleMarksChange(subject, e.target.value)
                    }
                    className="w-full border rounded p-2"
                    aria-label={`Marks for ${subject}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? "Searching..." : "Get Recommendations"}
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Update Preferences
        </button>
      )}

      {error && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">
            Recommended Colleges
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((college) => (
              <div
                key={college.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold">{college.name}</h4>
                  <span className="text-yellow-500 font-semibold">
                    {college.rating} ★
                  </span>
                </div>
                <FinancialBadge score={college.financialDetails.score} />
                <p className="text-gray-600">📍 {college.location}</p>
                <p className="mt-2 text-sm">
                  Revenue: ₹{college.financialDetails.annualRevenue} Cr
                </p>
                <div className="mt-3">
                  <strong>Programs:</strong>{" "}
                  {college.courses.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeRecommendation;
