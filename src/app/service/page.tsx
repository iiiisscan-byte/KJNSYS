export default function ServicePage() {
  return (
    <div className="container mt-4 mb-8">
      <h2 className="mb-4 text-center" style={{ fontSize: '2.2rem', fontWeight: '800' }}>고객센터 안내</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: '2rem',
        alignItems: 'start',
        marginTop: '3rem'
      }}>
        {/* Info Box */}
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '2.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #eee',
          height: '100%'
        }}>
          <h3 style={{ marginBottom: '2rem', color: '#004a99', fontSize: '1.5rem', borderBottom: '2px solid #004a99', paddingBottom: '0.5rem', display: 'inline-block' }}>
            운영 시간 및 연락처
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, color: '#333', lineHeight: '2.5', fontSize: '1.1rem' }}>
            <li style={{ borderBottom: '1px solid #f0f0f0', padding: '0.5rem 0' }}>
              <strong style={{ width: '100px', display: 'inline-block', color: '#666' }}>평일</strong> 
              <span>09:00 ~ 18:00 (점심 12:00 ~ 13:00)</span>
            </li>
            <li style={{ borderBottom: '1px solid #f0f0f0', padding: '0.5rem 0' }}>
              <strong style={{ width: '100px', display: 'inline-block', color: '#666' }}>휴무</strong> 
              <span>주말 및 공휴일</span>
            </li>
            <li style={{ borderBottom: '1px solid #f0f0f0', padding: '0.5rem 0' }}>
              <strong style={{ width: '100px', display: 'inline-block', color: '#666' }}>전화</strong> 
              <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>031-273-9171</span>
            </li>
            <li style={{ borderBottom: '1px solid #f0f0f0', padding: '0.5rem 0' }}>
              <strong style={{ width: '100px', display: 'inline-block', color: '#666' }}>팩스</strong> 
              <span>031-660-7066</span>
            </li>
            <li style={{ padding: '0.5rem 0' }}>
              <strong style={{ width: '100px', display: 'inline-block', color: '#666' }}>이메일</strong> 
              <a href="mailto:isscan@kjnsys.com" style={{ color: '#004a99', textDecoration: 'none' }}>isscan@kjnsys.com</a>
            </li>
          </ul>
          
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px', fontSize: '0.95rem', color: '#666' }}>
            <strong>주소:</strong><br />
            경기도 용인시 기흥구 흥덕1로 13, <br />
            흥덕IT밸리 컴플렉스 B동 508호
          </div>
        </div>

        {/* Map Box */}
        <div style={{ 
          borderRadius: '12px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #eee',
          height: '100%',
          minHeight: '450px'
        }}>
          <iframe 
            src="https://maps.google.com/maps?q=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%9A%A9%EC%9D%B8%EC%8B%9C%20%EA%B8%B0%ED%9D%A5%EA%B5%AC%20%ED%9D%A5%EB%8D%951%EB%A1%9C%2013%20%ED%9D%A5%EB%8D%95IT%EB%B0%9C%EB%A6%AC&t=&z=15&ie=UTF8&iwloc=&output=embed"
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              minHeight: '450px'
            }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
