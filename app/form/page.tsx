import { MultiStepForm } from '@/components/MultiStepForm'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const zipCode = searchParams.zipcode as string
  const city = searchParams.city as string
  const state = searchParams.state as string

  return (
    <main className="flex min-h-screen flex-col items-center py-24">
      <div className="w-full max-w-5xl items-center justify-between mb-10">
        <h1 className="text-6xl font-bold text-center">Form Page</h1>
      </div>

      <MultiStepForm zipCode={zipCode} city={city} state={state} />
    </main>
  )
}
