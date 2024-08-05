import LocationText from '@/components/LocationText'
import { ZipEntryForm } from '@/components/ZipEntryForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center py-24">
      <div className="w-full max-w-5xl items-center mb-10">
        <h1 className="text-6xl font-bold text-center">Landing Page</h1>
        <LocationText />
      </div>

      <ZipEntryForm />
    </main>
  )
}
