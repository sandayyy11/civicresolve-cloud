function Features() {
  const features = [
    {
      title: "Upload Image",
      description: "Attach photos of civic issues."
    },
    {
      title: "Live Location",
      description: "Automatically capture issue location."
    },
    {
      title: "AI Detection",
      description: "AI categorizes complaints instantly."
    },
    {
      title: "Cloud Powered",
      description: "Built using AWS Cloud Services."
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-gray-900">
          Features
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-6"
            >
              <h3 className="text-base font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;