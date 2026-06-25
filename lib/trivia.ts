import type { Locale } from "./i18n";

type L = Record<Locale, string>;

export interface TriviaQ {
  q: L;
  options: L[];
  /** index into options of the correct answer */
  answer: number;
}

// World Cup trivia — historical / format facts (no 2026 results, which are future).
export const TRIVIA: TriviaQ[] = [
  {
    q: { en: "How many teams play at the 2026 World Cup?", vi: "World Cup 2026 có bao nhiêu đội?" },
    options: [
      { en: "32", vi: "32" },
      { en: "40", vi: "40" },
      { en: "48", vi: "48" },
      { en: "64", vi: "64" },
    ],
    answer: 2,
  },
  {
    q: { en: "How many countries host the 2026 World Cup?", vi: "Bao nhiêu nước đồng chủ nhà World Cup 2026?" },
    options: [
      { en: "1", vi: "1" },
      { en: "2", vi: "2" },
      { en: "3", vi: "3" },
      { en: "4", vi: "4" },
    ],
    answer: 2,
  },
  {
    q: { en: "Which nation has won the most World Cups?", vi: "Đội nào vô địch World Cup nhiều nhất?" },
    options: [
      { en: "Germany", vi: "Đức" },
      { en: "Brazil", vi: "Brazil" },
      { en: "Italy", vi: "Ý" },
      { en: "Argentina", vi: "Argentina" },
    ],
    answer: 1,
  },
  {
    q: { en: "How many matches will the 2026 World Cup have?", vi: "World Cup 2026 có bao nhiêu trận?" },
    options: [
      { en: "64", vi: "64" },
      { en: "80", vi: "80" },
      { en: "104", vi: "104" },
      { en: "128", vi: "128" },
    ],
    answer: 2,
  },
  {
    q: { en: "Who won the 2022 World Cup?", vi: "Ai vô địch World Cup 2022?" },
    options: [
      { en: "France", vi: "Pháp" },
      { en: "Argentina", vi: "Argentina" },
      { en: "Brazil", vi: "Brazil" },
      { en: "Croatia", vi: "Croatia" },
    ],
    answer: 1,
  },
  {
    q: { en: "How many groups are there in 2026?", vi: "World Cup 2026 chia bao nhiêu bảng?" },
    options: [
      { en: "8", vi: "8" },
      { en: "12", vi: "12" },
      { en: "16", vi: "16" },
      { en: "4", vi: "4" },
    ],
    answer: 1,
  },
  {
    q: { en: "How many teams reach the knockout round in 2026?", vi: "Bao nhiêu đội vào vòng loại trực tiếp 2026?" },
    options: [
      { en: "16", vi: "16" },
      { en: "24", vi: "24" },
      { en: "32", vi: "32" },
      { en: "48", vi: "48" },
    ],
    answer: 2,
  },
  {
    q: { en: "Where was the first World Cup held, in 1930?", vi: "World Cup đầu tiên (1930) tổ chức ở đâu?" },
    options: [
      { en: "Brazil", vi: "Brazil" },
      { en: "Uruguay", vi: "Uruguay" },
      { en: "Italy", vi: "Ý" },
      { en: "France", vi: "Pháp" },
    ],
    answer: 1,
  },
  {
    q: { en: "Who is the all-time top scorer in World Cup history (men)?", vi: "Ai ghi nhiều bàn nhất lịch sử World Cup (nam)?" },
    options: [
      { en: "Ronaldo", vi: "Ronaldo (Béo)" },
      { en: "Miroslav Klose", vi: "Miroslav Klose" },
      { en: "Lionel Messi", vi: "Lionel Messi" },
      { en: "Gerd Müller", vi: "Gerd Müller" },
    ],
    answer: 1,
  },
  {
    q: { en: "Which new knockout round debuts in 2026?", vi: "Vòng knockout mới ra mắt năm 2026 là gì?" },
    options: [
      { en: "Round of 32", vi: "Vòng 1/16 (32 đội)" },
      { en: "Round of 24", vi: "Vòng 24 đội" },
      { en: "Play-in round", vi: "Vòng play-in" },
      { en: "Repechage", vi: "Vòng vớt" },
    ],
    answer: 0,
  },
  {
    q: { en: "How many host cities are there in 2026?", vi: "World Cup 2026 có bao nhiêu thành phố chủ nhà?" },
    options: [
      { en: "11", vi: "11" },
      { en: "14", vi: "14" },
      { en: "16", vi: "16" },
      { en: "20", vi: "20" },
    ],
    answer: 2,
  },
  {
    q: { en: "Which animal is Canada's mascot, Maple?", vi: "Linh vật Maple của Canada là con gì?" },
    options: [
      { en: "Beaver", vi: "Hải ly" },
      { en: "Moose", vi: "Nai sừng tấm" },
      { en: "Bear", vi: "Gấu" },
      { en: "Eagle", vi: "Đại bàng" },
    ],
    answer: 1,
  },
  {
    q: { en: "Which animal is Mexico's mascot, Zayu?", vi: "Linh vật Zayu của Mexico là con gì?" },
    options: [
      { en: "Eagle", vi: "Đại bàng" },
      { en: "Jaguar", vi: "Báo đốm" },
      { en: "Puma", vi: "Sư tử núi" },
      { en: "Snake", vi: "Rắn" },
    ],
    answer: 1,
  },
  {
    q: { en: "Which animal is the USA mascot, Clutch?", vi: "Linh vật Clutch của Mỹ là con gì?" },
    options: [
      { en: "Bald Eagle", vi: "Đại bàng đầu trắng" },
      { en: "Bison", vi: "Bò rừng" },
      { en: "Bear", vi: "Gấu" },
      { en: "Hawk", vi: "Diều hâu" },
    ],
    answer: 0,
  },
  {
    q: { en: "England's national team nickname is the…", vi: "Biệt danh đội tuyển Anh là…" },
    options: [
      { en: "Three Lions", vi: "Tam Sư" },
      { en: "Red Devils", vi: "Quỷ Đỏ" },
      { en: "Eagles", vi: "Đại bàng" },
      { en: "Roosters", vi: "Gà trống" },
    ],
    answer: 0,
  },
  {
    q: { en: "Australia's national team is nicknamed the…", vi: "Đội tuyển Úc có biệt danh là…" },
    options: [
      { en: "Kangaroos", vi: "Kangaroo" },
      { en: "Socceroos", vi: "Socceroos" },
      { en: "Wallabies", vi: "Wallabies" },
      { en: "Emus", vi: "Đà điểu Emu" },
    ],
    answer: 1,
  },
];

/** Pick the question for a given day index (deterministic, rotates daily). */
export function triviaForDay(dayIndex: number): TriviaQ {
  const i = ((dayIndex % TRIVIA.length) + TRIVIA.length) % TRIVIA.length;
  return TRIVIA[i];
}
