import { useState } from 'react';

export default function Home() {
  const [lang, setLang] = useState('en');
  const isArabic = lang === 'ar';

  return (
    <main
      style={{
        padding: '2rem',
        fontFamily: 'sans-serif',
        direction: isArabic ? 'rtl' : 'ltr',
        textAlign: isArabic ? 'right' : 'left',
      }}
    >
      <button
        onClick={() => setLang(isArabic ? 'en' : 'ar')}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007b8a',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        {isArabic ? 'EN' : 'AR'}
      </button>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
        {isArabic ? 'جي سي كوين — الأصل الرقمي للخليج 🌍' : 'GCCoin — The Digital Asset of the Gulf 🌍'}
      </h1>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        {isArabic
          ? 'مصمم لتوحيد مستقبل التمويل في دول مجلس التعاون الخليجي باستخدام البلوكتشين المتوافق مع الشريعة.'
          : 'Built to unify the financial future of the GCC region with secure, Sharia-compliant blockchain utility.'}
      </p>

      <div style={{ marginTop: '2rem' }}>
        <a
          href={isArabic ? '/GCCoin_Whitepaper_v1_AR_FULL.docx' : '/GCCoin_Whitepaper_v1_EN_FULL.docx'}
          download
          style={{
            display: 'inline-block',
            marginRight: isArabic ? 0 : '1rem',
            marginLeft: isArabic ? '1rem' : 0,
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007b8a',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          {isArabic ? 'تحميل الورقة البيضاء' : 'Download Whitepaper'}
        </a>
      </div>
    </main>
  );
}
