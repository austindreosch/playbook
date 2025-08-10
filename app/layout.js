import AOSInitializer from '@/components/LandingPage/internal/AOSInitializer';
import { Toaster } from "@/components/ui/sonner";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Azeret_Mono, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import ConditionalWrapper from '../components/ConditionalWrapper';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import GoogleAnalytics from '../components/GoogleAnalytics';
import MasterDatasetInitializer from '../components/MasterDatasetInitializer';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/alignui/tooltip';
import { GA_MEASUREMENT_ID } from '../lib/gtag';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/utils/cn';
config.autoAddCss = false

// const inter = FontSans({
//   subsets: ['latin'],
//   variable: '--font-sans',
// });

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

const azeretMono = Azeret_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-azeret-mono',
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
    <html lang="en" className={cn("h-full", dmSans.variable, azeretMono.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={cn(dmSans.className, "bg-paperwhite h-full flex flex-col")} suppressHydrationWarning>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <TooltipProvider>
              <Suspense fallback={null}>
                <GoogleAnalytics />
              </Suspense>
              <AOSInitializer />
              <main className="flex-1 overflow-y-auto min-h-0">
                <MasterDatasetInitializer />
                <ConditionalWrapper>
                  {children}
                </ConditionalWrapper>
              </main>
              <Toaster />

              {/* Google Analytics Scripts */}
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

              {/* Scroll Restoration Script */}
              <Script
                id="scroll-restoration"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    if ('scrollRestoration' in history) {
                      history.scrollRestoration = 'manual';
                    }
                    window.addEventListener('beforeunload', function() {
                      window.scrollTo(0, 0);
                    });
                  `
                }}
              />
            </TooltipProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}