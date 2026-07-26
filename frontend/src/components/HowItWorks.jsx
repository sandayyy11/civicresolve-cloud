function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Report an Issue",
      description: "Citizens report civic issues by submitting a description, location, and photo.",
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "AI helps categorize the issue and suggests its priority level.",
    },
    {
      number: "03",
      title: "Authority Assignment",
      description: "The complaint is forwarded to the appropriate municipal department.",
    },
    {
      number: "04",
      title: "Track Resolution",
      description: "Citizens receive updates and can monitor the complaint status until it is resolved.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-4">
          How CivicResolve Works
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Reporting civic issues is simple, transparent, and efficient.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                {step.number}
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;