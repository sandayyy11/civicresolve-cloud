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
    <section className="py-20 bg-white">

      <h2 className="text-4xl font-bold text-center mb-12">
        Features
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">

        {features.map((feature, index) => (

          <div
            key={index}
            className="shadow-lg rounded-xl p-6 hover:shadow-2xl transition"
          >

            <h3 className="text-xl font-semibold mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-600">
              {feature.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;