import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-dark-900">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
