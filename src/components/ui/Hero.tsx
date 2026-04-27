"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./Hero.module.css";

interface BannerData {
  id: string;
  image_url: string;
  title: string;
  description: string;
  link_url: string;
}

export default function Hero() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setBanner(data);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBanner();
  }, []);

  // 기본값 (데이터가 없거나 로딩 중일 때)
  const defaultBanner = {
    image_url: "/images/banner1.png",
    title: "최첨단 디지털라이제이션 솔루션",
    description: "케이제이엔시스가 비즈니스의 미래를 함께 설계합니다.",
    link_url: "/product"
  };

  const displayBanner = banner || defaultBanner;

  if (loading) {
    return <div className={styles.heroContainer} style={{ backgroundColor: '#f5f5f5' }}></div>;
  }

  return (
    <div className={styles.heroContainer}>
      <div className={styles.imageWrapper}>
        <Image
          src={displayBanner.image_url}
          alt={displayBanner.title}
          fill
          className={styles.image}
          priority
          unoptimized={displayBanner.image_url.endsWith(".gif")}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{displayBanner.title}</h1>
        <p className={styles.description}>{displayBanner.description}</p>
      </div>
    </div>
  );
}
