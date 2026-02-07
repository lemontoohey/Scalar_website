import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Vision from '@/components/Vision'
import Technology from '@/components/Technology'
import Collection from '@/components/Collection'
import SecretMenu from '@/components/SecretMenu'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Vision />
      <Technology />
      <Collection />
      <SecretMenu />
      <Footer />
    </main>
  )
}
