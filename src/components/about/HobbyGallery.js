"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const photos = [
  { src: "/images/hobbies/walk-sunset-bikes.webp", alt: "傍晚骑车经过校园", w: 1000, h: 750 },
  { src: "/images/hobbies/food-bbq.webp", alt: "烤肉", w: 1000, h: 750 },
  { src: "/images/hobbies/city-night.webp", alt: "夜晚的城市建筑", w: 562, h: 1000 },
  { src: "/images/hobbies/food-chicken-pot.webp", alt: "土豆鸡块面", w: 563, h: 1000 },
  { src: "/images/hobbies/walk-sky.webp", alt: "傍晚的天空和路灯", w: 1000, h: 750 },
  { src: "/images/hobbies/food-tofu-pot.webp", alt: "砂锅菜", w: 750, h: 1000 },
  { src: "/images/hobbies/theater.webp", alt: "剧场穹顶", w: 562, h: 1000 },
  { src: "/images/hobbies/food-beef-noodles.webp", alt: "牛肉粿条粉", w: 750, h: 1000 },
  { src: "/images/hobbies/cat-lazy.webp", alt: "趴在地上的橘猫", w: 1000, h: 750 },
  { src: "/images/hobbies/drink-matcha.webp", alt: "抹茶饮品", w: 750, h: 1000 },
  { src: "/images/hobbies/walk-old-street.webp", alt: "老街上的白色建筑", w: 1000, h: 750 },
  { src: "/images/hobbies/food-tofu.webp", alt: "家常豆腐", w: 1000, h: 750 },
  { src: "/images/hobbies/walk-historic-room.webp", alt: "旧式会客厅", w: 562, h: 1000 },
  { src: "/images/hobbies/food-fish-pot.webp", alt: "砂锅鱼头", w: 1000, h: 750 },
  { src: "/images/hobbies/walk-sunset-street.webp", alt: "傍晚街巷的晚霞", w: 750, h: 1000 },
  { src: "/images/hobbies/food-hotpot.webp", alt: "部队锅", w: 750, h: 1000 },
  { src: "/images/hobbies/walk-beach.webp", alt: "海边沙滩", w: 1000, h: 750 },
  { src: "/images/hobbies/food-rice-bowl.webp", alt: "拌饭", w: 1000, h: 563 },
];

function GalleryItem({ photo, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const fromLeft = index % 2 === 0;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className="mb-3 break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0, 0, 0) rotate(0deg)"
          : `translate3d(${fromLeft ? -14 : 14}px, 46px, 0) rotate(${fromLeft ? -1.6 : 1.6}deg)`,
        transition: `opacity 0.7s ease ${(index % 4) * 70}ms, transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${(index % 4) * 70}ms`,
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.w}
        height={photo.h}
        className="h-auto w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
      />
    </figure>
  );
}

export default function HobbyGallery() {
  return (
    <div className="mt-6 columns-2 gap-3 sm:columns-3 lg:columns-4">
      {photos.map((photo, index) => (
        <GalleryItem key={photo.src} photo={photo} index={index} />
      ))}
    </div>
  );
}
