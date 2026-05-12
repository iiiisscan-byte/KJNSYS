"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FiArrowLeft, FiClock, FiTag } from "react-icons/fi";
import styles from "./SolutionDetail.module.css";

interface Solution {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
  manufacturer: string | null;
  features: any[] | null;
  specifications: any[] | null;
  created_at: string;
  categories: { name: string };
}

export default function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSolution() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, title, description, image_url, category_id, manufacturer, features, specifications, created_at,
          categories (name)
        `)
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error loading solution:", error);
        alert("존재하지 않는 솔루션이거나 삭제된 항목입니다.");
        router.push("/solution");
      } else {
        setSolution(data as any);
      }
      setLoading(false);
    }
    loadSolution();
  }, [id, router]);

  if (loading) return <div className="container mt-8 mb-8 text-center">정보를 불러오는 중...</div>;
  if (!solution) return null;

  return (
    <div className={styles.detailWrapper}>
      {/* 솔루션 소개 섹션 */}
      <div className={styles.introSection}>
        <div className="container">
          {/* 상단 네비게이션 */}
          <div style={{ marginBottom: '2rem' }}>
            <button 
              onClick={() => router.back()} 
              className={styles.backBtn}
            >
              <FiArrowLeft /> 목록으로 돌아가기
            </button>
          </div>

          <div className={styles.mainGrid}>
            {/* 솔루션 이미지 */}
            <div className={styles.imageBox}>
              {solution.image_url ? (
                <img src={solution.image_url} alt={solution.title} className={styles.solutionImage} />
              ) : (
                <div style={{ color: '#ccc' }}>대표 이미지가 없습니다.</div>
              )}
            </div>

            {/* 솔루션 정보 */}
            <div className={styles.infoBox}>
              <h1 className={styles.title}>
                {solution.title}
              </h1>
              
              <div className={styles.description}>
                {solution.description || "본 솔루션에 대한 소개가 등록되지 않았습니다."}
              </div>
              
              <div className={styles.metaInfo}>
                <div className={styles.metaItem}>
                  <FiClock /> 제조사: {solution.manufacturer || "-"}
                </div>
                <div className={styles.metaItem}>
                  <FiTag /> 분류: {solution.categories.name}
                </div>
              </div>
              
              <div style={{ marginTop: '3rem' }}>
                <Link href="/service/inquiry" className={styles.inquiryBtn}>
                  솔루션 도입 문의하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 특장점 (Features) */}
      {solution.features && solution.features.length > 0 && (
        <div className={styles.featuresSection}>
          <div className="container">
            <h3 className={styles.sectionTitle}>솔루션 특장점</h3>
            <div className={styles.featureList}>
              {solution.features.map((feature: any, idx: number) => (
                <div key={idx} className={styles.featureCard}>
                  <div className={styles.featureContent}>
                    <h4 className={styles.featureTitle}>
                      {feature.title}
                    </h4>
                    <p className={styles.featureDesc}>
                      {feature.description}
                    </p>
                  </div>
                  {feature.image_url && (
                    <div className={styles.featureImageBox}>
                      <img src={feature.image_url} alt={`${feature.title} 상세 이미지`} className={styles.featureImage} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 솔루션 사양 (Specifications) */}
      {solution.specifications && solution.specifications.length > 0 && (
        <div className={styles.specSection}>
          <div className="container">
            <h3 className={styles.sectionTitle}>사양 및 요구사항</h3>
            <div className={styles.specTableContainer}>
              <table className={styles.specTable}>
                <tbody>
                  {solution.specifications.map((spec: any, idx: number) => (
                    <tr key={idx}>
                      <th className={styles.specTh}>
                        {spec.label}
                      </th>
                      <td className={styles.specTd}>
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={styles.specNote}>
                * 상기 설명된 제품사양은 예고없이 변경될 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
