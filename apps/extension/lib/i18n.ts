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
  | "language"
  | "trustScoreTooltip"
  | "confidenceTooltip"
  | "history"
  | "historyEmpty"
  | "historyPrivacy"
  | "clearHistory"
  | "delete"
  | "back"
  | "viewingHistory"
  | "settings"
  | "byokPrivacy"
  | "byokProvider"
  | "byokProviderGoogle"
  | "byokProviderOpenai"
  | "byokApiKey"
  | "byokKeyPlaceholder"
  | "byokKeyPlaceholderSaved"
  | "byokGetGeminiKey"
  | "byokGetOpenaiKey"
  | "byokSave"
  | "byokClear"
  | "byokSaved"
  | "byokCleared"
  | "byokKeyRequired"
  | "byokMissing"
  | "byokPermissionDenied"
  | "byokConnected"
  | "byokSetup"
  | "uiModeLabel"
  | "uiModePopup"
  | "uiModeSidepanel"
  | "uiModeHint"
  | "uiModeSwitchPopup"
  | "uiModeSwitchSidepanel"
  | "uiModeSwitchedPopup";

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
  trustScoreTooltip:
    "Mức độ thận trọng nên có dựa trên tín hiệu hiện có (0–100). Điểm thấp ≠ giả; điểm cao ≠ đúng. Luôn đọc kèm lý do.",
  confidenceTooltip:
    "Độ chắc của chính bài phân tích này (độ bao phủ, chất lượng trích xuất, độ rõ của tín hiệu). Điểm giữa + độ tin thấp vẫn hợp lệ.",
  history: "Lịch sử",
  historyEmpty: "Chưa có phân tích nào được lưu trên máy này.",
  historyPrivacy:
    "Chỉ lưu Trust Report trên máy bạn — không lưu nội dung trang, không đồng bộ cloud.",
  clearHistory: "Xóa tất cả",
  delete: "Xóa",
  back: "Quay lại",
  viewingHistory: "Đang xem từ lịch sử",
  settings: "Cài đặt",
  byokPrivacy:
    "Key chỉ lưu trên máy bạn. Khi Lưu, Chrome sẽ hỏi quyền gọi Gemini/OpenAI — không qua server TinAiLens.",
  byokProvider: "Nhà cung cấp",
  byokProviderGoogle: "Google Gemini (khuyến nghị, có free tier)",
  byokProviderOpenai: "OpenAI",
  byokApiKey: "API key",
  byokKeyPlaceholder: "Dán API key của bạn",
  byokKeyPlaceholderSaved: "Đã lưu ({masked}) — dán key mới để thay",
  byokGetGeminiKey: "Lấy Gemini API key (Google AI Studio)",
  byokGetOpenaiKey: "Lấy OpenAI API key",
  byokSave: "Lưu",
  byokClear: "Xóa key",
  byokSaved: "Đã lưu API key trên máy này.",
  byokCleared: "Đã xóa API key.",
  byokKeyRequired: "Nhập API key để lưu.",
  byokMissing: "Chưa có API key. Mở Cài đặt để kết nối Gemini hoặc OpenAI.",
  byokPermissionDenied:
    "Cần cho phép quyền truy cập API (Gemini/OpenAI) trong hộp thoại Chrome để phân tích.",
  byokConnected: "Đã kết nối",
  byokSetup: "Kết nối API key",
  uiModeLabel: "Giao diện khi bấm icon",
  uiModePopup: "Popup",
  uiModeSidepanel: "Sidebar (bên phải)",
  uiModeHint:
    "Sidebar giống Copilot — đọc báo cáo cạnh trang. Popup gọn, đóng khi click ra ngoài.",
  uiModeSwitchPopup: "Dùng popup",
  uiModeSwitchSidepanel: "Dùng sidebar",
  uiModeSwitchedPopup: "Đã chuyển sang popup. Bấm lại icon TinAiLens trên thanh công cụ.",
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
  trustScoreTooltip:
    "How much caution appears warranted from available signals (0–100). Low ≠ false; high ≠ true. Always read the reasons.",
  confidenceTooltip:
    "How sure this analysis itself is (coverage, extraction quality, signal clarity). A mid score with low confidence is valid.",
  history: "History",
  historyEmpty: "No analyses saved on this device yet.",
  historyPrivacy:
    "Only Trust Reports are stored on this device — no page body, no cloud sync.",
  clearHistory: "Clear all",
  delete: "Delete",
  back: "Back",
  viewingHistory: "Viewing from history",
  settings: "Settings",
  byokPrivacy:
    "Your key stays on this device. On Save, Chrome asks permission to call Gemini/OpenAI — not via TinAiLens servers.",
  byokProvider: "Provider",
  byokProviderGoogle: "Google Gemini (recommended, free tier)",
  byokProviderOpenai: "OpenAI",
  byokApiKey: "API key",
  byokKeyPlaceholder: "Paste your API key",
  byokKeyPlaceholderSaved: "Saved ({masked}) — paste a new key to replace",
  byokGetGeminiKey: "Get a Gemini API key (Google AI Studio)",
  byokGetOpenaiKey: "Get an OpenAI API key",
  byokSave: "Save",
  byokClear: "Remove key",
  byokSaved: "API key saved on this device.",
  byokCleared: "API key removed.",
  byokKeyRequired: "Enter an API key to save.",
  byokMissing: "No API key yet. Open Settings to connect Gemini or OpenAI.",
  byokPermissionDenied:
    "Allow API access (Gemini/OpenAI) in the Chrome prompt so analysis can run.",
  byokConnected: "Connected",
  byokSetup: "Connect API key",
  uiModeLabel: "Open as",
  uiModePopup: "Popup",
  uiModeSidepanel: "Sidebar (right)",
  uiModeHint:
    "Sidebar stays beside the page like Copilot. Popup is compact and closes on outside click.",
  uiModeSwitchPopup: "Use popup",
  uiModeSwitchSidepanel: "Use sidebar",
  uiModeSwitchedPopup: "Switched to popup. Click the TinAiLens toolbar icon again.",
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
