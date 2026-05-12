"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './CategorySlider.module.css';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string | number;
  name: string;
  image: string;
  link: string;
}

const hardcodedCategories: Category[] = [
  { id: 1, name: "평판 스캐너", image: "/images/categories/flatbed_scanner.png", link: "/products?category=flatbed" },
  { id: 2, name: "고속 스캐너", image: "/images/categories/high_speed_scanner.png", link: "/products?category=high-speed" },
  { id: 3, name: "북 스캐너", image: "/images/categories/book_scanner.png", link: "/products?category=book" },
  { id: 4, name: "상품권 스캐너", image: "/images/categories/voucher_scanner.png", link: "/products?category=voucher" },
  { id: 5, name: "바코드 스캐너", image: "/images/categories/barcode_scanner.png", link: "/products?category=barcode" },
  { id: 6, name: "지문 스캐너", image: "/images/categories/fingerprint_scanner.png", link: "/products?category=fingerprint" },
  { id: 7, name: "필름 스캐너", image: "/images/categories/film_scanner.png", link: "/products?category=film" },
  { id: 8, name: "표본 스캐너", image: "/images/categories/specimen_scanner.png", link: "/products?category=specimen" },
  { id: 9, name: "신분증 스캐너", image: "/images/categories/id_card_scanner.png", link: "/products?category=id-card" },
  { id: 10, name: "생명공학 스캐너", image: "/images/categories/biotech_scanner.png", link: "/products?category=biotech" }
];

const categoryImageMap: Record<string, string> = {
  "평판스캐너": "/images/categories/flatbed_scanner.png",
  "평판 스캐너": "/images/categories/flatbed_scanner.png",
  "고속스캐너": "/images/categories/high_speed_scanner.png",
  "고속 스캐너": "/images/categories/high_speed_scanner.png",
  "북스캐너": "/images/categories/book_scanner.png",
  "북 스캐너": "/images/categories/book_scanner.png",
  "상품권스캐너": "/images/categories/voucher_scanner.png",
  "상품권 스캐너": "/images/categories/voucher_scanner.png",
  "바코드스캐너": "/images/categories/barcode_scanner.png",
  "바코드 스캐너": "/images/categories/barcode_scanner.png",
  "지문스캐너": "/images/categories/fingerprint_scanner.png",
  "지문 스캐너": "/images/categories/fingerprint_scanner.png",
  "필름스캐너": "/images/categories/film_scanner.png",
  "필름 스캐너": "/images/categories/film_scanner.png",
  "표본스캐너": "/images/categories/specimen_scanner.png",
  "표본 스캐너": "/images/categories/specimen_scanner.png",
  "신분증스캐너": "/images/categories/id_card_scanner.png",
  "신분증 스캐너": "/images/categories/id_card_scanner.png",
  "생명공학스캐너": "/images/categories/biotech_scanner.png",
  "생명공학 스캐너": "/images/categories/biotech_scanner.png",
  "AI OCR": "/images/categories/flatbed_scanner.png", // 기본값
  "DOCU-FINDER": "/images/categories/book_scanner.png", // 기본값
  "가상화 솔루션": "/images/categories/high_speed_scanner.png" // 기본값
};

const CategorySlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>(hardcodedCategories);

  useEffect(() => {
    async function loadCategories() {
      // 1. 카테고리 데이터 가져오기
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. 모든 제품의 카테고리 ID와 이미지를 가져와서 카테고리별 최신 이미지 맵 생성
      const { data: prodData } = await supabase
        .from('products')
        .select('category_id, image_url')
        .order('created_at', { ascending: false });

      if (catData && catData.length > 0) {
        const imageMap: Record<string, string> = {};
        if (prodData) {
          prodData.forEach(p => {
            if (!imageMap[p.category_id] && p.image_url) {
              imageMap[p.category_id] = p.image_url;
            }
          });
        }

        // 제품(product)이 우선, 솔루션(solution)이 다음으로 오도록 정렬
        const sortedData = [...catData].sort((a, b) => {
          if (a.type === 'product' && b.type === 'solution') return -1;
          if (a.type === 'solution' && b.type === 'product') return 1;
          return 0;
        });

        const mapped = sortedData.map((cat) => ({
          id: cat.id,
          name: cat.name,
          // 최신 제품 이미지가 있으면 사용, 없으면 기존 맵 또는 기본 이미지 사용
          image: imageMap[cat.id] || categoryImageMap[cat.name] || "/images/categories/flatbed_scanner.png",
          link: `/${cat.type === 'solution' ? 'solution' : 'product'}?category=${cat.id}`
        }));
        setCategories(mapped);
      }
    }
    loadCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // 카드 너비 + gap (25px)
      const cardWidth = clientWidth < 768 ? 240 : 280;
      const gap = 25;
      const moveAmount = cardWidth + gap;
      
      const scrollTo = direction === 'left'
        ? scrollLeft - moveAmount
        : scrollLeft + moveAmount;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>케이제이엔시스의 다양한 제품과 솔루션을 만나보세요</h2>

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
