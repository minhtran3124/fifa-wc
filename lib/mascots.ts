import type { Locale } from "./i18n";

type L = Record<Locale, string>;

/**
 * Official FIFA World Cup 2026 mascots — the trio unveiled on 25 Sep 2025,
 * one per host nation. Source: fifa.com/.../canadamexicousa2026/mascots.
 * Emoji stand-ins are used in place of the (copyrighted) official artwork.
 */
export interface Mascot {
  name: string;
  emoji: string;
  flag: string;
  teamId: string;
  /** host-nation accent colour, used for the card glow/highlight */
  accent: string;
  animal: L;
  country: L;
  role: L;
  blurb: L;
}

export const MASCOTS: Mascot[] = [
  {
    name: "Maple",
    emoji: "🫎",
    flag: "🇨🇦",
    teamId: "can",
    accent: "#ef4444",
    animal: { en: "The Moose", vi: "Nai sừng tấm" },
    country: { en: "Canada", vi: "Canada" },
    role: { en: "Goalkeeper", vi: "Thủ môn" },
    blurb: {
      en: "A street-style artist and music lover who guards the net with creativity, resilience and unapologetic individuality.",
      vi: "Một nghệ sĩ đường phố mê âm nhạc, trấn giữ khung thành bằng sự sáng tạo, bền bỉ và cá tính riêng.",
    },
  },
  {
    name: "Zayu",
    emoji: "🐆",
    flag: "🇲🇽",
    teamId: "mex",
    accent: "#22c55e",
    animal: { en: "The Jaguar", vi: "Báo đốm" },
    country: { en: "Mexico", vi: "Mexico" },
    role: { en: "Striker", vi: "Tiền đạo" },
    blurb: {
      en: "A daring striker of exceptional agility — a symbol of cultural celebration carrying the heart of Mexico with pride.",
      vi: "Một tiền đạo nhanh nhẹn phi thường — biểu tượng của lễ hội văn hóa, mang theo trái tim Mexico đầy tự hào.",
    },
  },
  {
    name: "Clutch",
    emoji: "🦅",
    flag: "🇺🇸",
    teamId: "usa",
    accent: "#3b82f6",
    animal: { en: "The Bald Eagle", vi: "Đại bàng đầu trắng" },
    country: { en: "United States", vi: "Mỹ" },
    role: { en: "Midfielder", vi: "Tiền vệ" },
    blurb: {
      en: "A social spark and sports fanatic who, like every great midfielder, unites people wherever the game takes them.",
      vi: "Tâm điểm kết nối nơi tuyến giữa — như mọi tiền vệ xuất sắc, gắn kết mọi người ở bất cứ nơi đâu trái bóng lăn.",
    },
  },
];
