import { UserProvider } from '@auth0/nextjs-auth0/client';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { DM_Sans, Fira, Fira_Sans, Inter, Libre_Franklin } from 'next/font/google';
import './globals.css';
config.autoAddCss = false


import NavBar from '../components/NavBar';

const DMSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap'
})
// const inter = Inter({ subsets: ['latin'], weight: '400', display: 'swap' })

export const metadata = {
  title: 'Playbook AI',
  description: 'AI powered fantasy sports toolkit.',
}

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={DMSans.className}>
          <NavBar />
          {children}
        </body>
      </html>
    </UserProvider>
  )
}
