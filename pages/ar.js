import Head from 'next/head';

export default function ArabicHome() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 font-sans" dir="rtl">
      <Head>
        <title>جي سي كوين — الأصل الرقمي للخليج</title>
        <meta name="description" content="GCCoin هي العملة الرقمية الآمنة المتوافقة مع الشريعة لمستقبل الخليج." />
      </Head>

      <header className="flex justify-between items-center py-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          جي سي كوين <span className="text-blue-600">— الأصل الرقمي للخليج 🌍</span>
        </h1>
      </header>

      <main className="max-w-2xl mx-auto space-y-8 text-right">
        <p className="text-md sm:text-lg leading-relaxed">
          تم تصميمها لتوحيد مستقبل التمويل في دول مجلس التعاون الخليجي باستخدام بلوكتشين آمن ومتوافق مع الشريعة.
        </p>

        <a
          href="/GCCoin_Whitepaper_v1_AR_FULL.docx"
          className="inline-block bg-emerald-600 text-white rounded px-5 py-2 hover:bg-emerald-700"
          download
        >
          تحميل الورقة البيضاء
        </a>

        <section>
          <h2 className="text-lg font-semibold mb-2">مخطط توزيع الرمز</h2>
          <img
            src="/GCCoin_Tokenomics_Chart.png"
            alt="مخطط توزيع الرمز"
            className="mx-auto max-w-full"
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">خارطة الطريق</h2>
          <img
            src="/GCCoin_Roadmap_Timeline.png"
            alt="خارطة الطريق"
            className="mx-auto max-w-full"
          />
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-2">تواصل معنا</h2>
          <form
            action="https://formspree.io/f/xwpqqnov"
            method="POST"
            className="space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="الاسم"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-right"
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-right"
            />
            <textarea
              name="message"
              placeholder="رسالتك"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-right"
            ></textarea>
            <button
              type="submit"
              className="bg-emerald-600 text-white rounded px-5 py-2 hover:bg-emerald-700"
            >
              إرسال
            </button>
          </form>
        </section>
      </main>

      <footer className="text-center mt-10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} جي سي كوين. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
