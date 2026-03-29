'use client';

import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const ProductImageGallery = ({ images, productName }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl flex items-center justify-center h-[300px] md:h-[400px]">
        <div className="text-gray-400 text-center">
          <i className="fas fa-image text-5xl mb-2 block"></i>
          <span>No Image Available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Main Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        className="rounded-2xl overflow-hidden h-[300px] md:h-[400px] mb-4"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <img
                src={image}
                alt={`${productName} - Image ${index + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails Swiper */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Navigation, Thumbs]}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbnails-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-20 object-cover"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <style jsx>{`
        :global(.thumbnails-swiper) {
          margin-top: 12px;
        }
        :global(.thumbnails-swiper .swiper-slide) {
          width: 80px;
          height: 80px;
        }
        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: white;
          background: rgba(0,0,0,0.5);
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        :global(.swiper-button-next:after),
        :global(.swiper-button-prev:after) {
          font-size: 18px;
        }
        :global(.swiper-pagination-bullet) {
          background: rgba(255,255,255,0.5);
        }
        :global(.swiper-pagination-bullet-active) {
          background: #25D366;
        }
      `}</style>
    </div>
  );
};

export default ProductImageGallery;