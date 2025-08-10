import GoogleSignInButton from "~/components/Button/GoogleSignInButton";
import { BACKEND } from "~/utils/api";

export default function SignInContent({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      console.error("No credential returned");
      return;
    }
    try {
      const res = await fetch(BACKEND.USER_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Google sign-in failed");
      const { token, user } = await res.json();

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onClose();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="px-4 pb-4">
      <h2 className="text-xl font-semibold text-primary mb-3 text-center">
        {title}
      </h2>
      <p className="text-sm text-gray mb-6 text-center">{message}</p>
      <div className="flex justify-center">
        <GoogleSignInButton onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
