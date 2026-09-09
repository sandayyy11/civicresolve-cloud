function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold">
              CivicResolve
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              AI-powered civic issue reporting platform that helps citizens
              report and track municipal problems efficiently.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>Home</li>
              <li>About</li>
              <li>Report Issue</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Built With
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>React</li>
              <li>Tailwind CSS</li>
              <li>AWS Cloud</li>
              <li>AI Integration</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © 2026 CivicResolve. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;