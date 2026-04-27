"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './CategorySlider.module.css';

interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "대형프린터",
    image: "/images/categories/large_printer.png",
    link: "/products?category=large-printer"
  },
  {
    id: 2,
    name: "스캐너",
    image: "/images/categories/scanner.png",
    link: "/products?category=scanner"
  },
  {
    id: 3,
    name: "라벨 프린터",
    image: "/images/categories/label_printer.png",
    link: "/products?category=label-printer"
  },
  {
    id: 4,
    name: "POS 프린터",
    image: "/images/categories/pos_printer.png",
    link: "/products?category=pos-printer"
  },
  {
    id: 5,
    name: "산업용 로봇",
    image: "/images/categories/industrial_robot.png",
    link: "/products?category=industrial-robot"
  }
];

const CategorySlider = () => {
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
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>KJ&SYS의 다양한 제품과 솔루션을 만나보세요</h2>
        
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
              {categories.map((category) => (
                <Link key={category.id} href={category.link} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={160}
                      height={160}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <span className={styles.categoryName}>{category.name}</span>
                </Link>
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
      </div>
    </section>
  );
};

export default CategorySlider;
