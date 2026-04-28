"use client";

import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './PromotionSlider.module.css';
import InfoCard from './InfoCard';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  badge?: string;
}

interface PromotionSliderProps {
  products: Product[];
}

const PromotionSlider = ({ products }: PromotionSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.sliderWrapper}>
      <button 
        className={`${styles.navButton} ${styles.prevButton}`} 
        onClick={() => scroll('left')}
        aria-label="Previous"
      >
        <FiChevronLeft size={24} />
      </button>
      
      <div className={styles.sliderContainer} ref={scrollRef}>
        <div className={styles.sliderContent}>
          {products.map((product) => (
            <div key={product.id} className={styles.cardWrapper}>
              <InfoCard {...product} />
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className={`${styles.navButton} ${styles.nextButton}`} 
        onClick={() => scroll('right')}
        aria-label="Next"
      >
        <FiChevronRight size={24} />
      </button>
    </div>
  );
};

export default PromotionSlider;
