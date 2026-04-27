import styles from "./InfoCard.module.css";
import Image from "next/image";
import Link from "next/link";

interface InfoCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  category?: string;
  badge?: string;
}

export default function InfoCard({ title, description, image, link, category, badge }: InfoCardProps) {
  return (
    <Link href={link} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image 
          src={image} 
          alt={title} 
          fill 
          className={styles.image}
        />
        {category && <span className={styles.category}>{category}</span>}
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.more}>자세히 보기 &rarr;</span>
      </div>
    </Link>
  );
}
