import React from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  image: string;
  alt: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ image, alt }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src={image}
        alt={alt}
        className="object-contain w-full h-full transition-transform duration-200 hover:scale-105"
        width={400}
        height={400}
        loading="lazy"
      />
    </div>
  );
}; 