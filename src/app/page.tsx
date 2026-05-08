import Carousel from "@/components/ui/Carousel";
import InfoCard from "@/components/ui/InfoCard";
import CategorySlider from "@/components/ui/CategorySlider";
import PromotionSlider from "@/components/ui/PromotionSlider";
import Link from "next/link";
import { FiCpu } from "react-icons/fi";
import PopupManager from "@/components/ui/PopupManager";

import { supabase } from "@/lib/supabase";

async function getPromotions() {
  const { data } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function Home() {
  const promotions = await getPromotions();
  
  const featuredProducts = promotions.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description || "",
    image: p.image_url || "/images/placeholder.png",
    link: `/promotion/${p.id}`,
    category: p.category || "PROMO",
    badge: p.badge || ""
  }));

  return (
    <>
      {/* 팝업 관리자 */}
      <PopupManager />

      {/* 1. Hero Section */}
      <section aria-label="메인 배너">
        <Carousel />
      </section>

      {/* 2. About Company Section */}
      <section id="about" style={{ backgroundColor: '#fff', padding: '8rem 20px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1rem', color: '#004a99', letterSpacing: '0.1em', marginBottom: '1.5rem', fontWeight: '700' }}>케이제이엔시스 회사소개</h3>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '2.5rem', lineHeight: '1.3', color: '#1a1a1a' }}>
            혁신적인 기술로 <br />더 나은 디지털 미래를 만듭니다
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: '1.8', marginBottom: '4rem', wordBreak: 'keep-all' }}>
            케이제이엔시스는 최첨단 이미지 프로세싱 및 스캐닝 솔루션 분야의 선두주자로서, 
            기업의 업무 효율을 극대화하고 비즈니스 가치를 혁신하는 데 전념하고 있습니다. 
            20년 이상의 풍부한 경험과 독보적인 기술력을 바탕으로 고객의 성공을 위한 
            최적의 맞춤형 솔루션을 제공하며, 디지털 전환의 진정한 파트너가 되겠습니다.
          </p>

        </div>
      </section>

      {/* 3. Featured Section (PROMOTION) */}
      <section id="promotions" style={{ backgroundColor: '#f9f9f9', padding: '6rem 20px' }}>
        <div className="container">
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#e63946', letterSpacing: '0.2em', marginBottom: '1rem', fontWeight: '700' }}>PROMOTION</h3>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>진행중인 특별 프로모션</h2>
          </div>

          <PromotionSlider products={featuredProducts} />
        </div>
      </section>

      {/* 4. Product Category Slider Section */}
      <CategorySlider />
    </>
  );
}
