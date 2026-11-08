"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./hobby-gallery.module.css";

const PHOTO_POOL = [
  {
    src: "/images/hobbies/walk-sunset-bikes.webp",
    alt: "傍晚骑车经过校园",
  },
  {
    src: "/images/hobbies/food-bbq.webp",
    alt: "烤肉",
  },
  {
    src: "/images/hobbies/cat-lazy.webp",
    alt: "趴在地上的橘猫",
  },
  {
    src: "/images/hobbies/food-chicken-pot.webp",
    alt: "土豆鸡块面",
  },
  {
    src: "/images/hobbies/walk-sky.webp",
    alt: "傍晚的天空和路灯",
  },
  {
    src: "/images/hobbies/food-tofu.webp",
    alt: "家常豆腐",
  },
  {
    src: "/images/hobbies/city-night.webp",
    alt: "夜晚的城市建筑",
  },
  {
    src: "/images/hobbies/food-hotpot.webp",
    alt: "部队锅",
  },
  {
    src: "/images/hobbies/walk-beach.webp",
    alt: "海边沙滩",
  },
  {
    src: "/images/hobbies/walk-cat-street.webp",
    alt: "路边偶遇的黑白猫",
  },
  {
    src: "/images/hobbies/walk-goldfish.webp",
    alt: "挂在树上的金鱼瓶",
  },
  {
    src: "/images/hobbies/walk-cat-bag.webp",
    alt: "航空箱里的猫",
  },
  {
    src: "/images/hobbies/walk-pavilion.webp",
    alt: "公园湖边的亭子",
  },
  {
    src: "/images/hobbies/walk-dog.webp",
    alt: "草地上的边牧",
  },
  {
    src: "/images/hobbies/hobby-badminton.webp",
    alt: "羽毛球馆里的挂件",
  },
  {
    src: "/images/hobbies/walk-bikes-sunset.webp",
    alt: "傍晚的电动车和晚霞",
  },
  {
    src: "/images/hobbies/food-feast.webp",
    alt: "一桌家常菜",
  },
  {
    src: "/images/hobbies/walk-river-sunset.webp",
    alt: "河边的晚霞倒影",
  },
  {
    src: "/images/hobbies/walk-city-dusk.webp",
    alt: "傍晚的居民楼",
  },
];

const SLOT_COUNT = 10;

const INITIAL_LAYOUTS = [
  { x: 20, y: 27, w: 27, z: 2, r: -6 },
  { x: 44, y: 28, w: 30, z: 3, r: 3 },
  { x: 71, y: 29, w: 25, z: 2, r: 5 },
  { x: 27, y: 58, w: 29, z: 4, r: 4 },
  { x: 55, y: 52, w: 33, z: 5, r: -3 },
  { x: 81, y: 61, w: 24, z: 3, r: 6 },
  { x: 40, y: 72, w: 25, z: 4, r: -4 },
  { x: 67, y: 74, w: 23, z: 2, r: 3 },
  { x: 13, y: 70, w: 22, z: 2, r: -5 },
  { x: 88, y: 45, w: 21, z: 6, r: 7 },
];

const INITIAL_SLOTS = INITIAL_LAYOUTS.map((layout, index) => ({
  id: index,
  photo: PHOTO_POOL[index],
  ...layout,
}));

function randomLayout(existing = []) {
  let best = null;
  let bestScore = -1;

  for (let attempt = 0; attempt < 28; attempt += 1) {
    const candidate = {
      x: 14 + Math.random() * 72,
      y: 18 + Math.random() * 62,
      w: 21 + Math.random() * 9,
      z: 1 + Math.floor(Math.random() * 10),
      r: -8 + Math.random() * 16,
    };
    const score = existing.length
      ? Math.min(
          ...existing.map((slot) =>
            Math.hypot(candidate.x - slot.x, candidate.y - slot.y),
          ),
        )
      : 100;
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

function randomSlots() {
  const shuffled = [...PHOTO_POOL];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  const layouts = [];
  return shuffled.slice(0, SLOT_COUNT).map((photo, index) => {
    const layout = randomLayout(layouts);
    layouts.push(layout);
    return {
      id: index,
      photo,
      ...layout,
    };
  });
}

export default function HobbyGallery() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [slots, setSlots] = useState(INITIAL_SLOTS);

  useEffect(() => {
    setSlots(randomSlots());
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => setActive(entries[0].isIntersecting),
      { threshold: 0.05, rootMargin: "120px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const rotateSlot = (id) => {
    setSlots((current) => {
      const slot = current.find((item) => item.id === id);
      if (!slot) return current;
      const used = new Set(
        current
          .filter((item) => item.id !== id)
          .map((item) => item.photo.src),
      );
      const candidates = PHOTO_POOL.filter(
        (photo) => !used.has(photo.src) && photo.src !== slot.photo.src,
      );
      const nextPhoto =
        candidates[Math.floor(Math.random() * candidates.length)] ||
        slot.photo;
      return current.map((item) =>
        item.id === id
          ? {
              ...item,
              photo: nextPhoto,
              ...randomLayout(current.filter((slot) => slot.id !== id)),
            }
          : item,
      );
    });
  };

  return (
    <div
      ref={ref}
      className={`relative mt-6 h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(7,13,12,0.5)] sm:h-[520px] ${active ? "" : styles.paused}`}
      aria-label="爱好照片墙"
    >
      {slots.map((slot, index) => (
        <figure
          key={slot.id}
          className={`${styles.item} group absolute overflow-hidden rounded-xl border border-white/15 bg-black/30 shadow-[0_20px_50px_rgba(0,0,0,0.45)]`}
          style={{
            left: `${slot.x}%`,
            top: `${slot.y}%`,
            width: `${slot.w}%`,
            zIndex: slot.z,
            aspectRatio: "4 / 3",
            "--r": `${slot.r}deg`,
            "--delay": `${index * 0.4}s`,
          }}
          onAnimationIteration={() => rotateSlot(slot.id)}
        >
          {active && (
            <Image
              src={slot.photo.src}
              alt={slot.photo.alt}
              fill
              sizes="(max-width: 760px) 34vw, 300px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          )}
        </figure>
      ))}
    </div>
  );
}
