import { supabase } from "../../utils/supabase";

export default function SignInModal({
  isOpen,
  onClose,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-border text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-sm text-gray hover:text-primary"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-primary mb-3">{title}</h2>
        <p className="text-sm text-gray mb-6">{message}</p>
        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary/90 active:scale-95 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
