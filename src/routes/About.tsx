import Navbar from "../components/Menu/Navbar";

function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-start px-6 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-primary leading-snug">
        Thank you for using
        <br />
        my creations
      </h2>

      {/* <p className="text-sm text-dark tracking-wide uppercase">Creations</p>

      <div className="bg-primary rounded-xl px-4 py-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-light">MakanMana</h3>
        <p className="text-sm text-primary-light">
          A restaurant discovery app with filters and AI chat
        </p>
      </div>
      <div className="bg-primary rounded-xl px-4 py-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-light">
          Poop Counter Discord Bot
        </h3>
        <p className="text-sm text-primary-light">
          A restaurant discovery app with filters and AI chat
        </p>
      </div> */}
      <Navbar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
}

export default About;
