import { ArrowRight, MapPinned } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="border-b border-gray-200 bg-gray-50 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Left Side */}
        <div>
          <span className="inline-block rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
            AI-Assisted Civic Grievance Platform
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-900">
            Report Civic Issues
            <br />
            Smarter & Faster
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-600">
            CivicResolve enables citizens to report potholes, garbage,
            water leaks, and other civic issues with AI-powered
            categorization and real-time tracking.
          </p>

          <div className="mt-7 flex gap-3">
            <Link
              to="/register"
              className="btn-primary"
            >
              Report Issue
              <ArrowRight size={18} />
            </Link>

            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <div className="card w-80 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary-50">
              <MapPinned
                size={28}
                className="text-primary-700"
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Smart Reporting
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
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