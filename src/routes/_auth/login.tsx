import { createFileRoute, useRouter } from '@tanstack/react-router'

import { GalleryVerticalEnd } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@tanstack/react-router'

import { useLogin } from '@/hooks/useLogin'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/login')({
  component: Login,
})

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const loginMutation = useLogin()

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a className="flex flex-col items-center gap-2 font-medium">
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Scope</span>
                </a>
                <h1 className="text-xl font-bold">Welcome Scope</h1>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link to="/sign-up">
                    <span className="underline underline-offset-4">
                      Sign up
                    </span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="scope"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  onClick={() =>
                    loginMutation.mutate(
                      { username, password },
                      {
                        onSuccess: () => router.navigate({ to: '/workflow' }),
                        onError: () => alert('Login faled'),
                      },
                    )
                  }
                  className="w-full cursor-pointer"
                >
                  Login
                </Button>
              </div>
            </div>
          </form>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
