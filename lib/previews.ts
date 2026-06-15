import type { Match } from "./types";
import type { Locale } from "./i18n";
import { getTeam } from "./teams";

type L = Record<Locale, string>;

/**
 * Pre-match "what the press says" previews for the album. These are editorial
 * syntheses written for this fan project — they paraphrase the kind of build-up
 * each fixture would draw, attributed to the outlets that would naturally cover
 * it (a Spanish tie → Marca/AS, a German one → Kicker, …). They are NOT verbatim
 * quotes. See `dict.previews.disclaimer`.
 *
 * Keyed by the unordered pair of team ids so a preview is found whichever way
 * the fixtures feed orders home/away. Any match without a curated entry falls
 * back to a generated preview built from team metadata (see `generate`), so the
 * page always renders something credible for whatever match is next.
 */

export interface PreviewTake {
  /** outlet name — proper noun, not translated */
  outlet: string;
  /** byline — proper noun, not translated */
  pundit?: string;
  quote: L;
}

export interface MatchPreview {
  /** team id (lowercase FIFA code) */
  home: string;
  away: string;
  /** predicted scoreline in this home/away orientation */
  predHome: number;
  predAway: number;
  verdict: L;
  keyBattle: L;
  takes: PreviewTake[];
}

export interface ResolvedPreview extends MatchPreview {
  /** true when synthesised from metadata rather than hand-written */
  generated: boolean;
}

const PREVIEWS: MatchPreview[] = [
  {
    home: "ned",
    away: "jpn",
    predHome: 2,
    predAway: 1,
    verdict: {
      en: "A genuine toss-up dressed as a mismatch. The Netherlands carry the bigger names, but Japan's pressing has tormented European sides before.",
      vi: "Một cặp đấu cân bằng núp dưới vẻ ngoài chênh lệch. Hà Lan có dàn sao sáng hơn, nhưng lối pressing của Nhật Bản từng làm khổ nhiều đội châu Âu.",
    },
    keyBattle: {
      en: "Dutch high line vs Japan's quick transitions through the half-spaces.",
      vi: "Hàng thủ dâng cao của Hà Lan đối đầu những pha chuyển trạng thái nhanh của Nhật qua khoảng trống nửa sân.",
    },
    takes: [
      {
        outlet: "BBC Sport",
        quote: {
          en: "Oranje have the talent to win the group, but Japan are nobody's free three points — expect them to make this uncomfortable.",
          vi: "Hà Lan đủ tài năng để nhất bảng, nhưng Nhật Bản không phải ba điểm dễ dàng — họ sẽ khiến trận này rất khó chịu.",
        },
      },
      {
        outlet: "ESPN",
        quote: {
          en: "Whether the Dutch back line can defend space rather than bodies is the question Japan are built to ask.",
          vi: "Liệu hàng thủ Hà Lan có biết phòng ngự khoảng trống thay vì kèm người — đó chính là câu hỏi mà Nhật Bản được tạo ra để đặt.",
        },
      },
    ],
  },
  {
    home: "ger",
    away: "cuw",
    predHome: 3,
    predAway: 0,
    verdict: {
      en: "Germany should have far too much, but the night belongs to Curaçao — the smallest nation ever to reach a World Cup finals.",
      vi: "Đức vượt trội về mọi mặt, nhưng đêm nay thuộc về Curaçao — quốc gia nhỏ nhất lịch sử từng góp mặt ở một vòng chung kết World Cup.",
    },
    keyBattle: {
      en: "Germany's patience against a deep, disciplined Curaçao block.",
      vi: "Sự kiên nhẫn của Đức trước khối phòng ngự lùi sâu, kỷ luật của Curaçao.",
    },
    takes: [
      {
        outlet: "Kicker",
        quote: {
          en: "Anything less than a comfortable win would be a story; the real test is breaking down a side with nothing to lose.",
          vi: "Bất kỳ kết quả nào dưới một chiến thắng nhẹ nhàng đều thành đề tài; thử thách thật sự là xuyên thủng một đội chẳng còn gì để mất.",
        },
      },
      {
        outlet: "The Guardian",
        quote: {
          en: "Forget the rankings for ninety minutes — Curaçao being here at all is the result that matters.",
          vi: "Hãy quên thứ hạng trong chín mươi phút — việc Curaçao hiện diện ở đây mới là kết quả đáng nói nhất.",
        },
      },
    ],
  },
  {
    home: "esp",
    away: "cpv",
    predHome: 3,
    predAway: 0,
    verdict: {
      en: "Spain's possession game meets Cabo Verde's first-ever World Cup match. Class should tell, but the Blue Sharks have bite on the break.",
      vi: "Lối chơi kiểm soát bóng của Tây Ban Nha gặp trận World Cup đầu tiên trong lịch sử Cabo Verde. Đẳng cấp sẽ lên tiếng, nhưng \"Cá mập xanh\" rất sắc bén trong những pha phản công.",
    },
    keyBattle: {
      en: "Spain's midfield rotations vs Cabo Verde's compact, counter-ready shape.",
      vi: "Khả năng luân chuyển ở tuyến giữa của Tây Ban Nha trước đội hình co cụm, luôn chực phản công của Cabo Verde.",
    },
    takes: [
      {
        outlet: "Marca",
        quote: {
          en: "La Roja are the favourites in every column, but a slow start could let an organised debutant believe.",
          vi: "La Roja là ứng viên số một ở mọi khía cạnh, nhưng khởi đầu chậm chạp có thể khiến tân binh có tổ chức này nuôi hy vọng.",
        },
      },
      {
        outlet: "AS",
        quote: {
          en: "Tempo is everything: move the ball quickly and it's routine; play in front of them and it gets nervy.",
          vi: "Nhịp độ là tất cả: luân chuyển bóng nhanh thì mọi thứ nhẹ nhàng; cầm bóng trước mặt họ sẽ thành căng thẳng.",
        },
      },
    ],
  },
  {
    home: "bel",
    away: "egy",
    predHome: 2,
    predAway: 1,
    verdict: {
      en: "Belgium's golden-generation depth against an Egypt side that lives and dies with its talisman up top.",
      vi: "Chiều sâu của thế hệ vàng Bỉ đối đầu một Ai Cập sống còn nhờ ngôi sao trên hàng công.",
    },
    keyBattle: {
      en: "Egypt's counters down the right vs a Belgium defence that can be turned.",
      vi: "Những pha phản công bên cánh phải của Ai Cập trước hàng thủ Bỉ dễ bị xoay trở.",
    },
    takes: [
      {
        outlet: "Sky Sports",
        quote: {
          en: "Belgium have the squad to control it, but give Egypt's frontman a yard and the game changes in a heartbeat.",
          vi: "Bỉ đủ lực lượng để kiểm soát, nhưng chỉ cần cho ngôi sao Ai Cập một khoảng trống, trận đấu đổi chiều trong tích tắc.",
        },
      },
      {
        outlet: "Goal",
        quote: {
          en: "A measured opener for both: nobody wants to chase the group after losing the first match.",
          vi: "Một trận mở màn thận trọng cho cả hai: không ai muốn phải rượt đuổi cả bảng sau thất bại đầu tiên.",
        },
      },
    ],
  },
  {
    home: "hai",
    away: "sco",
    predHome: 1,
    predAway: 2,
    verdict: {
      en: "Scotland's experience and set-piece threat against the fearless energy of a Haiti side savouring a rare finals appearance.",
      vi: "Kinh nghiệm và sức mạnh bóng chết của Scotland trước nguồn năng lượng quả cảm của một Haiti đang tận hưởng lần hiếm hoi góp mặt ở vòng chung kết.",
    },
    keyBattle: {
      en: "Scottish set pieces vs Haiti's pace in transition.",
      vi: "Bóng chết của Scotland đối đầu tốc độ chuyển trạng thái của Haiti.",
    },
    takes: [
      {
        outlet: "BBC Sport",
        quote: {
          en: "Scotland start as favourites and will fancy the dead-ball duel, but Haiti's directness could punish any lapse.",
          vi: "Scotland được đánh giá cao hơn và tự tin ở các tình huống cố định, nhưng lối chơi trực diện của Haiti có thể trừng phạt mọi sơ hở.",
        },
      },
      {
        outlet: "The Athletic",
        quote: {
          en: "Tight, tense and decided by the margins — exactly the kind of opener that shapes a group.",
          vi: "Chặt chẽ, căng thẳng và được định đoạt bởi những chi tiết nhỏ — đúng kiểu trận mở màn định hình cả bảng đấu.",
        },
      },
    ],
  },
  {
    home: "aus",
    away: "tur",
    predHome: 1,
    predAway: 1,
    verdict: {
      en: "Two well-drilled sides separated by almost nothing. Australia's running power meets Türkiye's technical edge in midfield.",
      vi: "Hai đội bóng được tổ chức tốt, gần như ngang ngửa. Sức bền của Australia gặp sự khéo léo của Thổ Nhĩ Kỳ ở tuyến giữa.",
    },
    keyBattle: {
      en: "Türkiye's playmakers vs the relentless pressing of the Socceroos.",
      vi: "Những nhạc trưởng của Thổ Nhĩ Kỳ trước lối pressing không khoan nhượng của Socceroos.",
    },
    takes: [
      {
        outlet: "ESPN",
        quote: {
          en: "On paper Türkiye are the more gifted, but tournaments reward the team that runs harder for longer.",
          vi: "Trên giấy tờ Thổ Nhĩ Kỳ nhỉnh hơn về kỹ thuật, nhưng các giải đấu luôn tưởng thưởng đội chạy nhiều và bền hơn.",
        },
      },
      {
        outlet: "Fox Sports",
        quote: {
          en: "A draw would suit nobody — both know how quickly a group can slip away from the team that blinks first.",
          vi: "Một trận hòa chẳng làm vừa lòng ai — cả hai đều hiểu cả bảng có thể tuột mất nhanh thế nào với đội nao núng trước.",
        },
      },
    ],
  },
];

const pairKey = (a: string, b: string): string => [a, b].sort().join("|");

const MAP = new Map<string, MatchPreview>(
  PREVIEWS.map((p) => [pairKey(p.home, p.away), p])
);

/** Title-case a slug fallback when a live id has no static team entry. */
function prettyName(id: string): string {
  return id
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const teamName = (id: string, fallback?: string): string =>
  getTeam(id)?.name ?? fallback ?? prettyName(id);

/**
 * Synthesise a credible preview from FIFA ranking and confederation when no
 * curated entry exists for the fixture. The favourite (lower rank number) gets
 * an edge that scales with the ranking gap.
 */
function generate(m: Match): MatchPreview {
  const hRank = getTeam(m.home)?.fifaRank ?? 99;
  const aRank = getTeam(m.away)?.fifaRank ?? 99;
  const home = teamName(m.home, m.homeName);
  const away = teamName(m.away, m.awayName);

  const homeFav = hRank <= aRank;
  const fav = homeFav ? home : away;
  const dog = homeFav ? away : home;
  const gap = Math.abs(hRank - aRank);

  const favGoals = gap > 30 ? 3 : gap > 12 ? 2 : 1;
  const dogGoals = gap > 30 ? 0 : 1;

  return {
    home: m.home,
    away: m.away,
    predHome: homeFav ? favGoals : dogGoals,
    predAway: homeFav ? dogGoals : favGoals,
    verdict: {
      en: `${fav} go in as the form pick, but ${dog} have enough to make this a real contest in the opening exchanges.`,
      vi: `${fav} được đánh giá nhỉnh hơn về phong độ, nhưng ${dog} đủ sức biến trận này thành cuộc đấu thực sự ngay từ những phút đầu.`,
    },
    keyBattle: {
      en: `Whether ${fav} can impose their rhythm before ${dog} settle into the game.`,
      vi: `Liệu ${fav} có áp đặt được nhịp độ trước khi ${dog} kịp nhập cuộc.`,
    },
    takes: [
      {
        outlet: "Opta",
        quote: {
          en: `The model leans ${fav}, but the margin is slimmer than the ranking gap suggests.`,
          vi: `Mô hình nghiêng về ${fav}, nhưng khoảng cách thực tế hẹp hơn những gì thứ hạng phản ánh.`,
        },
      },
      {
        outlet: "FIFA.com",
        quote: {
          en: `A first look at two sides still finding their tournament rhythm — early goals could decide the mood of the group.`,
          vi: `Lần chạm trán đầu tiên của hai đội còn đang tìm nhịp giải đấu — những bàn thắng sớm có thể quyết định không khí cả bảng.`,
        },
      },
    ],
  };
}

/** Curated preview for a fixture if one exists, otherwise a generated one. */
export function previewForMatch(m: Match): ResolvedPreview {
  const curated = MAP.get(pairKey(m.home, m.away));
  if (curated) return { ...curated, generated: false };
  return { ...generate(m), generated: true };
}
