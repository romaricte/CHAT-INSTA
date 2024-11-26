import { auth } from "@/auth"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/chat")
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg shadow-lg bg-white dark:bg-zinc-900 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          Bienvenue sur Messageri Instantannee
        </h1>
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Connectez-vous pour commencer à chatter
          </p>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Button variant="link" className="px-2" asChild>
              <Link href="/register">
                Pas encore de compte? S'inscrire
              </Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
