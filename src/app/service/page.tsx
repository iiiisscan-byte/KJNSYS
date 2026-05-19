import styles from "./Service.module.css";

export default function ServicePage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>고객센터 안내</h2>
      
      <div className={styles.grid}>
        {/* Info Box */}
        <div className={styles.infoBox}>
          <h3 className={styles.sectionTitle}>
            운영 시간 및 연락처
          </h3>
          <ul className={styles.infoList}>
            <li className={styles.infoItem}>
              <div className={styles.label}>평일</div> 
              <div className={styles.value}>09:00 ~ 18:00 (점심 12:00 ~ 13:00)</div>
            </li>
            <li className={styles.infoItem}>
              <div className={styles.label}>휴무</div> 
              <div className={styles.value}>주말 및 공휴일</div>
            </li>
            <li className={styles.infoItem}>
              <div className={styles.label}>전화</div> 
              <div className={styles.value}><strong>031-273-9171</strong></div>
            </li>
            <li className={styles.infoItem}>
              <div className={styles.label}>팩스</div> 
              <div className={styles.value}>031-660-7066</div>
            </li>
            <li className={styles.infoItem}>
              <div className={styles.label}>이메일</div> 
              <div className={styles.value}>
                <a href="mailto:woojae@kjnsys.com" style={{ color: '#004a99', textDecoration: 'none' }}>woojae@kjnsys.com</a>
              </div>
            </li>
          </ul>
          
          <div className={styles.addressBox}>
            <strong>주소:</strong> 경기도 용인시 기흥구 흥덕1로 13, 흥덕IT밸리 컴플렉스 B동 508호
          </div>
        </div>

        {/* Map Box */}
        <div className={styles.mapBox}>
          <iframe 
            src="https://maps.google.com/maps?q=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%9A%A9%EC%9D%B8%EC%8B%9C%20%EA%B8%B0%ED%9D%A5%EA%B5%AC%20%ED%9D%A5%EB%8D%951%EB%A1%9C%2013%20%ED%9D%A5%EB%8D%95IT%EB%B0%9C%EB%A6%AC&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className={styles.mapFrame}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
