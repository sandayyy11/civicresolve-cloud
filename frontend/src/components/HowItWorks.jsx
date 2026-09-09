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
    <section className="border-t border-gray-200 bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900">
          How CivicResolve Works
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          Reporting civic issues is simple, transparent, and efficient.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="card p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary-700 text-base font-semibold text-white">
                {step.number}
              </div>

              <h3 className="mt-5 text-base font-semibold text-gray-900">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
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