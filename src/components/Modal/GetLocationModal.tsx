interface GetLocationModalProps {
  onAllow: () => void; // Closes the modal or handles "Allow" UI feedback
  onClose: () => void; // Closes the modal (Cancel)
  onRequestLocation: () => void; // 👈 New prop: actually calls geolocation when user clicks
}

const GetLocationModal = ({
  onAllow,
  onClose,
  onRequestLocation,
}: GetLocationModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-xl font-semibold text-primary mb-2">
          Use Your Location?
        </h2>
        <p className="text-gray mb-4 text-sm">
          Allow access to your location to find nearby restaurants.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onAllow(); // Close modal / show loading etc.
              onRequestLocation(); // 👈 Actually call navigator.geolocation
            }}
            className="flex-1 bg-primary text-white rounded-lg py-2"
          >
            Allow
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 rounded-lg py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetLocationModal;
