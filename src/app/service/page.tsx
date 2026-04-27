export default function ServicePage() {
  return (
    <div className="container mt-2 mb-2">
      <h2 className="mb-1 text-center" style={{ color: 'var(--primary)' }}>고객센터 안내</h2>
      <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '2rem auto' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>운영 시간 및 연락처</h3>
        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--accent)', lineHeight: '2' }}>
          <li><strong>평일:</strong> 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</li>
          <li><strong>휴무:</strong> 주말 및 공휴일</li>
          <li><strong>전화:</strong> 031-273-9171</li>
          <li><strong>이메일:</strong> isscan@kjnsys.com</li>
        </ul>
      </div>
    </div>
  );
}
