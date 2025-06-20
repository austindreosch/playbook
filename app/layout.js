import AOSInitializer from '@/components/LandingPage/internal/AOSInitializer';
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { DM_Sans } from 'next/font/google';
import ConditionalNavBar from '../components/ConditionalNavBar';
import MasterDatasetInitializer from '../components/MasterDatasetInitializer';
import './globals.css';
config.autoAddCss = false

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

export const metadata = {
  title: 'Playbook Fantasy Sports',
  description: 'Fantasy sports strategy made simple with AI-powered expert insights that learn your leagues and strategy. Outclass the competition with a fraction of the effort — all in one dashboard..',
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/favicon.ico' },
  keywords: ['fantasy sports', 'AI', 'rankings', 'trades', 'fantasy football', 'fantasy basketball', 'fantasy hockey', 'fantasy baseball', 'fantasy soccer', 'fantasy golf', 'fantasy tennis', 'fantasy racing', 'fantasy football rankings', 'fantasy basketball rankings', 'fantasy hockey rankings', 'fantasy baseball rankings', 'fantasy soccer rankings', 'fantasy golf rankings', 'fantasy tennis rankings', 'fantasy racing rankings'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <UserProvider>
        <body className={`${dmSans.className} flex flex-col`}>
          <AOSInitializer />
          <ConditionalNavBar />
          <main className="flex-1">
            <MasterDatasetInitializer />
            {children}
          </main>
          <Toaster />
        </body>
      </UserProvider>
    </html>
  )
}


