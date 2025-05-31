import AOSInitializer from '@/components/LandingPage/internal/AOSInitializer';
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { DM_Sans } from 'next/font/google';
// import { Akshar, Albert_Sans, Aleo, Alexandria, Anek_Gurmukhi, Anuphan, Atkinson_Hyperlegible, Barlow, Be_Vietnam_Pro, Chivo, DM_Sans, Familjen_Grotesk, Figtree, Finlandica, Fira, Fira_Sans, Funnel_Sans, Gabarito, Geist, Geologica, Golos_Text, Hanken_Grotesk, heebo, Heebo, Host_Grotesk, Hubot_Sans, IBM_Plex_Sans, Inclusive_Sans, Instrument_Sans, Inter, League_Spartan, Lexend, Lexend_Deca, Libre_Franklin, Literata, Manrope, Mona_Sans, Monda, Onest, Outfit, Overpass, Parkinsans, Plus_Jakarta_Sans, Questrial, Radio_Canada, Readex_Pro, Reddit_Sans, Rethink_Sans, Shippori_Antique, Sintony, Sofia_Sans, Sora, Spline_Sans, SUSE, Urbanist, Vazirmatn, Wix_Madefor_Text, Work_Sans, Yantramanav } from 'next/font/google';
import MasterDatasetInitializer from '../components/MasterDatasetInitializer';
import NavBar from '../components/NavBar';
import './globals.css';
config.autoAddCss = false

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
      <body className={dmSans.className}>
          <AOSInitializer />
          <NavBar />
          <MasterDatasetInitializer />
          {children}
          <Toaster />
        </body>
      </html>
    </UserProvider>
  )
}
