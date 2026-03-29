'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSlider = ({ sliders, onSlideClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!sliders || sliders.length === 0) {
    return (
      <div className="bg-gray-200 h-40 md:h-72 rounded-xl flex items-center justify-center">
        <div className="text-gray-400">No sliders available</div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg mx-3 my-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={isHovered}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={0}
        slidesPerView={1}
        className="h-40 md:h-72"
      >
        {sliders.map((slider, index) => (
          <SwiperSlide key={slider.id || index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full cursor-pointer"
              onClick={() => onSlideClick?.(slider)}
            >
              <img
                src={slider.image}
                alt={slider.title || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
        }
        .swiper-pagination-bullet-active {
          background: #25D366;
        }
        @media (max-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;