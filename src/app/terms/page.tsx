import styles from "../privacy/Legal.module.css";

export default function TermsPage() {
  const lastUpdated = "2026년 5월 12일";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>이용약관</h1>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제1조 (목적)</h2>
          <p className={styles.paragraph}>
            본 약관은 (주)케이제이엔시스(이하 "회사")가 운영하는 웹사이트(이하 "사이트")에서 제공하는 서비스 및 관련 기능(이하 "서비스")을 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제2조 (용어의 정의)</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>"사이트"란 회사가 정보를 제공하고 서비스를 운영하기 위해 설정한 가상의 공간을 의미합니다.</li>
            <li className={styles.listItem}>"이용자"란 사이트에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 받는 자를 의미합니다.</li>
            <li className={styles.listItem}>"서비스"란 회사가 사이트를 통해 제공하는 제품 정보, 솔루션 소개, 고객지원 등의 모든 서비스를 의미합니다.</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제3조 (약관의 명시와 개정)</h2>
          <p className={styles.paragraph}>
            회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 사이트의 초기 서비스 화면에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 약관이 개정될 경우에는 적용일자 및 개정 사유를 명시하여 사이트에 공지합니다.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제4조 (서비스의 제공 및 변경)</h2>
          <p className={styles.paragraph}>
            회사는 사이트를 통해 제품 및 솔루션 정보 제공, 온라인 문의 접수 등의 서비스를 제공합니다. 회사는 필요한 경우 서비스의 내용을 변경하거나 중단할 수 있으며, 이로 인해 이용자에게 발생하는 손해에 대해서는 회사의 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제5조 (이용자의 의무)</h2>
          <p className={styles.paragraph}>이용자는 다음 각 호의 행위를 하여서는 안 됩니다.</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>신청 또는 변경 시 허위 내용의 등록</li>
            <li className={styles.listItem}>사이트에 게시된 정보의 변경</li>
            <li className={styles.listItem}>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
            <li className={styles.listItem}>회사 및 제3자의 저작권 등 지식재산권에 대한 침해</li>
            <li className={styles.listItem}>회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제6조 (저작권의 귀속 및 이용제한)</h2>
          <p className={styles.paragraph}>
            회사가 작성한 저작물에 대한 저작권 기타 지식재산권은 회사에 귀속합니다. 이용자는 사이트를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제7조 (면책조항)</h2>
          <p className={styles.paragraph}>
            회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다. 또한 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제8조 (분쟁해결 및 관할법원)</h2>
          <p className={styles.paragraph}>
            회사와 이용자 간에 발생한 분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원을 전용 관할법원으로 합니다. 본 약관의 해석 및 분쟁 해결에 대해서는 대한민국 법령을 적용합니다.
          </p>
        </div>
      </div>
      
      <p style={{ marginTop: '4rem', fontSize: '0.9rem', color: '#888' }}>시행일자: {lastUpdated}</p>
    </div>
  );
}
