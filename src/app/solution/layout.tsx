import LNB from "@/components/layout/LNB";
import { FiLayers } from "react-icons/fi";

const solutionNav = [
  { label: "스캔 솔루션", href: "/solution" },
  { label: "가상화 솔루션", href: "/solution/virtualization" },
];

export default function SolutionLayout({ children }: { children: React.ReactNode }) {
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
              backgroundColor: '#004a99',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '1.3rem'
            }}>
              <FiLayers />
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>솔루션</h1>
          </div>
          <p style={{ fontSize: '1rem', color: '#666', maxWidth: '600px', margin: '0 auto', wordBreak: 'keep-all', lineHeight: '1.6' }}>
            효율적인 디지털 전환과 보안 강화를 위한 <br />케이제이엔시스만의 최적화된 맞춤형 솔루션을 제공합니다.
          </p>
        </div>
      </div>
      <LNB items={solutionNav} />
      {children}
    </>
  );
}
