import LNB from "@/components/layout/LNB";
import { FiHeadphones } from "react-icons/fi";

const serviceNav = [
  { label: "고객센터 안내", href: "/service" },
  { label: "제품 및 서비스 문의", href: "/service/inquiry" },
  { label: "자료실", href: "/service/archive" },
];

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
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
              backgroundColor: '#e63946',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '1.3rem'
            }}>
              <FiHeadphones />
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>고객지원</h1>
          </div>
          <p style={{ fontSize: '1rem', color: '#666', maxWidth: '600px', margin: '0 auto', wordBreak: 'keep-all', lineHeight: '1.6' }}>
            고객님의 목소리에 귀를 기울이며, 최상의 서비스를 위해 <br />언제나 준비되어 있습니다. 무엇이든 도와드리겠습니다.
          </p>
        </div>
      </div>
      <LNB items={serviceNav} />
      {children}
    </>
  );
}
