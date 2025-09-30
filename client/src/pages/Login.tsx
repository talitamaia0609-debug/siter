import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiDiscord } from "react-icons/si";

export default function Login() {
  const handleDiscordLogin = () => {
    window.location.href = "/auth/discord";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center" data-testid="text-login-title">
            Welcome
          </CardTitle>
          <CardDescription className="text-center" data-testid="text-login-description">
            Sign in with your Discord account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleDiscordLogin}
            className="w-full"
            size="lg"
            data-testid="button-discord-login"
          >
            <SiDiscord className="mr-2 h-5 w-5" />
            Sign in with Discord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
