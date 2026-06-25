import type { Choice, LearningLevel, QuizQuestion, SkillKey } from '../types';

export const THEME_COLORS = {
  backgroundLight: '#F8F1F3',
  backgroundDark: '#2B2B2B',
  frameLight: '#FFF0F5',
  frameDark: '#363636',
  primary: '#C8A2C8',
  primaryHover: '#B8B8E8',
  textLight: '#4A4A4A',
  textDark: '#E0E0E0',
  success: '#A7E8BD',
  danger: '#F7B8B8'
};

export const assetSheets = [
  { id: 'sunny', title: 'Nhân vật Sunny', src: '/assets/sunny-characters.png' },
  { id: 'fruits', title: 'Trái cây', src: '/assets/items-fruits.png' },
  { id: 'sweets', title: 'Kẹo & Ngọt', src: '/assets/items-sweets.png' },
  { id: 'pets', title: 'Thú cưng & Búp bê', src: '/assets/items-pets.png' },
  { id: 'others', title: 'Đồ vật khác', src: '/assets/items-others.png' }
];

export const numberChoices: Choice[] = Array.from({ length: 20 }, (_, index) => ({
  id: String(index + 1),
  label: String(index + 1),
  emoji: ['🍎', '🍌', '🍓', '🍊', '🍒', '🍇', '🍉', '🍍', '🧁', '🍭'][index % 10]
}));

export const vietnameseLetters: Choice[] = 'a,ă,â,b,c,d,đ,e,ê,g,h,i,k,l,m,n,o,ô,ơ,p,q,r,s,t,u,ư,v,x,y'
  .split(',')
  .map((letter) => ({ id: letter, label: letter.toUpperCase(), emoji: '🔤' }));

export const vocabulary = [
  { id: 'ba', word: 'ba', emoji: '👨', speak: 'ba' },
  { id: 'me', word: 'mẹ', emoji: '👩', speak: 'mẹ' },
  { id: 'be', word: 'bé', emoji: '👧', speak: 'bé' },
  { id: 'ba2', word: 'bà', emoji: '👵', speak: 'bà' },
  { id: 'ca', word: 'cá', emoji: '🐟', speak: 'cá' },
  { id: 'ga', word: 'gà', emoji: '🐔', speak: 'gà' },
  { id: 'meo', word: 'mèo', emoji: '🐱', speak: 'mèo' },
  { id: 'cho', word: 'chó', emoji: '🐶', speak: 'chó' },
  { id: 'nha', word: 'nhà', emoji: '🏠', speak: 'nhà' },
  { id: 'xe', word: 'xe', emoji: '🚗', speak: 'xe' },
  { id: 'hoa', word: 'hoa', emoji: '🌸', speak: 'hoa' },
  { id: 'keo', word: 'kẹo', emoji: '🍬', speak: 'kẹo' }
];

export const shortSentences = [
  { id: 's1', text: 'Bé ăn kẹo', emoji: '👧🍬' },
  { id: 's2', text: 'Mẹ bế bé', emoji: '👩🤱' },
  { id: 's3', text: 'Con mèo đi', emoji: '🐱🚶' },
  { id: 's4', text: 'Bé yêu mẹ', emoji: '👧❤️👩' }
];

export const countItems = [
  { id: 'apple', name: 'quả táo', emoji: '🍎' },
  { id: 'banana', name: 'quả chuối', emoji: '🍌' },
  { id: 'strawberry', name: 'dâu tây', emoji: '🍓' },
  { id: 'orange', name: 'quả cam', emoji: '🍊' },
  { id: 'cherry', name: 'quả cherry', emoji: '🍒' },
  { id: 'grape', name: 'chùm nho', emoji: '🍇' },
  { id: 'watermelon', name: 'miếng dưa hấu', emoji: '🍉' },
  { id: 'pineapple', name: 'quả dứa', emoji: '🍍' },
  { id: 'lollipop', name: 'kẹo mút', emoji: '🍭' },
  { id: 'cupcake', name: 'cupcake', emoji: '🧁' },
  { id: 'icecream', name: 'kem ốc quế', emoji: '🍦' },
  { id: 'donut', name: 'donut', emoji: '🍩' },
  { id: 'kitten', name: 'mèo con', emoji: '🐱' },
  { id: 'puppy', name: 'chó con', emoji: '🐶' },
  { id: 'bunny', name: 'thỏ trắng', emoji: '🐰' },
  { id: 'bear', name: 'gấu bông', emoji: '🧸' },
  { id: 'unicorn', name: 'unicorn', emoji: '🦄' },
  { id: 'star', name: 'ngôi sao', emoji: '⭐' },
  { id: 'balloon', name: 'bong bóng hồng', emoji: '🎈' },
  { id: 'heartballoon', name: 'bóng tim', emoji: '💗' },
  { id: 'flower', name: 'hoa hồng pastel', emoji: '🌸' },
  { id: 'butterfly', name: 'bướm', emoji: '🦋' },
  { id: 'pinkcar', name: 'xe hơi hồng', emoji: '🚗' },
  { id: 'block', name: 'khối gỗ', emoji: '🧱' },
  { id: 'rainbow', name: 'cầu vồng nhỏ', emoji: '🌈' },
  { id: 'house', name: 'ngôi nhà nhỏ', emoji: '🏠' }
];

const q = (
  id: string,
  skill: SkillKey,
  prompt: string,
  answerId: string,
  choices: Choice[],
  speakText?: string,
  hint?: string
): QuizQuestion => ({ id, skill, prompt, answerId, choices, speakText, hint });

const makeNumberChoices = (...nums: number[]): Choice[] => nums.map((num) => ({ id: String(num), label: String(num), emoji: '⭐' }));
const makeLetterChoices = (...letters: string[]): Choice[] => letters.map((letter) => ({ id: letter, label: letter.toUpperCase(), emoji: '🔤' }));
const makeWordChoices = (...words: string[]): Choice[] => words.map((word) => {
  const item = vocabulary.find((v) => v.word === word || v.id === word);
  return { id: item?.word ?? word, label: item?.word ?? word, emoji: item?.emoji ?? '🌷' };
});

export const learningLevels: LearningLevel[] = [
  {
    id: 1,
    stage: 1,
    title: 'Làm quen số 1–3',
    subtitle: 'Nhìn mặt số đầu tiên',
    focus: 'Số 1, 2, 3',
    skill: 'numbers',
    lessonText: 'Sunny sẽ nhìn số thật to, nghe cách đọc và chọn đúng số. Mỗi số chỉ học ít để bé không bị quá tải.',
    lessonItems: makeNumberChoices(1, 2, 3),
    questions: [
      q('l1q1', 'numbers', 'Tìm số 1 cho Sunny nhé', '1', makeNumberChoices(1, 2, 3), 'Tìm số một'),
      q('l1q2', 'numbers', 'Tìm số 2', '2', makeNumberChoices(3, 2, 1), 'Tìm số hai'),
      q('l1q3', 'numbers', 'Tìm số 3', '3', makeNumberChoices(1, 3, 2), 'Tìm số ba')
    ],
    rewardSticker: '🌟'
  },
  {
    id: 2,
    stage: 1,
    title: 'Đếm trái cây 1–5',
    subtitle: 'Đếm táo, chuối, dâu',
    focus: 'Đếm số lượng',
    skill: 'counting',
    lessonText: 'Sunny tập chạm vào từng món và đếm chậm: một, hai, ba. Khi đếm xong mới chọn số.',
    lessonItems: [
      { id: 'apple', label: '1 quả táo', emoji: '🍎' },
      { id: 'banana', label: '2 quả chuối', emoji: '🍌🍌' },
      { id: 'berry', label: '3 dâu', emoji: '🍓🍓🍓' }
    ],
    questions: [
      q('l2q1', 'counting', 'Có mấy quả táo? 🍎🍎', '2', makeNumberChoices(1, 2, 3), 'Có mấy quả táo'),
      q('l2q2', 'counting', 'Có mấy quả chuối? 🍌🍌🍌', '3', makeNumberChoices(2, 3, 4), 'Có mấy quả chuối'),
      q('l2q3', 'counting', 'Có mấy quả dâu? 🍓🍓🍓🍓🍓', '5', makeNumberChoices(3, 4, 5), 'Có mấy quả dâu')
    ],
    rewardSticker: '🍓'
  },
  {
    id: 3,
    stage: 2,
    title: 'Tìm số 1–10',
    subtitle: 'Phản xạ nhanh với số',
    focus: 'Số 1 đến 10',
    skill: 'numbers',
    lessonText: 'Sunny nghe yêu cầu rồi bấm đúng số. Nếu chưa chắc, hãy nghe lại âm thanh.',
    lessonItems: makeNumberChoices(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
    questions: [
      q('l3q1', 'numbers', 'Tìm số 5', '5', makeNumberChoices(5, 8, 3, 1), 'Tìm số năm'),
      q('l3q2', 'numbers', 'Tìm số 7', '7', makeNumberChoices(2, 7, 9, 4), 'Tìm số bảy'),
      q('l3q3', 'numbers', 'Tìm số 10', '10', makeNumberChoices(6, 10, 1, 9), 'Tìm số mười'),
      q('l3q4', 'numbers', 'Tìm số 4', '4', makeNumberChoices(4, 5, 6, 7), 'Tìm số bốn')
    ],
    rewardSticker: '🎈'
  },
  {
    id: 4,
    stage: 2,
    title: 'Nhiều hơn hay ít hơn',
    subtitle: 'So sánh bằng hình ảnh',
    focus: 'Nhiều / ít',
    skill: 'counting',
    lessonText: 'Sunny nhìn hai nhóm đồ vật. Nhóm nào có nhiều hơn thì chọn nhóm đó.',
    lessonItems: [
      { id: 'more', label: 'Nhiều hơn', emoji: '🍭🍭🍭' },
      { id: 'less', label: 'Ít hơn', emoji: '🍭' }
    ],
    questions: [
      q('l4q1', 'counting', 'Nhóm nào nhiều hơn?', 'left', [{ id: 'left', label: '🍬🍬🍬' }, { id: 'right', label: '🍬' }], 'Nhóm nào nhiều hơn'),
      q('l4q2', 'counting', 'Nhóm nào ít hơn?', 'right', [{ id: 'left', label: '🧸🧸🧸🧸' }, { id: 'right', label: '🧸🧸' }], 'Nhóm nào ít hơn'),
      q('l4q3', 'counting', 'Chọn nhóm có nhiều ngôi sao hơn', 'right', [{ id: 'left', label: '⭐⭐' }, { id: 'right', label: '⭐⭐⭐⭐' }], 'Chọn nhóm có nhiều ngôi sao hơn')
    ],
    rewardSticker: '🧸'
  },
  {
    id: 5,
    stage: 1,
    title: 'Làm quen chữ a, ă, â, b, c',
    subtitle: 'Nhận mặt chữ cái',
    focus: 'Chữ cái đầu tiên',
    skill: 'letters',
    lessonText: 'Sunny nhìn chữ in thường và in hoa. Bé bấm nghe âm rồi chọn chữ đúng.',
    lessonItems: makeLetterChoices('a', 'ă', 'â', 'b', 'c'),
    questions: [
      q('l5q1', 'letters', 'Tìm chữ A', 'a', makeLetterChoices('a', 'ă', 'b'), 'Tìm chữ a'),
      q('l5q2', 'letters', 'Tìm chữ B', 'b', makeLetterChoices('c', 'b', 'â'), 'Tìm chữ bờ'),
      q('l5q3', 'letters', 'Tìm chữ C', 'c', makeLetterChoices('ă', 'c', 'a'), 'Tìm chữ cờ')
    ],
    rewardSticker: '🔤'
  },
  {
    id: 6,
    stage: 2,
    title: 'Nghe âm chọn chữ',
    subtitle: 'd, đ, e, ê, g',
    focus: 'Phân biệt âm gần nhau',
    skill: 'letters',
    lessonText: 'Sunny nghe âm chữ rồi bấm chữ đúng. Chữ d và đ cần nhìn kỹ nét gạch ngang.',
    lessonItems: makeLetterChoices('d', 'đ', 'e', 'ê', 'g'),
    questions: [
      q('l6q1', 'letters', 'Nghe và chọn chữ Đ', 'đ', makeLetterChoices('d', 'đ', 'e'), 'Chữ đờ', 'Chữ Đ có thêm một nét ngang nhỏ.'),
      q('l6q2', 'letters', 'Nghe và chọn chữ Ê', 'ê', makeLetterChoices('e', 'ê', 'g'), 'Chữ ê'),
      q('l6q3', 'letters', 'Nghe và chọn chữ G', 'g', makeLetterChoices('d', 'g', 'đ'), 'Chữ gờ')
    ],
    rewardSticker: '🦄'
  },
  {
    id: 7,
    stage: 3,
    title: 'Ghép âm thành tiếng',
    subtitle: 'ba, bé, bà, cá',
    focus: 'Phụ âm + nguyên âm',
    skill: 'phonics',
    lessonText: 'Sunny ghép chữ thành tiếng ngắn. Ba gồm b + a. Bé gồm b + e + dấu sắc.',
    lessonItems: makeWordChoices('ba', 'bé', 'bà', 'cá'),
    questions: [
      q('l7q1', 'phonics', 'b + a đọc là gì?', 'ba', makeWordChoices('ba', 'bà', 'bé'), 'bờ a ba'),
      q('l7q2', 'phonics', 'c + a + dấu sắc đọc là gì?', 'cá', makeWordChoices('cá', 'bà', 'ba'), 'cờ a ca sắc cá'),
      q('l7q3', 'phonics', 'Chọn tiếng “bé”', 'bé', makeWordChoices('ba', 'bé', 'bà'), 'bé')
    ],
    rewardSticker: '🍬'
  },
  {
    id: 8,
    stage: 3,
    title: 'Dấu thanh vui vẻ',
    subtitle: 'ngang, huyền, sắc, nặng',
    focus: 'Nhận biết dấu thanh',
    skill: 'phonics',
    lessonText: 'Sunny nhìn cùng một tiếng ba nhưng dấu khác nhau: ba, bà, bá, bạ. Bản đầu chỉ làm quen, không ép nhớ quá nhanh.',
    lessonItems: makeWordChoices('ba', 'bà').concat([{ id: 'bá', label: 'bá', emoji: '✨' }, { id: 'bạ', label: 'bạ', emoji: '⚫' }]),
    questions: [
      q('l8q1', 'phonics', 'Tiếng nào có dấu huyền?', 'bà', [{ id: 'ba', label: 'ba' }, { id: 'bà', label: 'bà' }, { id: 'bá', label: 'bá' }], 'Tìm tiếng bà'),
      q('l8q2', 'phonics', 'Tiếng nào có dấu sắc?', 'bé', makeWordChoices('ba', 'bé', 'bà'), 'Tìm tiếng bé'),
      q('l8q3', 'phonics', 'Tiếng nào có dấu nặng?', 'mẹ', makeWordChoices('mẹ', 'ba', 'bé'), 'Tìm tiếng mẹ')
    ],
    rewardSticker: '💗'
  },
  {
    id: 9,
    stage: 4,
    title: 'Đọc từ có hình',
    subtitle: 'Từ gần gũi với bé',
    focus: 'Từ đơn giản',
    skill: 'reading',
    lessonText: 'Sunny nhìn hình, nghe đọc mẫu rồi chọn đúng từ. Từ đều là đồ vật hoặc người thân quen.',
    lessonItems: makeWordChoices('mẹ', 'mèo', 'chó', 'kẹo'),
    questions: [
      q('l9q1', 'reading', '🐱 Đây là từ nào?', 'mèo', makeWordChoices('mèo', 'mẹ', 'kẹo'), 'Con mèo'),
      q('l9q2', 'reading', '🐶 Đây là từ nào?', 'chó', makeWordChoices('cá', 'chó', 'hoa'), 'Con chó'),
      q('l9q3', 'reading', '🍬 Đây là từ nào?', 'kẹo', makeWordChoices('kẹo', 'xe', 'nhà'), 'Kẹo')
    ],
    rewardSticker: '🐱'
  },
  {
    id: 10,
    stage: 4,
    title: 'Đọc câu ngắn',
    subtitle: '3–5 từ, có nút nghe mẫu',
    focus: 'Câu ngắn',
    skill: 'reading',
    lessonText: 'Sunny nghe cả câu rồi chọn câu đúng với hình. Mục tiêu là nhận nhịp đọc, chưa cần đọc nhanh.',
    lessonItems: shortSentences.map((s) => ({ id: s.id, label: s.text, emoji: s.emoji })),
    questions: [
      q('l10q1', 'reading', '👧🍬 Chọn câu đúng', 'Bé ăn kẹo', shortSentences.slice(0, 3).map((s) => ({ id: s.text, label: s.text, emoji: s.emoji })), 'Bé ăn kẹo'),
      q('l10q2', 'reading', '👩🤱 Chọn câu đúng', 'Mẹ bế bé', shortSentences.slice(0, 3).map((s) => ({ id: s.text, label: s.text, emoji: s.emoji })), 'Mẹ bế bé'),
      q('l10q3', 'reading', '🐱🚶 Chọn câu đúng', 'Con mèo đi', shortSentences.slice(0, 3).map((s) => ({ id: s.text, label: s.text, emoji: s.emoji })), 'Con mèo đi')
    ],
    rewardSticker: '📖'
  },
  {
    id: 11,
    stage: 5,
    title: 'Tập tô số 5',
    subtitle: 'Dùng tay hoặc chuột tô theo nét mờ',
    focus: 'Tập viết số',
    skill: 'tracing',
    lessonText: 'Sunny tô theo số mờ trên màn hình. Bản đầu chỉ kiểm tra bé có kéo/tô đủ nét, chưa chấm đẹp xấu.',
    lessonItems: [{ id: '5', label: '5', emoji: '✍️' }],
    questions: [q('l11q1', 'tracing', 'Tô số 5 rồi bấm hoàn thành', 'done', [{ id: 'done', label: 'Con đã tô xong', emoji: '✅' }], 'Tô số năm')],
    rewardSticker: '✍️',
    tracingTarget: '5'
  },
  {
    id: 12,
    stage: 5,
    title: 'Tập tô chữ a',
    subtitle: 'Chữ cái đầu tiên',
    focus: 'Tập viết chữ',
    skill: 'tracing',
    lessonText: 'Sunny tô chữ a thật chậm. Phụ huynh có thể ngồi cạnh nhắc bé cầm máy chắc và nghỉ mắt.',
    lessonItems: [{ id: 'a', label: 'a', emoji: '✍️' }],
    questions: [q('l12q1', 'tracing', 'Tô chữ a rồi bấm hoàn thành', 'done', [{ id: 'done', label: 'Con đã tô xong', emoji: '✅' }], 'Tô chữ a')],
    rewardSticker: '🌷',
    tracingTarget: 'a'
  }
];

export const rewardPool = ['🌟', '🍓', '🎈', '🧸', '🔤', '🦄', '🍬', '💗', '🐱', '📖', '✍️', '🌷', '🌈', '👑'];
