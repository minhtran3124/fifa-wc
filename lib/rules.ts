import type { Locale } from "./i18n";

type L = Record<Locale, string>;

/**
 * New / trialed Laws of the Game at the 2026 FIFA World Cup. These are IFAB
 * 2025/26 changes being applied or expanded at the tournament. Sourced from
 * IFAB announcements and reporting (Al Jazeera, Sky Sports, June 2026).
 */
export type RuleTag = "var" | "time" | "conduct" | "welfare";

export interface RuleChange {
  emoji: string;
  tag: RuleTag;
  title: L;
  desc: L;
}

export const RULE_CHANGES: RuleChange[] = [
  {
    emoji: "🧤",
    tag: "time",
    title: { en: "8-second goalkeeper limit", vi: "Giới hạn 8 giây cho thủ môn" },
    desc: {
      en: "Keepers may hold the ball for a maximum of 8 seconds — the referee shows a visual 5-second countdown — and holding on longer now concedes a corner to the opposition instead of an indirect free kick.",
      vi: "Thủ môn được giữ bóng tối đa 8 giây — trọng tài đếm ngược 5 giây bằng tay — giữ lâu hơn sẽ bị phạt góc cho đối phương thay vì đá phạt gián tiếp như trước.",
    },
  },
  {
    emoji: "⏱️",
    tag: "time",
    title: { en: "5-second restart countdown", vi: "Đếm ngược 5 giây khi nhập cuộc" },
    desc: {
      en: "Referees raise a hand and count down five seconds on throw-ins and goal kicks; failing to restart in time hands possession to the opponents.",
      vi: "Trọng tài giơ tay đếm ngược năm giây ở các tình huống ném biên và phát bóng; không thực hiện kịp sẽ trao quyền kiểm soát bóng cho đối thủ.",
    },
  },
  {
    emoji: "🔁",
    tag: "time",
    title: { en: "10-second substitutions", vi: "Thay người trong 10 giây" },
    desc: {
      en: "A substituted player must leave the pitch within 10 seconds of the board going up; dawdling delays their replacement coming on.",
      vi: "Cầu thủ bị thay phải rời sân trong vòng 10 giây từ khi bảng điện tử giơ lên; chần chừ sẽ làm chậm việc người vào thay.",
    },
  },
  {
    emoji: "📺",
    tag: "var",
    title: { en: "Expanded VAR", vi: "Mở rộng VAR" },
    desc: {
      en: "VAR can now review second yellow cards, mistaken identity, wrongly awarded corners, and fouls committed in the build-up before a restart.",
      vi: "VAR nay có thể xem lại thẻ vàng thứ hai, nhầm người, phạt góc sai và các lỗi trong pha xây dựng bóng trước khi bóng được đưa vào cuộc.",
    },
  },
  {
    emoji: "🤕",
    tag: "welfare",
    title: { en: "One-minute treatment penalty", vi: "Phạt một phút khi nhận chữa trị" },
    desc: {
      en: "An outfield player who receives medical treatment on the pitch must stay off for one minute after play resumes — goalkeepers and serious head injuries are exempt.",
      vi: "Cầu thủ (ngoài thủ môn) được chăm sóc y tế trên sân phải ở ngoài một phút sau khi bóng lăn lại — thủ môn và chấn thương đầu nghiêm trọng được miễn.",
    },
  },
  {
    emoji: "💧",
    tag: "welfare",
    title: { en: "Three-minute hydration breaks", vi: "Giải lao bù nước ba phút" },
    desc: {
      en: "Every match now has a three-minute hydration break in each half, taken around the 22nd minute.",
      vi: "Mỗi trận nay có một quãng nghỉ bù nước ba phút ở mỗi hiệp, diễn ra quanh phút thứ 22.",
    },
  },
  {
    emoji: "🤫",
    tag: "conduct",
    title: { en: "Mouth-covering offence", vi: "Lỗi che miệng khi tranh cãi" },
    desc: {
      en: "Covering the mouth during a confrontation can earn a red card — aimed at curbing hidden discriminatory or abusive remarks. Ordinary, friendly communication is exempt.",
      vi: "Che miệng trong lúc đôi co có thể bị thẻ đỏ — nhằm ngăn những phát ngôn phân biệt hay lăng mạ giấu mặt. Giao tiếp bình thường, thân thiện thì không bị phạt.",
    },
  },
  {
    emoji: "🚪",
    tag: "conduct",
    title: { en: "Leaving the pitch in protest", vi: "Rời sân để phản đối" },
    desc: {
      en: "Walking off the field to protest a referee's decision earns a red card, and a team that causes a match to be abandoned forfeits it.",
      vi: "Bỏ ra ngoài sân để phản đối quyết định của trọng tài sẽ bị thẻ đỏ, và đội khiến trận đấu bị hủy sẽ bị xử thua.",
    },
  },
];
