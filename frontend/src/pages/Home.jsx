import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Zap,
  Droplets,
  Trash2,
  Brain,
  Users,
  Bell,
  BarChart3,
  CheckCircle2,
  Upload,
  Navigation,
  Cpu,
  Shield,
  Building2,
  ChevronRight,
  Network,
  Cloud,
  Route,
  Eye,
} from "lucide-react";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";
import SmartCityVisual from "../components/landing/SmartCityVisual";

function Home() {
  const [activeIssue, setActiveIssue] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIssue(Math.floor(Math.random() * 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      num: "01",
      icon: <Upload size={20} />,
      title: "Report",
      desc: "Citizen submits a civic complaint with location and photo.",
    },
    {
      num: "02",
      icon: <Brain size={20} />,
      title: "AI Analysis",
      desc: "AI identifies the complaint category and suggests priority.",
    },
    {
      num: "03",
      icon: <Route size={20} />,
      title: "Smart Assignment",
      desc: "The appropriate municipal worker is automatically selected.",
    },
    {
      num: "04",
      icon: <CheckCircle2 size={20} />,
      title: "Resolution",
      desc: "The issue is resolved, tracked, and verified by the citizen.",
    },
  ];

  const features = [
    { icon: <Brain size={22} />, title: "AI-Assisted Categorization", desc: "Automatically identifies issue types and priority levels." },
    { icon: <Route size={22} />, title: "Smart Worker Assignment", desc: "Routes complaints to the right municipal department." },
    { icon: <MapPin size={22} />, title: "Location-Based Reporting", desc: "Captures exact geographic coordinates of civic issues." },
    { icon: <Upload size={22} />, title: "Image Upload", desc: "Attach photos to help identify the severity of issues." },
    { icon: <Eye size={22} />, title: "Real-Time Tracking", desc: "Monitor complaint status from submission to resolution." },
    { icon: <Users size={22} />, title: "Worker Management", desc: "Municipal workforce overview and availability tracking." },
    { icon: <Bell size={22} />, title: "Notifications", desc: "Automatic status updates for citizens and workers." },
    { icon: <BarChart3 size={22} />, title: "Analytics", desc: "Platform-wide insights into complaint patterns and trends." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.04),transparent_50%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:py-24">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-medium text-primary-700">
              <Cpu size={14} />
              AI-Powered · Cloud-Based · Municipal Platform
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
              Report it.
              <br />
              <span className="text-primary-600">Track it.</span>
              <br />
              Resolve it.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 lg:text-lg">
              CivicResolve connects citizens, AI, and municipal workers to identify, route, track, and resolve civic issues — quickly and transparently.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 sm:w-auto"
              >
                Report an Issue
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:w-auto"
              >
                How It Works
                <ChevronRight size={18} />
              </a>
            </div>
          </div>

          {/* Right: Smart City Visual */}
          <div className="flex-1 lg:flex lg:justify-end">
            <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-navy-900 shadow-2xl lg:h-[460px] lg:w-[520px]">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 via-navy-900/60 to-navy-950" />

              <SmartCityVisual className="absolute inset-0 h-full w-full" />

              {/* Bottom status bar */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-slate-300">System Active</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>24/7 Monitoring</span>
                    <span className="hidden sm:inline">AI Routing Enabled</span>
                  </div>
                </div>
              </div>

              {/* Issue cards overlay */}
              <div className="absolute left-4 top-4 space-y-2">
                {[
                  { label: "Road Issue", color: "bg-primary-600", status: "Active", statusColor: "text-emerald-400" },
                  { label: "Water Leak", color: "bg-cyan-500", status: "Reported", statusColor: "text-amber-400" },
                  { label: "Garbage", color: "bg-amber-500", status: "In Progress", statusColor: "text-primary-400" },
                  { label: "Electricity", color: "bg-yellow-500", status: "Resolved", statusColor: "text-emerald-400" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all backdrop-blur-sm ${
                      activeIssue === i ? "bg-white/15 ring-1 ring-white/20" : "bg-white/5"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="font-medium text-slate-200">{item.label}</span>
                    <span className={`${item.statusColor}`}>● {item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PLATFORM STRIP ============ */}
      <section className="border-y border-slate-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: <Brain size={18} />, label: "AI-Assisted", sub: "Smart Routing" },
              { icon: <Navigation size={18} />, label: "Real-Time", sub: "Issue Tracking" },
              { icon: <Cloud size={18} />, label: "Cloud", sub: "AWS Powered" },
              { icon: <Shield size={18} />, label: "Secure", sub: "JWT Protected" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900">From Report to Resolution</h2>
          <p className="mt-3 text-base text-slate-500">
            Four simple steps connect citizens, AI, and municipal workers.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[60%] top-10 hidden h-[2px] w-[70%] bg-gradient-to-r from-primary-200 to-primary-100 md:block" />
                )}

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 ring-8 ring-white">
                  <div className="text-primary-600">{step.icon}</div>
                </div>

                <div className="mt-2 text-sm font-semibold text-primary-600">{step.num}</div>
                <h3 className="mt-3 text-lg font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="scroll-mt-20 border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900">Platform Capabilities</h2>
            <p className="mt-3 text-base text-slate-500">
              Everything needed to manage civic grievances efficiently.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div key={i} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md hover:shadow-primary-100/50">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-navy-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SMART CITY CONNECTION ============ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-navy-900">
                A Connected City<br />
                <span className="text-primary-600">Starts with a Report</span>
              </h2>

              <div className="mt-8 space-y-6">
                {[
                  { icon: <Users size={20} />, title: "Citizen Reports", desc: "Anyone can report an issue in seconds." },
                  { icon: <Brain size={20} />, title: "AI Processes", desc: "AI categorizes and prioritizes automatically." },
                  { icon: <Users size={20} />, title: "Worker Resolves", desc: "The right worker is assigned and notified." },
                  { icon: <CheckCircle2 size={20} />, title: "City Improves", desc: "Resolution is tracked and verified." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-navy-900">{item.title}</h4>
                      <p className="mt-0.5 text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="btn-primary mt-8 shadow-lg shadow-primary-600/20"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative h-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-navy-900 shadow-xl">
              <SmartCityVisual className="h-full w-full" simplified />
            </div>
          </div>
        </div>
      </section>

      {/* ============ PLATFORM INFRASTRUCTURE ============ */}
      <section className="border-t border-slate-100 bg-navy-950 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-800/40 bg-primary-900/30 px-3.5 py-1.5 text-xs font-medium text-primary-300">
              <Cloud size={14} />
              Designed for Scale
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Built for a Connected City
            </h2>
            <p className="mt-3 text-base text-slate-400">
              Modern cloud infrastructure powering municipal operations.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Cpu size={22} />, title: "React + Vite", desc: "Fast, modern frontend" },
              { icon: <Network size={22} />, title: "Node.js + Express", desc: "Scalable API backend" },
              { icon: <Cloud size={22} />, title: "MongoDB Atlas", desc: "Cloud database" },
              { icon: <Brain size={22} />, title: "AI Integration", desc: "Smart categorization" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]">
                <div className="text-primary-400">{item.icon}</div>
                <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden bg-navy-900 py-20">
        <div className="absolute inset-0 opacity-[0.03]">
          <SmartCityVisual className="h-full w-full" simplified />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Have a Civic Issue?
          </h2>
          <p className="mt-3 text-lg text-slate-400">
            Make it visible. One report connects you to the right people.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 hover:shadow-xl sm:w-auto"
            >
              Report an Issue <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

export default Home;