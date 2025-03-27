import Layout from '../components/Layout';
import styles from '../styles/Gallery.module.css';
import Image from 'next/image';

export default function Gallery() {
  const cakeImages = [1, 2, 3, 4, 5];

  return (
    <Layout title="作品集 | 念否">
      <div className={styles.galleryContainer}>
        <h1 className={styles.galleryTitle}>我们的作品</h1>
        <div className={styles.galleryGrid}>
          {cakeImages.map((img) => (
            <div key={img} className={styles.galleryItem}>
              <Image 
                src={`/images/${img}.jpg`} 
                alt={`蛋糕作品 ${img}`} 
                width={1440} 
                height={1440} 
                objectFit="cover"
              />
              <div className={styles.galleryItemContent}>
                <h3>精致蛋糕设计 {img}</h3>
                <p>独特工艺，美味呈现</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}