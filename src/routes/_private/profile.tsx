import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  getProfileData,
  updateProfileData,
  type IUserProfile,
} from '@/services/profileService'
import { useAuthStore } from '@/store/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_private/profile')({
  component: Profile,
})

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center">
      <div className="w-40 font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 md:mt-0">{value}</div>
    </div>
  )
}

function Profile() {
  const access = useAuthStore((s) => s.access)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: ['update profile'],
    mutationFn: async (data: IUserProfile) => {
      return await updateProfileData(access!, data)
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['me', access], updatedData)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(formData)
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['me', access],
    queryFn: ({ queryKey }) => {
      const [, token] = queryKey
      return getProfileData(token)
    },
    enabled: !!access,
  })

  const user = data ?? {
    username: '',
    first_name: '',
    last_name: '',
  }

  const [formData, setFormData] = useState<IUserProfile>(user)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
      })
    }
  }, [data])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading profile</div>

  return (
    <div className="flex justify-center px-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
        </CardHeader>
        <Separator />

        <CardContent className="grid gap-6 py-4 text-sm">
          <ProfileField label="Username" value={user.username || '...'} />
          <ProfileField label="Email" value={user.email || '...'} />
          <ProfileField label="First Name" value={user.first_name || '...'} />
          <ProfileField label="Last Name" value={user.last_name || '...'} />
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-end">
          <Sheet>
            <SheetTrigger className="rounded-md px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
              Edit Profile
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Use this form to update user details. All changes are
                  reflected instantly.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      defaultValue={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      defaultValue={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <SheetFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save changes'}
                  </Button>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </CardFooter>
      </Card>
    </div>
  )
}
