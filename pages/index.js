

// pages/index.js

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          GCCoin <span className="text-blue-600">– The Digital Asset of the Gulf</span>
        </h1>
      </header>
      {/* Other sections of your homepage */}
    </main>
  );
}
