import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* ✅ Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Right Career Path 🚀
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Get AI-powered college recommendations, career guidance & personalized roadmaps after 12th.
        </p>
        <div className="space-x-4">
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200">
            Get Started
          </button>
          <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-300">
            Ask CareerBot 🤖
          </button>
        </div>
      </section>

      {/* ✅ Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            🎓 <h3 className="text-xl font-semibold mb-2">College Finder</h3>
            <p>Suggests best colleges based on your marks & budget.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            💼 <h3 className="text-xl font-semibold mb-2">Career Planner</h3>
            <p>Roadmap for your dream job after graduation.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            🤖 <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
            <p>Clear your doubts instantly with CareerBot.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            📊 <h3 className="text-xl font-semibold mb-2">Scholarships</h3>
            <p>Discover financial aid & opportunities available for you.</p>
          </div>
        </div>
      </section>

      {/* ✅ Colleges & Career Highlights */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-10">Top Recommendations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-2">Anna University</h3>
            <p>High revenue | Strong placements</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-2">PSG Tech</h3>
            <p>Great ROI | Research oriented</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-2">SSN College</h3>
            <p>Excellent career support</p>
          </div>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p>© 2025 Career Guidance App | All Rights Reserved</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Contact</a>
          <a href="#" className="hover:text-white">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
