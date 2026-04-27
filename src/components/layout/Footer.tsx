import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiKakaoTalkFill } from "react-icons/ri";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topArea}>
          <div className={styles.info}>
            <div className={styles.companyName}>(주)케이제이엔시스</div>
            <p>경기도 용인시 기흥구 흥덕1로 13, 흥덕IT밸리 컴플렉스 B동 508호</p>
            <p>사업자번호 : 124-86-12790 &nbsp;|&nbsp; 대표자 : 승인배</p>
            <p>전화 : 031-273-9171 &nbsp;|&nbsp; 팩스 : 031-660-7066</p>
            <p>이메일 : isscan@kjnsys.com</p>
          </div>

          <div className={styles.linkSections}>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>바로가기</h4>
              <div className={styles.groupLinks}>
                <Link href="/">회사소개</Link>
                <Link href="/product">제품</Link>
                <Link href="/solution">솔루션</Link>
                <Link href="/service">고객지원</Link>
                <Link href="https://smartstore.naver.com/kjnsys" target="_blank" rel="noopener noreferrer">스토어</Link>
              </div>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>약관 및 정책</h4>
              <div className={styles.groupLinks}>
                <Link href="/terms">이용약관</Link>
                <Link href="/privacy">개인정보처리방침</Link>
              </div>
              <div className={styles.socialIcons}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://pf.kakao.com" target="_blank" rel="noopener noreferrer"><RiKakaoTalkFill /></a>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottomArea}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} KJNSYS Co., Ltd. All Rights Reserved.
          </div>
          <div className={styles.slogan}>
            Designed & Built for Professional Digitalization.
          </div>
        </div>
      </div>
    </footer>
  );
}
