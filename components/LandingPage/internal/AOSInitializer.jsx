'use client';

import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import { useEffect } from 'react';

export default function AOSInitializer() {
  useEffect(() => {
    AOS.init({
      once: true, // whether animation should happen only once - while scrolling down
      duration: 700, // values from 0 to 3000, with step 50ms
      easing: 'ease-out-cubic', // default easing for AOS animations
      // You can add more default settings here if needed
    });
  }, []);

  return null; // This component doesn't render anything itself
} 