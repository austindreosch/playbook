import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Inter } from 'next/font/google';
import './globals.css';

import FooterBlock from "/components/FooterBlock";

import NavBar from '../components/NavBar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
        <footer className='bg-white' >
          <FooterBlock />
        </footer>
      </html>
    </UserProvider>
  )
}
