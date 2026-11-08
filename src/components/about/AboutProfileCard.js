"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./profile.module.css";

export default function AboutProfileCard({ photos }) {
  const cafeIndex = photos.findIndex((photo) =>
    photo.src.includes("profile-3"),
  );
  const [active, setActive] = useState(cafeIndex >= 0 ? cafeIndex : 0);
  const total = photos.length;
  const previous = (active - 1 + total) % total;
  const next = (active + 1) % total;

  const sideCard = (index, position) => {
    const photo = photos[index];
    return (
      <button
        key={`${position}-${photo.src}`}
        type="button"
        onClick={() => setActive(index)}
        className={`${styles.sideCard} ${styles[position]}`}
        aria-label={`切换照片：${photo.alt}`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 760px) 30vw, 220px"
          className={styles.photo}
        />
      </button>
    );
  };

  return (
    <div className={styles.profile}>
      <div className={styles.photoStage}>
        {sideCard(previous, "sideLeft")}
        {sideCard(next, "sideRight")}

        <div key={photos[active].src} className={styles.centerCard}>
          <Image
            src={photos[active].src}
            alt={photos[active].alt}
            fill
            priority
            sizes="(max-width: 760px) 56vw, 330px"
            className={styles.photo}
          />
        </div>

        <div className={styles.bubble} aria-hidden="true">
          <strong>Glimpses of me</strong>
        </div>
      </div>
    </div>
  );
}
