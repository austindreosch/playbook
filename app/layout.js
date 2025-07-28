import AOSInitializer from '@/components/LandingPage/internal/AOSInitializer';
import { Toaster } from "@/components/ui/sonner";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { DM_Mono, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import ConditionalNavBar from '../components/ConditionalNavBar';
import ConditionalWrapper from '../components/ConditionalWrapper';
import { DevUserProvider } from '../components/DevUserProvider';
import GoogleAnalytics from '../components/GoogleAnalytics';
import MasterDatasetInitializer from '../components/MasterDatasetInitializer';
import { GA_MEASUREMENT_ID } from '../lib/gtag';
import './globals.css';
config.autoAddCss = false

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap'
})

export const metadata = {
  title: {
    default: 'Playbook Fantasy Sports',
    template: '%s | Playbook Fantasy Sports'
  },
  description: 'Fantasy sports strategy made simple with AI-powered expert insights that learn your leagues and strategy. Outclass the competition with a fraction of the effort — all in one dashboard..',
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/favicon.ico' },
  keywords: ['fantasy sports', 'AI', 'rankings', 'trades', 'fantasy football', 'fantasy basketball', 'fantasy hockey', 'fantasy baseball', 'fantasy soccer', 'fantasy golf', 'fantasy tennis', 'fantasy racing', 'fantasy football rankings', 'fantasy basketball rankings', 'fantasy hockey rankings', 'fantasy baseball rankings', 'fantasy soccer rankings', 'fantasy golf rankings', 'fantasy tennis rankings', 'fantasy racing rankings'],
}


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'manual';
            }
            window.addEventListener('beforeunload', function() {
              window.scrollTo(0, 0);
            });
          `
        }} />
      </head>
      <DevUserProvider>
      <body className={`${dmSans.className} ${dmMono.variable} bg-pb_paperwhite h-full flex flex-col`}>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <AOSInitializer />
          <ConditionalNavBar />
          <main className="flex-1 overflow-y-auto pt-10 md:pt-12 min-h-0">
            <MasterDatasetInitializer />
            <ConditionalWrapper>
              {children}
            </ConditionalWrapper>
          </main>
          <Toaster />


          {process.env.NODE_ENV === 'development' && process.env.PINY_VISUAL_SELECT === 'true' && (
         <Script
            src="/_piny/piny.phone.js"
            strategy="afterInteractive" 
         />)}





        </body>
      </DevUserProvider>
    </html>
  )
}


