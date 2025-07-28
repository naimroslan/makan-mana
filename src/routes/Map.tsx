import Navbar from "../components/Menu/Navbar";

function Map() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-10 space-y-8 text-center">
      <h2 className="text-4xl font-bold text-primary">Coming Soon</h2>

      <p className="text-sm text-gray-500 max-w-md">
        We're working on something awesome. Stay tuned!
      </p>

      <Navbar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
}

export default Map;
