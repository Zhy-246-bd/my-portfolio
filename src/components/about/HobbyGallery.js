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

const SLOT_COUNT = 12;

const ZONES = [
  { x: 12, y: 25 },
  { x: 29, y: 47 },
  { x: 46, y: 24 },
  { x: 63, y: 49 },
  { x: 79, y: 27 },
  { x: 88, y: 43 },
  { x: 16, y: 67 },
  { x: 33, y: 77 },
  { x: 50, y: 62 },
  { x: 68, y: 75 },
  { x: 84, y: 64 },
  { x: 42, y: 38 },
];

const INITIAL_LAYOUTS = ZONES.map((zone, index) => ({
  ...zone,
  zone: index,
  w: 20,
  z: index + 1,
  r: index % 2 === 0 ? -4 : 4,
}));

const INITIAL_SLOTS = INITIAL_LAYOUTS.map((layout, index) => ({
  id: index,
  photo: PHOTO_POOL[index],
  ...layout,
}));

function zoneLayout(existing = []) {
  const used = new Set(existing.map((slot) => slot.zone));
  const free = ZONES.map((zone, index) => index).filter(
    (index) => !used.has(index),
  );
  const zone = free[Math.floor(Math.random() * free.length)] ?? 0;
  const base = ZONES[zone];
  return {
    zone,
    x: base.x + (Math.random() - 0.5) * 4,
    y: base.y + (Math.random() - 0.5) * 4,
    w: 20,
    r: -5 + Math.random() * 10,
  };
}

function randomSlots() {
  const shuffled = [...PHOTO_POOL];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  const layouts = [];
  return shuffled.slice(0, SLOT_COUNT).map((photo, index) => {
    const layout = zoneLayout(layouts);
    layouts.push(layout);
    return {
      id: index,
      photo,
      ...layout,
      z: index + 1,
    };
  });
}

export default function HobbyGallery() {
  const ref = useRef(null);
  const topZ = useRef(SLOT_COUNT + 1);
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
      { threshold: 0.05, rootMargin: "420px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const rotateSlot = (id) => {
    const nextZ = topZ.current;
    topZ.current += 1;
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
              z: nextZ,
              ...zoneLayout(current.filter((slot) => slot.id !== id)),
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
            "--delay": `${index * -(7 / SLOT_COUNT)}s`,
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
