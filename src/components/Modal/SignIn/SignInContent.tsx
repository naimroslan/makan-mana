import { supabase } from "../../../utils/supabase";

export default function SignInContent({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      alert("Failed to sign in");
      console.error("Google Sign-In Error:", error.message);
    }
  };

  return (
    <div className="px-4 pb-4">
      <h2 className="text-xl font-semibold text-primary mb-3 text-center">
        {title}
      </h2>
      <p className="text-sm text-gray mb-6 text-center">{message}</p>
      <button
        onClick={handleLogin}
        className="w-full bg-primary text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary/90 active:scale-95 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}
