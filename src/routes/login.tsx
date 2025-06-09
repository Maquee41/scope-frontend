import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
