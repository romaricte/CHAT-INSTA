import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

export function LoginButton() {
  const handleLogin = () => {
    signIn("github", { callbackUrl: "/chat" });
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-2"
      variant="outline"
    >
      <GithubIcon className="w-5 h-5" />
      Continuer avec GitHub
    </Button>
  );
}
