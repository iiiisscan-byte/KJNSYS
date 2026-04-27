import Carousel from "@/components/ui/Carousel";
import InfoCard from "@/components/ui/InfoCard";
import CategorySlider from "@/components/ui/CategorySlider";
import Link from "next/link";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      title: "봄맞이 스캐너 보상판매 이벤트",
      description: "기존에 사용하시던 노후 스캐너를 반납하시면 최신형 평판 스캐너를 최대 20% 할인된 가격에 드립니다.",
      image: "/products/scanner.jpg",
      link: "/product",
      category: "EVENT",
      badge: "HOT"
    },
    {
      id: 2,
      title: "보안 솔루션 신규 도입 패키지",
      description: "문서 가상화 보안 솔루션을 처음 도입하는 중소기업을 대상으로 3개월 무료 체험 및 구축비 면제 혜택을 제공합니다.",
      image: "/solutions/virtual.jpg",
      link: "/solution",
      category: "PROMO",
      badge: "SALE"
    },
    {
      id: 3,
      title: "스마트 오피스 무료 컨설팅",
      description: "전문 컨설턴트가 방문하여 귀사의 업무 효율을 진단하고 최적의 스마트 워크플레이스 환경을 제안해 드립니다.",
      image: "/services/smart-office.jpg",
      link: "/service",
      category: "SERVICE",
      badge: "HOT"
    }
  ];

  return (
    <>
      {/* 1. Hero Section */}
      <section aria-label="메인 배너">
        <Carousel />
      </section>

      {/* 3. Featured Section */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '6rem 20px' }}>
        <div className="container">
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#e63946', letterSpacing: '0.2em', marginBottom: '1rem', fontWeight: '700' }}>PROMOTION</h3>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>진행중인 특별 프로모션</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {featuredProducts.map((product) => (
              <InfoCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Product Category Slider Section */}
      <CategorySlider />

      {/* 5. Contact Section */}
      <section className="container" style={{ padding: '6rem 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>궁금한 점이 있으신가요?</h2>
        <p style={{ color: '#666', marginBottom: '3rem' }}>전문 상담사가 상세히 안내해 드립니다.</p>
        <Link href="/service" style={{
          display: 'inline-block',
          backgroundColor: '#000',
          color: '#fff',
          padding: '1.2rem 4rem',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          지금 바로 문의하기
        </Link>
      </section>
    </>
  );
}
