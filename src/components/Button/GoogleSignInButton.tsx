import { GoogleLogin } from "@react-oauth/google";

export default function GoogleSignInButton({
  onSuccess,
}: {
  onSuccess: (res: any) => void;
}) {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => alert("Google login failed")}
    />
  );
}
