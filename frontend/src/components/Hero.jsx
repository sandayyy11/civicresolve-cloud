import { ArrowRight, MapPinned } from "lucide-react";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Side */}
        <div>
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            AI + AWS Powered Smart Civic Platform
          </span>

          <h1 className="text-5xl font-extrabold text-gray-900 mt-6 leading-tight">
            Report Civic Issues
            <br />
            Smarter & Faster
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            CivicResolve enables citizens to report potholes, garbage,
            water leaks, and other civic issues with AI-powered
            categorization and real-time tracking.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition">
              Report Issue
              <ArrowRight size={20} />
            </button>

            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <div className="bg-white rounded-3xl shadow-xl p-10 w-80">

            <MapPinned
              size={70}
              className="text-blue-600 mx-auto"
            />

            <h3 className="text-2xl font-bold text-center mt-6">
              Smart Reporting
            </h3>

            <p className="text-gray-600 text-center mt-4">
              AI identifies issue types and routes complaints to the
              correct department automatically.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;