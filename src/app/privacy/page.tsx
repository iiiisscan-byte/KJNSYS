import styles from "./Legal.module.css";

export default function PrivacyPage() {
  const lastUpdated = "2026년 5월 12일";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>개인정보처리방침</h1>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <p className={styles.paragraph}>
            (주)케이제이엔시스(이하 '회사')는 고객님의 개인정보를 소중하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 
            회사는 개인정보처리방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 
            개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>1. 수집하는 개인정보 항목 및 수집방법</h2>
          <p className={styles.paragraph}>회사는 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>수집항목: 이름, 회사명, 연락처, 이메일, 문의사항, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보 등</li>
            <li className={styles.listItem}>수집방법: 홈페이지(문의하기), 이메일, 전화, 팩스</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>2. 개인정보의 수집 및 이용목적</h2>
          <p className={styles.paragraph}>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산: 콘텐츠 제공, 구매 및 요금 결제, 물품배송 또는 청구지 등 발송</li>
            <li className={styles.listItem}>고객 관리: 고객 상담 및 문의 답변, 불만처리 등 민원처리, 고지사항 전달</li>
            <li className={styles.listItem}>마케팅 및 광고에 활용: 신규 서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>3. 개인정보의 보유 및 이용기간</h2>
          <p className={styles.paragraph}>
            회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계 법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
            <li className={styles.listItem}>방문에 관한 기록(로그): 3개월 (통신비밀보호법)</li>
            <li className={styles.listItem}>기타 상담 및 문의 내용: 목적 달성 후 1년</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>4. 개인정보의 파기절차 및 방법</h2>
          <p className={styles.paragraph}>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.</p>
          <h3 className={styles.subSectionTitle}>파기절차</h3>
          <p className={styles.paragraph}>상담 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.</p>
          <h3 className={styles.subSectionTitle}>파기방법</h3>
          <p className={styles.paragraph}>전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>5. 이용자 및 법정대리인의 권리와 그 행사방법</h2>
          <p className={styles.paragraph}>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지(동의철회)를 요청할 수도 있습니다. 개인정보 관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>6. 개인정보 자동 수집 장치의 설치, 운영 및 그 거부에 관한 사항</h2>
          <p className={styles.paragraph}>회사는 귀하의 정보를 수시로 저장하고 찾아내는 '쿠키(cookie)' 등을 운용합니다. 쿠키란 웹사이트를 운영하는데 이용되는 서버가 귀하의 브라우저에 보내는 아주 작은 텍스트 파일로서 귀하의 컴퓨터 하드디스크에 저장됩니다.</p>
          <h3 className={styles.subSectionTitle}>쿠키 설정 거부 방법</h3>
          <p className={styles.paragraph}>회원님은 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 회원님은 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>7. 개인정보 보호책임자 및 상담신고</h2>
          <p className={styles.paragraph}>회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보 보호책임자를 지정하고 있습니다.</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>개인정보 보호책임자: 김영덕</li>
            <li className={styles.listItem}>전화번호: 031-273-9171</li>
          </ul>
        </div>
      </div>
      
      <p style={{ marginTop: '4rem', fontSize: '0.9rem', color: '#888' }}>시행일자: {lastUpdated}</p>
    </div>
  );
}
