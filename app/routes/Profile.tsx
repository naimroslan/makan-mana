import { useState, useEffect } from "react";
import { BACKEND } from "~/utils/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(BACKEND.PROFILE, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // This will send the httpOnly cookie automatically
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile data received:", data);
        setProfile(data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        // Handle auth errors - maybe redirect to login
      });
  }, []);

  const avatarUrl = `${BACKEND.SEED}/${profile?.avatar}`;

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      {/* Avatar and profile info in top left */}
      <div className="mb-8 flex items-center space-x-4">
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-16 h-16 rounded-xl"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">
            {profile?.name || "Loading..."}
          </h3>
          <p className="text-sm text-gray-500">
            Joined on {profile?.joinedDate || "Loading..."}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col justify-center items-center space-y-8 text-center">
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

        {/* Uncomment if you want to add the creations section */}
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
      </div>
    </div>
  );
}

export default Profile;
