# Sunny Pastel Learning
Ứng dụng web game học số, học chữ, tập đọc và tập tô tiếng Việt cho bé Sunny 5 tuổi. Bản đầu ưu tiên chạy ổn, dễ sửa, dễ nâng cấp, không cần backend.

## 1. Công nghệ
- React.js + Vite + TypeScript.
- CSS thuần trong `src/styles/global.css`, không phụ thuộc Tailwind để dễ build.
- Âm thanh dùng Web Audio API và Web Speech API `vi-VN` nếu trình duyệt hỗ trợ.
- Lưu tiến độ bằng `localStorage`, không đăng nhập, không gửi dữ liệu cá nhân.

## 2. Cấu trúc thư mục
```txt
sunny-pastel-learning/
├─ public/
│  └─ assets/                 # Hình nhân vật và sprite sheet vật phẩm Pastel Dream
├─ src/
│  ├─ components/             # Màn hình và component game
│  │  ├─ HomeScreen.tsx
│  │  ├─ LearningPath.tsx
│  │  ├─ FreePlay.tsx
│  │  ├─ ParentDashboard.tsx
│  │  ├─ RewardModal.tsx
│  │  ├─ SoundToggle.tsx
│  │  ├─ ProgressBar.tsx
│  │  └─ TracingCanvas.tsx
│  ├─ data/
│  │  └─ lessons.ts           # Dữ liệu số, chữ, từ, câu, level, phần thưởng
│  ├─ hooks/
│  │  └─ useSound.ts          # Đọc tiếng Việt và hiệu ứng âm thanh
│  ├─ lib/
│  │  └─ storage.ts           # Quản lý localStorage
│  ├─ styles/
│  │  └─ global.css           # Giao diện Pastel Dream responsive
│  ├─ types.ts
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## 3. Cách chạy local
Yêu cầu máy có Node.js.

```bash
npm install
npm run dev
```

Sau đó mở link Vite hiện trong Terminal, thường là:

```txt
http://localhost:5173
```

## 4. Cách build
```bash
npm run build
```

Sau khi build xong, thư mục xuất bản nằm tại:

```txt
dist/
```

Có thể kiểm tra bản build bằng:

```bash
npm run preview
```

## 5. Cách đưa lên GitHub
```bash
git init
git add .
git commit -m "Initial Sunny Pastel Learning"
git branch -M main
git remote add origin <link-repo-github-cua-anh>
git push -u origin main
```

Nếu dùng giao diện GitHub Desktop thì chỉ cần chọn folder này, commit rồi publish repository.

## 6. Deploy Render dạng static site
1. Vào Render, chọn `New` → `Static Site`.
2. Kết nối repository GitHub chứa project này.
3. Điền cấu hình:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Bấm deploy.
5. Sau khi Render build xong, dùng link public để mở trên điện thoại, máy tính bảng và máy tính.

## 7. Cách sửa dữ liệu bài học
Mở file:

```txt
src/data/lessons.ts
```

Các vùng dữ liệu chính:
- `numberChoices`: số 1–20.
- `vietnameseLetters`: bảng chữ cái tiếng Việt dùng trong app.
- `vocabulary`: từ đơn giản như ba, mẹ, bé, cá, gà, mèo, chó, nhà, xe, hoa, kẹo.
- `shortSentences`: câu ngắn như “Bé ăn kẹo”, “Mẹ bế bé”.
- `learningLevels`: toàn bộ level học theo lộ trình.

Muốn thêm level mới, copy một object trong `learningLevels`, đổi `id`, `title`, `lessonText`, `questions`, `rewardSticker`. Mỗi level nên giữ 3–5 câu hỏi để bé học trong 2–5 phút.

Ví dụ thêm câu hỏi chọn số:

```ts
q('new-q1', 'numbers', 'Tìm số 8', '8', makeNumberChoices(6, 8, 9), 'Tìm số tám')
```

## 8. Cách đổi màu/chủ đề
Mở file:

```txt
src/styles/global.css
```

Sửa các biến ở đầu file:

```css
:root {
  --bg-light: #F8F1F3;
  --frame-light: #FFF0F5;
  --primary: #C8A2C8;
  --primary-hover: #B8B8E8;
  --text-light: #4A4A4A;
  --success: #A7E8BD;
  --danger: #F7B8B8;
}
```

Nếu muốn chỉnh danh sách màu trong data, mở `THEME_COLORS` trong `src/data/lessons.ts`.

## 9. Cách thay hình ảnh
Hình đang nằm trong:

```txt
public/assets/
```

Có thể thay các file:
- `sunny-characters.png`
- `items-fruits.png`
- `items-sweets.png`
- `items-pets.png`
- `items-others.png`

Giữ nguyên tên file nếu không muốn sửa code. Nếu đổi tên file, sửa lại `assetSheets` trong `src/data/lessons.ts`.

Bản đầu dùng emoji trong mini-game để đơn giản và ổn định. Khi muốn dùng sprite 128x128 riêng từng món, có thể crop sprite sheet thành từng file như `apple.png`, `banana.png`, rồi thêm trường `image` vào dữ liệu `countItems` hoặc `vocabulary`.

## 10. Cách nâng cấp thêm mini-game mới
1. Mở `src/components/FreePlay.tsx`.
2. Thêm key mới vào type `GameKey`.
3. Thêm thông tin game vào `gameMeta`.
4. Viết component game mới, ví dụ `LetterTrainGame`.
5. Thêm dòng render:

```tsx
{activeGame === 'letterTrain' && <LetterTrainGame sound={sound} />}
```

Nên giữ mỗi game một kỹ năng nhỏ: chỉ chữ cái, chỉ đếm, chỉ ghép từ, hoặc chỉ tập đọc. Không nên gom quá nhiều kỹ năng vào một màn.

## 11. Gợi ý nâng cấp phiên bản sau
- Crop sprite sheet thành từng vật phẩm 128x128 để thay emoji.
- Thêm nhiều level cho chữ ghép vần: ba, bà, bé, bê, bi, bo, bò, cá, cò, cô, mẹ, mèo, gà.
- Thêm giọng đọc thu âm riêng nếu Web Speech API đọc chưa tự nhiên.
- Thêm chế độ phụ huynh nhập bộ từ riêng cho Sunny.
- Thêm nhận diện nét viết bằng canvas nâng cao, nhưng nên để sau khi app MVP đã ổn.
