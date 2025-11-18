import React from 'react';
import Footer from '../footer/Footer';
import Header from '../header/Header';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16 md:pt-20 pb-24 md:pb-0">
        <div className="max-w-5xl mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;