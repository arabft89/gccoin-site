import { useState } from 'react';

export default function Home() {
  const [lang, setLang] = useState('en');
  const isArabic = lang === 'ar';

  return (
    <main style={{
      padding: '2rem',
      fontFamily: 'sans-serif',
      direction: isArabic ? 'rtl' : 'ltr',
      textAlign: isArabic ? 'right' : 'left',
    }}>
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

      <div style={{ marginTop: '3rem' }}>
        <h2>{isArabic ? 'تواصل معنا' : 'Contact Us'}</h2>
        <form
          action="https://formspree.io/f/xwpqqnov"
          method="POST"
          style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', marginTop: '1rem' }}
        >
          <label>{isArabic ? 'الاسم' : 'Name'}</label>
          <input type="text" name="name" required style={{ marginBottom: '1rem', padding: '0.5rem' }} />

          <label>{isArabic ? 'البريد الإلكتروني' : 'Email'}</label>
          <input type="email" name="email" required style={{ marginBottom: '1rem', padding: '0.5rem' }} />

          <label>{isArabic ? 'رسالتك' : 'Message'}</label>
          <textarea name="message" required style={{ marginBottom: '1rem', padding: '0.5rem' }} />

          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007b8a',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {isArabic ? 'إرسال' : 'Send'}
          </button>
        </form>
      </div>
    </main>
  );
}
