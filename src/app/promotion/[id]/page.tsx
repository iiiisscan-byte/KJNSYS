import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../promotion-detail.module.css";

async function getPromotion(id: string) {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function PromotionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const promotion = await getPromotion(id);

  if (!promotion) {
    notFound();
  }

  return (
    <div className={styles.detailContainer}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.categoryBadge}>
          <span className={styles.category}>{promotion.category}</span>
          {promotion.badge && <span className={styles.badge}>{promotion.badge}</span>}
        </div>
        <h1 className={styles.title}>{promotion.title}</h1>
      </section>

      {/* Main Content Card */}
      <main className={styles.mainContent}>
        {/* Promotion Image inside card */}
        <div className={styles.imageWrapper}>
          <Image
            src={promotion.image_url || "/images/placeholder.png"}
            alt={promotion.title}
            fill
            className={styles.promoImage}
            priority
          />
        </div>

        <div className={styles.descriptionSection}>
          <div className={styles.description}>
            {promotion.description}
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/#promotions" className={styles.backBtn}>
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
