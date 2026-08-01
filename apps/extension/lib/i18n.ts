import type { Locale } from "@tin-ai-lens/types";

import { DEFAULT_LOCALE } from "~/lib/locale";

export type { Locale };
export { DEFAULT_LOCALE };

export type MessageKey =
  | "tagline"
  | "lede"
  | "analyze"
  | "extracting"
  | "analyzing"
  | "insufficient"
  | "genericError"
  | "footer"
  | "trustScore"
  | "confidence"
  | "scoreWithheld"
  | "scoreHint"
  | "summary"
  | "reasons"
  | "signals"
  | "claims"
  | "suggestions"
  | "uncertainty"
  | "warnings"
  | "notFlagged"
  | "uncertain"
  | "signalAi"
  | "signalClickbait"
  | "signalMissingSource"
  | "signalMissingAuthor"
  | "langVi"
  | "langEn"
  | "language";

const vi: Record<MessageKey, string> = {
  tagline: "Think Before You Trust.",
  lede: "Tín hiệu tin cậy có giải thích cho trang này — không phải phán quyết đúng/sai hay AI.",
  analyze: "Phân tích trang hiện tại",
  extracting: "Đang trích xuất…",
  analyzing: "Đang phân tích…",
  insufficient:
    "Nội dung chưa đủ để đưa báo cáo tự tin. Hãy thử bài dài hơn, hoặc tải lại trang rồi phân tích lại.",
  genericError: "Đã có lỗi. Vui lòng thử lại.",
  footer: "Bạn quyết định. TinAiLens chỉ giúp bạn thấy điều cần kiểm chứng tiếp.",
  trustScore: "Điểm tin cậy",
  confidence: "Độ tin của phân tích",
  scoreWithheld: "Chưa chấm điểm",
  scoreHint: "Đây là chỉ dẫn điều hướng — không phải phán quyết đúng hay sai.",
  summary: "Tóm tắt",
  reasons: "Lý do",
  signals: "Tín hiệu",
  claims: "Khẳng định",
  suggestions: "Gợi ý kiểm chứng",
  uncertainty: "Điểm chưa chắc",
  warnings: "Cảnh báo",
  notFlagged: "không nổi bật",
  uncertain: "chưa chắc",
  signalAi: "Mẫu AI-era",
  signalClickbait: "Tu từ clickbait",
  signalMissingSource: "Thiếu nguồn",
  signalMissingAuthor: "Thiếu tác giả",
  langVi: "VI",
  langEn: "EN",
  language: "Ngôn ngữ",
};

const en: Record<MessageKey, string> = {
  tagline: "Think Before You Trust.",
  lede: "Explainable trust signals for this page — not a true/false or AI verdict.",
  analyze: "Analyze current page",
  extracting: "Extracting…",
  analyzing: "Analyzing…",
  insufficient:
    "Insufficient content for a confident report. Try a longer article, or refresh and analyze again.",
  genericError: "Something went wrong. Please retry.",
  footer: "You decide. TinAiLens only helps you see what to verify next.",
  trustScore: "Trust Score",
  confidence: "Confidence",
  scoreWithheld: "Score withheld",
  scoreHint: "A navigation aid — not a verdict of true or false.",
  summary: "Summary",
  reasons: "Reasons",
  signals: "Signals",
  claims: "Claims",
  suggestions: "Suggestions",
  uncertainty: "Uncertainty",
  warnings: "Warnings",
  notFlagged: "not flagged",
  uncertain: "uncertain",
  signalAi: "AI-era patterns",
  signalClickbait: "Clickbait rhetoric",
  signalMissingSource: "Missing sources",
  signalMissingAuthor: "Missing author",
  langVi: "VI",
  langEn: "EN",
  language: "Language",
};

const catalogs: Record<Locale, Record<MessageKey, string>> = { vi, en };

export function t(locale: Locale, key: MessageKey): string {
  return catalogs[locale][key] ?? catalogs.en[key] ?? key;
}

const SIGNAL_TYPE_VI: Record<string, string> = {
  ai: "AI-era",
  clickbait: "clickbait",
  missing_source: "thiếu nguồn",
  missing_author: "thiếu tác giả",
  source_quality: "chất lượng nguồn",
  claim_quality: "chất lượng khẳng định",
  evidence: "bằng chứng",
  rhetoric: "tu từ",
  coverage: "độ bao phủ",
  other: "khác",
};

const CLAIM_TYPE_VI: Record<string, string> = {
  factual_assertion: "khẳng định thực tế",
  opinion: "ý kiến",
  prediction: "dự đoán",
  statistic: "số liệu",
  quote: "trích dẫn",
  other: "khác",
};

const SEVERITY_VI: Record<string, string> = {
  low: "thấp",
  medium: "trung bình",
  high: "cao",
};

export function labelSignalType(locale: Locale, value: string): string {
  if (locale === "vi") return SIGNAL_TYPE_VI[value] ?? value.replaceAll("_", " ");
  return value.replaceAll("_", " ");
}

export function labelClaimType(locale: Locale, value: string): string {
  if (locale === "vi") return CLAIM_TYPE_VI[value] ?? value.replaceAll("_", " ");
  return value.replaceAll("_", " ");
}

export function labelSeverity(locale: Locale, value: string): string {
  if (locale === "vi") return SEVERITY_VI[value] ?? value;
  return value;
}
