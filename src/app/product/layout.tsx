import LNB from "@/components/layout/LNB";
import { FiBox } from "react-icons/fi";

const productNav = [
  { label: "평판 스캐너", href: "/product" },
  { label: "고속 스캐너", href: "/product/highspeed" },
  { label: "북 스캐너", href: "/product/book" },
  { label: "상품권 스캐너", href: "/product/voucher" },
  { label: "바코드 스캐너", href: "/product/barcode" },
  { label: "지문 스캐너", href: "/product/fingerprint" },
  { label: "필름 스캐너", href: "/product/film" },
  { label: "표본 스캐너", href: "/product/specimen" },
  { label: "신분증 스캐너", href: "/product/idcard" },
  { label: "생명공학 스캐너", href: "/product/bio" },
];

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ backgroundColor: '#f5f5f7', padding: '2.5rem 0', marginBottom: '0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '1.3rem'
            }}>
              <FiBox />
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>제품</h1>
          </div>
          <p style={{ fontSize: '1rem', color: '#666', maxWidth: '600px', margin: '0 auto', wordBreak: 'keep-all', lineHeight: '1.6' }}>
            최상의 비즈니스 파트너, 케이제이엔시스의 혁신적인 <br />이미지 프로세싱 및 스캐닝 제품군을 만나보세요.
          </p>
        </div>
      </div>
      <LNB items={productNav} />
      {children}
    </>
  );
}
