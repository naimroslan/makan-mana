import Navbar from "~/components/menu/Navbar";

function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-10 space-y-8 text-center">
      <h2 className="text-3xl font-bold text-primary leading">
        Built with love,
        <br />
        shared with you.
      </h2>

      <p className="text-sm text-gray-500">
        Check out my portfolio at{" "}
        <a
          href="https://naimroslan.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary-dark transition"
        >
          naimroslan.dev
        </a>
      </p>

      {/* <p className="text-sm text-dark tracking-wide uppercase">Creations</p>

      <div className="space-y-4 w-full max-w-md">
        <div className="bg-primary rounded-2xl px-5 py-6">
          <h3 className="text-lg font-semibold text-light">MakanMana</h3>
          <p className="text-sm text-primary-light mt-1">
            A restaurant discovery app with filters and AI chat
          </p>
        </div>

        <div className="bg-primary rounded-2xl px-5 py-6">
          <h3 className="text-lg font-semibold text-light">Poop Counter Bot</h3>
          <p className="text-sm text-primary-light mt-1">
            Discord bot for fun stats and community engagement
          </p>
        </div>
      </div> */}

      <Navbar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
}

export default About;
