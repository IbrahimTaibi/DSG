import React from 'react';

interface ProductGalleryProps {
  image: string;
  alt: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ image, alt }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={image}
        alt={alt}
        className="object-contain w-full h-full transition-transform duration-200 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}; 