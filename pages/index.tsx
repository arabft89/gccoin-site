
// pages/index.tsx - GCCoin Landing Page

import Head from 'next/head'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-sans">
      <Head>
        <title>GCCoin — The Digital Asset of the Gulf</title>
        <meta name="description" content="GCCoin is the secure, Sharia-compliant token for the future of the Gulf economy." />
      </Head>

      <header className="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-emerald-400">GCCoin</h1>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-emerald-600 text-white px-4 py-1 rounded"
        >
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {language === 'en' ? (
          <>
            <section className="text-center">
              <h2 className="text-4xl font-bold mb-4">The Digital Asset of the Gulf 🌍</h2>
              <p className="text-lg text-gray-300">
                GCCoin empowers economic unity, loyalty rewards, and decentralized growth — all while remaining Sharia-compliant and community-driven.
              </p>
            </section>

            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-gray-400 mb-4">(Coming soon: In-app wallet and staking dashboard)</p>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded">
                Connect Wallet
              </button>
            </section>

            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-2">About GCCoin</h3>
              <p className="text-gray-300">
                Built to serve the GCC region, GCCoin combines transparency, economic vision, and cultural values into a single digital asset.
              </p>
            </section>

            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-2">Contact</h3>
              <form action="https://formspree.io/f/xwpqqnov" method="POST" className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                ></textarea>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded"
                >
                  Send Message
                </button>
              </form>
            </section>
          </>
        ) : (
          <>
            <section className="text-center">
              <h2 className="text-4xl font-bold mb-4">الأصل الرقمي للخليج 🌍</h2>
              <p className="text-lg text-gray-300">
                جي سي كوين تعزز الوحدة الاقتصادية، وبرامج الولاء، والنمو اللامركزي — ضمن رؤية متوافقة مع الشريعة الإسلامية.
              </p>
            </section>

            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-2">ربط المحفظة</h3>
              <p className="text-gray-400 mb-4">(قريبًا: محفظة داخلية ولوحة تحكم للمكافآت)</p>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded">
                ربط المحفظة
              </button>
            </section>

            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-2">عن جي سي كوين</h3>
              <p className="text-gray-300">
                صُممت جي سي كوين لخدمة دول مجلس التعاون، وتجمع بين الشفافية والرؤية الاقتصادية والقيم الثقافية في أصل رقمي موحد.
              </p>
            </section>

            <section className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-2">تواصل معنا</h3>
              <form action="https://formspree.io/f/xwpqqnov" method="POST" className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="اسمك"
                  required
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="بريدك الإلكتروني"
                  required
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                />
                <textarea
                  name="message"
                  placeholder="رسالتك"
                  required
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                ></textarea>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded"
                >
                  إرسال
                </button>
              </form>
            </section>
          </>
        )}
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-800">
        &copy; {new Date().getFullYear()} GCCoin. All rights reserved.
      </footer>
    </div>
  )
}
