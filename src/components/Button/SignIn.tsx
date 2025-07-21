import { supabase } from "../../utils/supabase";

export default function SignIn() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Login failed:", error.message);
      alert("Login failed");
    }
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
}
