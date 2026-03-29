import { Hind_Siliguri, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Trust Mobile Care - Professional E-commerce',
  description: 'বিশ্বস্ত মোবাইল কেয়ার সার্ভিস প্রোভাইডার',
  keywords: 'mobile accessories, ecommerce, bangladesh, trust mobile care',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${poppins.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="font-hind bg-gray-100">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: 'white',
              borderRadius: '50px',
              padding: '12px 24px',
              fontWeight: '600',
            },
            success: {
              iconTheme: {
                primary: 'white',
                secondary: '#25D366',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #ff5722, #9c27b0)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}