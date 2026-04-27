export default function ProductPage() {
  return (
    <div className="container mt-2 mb-2">
      <h2 className="mb-1 text-center" style={{ color: 'var(--primary)' }}>평판 스캐너</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {/* Placeholder for products */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0', marginBottom: '1rem', borderRadius: '4px' }}></div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>KJ-Flatbed Pro 100</h3>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>고해상도 A3 평판 스캐너</p>
        </div>
      </div>
    </div>
  );
}
