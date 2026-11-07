"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const photos = [
  {
    src: "/images/hobbies/walk-sunset-bikes.webp",
    alt: "傍晚骑车经过校园",
    x: 14,
    y: 24,
    w: 27,
    z: 2,
    r: -6,
  },
  {
    src: "/images/hobbies/food-bbq.webp",
    alt: "烤肉",
    x: 39,
    y: 25,
    w: 30,
    z: 3,
    r: 3,
  },
  {
    src: "/images/hobbies/cat-lazy.webp",
    alt: "趴在地上的橘猫",
    x: 66,
    y: 26,
    w: 25,
    z: 2,
    r: 5,
  },
  {
    src: "/images/hobbies/food-chicken-pot.webp",
    alt: "土豆鸡块面",
    x: 25,
    y: 56,
    w: 29,
    z: 4,
    r: 4,
  },
  {
    src: "/images/hobbies/walk-sky.webp",
    alt: "傍晚的天空和路灯",
    x: 53,
    y: 48,
    w: 33,
    z: 5,
    r: -3,
  },
  {
    src: "/images/hobbies/food-tofu.webp",
    alt: "家常豆腐",
    x: 80,
    y: 59,
    w: 24,
    z: 3,
    r: 6,
  },
  {
    src: "/images/hobbies/city-night.webp",
    alt: "夜晚的城市建筑",
    x: 40,
    y: 70,
    w: 25,
    z: 4,
    r: -4,
  },
  {
    src: "/images/hobbies/food-hotpot.webp",
    alt: "部队锅",
    x: 67,
    y: 72,
    w: 23,
    z: 2,
    r: 3,
  },
  {
    src: "/images/hobbies/walk-beach.webp",
    alt: "海边沙滩",
    x: 10,
    y: 68,
    w: 22,
    z: 2,
    r: -5,
  },
];

export default function HobbyGallery() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative mt-6 h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(7,13,12,0.5)] sm:h-[520px]"
      aria-label="爱好照片墙"
    >
      {photos.map((photo, index) => (
        <figure
          key={photo.src}
          className="group absolute overflow-hidden rounded-xl border border-white/15 bg-black/30 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          style={{
            left: `${photo.x}%`,
            top: `${photo.y}%`,
            width: `${photo.w}%`,
            zIndex: photo.z,
            aspectRatio: "4 / 3",
            opacity: visible ? 1 : 0,
            transform: visible
              ? `translate(-50%, -50%) rotate(${photo.r}deg) scale(1)`
              : `translate(-50%, calc(-50% + 72px)) rotate(${photo.r}deg) scale(0.9)`,
            transition: `opacity 0.45s ease ${index * 110}ms, transform 0.8s cubic-bezier(0.22, 1.35, 0.36, 1) ${index * 110}ms`,
          }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 760px) 34vw, 300px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </figure>
      ))}
    </div>
  );
}
