'use client'

import ModalImageFile from '@/public/images/landing/herofeature.png'; // Import the image
import Image from 'next/image';

export default function ModalImage({
  thumbAlt, // thumbAlt is still useful
}) {
  // Removed modalOpen state

  // TODO: Replace these placeholder values with the actual dimensions of modalimage.png
  const imageWidth = 1920; // Example width
  const imageHeight = 1080; // Example height
  const thumbWidth = 768; // Example thumbnail width
  const thumbHeight = 432; // Example thumbnail height

  return (
    <div>
      {/* Image thumbnail */}
      <div>
        <div className="relative flex justify-center mb-8" data-aos="zoom-y-out" data-aos-delay="450">
          <div className="flex flex-col justify-center">
            {/* Use ModalImageFile and placeholder dimensions */}
            <Image src={ModalImageFile} width={thumbWidth} height={thumbHeight} alt={thumbAlt} className='' quality={100} />
          </div>
          <a
            href="/#features"
            className="absolute top-full flex items-center transform -translate-y-1/2 bg-white rounded-full font-medium group p-4 shadow-lg"
          >
            <svg className="w-6 h-6 fill-current text-pb_darkgray group-hover:text-pb_blue shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M8 12 L12 16 L16 12 L14.59 10.59 L13 12.17 L13 8 L11 8 L11 12.17 L9.41 10.59 L8 12 Z" />
            </svg>
            <span className="ml-3 text-pb_darkgray hover:text-pb_darkgrayhover">What makes Playbook different?</span>
          </a>
        </div>
      </div>
      {/* End: Image thumbnail */}
    </div>
  )
}