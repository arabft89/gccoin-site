
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>GCCoin</title>
        <meta name="description" content="GCCoin - Empowering Gulf with Blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-green-100 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to GCCoin</h1>
      </main>
    </>
  )
}
