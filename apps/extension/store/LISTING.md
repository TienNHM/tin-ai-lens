# Chrome Web Store — publish pack

Use this file when filling the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## Package

```bash
pnpm --filter @tin-ai-lens/types build
pnpm --filter @tin-ai-lens/ai build
pnpm --filter @tin-ai-lens/extension build
# Zip: apps/extension/build/chrome-mv3-prod.zip  (Plasmo may emit zip next to folder)
# Or zip the chrome-mv3-prod folder contents (not the parent folder).
```

Upload the **production** build (`chrome-mv3-prod`), not `chrome-mv3-dev`.

## Store listing (copy-paste)

### Name
TinAiLens

### Short description (≤132 characters)
Think Before You Trust. Explainable trust signals for the page you’re reading — not a detector or oracle.

### Detailed description

TinAiLens is a calm browser Trust Assistant for Chrome.

Open an article, click Analyze, and get an explainable Trust Report: Trust Score with reasons, AI-era / clickbait / missing-source / missing-author signals, key claims, and concrete verification suggestions. You decide what to trust next.

What TinAiLens is not
• Not a fake-news oracle
• Not an “AI detector” that labels authorship as fact
• Not a censorship tool

How it works (community / free)
1. Install the extension and open Settings.
2. Paste your own Google Gemini API key (recommended free tier) or OpenAI API key.
3. Analyze the current page — the extension calls your provider directly. No TinAiLens account required.

Privacy
• API keys stay in Chrome local storage on your device.
• History stores Trust Reports only (not full page bodies).
• See the Privacy Policy linked on this listing.

Tagline: Think Before You Trust. Explain. Never judge.

### Category
Productivity (or News & Magazines — pick one; Productivity is usual for assistants)

### Language
English (primary). UI also supports Vietnamese.

## Privacy practices tab (Phương thức bảo vệ quyền riêng tư)

Mở thẻ **Phương thức bảo vệ quyền riêng tư** → điền lần lượt → **Lưu bản nháp**.

### 1. Single purpose / Mục đích duy nhất

```
Help users evaluate trustworthiness of the webpage they are reading by extracting page text on user gesture and generating an explainable Trust Report (signals, claims, suggestions) via the user’s own Gemini or OpenAI API key. Not a fake-news oracle or AI-authorship detector.
```

(VI — nếu form yêu cầu tiếng Việt)

```
Giúp người dùng đánh giá độ tin cậy của trang đang đọc: khi họ bấm Phân tích, extension trích xuất nội dung và tạo Trust Report có giải thích (tín hiệu, khẳng định, gợi ý) bằng API key Gemini/OpenAI của chính họ. Không phải công cụ phán quyết tin giả hay detector AI.
```

### 2. Remote code / Mã từ xa

**Khuyến nghị:** chọn **Không** — TinAiLens **không** tải/chạy JavaScript từ xa. Extension chỉ gọi API để nhận JSON báo cáo.

Nếu đã chọn Có nhầm, đổi thành **Không**.  
Nếu form bắt buộc nhập lý do khi chọn Có (không nên), dùng:

```
The extension does not execute remote JavaScript. It only sends page text to Google Gemini or OpenAI HTTPS APIs (using the user’s own API key) and receives JSON Trust Report data to render locally. No remote scripts are downloaded or evaluated.
```

### 3. Permission: activeTab

```
Used only after the user clicks Analyze, so the extension can access the active tab and extract readable article text for the Trust Report. Not used for background browsing surveillance.
```

```
Chỉ dùng khi người dùng bấm Phân tích, để truy cập tab đang mở và trích xuất nội dung bài đọc cho Trust Report. Không theo dõi duyệt web nền.
```

### 4. Permission: scripting

```
Required to run the content-script extraction (Readability → markdown) in the active page context when the user requests analysis, so we can obtain readable page text.
```

```
Cần để chạy script trích xuất nội dung (Readability → markdown) trong ngữ cảnh trang khi người dùng yêu cầu phân tích.
```

### 5. Permission: storage

```
Stores the user’s locale preference, optional BYOK API key, and local Trust Report history on the device via chrome.storage.local. No cloud sync of this data by TinAiLens.
```

```
Lưu ngôn ngữ, API key BYOK (nếu có) và lịch sử Trust Report trên máy qua chrome.storage.local. TinAiLens không đồng bộ cloud dữ liệu này.
```

### 6. Host permissions / Quyền phía máy chủ

Manifest dùng **`optional_host_permissions`** (không khai sẵn `host_permissions`).  
Hosts (xin khi user Lưu key / Phân tích):  
`https://generativelanguage.googleapis.com/*`, `https://api.openai.com/*`

```
Optional host permissions are limited to Google Generative Language (Gemini) and OpenAI API endpoints. They are requested only when the user saves a BYOK key or analyzes, so the extension can send extracted page text with the user’s own API key and receive a JSON Trust Report. Page content is not sent to TinAiLens servers. We do not use broad <all_urls> access.
```

```
Quyền máy chủ là optional: chỉ endpoint Gemini và OpenAI, xin khi user lưu API key hoặc phân tích. Gửi nội dung trang bằng key của user, nhận JSON Trust Report. Không gửi lên server TinAiLens. Không dùng <all_urls>.
```

### 7. Data usage / Sử dụng dữ liệu (checkbox công khai)

Chọn **đúng 3** loại sau (các loại còn lại **không** chọn):

| Loại | Chọn? | Lý do |
| --- | --- | --- |
| Thông tin nhận dạng cá nhân | Không | Không thu tên/email/địa chỉ |
| Thông tin sức khỏe | Không | — |
| Thông tin thanh toán và tài chính | Không | — |
| **Thông tin xác thực** | **Có** | Lưu API key BYOK (Gemini/OpenAI) trên máy |
| Thông tin liên lạc cá nhân | Không | — |
| Thông tin vị trí | Không | Không thu GPS/IP cho mục đích của extension |
| **Lịch sử duyệt web** | **Có** | Lưu URL + tiêu đề + thời điểm của trang **user chủ động Phân tích** (lịch sử local) |
| Hoạt động của người dùng | Không | Không theo dõi click/cuộn/phím/network monitoring |
| **Nội dung trang web** | **Có** | Trích xuất văn bản trang để tạo Trust Report |

**3 chứng nhận bắt buộc** — tick **cả 3**:
1. Không bán / chuyển dữ liệu ngoài trường hợp đã được phê duyệt  
2. Không dùng / chuyển dữ liệu ngoài mục đích duy nhất của extension  
3. Không dùng dữ liệu để chấm điểm tín dụng / cho vay  

Gửi nội dung trang + API key tới Gemini/OpenAI là **trường hợp sử dụng được phê duyệt** (cần thiết cho mục đích duy nhất), không phải “bán dữ liệu”.

Nếu form hỏi thêm từng loại dữ liệu (mục đích / mã hóa / bên thứ ba), dùng:

| Câu hỏi | Gợi ý |
| --- | --- |
| Mục đích | Chức năng của sản phẩm (analyze / Trust Report) |
| Mã hóa khi truyền | Có (HTTPS tới Gemini/OpenAI) |
| Bán dữ liệu | Không |
| Chuyển bên thứ ba | Có — Google Gemini và/hoặc OpenAI theo lựa chọn của user |
| Dùng cho quảng cáo / theo dõi | Không |
| Privacy policy URL | `https://tiennhm.github.io/tin-ai-lens/privacy/` |

Certify note (nếu cần):

```
I certify that TinAiLens’s data use complies with the Chrome Web Store Developer Program Policies. Page content is processed only on explicit user action and sent only to the AI provider chosen by the user (Gemini/OpenAI) with their own key. Local storage holds settings, key, and Trust Reports without full page bodies. We do not sell user data or use it for advertising.
```

## Permission justifications (short — Dashboard prompts)

**activeTab** — See § Privacy practices #3.  
**scripting** — See #4.  
**storage** — See #5.  
**Host permissions** — See #6.

## Privacy policy URL
After GitHub Pages is enabled:

`https://tiennhm.github.io/tin-ai-lens/privacy/`

(Or your custom domain + `/privacy/`.)

Update the contact details on that page if needed. Current contact: [facebook.com/tiennhm.vn](https://www.facebook.com/tiennhm.vn).

## Assets checklist

| Asset | Spec | Status |
| --- | --- | --- |
| Extension icon | 128×128 PNG (`assets/icon.png`) | Ready |
| Store icon | 128×128 (`store/icon-128.png`) | Ready |
| Screenshots | 1280×800 PNG | Ready — upload `store-*.png` below |

### Screenshots (upload these — max 5)

Chrome Web Store requires:
- **Max 5** images
- **1280×800** or **640×400**
- **JPEG or 24-bit PNG (no alpha)**
- At least 1

Path: `apps/extension/store/screenshots/upload/`

| # | File | Shows |
| --- | --- | --- |
| 1 | `01-main-popup.png` | Main popup (VI) |
| 2 | `02-settings-byok.png` | BYOK Settings |
| 3 | `03-trust-score.png` | Trust Score + summary |
| 4 | `04-signals-claims.png` | Signals + claims |
| 5 | `05-suggestions.png` | Suggestions + uncertainty |

All are **1280×800**, **RGB / 24-bit PNG** (no alpha). Upload in this order.

Regenerate:

```bash
python apps/extension/scripts/pad-store-screenshots.py
```

## Testing instructions (Hướng dẫn thử nghiệm)

TinAiLens **không** có tài khoản đăng nhập. Reviewer cần API key Gemini (free).

### Tên người dùng
```
N/A — no login account
```

### Mật khẩu
```
N/A
```

Hoặc để trống cả hai nếu Dashboard cho phép; nếu bắt buộc nhập thì dùng `N/A` như trên.

### Hướng dẫn bổ sung (≤500 ký tự) — paste này, thay `YOUR_GEMINI_KEY`:

Tạo key tạm tại https://aistudio.google.com/apikey (chỉ dùng cho review, thu hồi sau khi duyệt).

```
No app login. BYOK: open popup → Settings → Provider = Google Gemini → paste test API key below → Save → Allow Chrome host permission for generativelanguage.googleapis.com → open any long news article → Analyze. Expect Trust Report (score, signals, claims, suggestions). History stores reports locally only. Test key: YOUR_GEMINI_KEY
```

(VI — nếu form ưu tiên tiếng Việt)

```
Không cần đăng nhập app. Mở popup → Cài đặt → chọn Google Gemini → dán API key thử nghiệm bên dưới → Lưu → Cho phép quyền Chrome tới generativelanguage.googleapis.com → mở bài báo dài → Phân tích. Kỳ vọng Trust Report. Lịch sử chỉ lưu local. Key thử: YOUR_GEMINI_KEY
```

**Trước khi gửi:** tạo Gemini API key riêng cho review → thay `YOUR_GEMINI_KEY` → sau khi được duyệt thì **thu hồi/xóa** key đó trên Google AI Studio.

## Review notes (paste for reviewer)

TinAiLens analyzes the active tab only on explicit user gesture. Users bring their own Gemini/OpenAI API key; page content goes to that provider, not to a TinAiLens backend. Local history stores Trust Reports without page markdown. We do not claim content is fake/true/AI-generated as a verdict.

## Before submit

- [ ] Privacy policy live on HTTPS
- [ ] Production zip built and smoke-tested (load unpacked prod build)
- [ ] Screenshots attached
- [ ] Payment profile / one-time developer fee paid (Google requirement)
- [ ] Rotate any API keys that were ever pasted into chat or screenshots
- [ ] Remove localhost-only testing notes from public listing copy

## Version

Bump `version` in `apps/extension/package.json` for each Store upload (e.g. `0.1.1` → `0.1.2`).
