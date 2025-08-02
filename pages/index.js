import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 font-sans">
      <Head>
        <title>GCCoin — The Digital Asset of the Gulf</title>
        <meta name="description" content="GCCoin is the secure, Sharia-compliant token for the future of the Gulf economy." />
      </Head>

      <header className="flex justify-between items-center py-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          GCCoin <span className="text-blue-600">&mdash; The Digital Asset of the Gulf 🌍</span>
        </h1>
        <a 
          href="/ar"
            className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
              العربية
        </a>
      </header>

      <main className="max-w-2xl mx-auto space-y-8">
        <p className="text-md sm:text-lg leading-relaxed">
          Built to unify the financial future of the GCC region with secure, Sharia-compliant blockchain utility.
        </p>

        <a
          href="/GCCoin_Whitepaper_v1_EN_FULL.docx"
          className="inline-block bg-emerald-600 text-white rounded px-5 py-2 hover:bg-emerald-700"
          download
        >
          Download Whitepaper
        </a>

        <section>
          <h2 className="text-lg font-semibold mb-2">Tokenomics Chart</h2>
          <img
            src="/GCCoin_Tokenomics_Chart_Final.png"
            alt="GCCoin Tokenomics"
            className="mx-auto max-w-full"
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Roadmap Timeline</h2>
          <img
            src="/GCCoin_Roadmap_Timeline_Final_Fixed.png"
            alt="GCCoin Roadmap"
            className="mx-auto max-w-full"
          />
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
          <form
            action="https://formspree.io/f/xwpqqnov"
            method="POST"
            className="space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <textarea
              name="message"
              placeholder="Message"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            ></textarea>
            <button
              type="submit"
              className="bg-emerald-600 text-white rounded px-5 py-2 hover:bg-emerald-700"
            >
              Send
            </button>
          </form>
        </section>
      </main>

      <footer className="text-center mt-10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} GCCoin. All rights reserved.
      </footer>
    </div>
  );
}
