import Image from 'next/image'
import Link from 'next/link'
import '../globals.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <aside className="relative hidden md:block bg-black text-white">
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <Image src="/logo.svg" alt="Brand" width={32} height={32} priority />
        </div>
        <div className="h-full flex items-end p-10">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight mb-3">Just Do It</h2>
            <p className="text-white/80 max-w-md">
              Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
            </p>
          </div>
        </div>
      </aside>

      <main className="bg-white dark:bg-background flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium underline underline-offset-4 hover:text-foreground">
              Sign In
            </Link>
          </p>
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
