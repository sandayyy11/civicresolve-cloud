function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-2xl font-bold">
              CivicResolve
            </h2>

            <p className="mt-4 text-gray-400">
              AI-powered civic issue reporting platform that helps citizens
              report and track municipal problems efficiently.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>Home</li>
              <li>About</li>
              <li>Report Issue</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Built With
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>React</li>
              <li>Tailwind CSS</li>
              <li>AWS Cloud</li>
              <li>AI Integration</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">
          © 2026 CivicResolve. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;