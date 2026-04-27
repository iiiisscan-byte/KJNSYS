"use client";

import { useState, useEffect } from "react";
import styles from "./Carousel.module.css";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface SlideData {
  id: number;
  image: string;
  title: string;
  description: string;
  link: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/images/banner1.png",
    title: "Innovating Your \nDigital Future",
    description: "최첨단 이미지 프로세싱 기술로 기업의 비즈니스 가치를 극대화합니다.",
    link: "/product",
  },
  {
    id: 2,
    image: "/images/banner1.png",
    title: "Secure & Smart \nSolution Provider",
    description: "신뢰할 수 있는 보안 기술과 가상화 솔루션으로 완벽한 인프라를 구축합니다.",
    link: "/solution",
  },
  {
    id: 3,
    image: "/images/banner1.png",
    title: "Leading the \nIT Transformation",
    description: "끊임없는 도전과 기술 혁신으로 내일의 디지털 환경을 선도합니다.",
    link: "/service",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // 5초 간격
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${index === currentSlide ? styles.active : ""}`}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className={styles.image}
              priority={index === 0}
            />
          </div>
          <div className={styles.content}>
            <div className={`container ${styles.contentContainer}`}>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.description}>{slide.description}</p>

            </div>
          </div>
        </div>
      ))}

      <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevSlide} aria-label="Previous slide">
        <FiChevronLeft />
      </button>
      <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextSlide} aria-label="Next slide">
        <FiChevronRight />
      </button>
      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentSlide ? styles.activeIndicator : ""
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
