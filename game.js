const SAVE_KEY = "mugiquest_ver4_save";
const PLAYER_MAX_LIFE = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
const RETRY_GAP = 3;

const state = {
  words: [],
  phrases: [],
  save: {
    playerLife: PLAYER_MAX_LIFE,
    exp: 0,
    learned: {},
    mastered: {},
    clearedQuests: {},
    termTestProgress: {
      wordTranslation: {},
      fillWritten: {}
    }
  },
  currentQuest: null,
  battleDeck: [],
  currentWord: null,
  questionCount: 0,
  correct: 0,
  gainExp: 0,
  newLearnedIds: new Set(),
  battleLog: [],
  enemyLife: 10,
  enemyMaxLife: 10,
  answered: false,
  playerMaxLife: PLAYER_MAX_LIFE,
  previousScreen: "screenHome",
  selectedGrade: 2,
  selectedG1Dungeon: null,
  wordBookGradeFilter: "all",
  wordBookStatusFilter: "all",
  phraseBookGradeFilter: "all",
  phraseBookStatusFilter: "all"
};

const GRADE2_TERM_TEST_WORD_SPECS = [
  // Unit 0
  { id: "u01_001", ja: "同じ、同一の" },
  { id: "u01_002", ja: "経験、体験" },
  { id: "u01_003", ja: "実は、本当は" },
  { id: "u01_004", ja: "ラーメン" },
  { id: "u01_005", ja: "緊急の、即席の" },
  { id: "u01_006", ja: "ヌードル、めん" },
  { id: "term_test_by_the_way", en: "by the way", ja: "ところで", pron: "バイ ザ ウェイ", answers: ["by the way"], skipStats: true },

  // Unit 1
  { id: "u01_009", ja: "休日、休暇" },
  { id: "u01_014", ja: "到着する" },
  { id: "u01_016", ja: "空港、飛行場" },
  { id: "u01_017", ja: "すぐに、まもなく" },
  { id: "u01_021", ja: "…でしょう、…だろう、…するつもりだ" },
  { id: "u01_026", ja: "わくわくした" },
  { id: "u01_027", ja: "シーフード" },
  { id: "u01_028", ja: "予約" },
  { id: "u01_023", ja: "you will の短縮形" },
  { id: "u01_024", ja: "I will の短縮形" },
  { id: "u01_029", ja: "メートル" },
  { id: "u01_030", ja: "身長［高さ］が…ある" },
  { id: "u01_031", ja: "…の重さがある" },
  { id: "u01_032", ja: "トン" },
  { id: "u01_035", ja: "…を見つける、発見する" },
  { id: "u01_036", ja: "find の過去形" },
  { id: "u01_038", ja: "言語、言葉" },
  { id: "u01_039", ja: "ドル" },
  { id: "u01_043", ja: "例、実例" },
  { id: "u01_045", ja: "連絡する、意思の疎通をする" },
  { id: "u01_047", ja: "絵、絵画" },
  { id: "u01_050", ja: "驚いた、びっくりした" },
  { id: "u01_052", ja: "区域、場所、地域" },
  { id: "u01_058", ja: "文化" },

  // Unit 2
  { id: "u2_001", ja: "特に、とりわけ" },
  { id: "u2_003", ja: "…を注文する" },
  { id: "u2_005", ja: "いろいろな" },
  { id: "u2_006", ja: "（独特な）味、（香りもふくめた）風味" },
  { id: "u2_009", ja: "スピーチ、演説" },
  { id: "u2_010", ja: "いつか、そのうち（8文字で）" },
  { id: "u2_011", ja: "もし…ならば" },
  { id: "u2_012", ja: "（～に）…を加える、足す" },
  { id: "u2_014", ja: "興味を持っている" },
  { id: "u2_015", ja: "（…を）忘れる" },
  { id: "u2_016", ja: "種類" },
  { id: "u2_019", ja: "…だから、…なので" },
  { id: "u2_020", ja: "濃い、どろっとした" },
  { id: "u2_021", ja: "おすすめの" },
  { id: "u2_024", ja: "早く" },
  { id: "u2_025", ja: "（物事・考えなど）を反映する" },
  { id: "u2_026", ja: "気候" },
  { id: "u2_028", ja: "life の複数形" },
  { id: "u2_029", ja: "創造性［力］、独創性［力］" },
  { id: "u2_030", ja: "シェフ、コック長" },
  { id: "u2_031", ja: "外国（へ［から］）の" },
  { id: "u2_034", ja: "…を創造する、つくり出す" },
  { id: "u2_039", ja: "変わる、変化する" },

  // Unit 3 part 1
  { id: "u3_003", ja: "職業" },
  { id: "u3_005", ja: "情報" },
  { id: "u3_006", ja: "国際的な" },
  { id: "u3_002", ja: "保育所、託児所" },
  { id: "u3_007", ja: "メモ、覚え書き" },
  { id: "u3_008", ja: "自分自身の、独自の" },
  { id: "u3_009", ja: "つけ札、荷札" },
  { id: "u3_010", en: "chopsticks", ja: "（複数形で）はし", answers: ["chopsticks"] },
  { id: "u3_001", ja: "（子供用）絵本" },
  { id: "term_test_nursery_school", en: "nursery school", ja: "保育園", pron: "ナーサリー スクール", answers: ["nursery school"], skipStats: true },
  { id: "u3_004", ja: "職業体験日" }
];

const GRADE2_TERM_FILL_ITEMS = [
  // Unit 0 表現チェック
  { id: "term_fill_u0_01", unit: "Unit 0", ja: "小林さんは今日、忙しくありませんでした。", question: "Mr. Kobayashi ＿＿ not ＿＿ today.", en: "was busy" },
  { id: "term_fill_u0_02", unit: "Unit 0", ja: "あなたの夏休みはどうでしたか。", question: "＿＿ ＿＿ your summer vacation?", en: "How was" },
  { id: "term_fill_u0_04", unit: "Unit 0", ja: "名古屋に行きました。", question: "I ＿＿ ＿＿ Nagoya.", en: "went to" },
  { id: "term_fill_u0_05", unit: "Unit 0", ja: "彼らは買い物をして楽しみました。", question: "They ＿＿ ＿＿.", en: "enjoyed shopping" },
  { id: "term_fill_u0_06", unit: "Unit 0", ja: "それはすばらしい経験でした。", question: "It ＿＿ a great ＿＿.", en: "was experience" },
  { id: "term_fill_u0_07", unit: "Unit 0", ja: "私たちは昨日疲れていませんでした。", question: "We ＿＿ not ＿＿ yesterday.", en: "were tired" },
  { id: "term_fill_u0_08", unit: "Unit 0", ja: "あなたは放課後プールに行きましたか。", question: "＿＿ ＿＿ go to the pool after school?", en: "Did you" },
  { id: "term_fill_u0_09", unit: "Unit 0", ja: "箱の中にいくつかのボールがあります。", question: "＿＿ ＿＿ some balls in the box.", en: "There are" },
  { id: "term_fill_u0_10", unit: "Unit 0", ja: "この近くに郵便局はありますか。", question: "＿＿ ＿＿ a post office near here?", en: "Is there" },

  // Unit 1 表現チェック
  { id: "term_fill_u1_01", unit: "Unit 1", ja: "健は私たちをあちこち案内してくれました。", question: "Ken ＿＿ us ＿＿.", en: "showed around" },
  { id: "term_fill_u1_02", unit: "Unit 1", ja: "またね。", question: "＿＿ ＿＿.", en: "See you" },
  { id: "term_fill_u1_03", unit: "Unit 1", ja: "あなたの家は駅から遠いですか。", question: "Is your house ＿＿ ＿＿ the station?", en: "far from" },
  { id: "term_fill_u1_04", unit: "Unit 1", ja: "予約をしたいのですが。", question: "I'd like to ＿＿ a ＿＿.", en: "make reservation" },
  { id: "term_fill_u1_05", unit: "Unit 1", ja: "その木は10メートルの高さがあります。", question: "The tree is 10 ＿＿ ＿＿.", en: "meters tall", answers: ["metres tall"] },
  { id: "term_fill_u1_06", unit: "Unit 1", ja: "今週末、買い物に行きましょう。", question: "Let's ＿＿ ＿＿ this weekend.", en: "go shopping" },
  { id: "term_fill_u1_07", unit: "Unit 1", ja: "私は、例えばサッカーやラグビーなどのスポーツが好きです。", question: "I like sports, ＿＿ ＿＿, soccer and rugby.", en: "for example" },
  { id: "term_fill_u1_08", unit: "Unit 1", ja: "私は彼らと英語で意思の疎通をすることができませんでした。", question: "I could not ＿＿ ＿＿ them in English.", en: "communicate with" },

  // Unit 1 Key Sentences 選択問題
  { id: "term_fill_u1_ks_01", unit: "Unit 1 K.S.", ja: "アヤは明日、昼食を作る予定です。", question: "Aya is going to ＿＿ lunch tomorrow.", en: "make", choices: ["make", "makes", "making", "made"] },
  { id: "term_fill_u1_ks_02", unit: "Unit 1 K.S.", ja: "私はその塔の写真を撮るつもりです。", question: "I will ＿＿ pictures of the tower.", en: "take", choices: ["to take", "taking", "take", "took"] },
  { id: "term_fill_u1_ks_03", unit: "Unit 1 K.S.", ja: "私は昨日、彼女にペンをあげました。", question: "I ＿＿ her a pen yesterday.", en: "gave", choices: ["called", "looked", "gave", "give"] },
  { id: "term_fill_u1_ks_04", unit: "Unit 1 K.S.", ja: "彼らは彼にサッカーボールを買いました。", question: "They bought ＿＿ a soccer ball.", en: "him", choices: ["he", "his", "him", "they"] },
  { id: "term_fill_u1_ks_05", unit: "Unit 1 K.S.", ja: "私の父は私をナオと呼びます。", question: "My father calls ＿＿ Nao.", en: "me", choices: ["I", "my", "me", "mine"] },

  // Unit 2 表現チェック
  { id: "term_fill_u2_01", unit: "Unit 2", ja: "メグはサッカー、テニスなどをすることができます。", question: "She can play soccer, tennis, ＿＿ ＿＿ ＿＿.", en: "and so on" },
  { id: "term_fill_u2_02", unit: "Unit 2", ja: "いつか東京を訪れたいです。", question: "I ＿＿ ＿＿ ＿＿ visit Tokyo someday.", en: "would love to" },
  { id: "term_fill_u2_03", unit: "Unit 2", ja: "ジムは日本史に興味があります。", question: "Jim is ＿＿ ＿＿ Japanese history.", en: "interested in" },
  { id: "term_fill_u2_04", unit: "Unit 2", ja: "この公園にはたくさんの種類の植物があります。", question: "There are many ＿＿ ＿＿ plants in this park.", en: "kinds of", answers: ["kinds of"] },
  { id: "term_fill_u2_05", unit: "Unit 2", ja: "あの男性はイギリスの出身です。", question: "That man ＿＿ ＿＿ the U.K.", en: "comes from" },
  { id: "term_fill_u2_06", unit: "Unit 2", ja: "ここにおもしろい本があります。", question: "＿＿ ＿＿ an interesting book.", en: "Here is" },
  { id: "term_fill_u2_07", unit: "Unit 2", ja: "彼女は大好きな俳優にちなんでそのネコをタカと名づけました。", question: "She ＿＿ the cat Taka ＿＿ her favorite actor.", en: "named after" },

  // Unit 2 Key Sentences 選択問題
  { id: "term_fill_u2_ks_01", unit: "Unit 2 K.S.", ja: "もし明日ここに来るなら、一緒にバスケットボールをしましょう。", question: "If you ＿＿ here tomorrow, let's play basketball together.", en: "come", choices: ["come", "came", "will come", "comes"] },
  { id: "term_fill_u2_ks_02", unit: "Unit 2 K.S.", ja: "多くの人が祭りに行くと思います。", question: "I think ＿＿ a lot of people will go to the festival.", en: "that", choices: ["when", "if", "that", "because"] },
  { id: "term_fill_u2_ks_03", unit: "Unit 2 K.S.", ja: "この筆箱はかわいいので買いたいです。", question: "I want to buy this pencil case ＿＿ it's cute.", en: "because", choices: ["so", "because", "but", "when"] },
  { id: "term_fill_u2_ks_04", unit: "Unit 2 K.S.", ja: "マイは時間があるときにピアノを練習します。", question: "Mai practices the piano ＿＿ she has free time.", en: "when", choices: ["then", "when", "what", "that"] },

  // Unit 2 Key Sentences 空所補充
  { id: "term_fill_u2_ks_05", unit: "Unit 2 K.S.", ja: "もし今度の土曜日が晴れならば、健二は海に行くつもりです。", question: "Kenji will go to the sea ＿＿ it ＿＿ sunny next Saturday.", en: "if is" },
  { id: "term_fill_u2_ks_06", unit: "Unit 2 K.S.", ja: "私はこれはいい考えだと思います。", question: "＿＿ ＿＿ this is a good idea.", en: "I think" },
  { id: "term_fill_u2_ks_07", unit: "Unit 2 K.S.", ja: "理絵は昨日学校に来たとき、疲れているように見えました。", question: "＿＿ Rie ＿＿ to school yesterday, she looked tired.", en: "When came" },
  { id: "term_fill_u2_ks_08", unit: "Unit 2 K.S.", ja: "博はみんなに親切なので、私は彼が好きです。", question: "＿＿ Hiroshi ＿＿ kind to everyone, I like him.", en: "Because is" },
  { id: "term_fill_u2_ks_09", unit: "Unit 2 K.S.", ja: "あなたは彼女がダンスが得意なことを知っていますか。", question: "Do you know ＿＿ ＿＿ good at dancing?", en: "she is" },
  { id: "term_fill_u2_ks_10", unit: "Unit 2 K.S.", ja: "私はこの前の日曜日に動物園に行ったので、今週末は行くつもりはありません。", question: "I'm not going to go to the zoo this weekend ＿＿ I ＿＿ there last Sunday.", en: "because went" },

  // Unit 2 紹介文
  { id: "term_fill_u2_passage_01", unit: "Unit 2 紹介文", ja: "もんじゃ焼きは東京のご当地料理です。", question: "It's a ＿＿ dish of Tokyo.", en: "local" },
  { id: "term_fill_u2_passage_02", unit: "Unit 2 紹介文", ja: "とてもおいしいので、もんじゃ焼きが大好きです。", question: "I like monjayaki very much ＿＿ it's delicious.", en: "because" },
  { id: "term_fill_u2_passage_03", unit: "Unit 2 紹介文", ja: "作るとき、私はわくわくします。", question: "＿＿ I make it, I feel excited.", en: "When" },
  { id: "term_fill_u2_passage_04", unit: "Unit 2 紹介文", ja: "気に入ってくれるといいと思います。", question: "I ＿＿ you will like it.", en: "hope" },

  // Unit 3 part 1 表現・K.S.チェック
  { id: "term_fill_u3_01", unit: "Unit 3 part 1", ja: "私は英語を学ぶためにコンピューターを使います。", question: "I ＿＿ a computer ＿＿ ＿＿ English.", en: "use to learn" },
  { id: "term_fill_u3_02", unit: "Unit 3 part 1", ja: "あなた自身のクロームブックを持ってきなさい。", question: "＿＿ your ＿＿ Chromebook.", en: "Bring own" },
  { id: "term_fill_u3_03", unit: "Unit 3 part 1", ja: "彼らはケーキを作るためにいくつかの卵を買いました。", question: "They bought some eggs ＿＿ ＿＿ a ＿＿.", en: "to make cake" },
  { id: "term_fill_u3_04", unit: "Unit 3 part 1", ja: "あなたのごみは持ち帰ってください。", question: "Please ＿＿ your garbage ＿＿ ＿＿.", en: "take back home" },
  { id: "term_fill_u3_05", unit: "Unit 3 part 1", ja: "彼は走るためにここへ来ました。", question: "He ＿＿ here ＿＿ ＿＿.", en: "came to run" },
  { id: "term_fill_u3_ks_01", unit: "Unit 3 part 1 K.S.", ja: "ジュンは宿題をするために図書館へ行きました。", question: "Jun went to the ＿＿ to ＿＿ his homework.", en: "library do" },
  { id: "term_fill_u3_ks_02", unit: "Unit 3 part 1 K.S.", ja: "リサは牛乳を買うためにスーパーへ行きました。", question: "Risa went to the supermarket ＿＿ ＿＿ some milk.", en: "to buy" },
  { id: "term_fill_u3_ks_03", unit: "Unit 3 part 1 K.S.", ja: "アンナは父と泳ぐために海へ行きました。", question: "Anna went to the sea ＿＿ ＿＿ with her father.", en: "to swim" }
].map(item => ({
  ...item,
  type: "fill_blank",
  blankCount: item.en.trim().split(/\s+/).length,
  answers: item.answers || [],
  skipStats: true
}));

const GRADE2_TENSE_SCENARIOS = [
  { id: "aya_make", subject: "Aya", base: "make", present: "makes", past: "made", ing: "making", bePresent: "is", bePast: "was", presentTail: "lunch every day.", pastTail: "lunch yesterday.", futureTail: "lunch tomorrow.", jaPresent: "アヤは毎日、昼食を作ります。", jaPast: "アヤは昨日、昼食を作りました。", jaFuture: "アヤは明日、昼食を作るでしょう。" },
  { id: "takashi_leave", subject: "Takashi", base: "leave", present: "leaves", past: "left", ing: "leaving", bePresent: "is", bePast: "was", presentTail: "home at seven every morning.", pastTail: "home at seven yesterday.", futureTail: "home at seven tomorrow.", jaPresent: "孝は毎朝7時に家を出発します。", jaPast: "孝は昨日7時に家を出発しました。", jaFuture: "孝は明日7時に家を出発するでしょう。" },
  { id: "ken_show", subject: "Ken", base: "show", present: "shows", past: "showed", ing: "showing", bePresent: "is", bePast: "was", presentTail: "us around the city on weekends.", pastTail: "us around the city last Sunday.", futureTail: "us around the city next Sunday.", jaPresent: "健は週末に私たちを町のあちこちへ案内します。", jaPast: "健はこの前の日曜日、私たちを町のあちこちへ案内しました。", jaFuture: "健は次の日曜日、私たちを町のあちこちへ案内するでしょう。" },
  { id: "they_enjoy", subject: "They", base: "enjoy", present: "enjoy", past: "enjoyed", ing: "enjoying", bePresent: "are", bePast: "were", presentTail: "shopping after school.", pastTail: "shopping yesterday.", futureTail: "shopping tomorrow.", jaPresent: "彼らは放課後、買い物を楽しみます。", jaPast: "彼らは昨日、買い物を楽しみました。", jaFuture: "彼らは明日、買い物を楽しむでしょう。" },
  { id: "mika_go", subject: "Mika", base: "go", present: "goes", past: "went", ing: "going", bePresent: "is", bePast: "was", presentTail: "to Nagoya every summer.", pastTail: "to Nagoya last summer.", futureTail: "to Nagoya next summer.", jaPresent: "ミカは毎年夏に名古屋へ行きます。", jaPast: "ミカは去年の夏、名古屋へ行きました。", jaFuture: "ミカは来年の夏、名古屋へ行くでしょう。" },
  { id: "we_visit", subject: "We", base: "visit", present: "visit", past: "visited", ing: "visiting", bePresent: "are", bePast: "were", presentTail: "the museum every month.", pastTail: "the museum last month.", futureTail: "the museum next month.", jaPresent: "私たちは毎月その博物館を訪れます。", jaPast: "私たちは先月その博物館を訪れました。", jaFuture: "私たちは来月その博物館を訪れるでしょう。" },
  { id: "risa_buy", subject: "Risa", base: "buy", present: "buys", past: "bought", ing: "buying", bePresent: "is", bePast: "was", presentTail: "milk at the supermarket.", pastTail: "milk at the supermarket yesterday.", futureTail: "milk at the supermarket tomorrow.", jaPresent: "リサはスーパーで牛乳を買います。", jaPast: "リサは昨日スーパーで牛乳を買いました。", jaFuture: "リサは明日スーパーで牛乳を買うでしょう。" },
  { id: "anna_swim", subject: "Anna", base: "swim", present: "swims", past: "swam", ing: "swimming", bePresent: "is", bePast: "was", presentTail: "in the sea every summer.", pastTail: "in the sea last Sunday.", futureTail: "in the sea next Sunday.", jaPresent: "アンナは毎年夏に海で泳ぎます。", jaPast: "アンナはこの前の日曜日、海で泳ぎました。", jaFuture: "アンナは次の日曜日、海で泳ぐでしょう。" },
  { id: "jun_do", subject: "Jun", base: "do", present: "does", past: "did", ing: "doing", bePresent: "is", bePast: "was", presentTail: "his homework in the library.", pastTail: "his homework in the library yesterday.", futureTail: "his homework in the library tomorrow.", jaPresent: "ジュンは図書館で宿題をします。", jaPast: "ジュンは昨日図書館で宿題をしました。", jaFuture: "ジュンは明日図書館で宿題をするでしょう。" },
  { id: "jim_study", subject: "Jim", base: "study", present: "studies", past: "studied", ing: "studying", bePresent: "is", bePast: "was", presentTail: "Japanese history every day.", pastTail: "Japanese history yesterday.", futureTail: "Japanese history tomorrow.", jaPresent: "ジムは毎日日本史を勉強します。", jaPast: "ジムは昨日日本史を勉強しました。", jaFuture: "ジムは明日日本史を勉強するでしょう。" },
  { id: "meg_play", subject: "Meg", base: "play", present: "plays", past: "played", ing: "playing", bePresent: "is", bePast: "was", presentTail: "soccer after school.", pastTail: "soccer after school yesterday.", futureTail: "soccer after school tomorrow.", jaPresent: "メグは放課後サッカーをします。", jaPast: "メグは昨日、放課後サッカーをしました。", jaFuture: "メグは明日、放課後サッカーをするでしょう。" },
  { id: "she_name", subject: "She", base: "name", present: "names", past: "named", ing: "naming", bePresent: "is", bePast: "was", presentTail: "her cats after actors.", pastTail: "the cat Taka after an actor.", futureTail: "her new cat after an actor.", jaPresent: "彼女は俳優にちなんでネコに名前をつけます。", jaPast: "彼女は俳優にちなんでそのネコをタカと名づけました。", jaFuture: "彼女は俳優にちなんで新しいネコに名前をつけるでしょう。" },
  { id: "kumi_make", subject: "Kumi", base: "make", present: "makes", past: "made", ing: "making", bePresent: "is", bePast: "was", presentTail: "monjayaki at home.", pastTail: "monjayaki at home yesterday.", futureTail: "monjayaki at home tomorrow.", jaPresent: "久美は家でもんじゃ焼きを作ります。", jaPast: "久美は昨日、家でもんじゃ焼きを作りました。", jaFuture: "久美は明日、家でもんじゃ焼きを作るでしょう。" },
  { id: "he_use", subject: "He", base: "use", present: "uses", past: "used", ing: "using", bePresent: "is", bePast: "was", presentTail: "a computer to learn English.", pastTail: "a computer to learn English yesterday.", futureTail: "a computer to learn English tomorrow.", jaPresent: "彼は英語を学ぶためにコンピューターを使います。", jaPast: "彼は昨日、英語を学ぶためにコンピューターを使いました。", jaFuture: "彼は明日、英語を学ぶためにコンピューターを使うでしょう。" },
  { id: "taro_come", subject: "Taro", base: "come", present: "comes", past: "came", ing: "coming", bePresent: "is", bePast: "was", presentTail: "here to run every morning.", pastTail: "here to run yesterday.", futureTail: "here to run tomorrow.", jaPresent: "太郎は毎朝走るためにここへ来ます。", jaPast: "太郎は昨日、走るためにここへ来ました。", jaFuture: "太郎は明日、走るためにここへ来るでしょう。" },
  { id: "father_call", subject: "My father", base: "call", present: "calls", past: "called", ing: "calling", bePresent: "is", bePast: "was", presentTail: "me Nao.", pastTail: "me Nao yesterday.", futureTail: "me Nao tomorrow.", jaPresent: "父は私をナオと呼びます。", jaPast: "父は昨日、私をナオと呼びました。", jaFuture: "父は明日、私をナオと呼ぶでしょう。" },
  { id: "they_find", subject: "They", base: "find", present: "find", past: "found", ing: "finding", bePresent: "are", bePast: "were", presentTail: "interesting paintings in the area.", pastTail: "an interesting painting yesterday.", futureTail: "more paintings tomorrow.", jaPresent: "彼らはその地域でおもしろい絵を見つけます。", jaPast: "彼らは昨日おもしろい絵を見つけました。", jaFuture: "彼らは明日さらに多くの絵を見つけるでしょう。" },
  { id: "chef_create", subject: "The chef", base: "create", present: "creates", past: "created", ing: "creating", bePresent: "is", bePast: "was", presentTail: "new flavors every year.", pastTail: "a new flavor last year.", futureTail: "a new flavor next year.", jaPresent: "そのシェフは毎年新しい味を作り出します。", jaPast: "そのシェフは去年、新しい味を作り出しました。", jaFuture: "そのシェフは来年、新しい味を作り出すでしょう。" },
  { id: "traveler_order", subject: "The traveler", base: "order", present: "orders", past: "ordered", ing: "ordering", bePresent: "is", bePast: "was", presentTail: "ramen at this restaurant.", pastTail: "ramen at this restaurant yesterday.", futureTail: "ramen at this restaurant tomorrow.", jaPresent: "その旅行者はこのレストランでラーメンを注文します。", jaPast: "その旅行者は昨日このレストランでラーメンを注文しました。", jaFuture: "その旅行者は明日このレストランでラーメンを注文するでしょう。" },
  { id: "they_communicate", subject: "They", base: "communicate", present: "communicate", past: "communicated", ing: "communicating", bePresent: "are", bePast: "were", presentTail: "with visitors in English.", pastTail: "with visitors in English yesterday.", futureTail: "with visitors in English tomorrow.", jaPresent: "彼らは訪問者と英語で意思の疎通をします。", jaPast: "彼らは昨日、訪問者と英語で意思の疎通をしました。", jaFuture: "彼らは明日、訪問者と英語で意思の疎通をするでしょう。" }
];

function getOneWordTenseChoices(scenario, correct) {
  const candidates = [
    correct,
    scenario.present,
    scenario.past,
    scenario.base,
    scenario.ing,
    `${scenario.base}s`
  ];
  return [...new Set(candidates)].slice(0, 4);
}

function getFutureTenseChoices(scenario) {
  const candidates = [
    `will ${scenario.base}`,
    `will ${scenario.present}`,
    `will ${scenario.past}`,
    `will ${scenario.ing}`,
    `will ${scenario.base}s`
  ];
  return [...new Set(candidates)].slice(0, 4);
}

const GRADE2_TERM_TENSE_ITEMS = GRADE2_TENSE_SCENARIOS.flatMap(scenario => [
  {
    id: `term_tense_${scenario.id}_present`,
    ja: scenario.jaPresent,
    question: `${scenario.subject} ＿＿ ${scenario.presentTail}`,
    en: scenario.present,
    sentence: `${scenario.subject} ${scenario.present} ${scenario.presentTail}`,
    choices: getOneWordTenseChoices(scenario, scenario.present)
  },
  {
    id: `term_tense_${scenario.id}_past`,
    ja: scenario.jaPast,
    question: `${scenario.subject} ＿＿ ${scenario.pastTail}`,
    en: scenario.past,
    sentence: `${scenario.subject} ${scenario.past} ${scenario.pastTail}`,
    choices: getOneWordTenseChoices(scenario, scenario.past)
  },
  {
    id: `term_tense_${scenario.id}_future`,
    ja: scenario.jaFuture,
    question: `${scenario.subject} ＿＿ ${scenario.futureTail}`,
    en: `will ${scenario.base}`,
    sentence: `${scenario.subject} will ${scenario.base} ${scenario.futureTail}`,
    choices: getFutureTenseChoices(scenario)
  }
]).map(item => ({
  ...item,
  type: "fill_blank",
  blankCount: 1,
  answers: [],
  skipStats: true
}));

const CONJUNCTION_CHOICES = ["when", "if", "because", "that"];
const GRADE2_TERM_CONJUNCTION_ITEMS = [
  { id: "term_conj_01", ja: "もし明日ここに来るなら、一緒にバスケットボールをしましょう。", question: "＿＿ you come here tomorrow, let's play basketball together.", en: "if" },
  { id: "term_conj_02", ja: "多くの人が祭りに行くと思います。", question: "I think ＿＿ a lot of people will go to the festival.", en: "that" },
  { id: "term_conj_03", ja: "この筆箱はかわいいので買いたいです。", question: "I want to buy this pencil case ＿＿ it's cute.", en: "because" },
  { id: "term_conj_04", ja: "マイは時間があるときにピアノを練習します。", question: "Mai practices the piano ＿＿ she has free time.", en: "when" },
  { id: "term_conj_05", ja: "もし土曜日が晴れなら、健二は海に行くつもりです。", question: "Kenji will go to the sea ＿＿ it is sunny on Saturday.", en: "if" },
  { id: "term_conj_06", ja: "私はこれはいい考えだと思います。", question: "I think ＿＿ this is a good idea.", en: "that" },
  { id: "term_conj_07", ja: "理絵は学校に来たとき、疲れているように見えました。", question: "＿＿ Rie came to school, she looked tired.", en: "when" },
  { id: "term_conj_08", ja: "博はみんなに親切なので、私は彼が好きです。", question: "I like Hiroshi ＿＿ he is kind to everyone.", en: "because" },
  { id: "term_conj_09", ja: "あなたは彼女がダンスが得意なことを知っていますか。", question: "Do you know ＿＿ she is good at dancing?", en: "that" },
  { id: "term_conj_10", ja: "この前の日曜日に動物園へ行ったので、今週末は行きません。", question: "I'm not going to the zoo this weekend ＿＿ I went there last Sunday.", en: "because" },
  { id: "term_conj_11", ja: "もんじゃ焼きを作るとき、私はわくわくします。", question: "＿＿ I make monjayaki, I feel excited.", en: "when" },
  { id: "term_conj_12", ja: "あなたが気に入ってくれることを願っています。", question: "I hope ＿＿ you will like it.", en: "that" },
  { id: "term_conj_13", ja: "もし日本史に興味があるなら、この本を読んでください。", question: "＿＿ you are interested in Japanese history, read this book.", en: "if" },
  { id: "term_conj_14", ja: "スープが濃いので、私は札幌ラーメンが好きです。", question: "I like Sapporo ramen ＿＿ the soup is thick.", en: "because" },
  { id: "term_conj_15", ja: "健が空港に到着したとき、私たちはわくわくしました。", question: "＿＿ Ken arrived at the airport, we were excited.", en: "when" },
  { id: "term_conj_16", ja: "食べ物は世界中を旅すると思います。", question: "I think ＿＿ food travels around the world.", en: "that" },
  { id: "term_conj_17", ja: "もし予約があるなら、すぐに席に着けます。", question: "＿＿ she has a reservation, she can get a table soon.", en: "if" },
  { id: "term_conj_18", ja: "彼はおもしろい絵を見つけたので驚きました。", question: "He was surprised ＿＿ he found an interesting painting.", en: "because" },
  { id: "term_conj_19", ja: "彼らは買い物に行くとき、英語で話します。", question: "＿＿ they go shopping, they communicate in English.", en: "when" },
  { id: "term_conj_20", ja: "もし気候が変化すれば、私たちの生活も変わるでしょう。", question: "＿＿ the climate changes, our lives will change too.", en: "if" }
].map(item => ({
  ...item,
  type: "fill_blank",
  blankCount: 1,
  choices: CONJUNCTION_CHOICES,
  answers: [],
  skipStats: true
}));

const GRADE2_TERM_REORDER_ITEMS = GRADE2_TERM_TENSE_ITEMS.map(item => {
  const words = item.sentence.trim().split(/\s+/);
  return {
    id: item.id.replace("term_tense_", "term_reorder_"),
    type: "reorder_pair",
    ja: item.ja,
    en: `${words[1]}|||${words[3]}`,
    fullSentence: item.sentence,
    skipStats: true
  };
});

const quests = [
  {
    id: "unit01_dungeon_1f",
    title: "Unit0~1ダンジョン 1F",
    boss: "スライム1",
    bossLife: 10,
    enemyImg: "images/enemies/slime.png",
    backgroundImg: "images/backgrounds/dungeon_unit01.png",
    mode: "area",
    unit: "Unit0~1",
    area: "dungeon1",
    wordType: "word"
  },
  {
    id: "unit01_dungeon_2f",
    title: "Unit0~1ダンジョン 2F",
    boss: "スライム2",
    bossLife: 10,
    enemyImg: "images/enemies/slime.png",
    backgroundImg: "images/backgrounds/dungeon_unit01.png",
    mode: "area",
    unit: "Unit0~1",
    area: "dungeon2",
    wordType: "word"
  },
  {
    id: "unit01_dungeon_3f",
    title: "Unit0~1ダンジョン 3F",
    boss: "スライム3",
    bossLife: 10,
    enemyImg: "images/enemies/slime.png",
    backgroundImg: "images/backgrounds/dungeon_unit01.png",
    mode: "area",
    unit: "Unit0~1",
    area: "dungeon3",
    wordType: "word"
  },
  {
    id: "unit01_dungeon_4f",
    title: "Unit0~1ダンジョン 4F",
    boss: "スライム4",
    bossLife: 10,
    enemyImg: "images/enemies/slime.png",
    backgroundImg: "images/backgrounds/dungeon_unit01.png",
    mode: "area",
    unit: "Unit0~1",
    area: "dungeon4",
    wordType: "word"
  },
  {
    id: "unit01_dungeon_5f",
    title: "Unit0~1ダンジョン 5F",
    boss: "スライム5",
    bossLife: 15,
    enemyImg: "images/enemies/slime.png",
    backgroundImg: "images/backgrounds/dungeon_unit01.png",
    mode: "area",
    unit: "Unit0~1",
    area: "dungeon5",
    wordType: "word"
  },
  {
    id: "unit01_dungeon_deepest",
    title: "Unit0~1ダンジョン 最深階",
    boss: "スライムキング",
    bossLife: 20,
    enemyImg: "images/enemies/slime_king.png",
    backgroundImg: "images/backgrounds/dungeon_unit01.png",
    mode: "final",
    unit: "Unit0~1",
    wordType: "word"
  },
  {
    id: "unit2_dungeon_1f",
    title: "Unit2ダンジョン 1F",
    boss: "ゴースト1",
    bossLife: 10,
    enemyImg: "images/enemies/ghost.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit2",
    area: "dungeon1",
    wordType: "word"
  },
  {
    id: "unit2_dungeon_2f",
    title: "Unit2ダンジョン 2F",
    boss: "ゴースト2",
    bossLife: 10,
    enemyImg: "images/enemies/ghost.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit2",
    area: "dungeon2",
    wordType: "word"
  },
  {
    id: "unit2_dungeon_3f",
    title: "Unit2ダンジョン 3F",
    boss: "ゴースト3",
    bossLife: 10,
    enemyImg: "images/enemies/ghost.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit2",
    area: "dungeon3",
    wordType: "word"
  },
  {
    id: "unit2_dungeon_4f",
    title: "Unit2ダンジョン 4F",
    boss: "ゴースト4",
    bossLife: 15,
    enemyImg: "images/enemies/ghost.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit2",
    area: "dungeon4",
    wordType: "word"
  },
  {
    id: "unit2_dungeon_deepest",
    title: "Unit2ダンジョン 最深階",
    boss: "ゴーストマスター",
    bossLife: 20,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "final",
    unit: "Unit2",
    wordType: "word"
  },
  {
    id: "unit01_phrase_dungeon",
    title: "Unit0~1 熟語ダンジョン",
    boss: "熟語スライム",
    bossLife: 3,
    enemyImg: "images/enemies/slime_king.png",
    backgroundImg: "images/backgrounds/dungeon_unit01.png",
    mode: "phrase_unit",
    unit: "Unit0~1",
    wordType: "phrase"
  },
  {
    id: "unit2_phrase_dungeon",
    title: "Unit2 熟語ダンジョン",
    boss: "熟語ゴースト",
    bossLife: 7,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "phrase_unit",
    unit: "Unit2",
    wordType: "phrase"
  },
  {
    id: "unit2_word_test_prep",
    title: "Unit2 単語テスト対策ダンジョン①",
    boss: "テストゴースト",
    bossLife: 25,
    playerLife: 10,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "unit2_test_prep",
    unit: "Unit2",
    wordType: "mixed_test"
  },
  {
    id: "unit2_long_writing_test_prep",
    title: "Unit2 テスト対策ダンジョン②",
    boss: "ライティングゴースト",
    bossLife: 2,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "unit2_long_writing",
    unit: "Unit2",
    wordType: "long_writing"
  }
  ,
  {
    id: "unit3_dungeon_1f",
    title: "Unit3ダンジョン 1F",
    boss: "ゴブリンボーイ1",
    bossLife: 10,
    enemyImg: "images/enemies/goblin_boy.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit3",
    area: "dungeon1",
    wordType: "word"
  },
  {
    id: "unit3_dungeon_2f",
    title: "Unit3ダンジョン 2F",
    boss: "ゴブリンボーイ2",
    bossLife: 10,
    enemyImg: "images/enemies/goblin_boy.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit3",
    area: "dungeon2",
    wordType: "word"
  },
  {
    id: "unit3_dungeon_3f",
    title: "Unit3ダンジョン 3F",
    boss: "ゴブリンボーイ3",
    bossLife: 10,
    enemyImg: "images/enemies/goblin_boy.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit3",
    area: "dungeon3",
    wordType: "word"
  },
  {
    id: "unit3_dungeon_4f",
    title: "Unit3ダンジョン 4F",
    boss: "ゴブリンボーイ4",
    bossLife: 10,
    enemyImg: "images/enemies/goblin_boy.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit3",
    area: "dungeon4",
    wordType: "word"
  },
  {
    id: "unit3_dungeon_5f",
    title: "Unit3ダンジョン 5F",
    boss: "ゴブリンボーイ5",
    bossLife: 10,
    enemyImg: "images/enemies/goblin_boy.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "area",
    unit: "Unit3",
    area: "dungeon5",
    wordType: "word"
  },
  {
    id: "unit3_dungeon_deepest",
    title: "Unit3ダンジョン 最深階",
    boss: "ゴブリンガール",
    bossLife: 20,
    enemyImg: "images/enemies/goblin_girl.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "final",
    unit: "Unit3",
    wordType: "word"
  },
  {
    id: "grade2_term_test_ja_choice",
    title: "単語チェック　和訳（4択・全65語）",
    boss: "和訳テストドラゴン",
    bossLife: 20,
    playerLife: 10,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "grade2_term_test_ja_choice",
    unit: "中学校2年生定期テスト",
    wordType: "term_test"
  },
  {
    id: "grade2_term_test_words",
    title: "単語チェック　英訳（全65語）",
    boss: "定期テストドラゴン",
    bossLife: 20,
    playerLife: 10,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "grade2_term_test_words",
    unit: "中学校2年生定期テスト",
    wordType: "term_test"
  },
  {
    id: "grade2_term_fill_choice",
    title: "空所補充（選択式）",
    boss: "選択問題ドラゴン",
    bossLife: 20,
    playerLife: 10,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "grade2_term_fill_choice",
    unit: "中学校2年生定期テスト",
    wordType: "fill_test"
  },
  {
    id: "grade2_term_fill_written",
    title: "空所補充（記述式）",
    boss: "記述問題ドラゴン",
    bossLife: 20,
    playerLife: 10,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "grade2_term_fill_written",
    unit: "中学校2年生定期テスト",
    wordType: "fill_test"
  },
  {
    id: "grade2_term_tense_choice",
    title: "時制復習（選択式・全60問）",
    boss: "時制ドラゴン",
    bossLife: 20,
    playerLife: 10,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "grade2_term_tense_choice",
    unit: "中学校2年生定期テスト",
    wordType: "tense_test"
  },
  {
    id: "grade2_term_conjunction_choice",
    title: "接続詞（選択式・全20問）",
    boss: "接続詞ドラゴン",
    bossLife: 20,
    playerLife: 10,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "grade2_term_conjunction_choice",
    unit: "中学校2年生定期テスト",
    wordType: "conjunction_test"
  },
  {
    id: "grade2_term_reorder_choice",
    title: "並び替え（2番目・4番目・全60問）",
    boss: "並び替えドラゴン",
    bossLife: 20,
    playerLife: 10,
    enemyImg: "images/enemies/ghost_master.png",
    backgroundImg: "images/backgrounds/dungeon_unit2.png",
    mode: "grade2_term_reorder_choice",
    unit: "中学校2年生定期テスト",
    wordType: "reorder_test"
  }


];

const GRADE1_DUNGEONS = [
  {
    "id": "g1_verb",
    "title": "動詞ダンジョン",
    "countLabel": "118語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_verb_s01",
        "title": "動詞1",
        "boss": "スライム1"
      },
      {
        "id": "g1_verb_s02",
        "title": "動詞2",
        "boss": "スライム2"
      },
      {
        "id": "g1_verb_s03",
        "title": "動詞3",
        "boss": "スライム3"
      },
      {
        "id": "g1_verb_s04",
        "title": "動詞4",
        "boss": "スライム4"
      },
      {
        "id": "g1_verb_s05",
        "title": "動詞5",
        "boss": "スライム5"
      },
      {
        "id": "g1_verb_s06",
        "title": "動詞6",
        "boss": "スライム6"
      },
      {
        "id": "g1_verb_s07",
        "title": "動詞7",
        "boss": "スライム7"
      },
      {
        "id": "g1_verb_s08",
        "title": "動詞8",
        "boss": "スライム8"
      },
      {
        "id": "g1_verb_s09",
        "title": "動詞9",
        "boss": "スライム9"
      },
      {
        "id": "g1_verb_s10",
        "title": "動詞10",
        "boss": "スライム10"
      },
      {
        "id": "g1_verb_s11",
        "title": "動詞11",
        "boss": "スライム11"
      }
    ]
  },
  {
    "id": "g1_pronoun",
    "title": "代名詞ダンジョン",
    "countLabel": "36語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_pronoun_s01",
        "title": "代名詞1",
        "boss": "スライム1"
      },
      {
        "id": "g1_pronoun_s02",
        "title": "代名詞2",
        "boss": "スライム2"
      },
      {
        "id": "g1_pronoun_s03",
        "title": "代名詞3",
        "boss": "スライム3"
      }
    ]
  },
  {
    "id": "g1_adjective",
    "title": "形容詞ダンジョン",
    "countLabel": "64語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_adjective_s01",
        "title": "形容詞1",
        "boss": "スライム1"
      },
      {
        "id": "g1_adjective_s02",
        "title": "形容詞2",
        "boss": "スライム2"
      },
      {
        "id": "g1_adjective_s03",
        "title": "形容詞3",
        "boss": "スライム3"
      },
      {
        "id": "g1_adjective_s04",
        "title": "形容詞4",
        "boss": "スライム4"
      },
      {
        "id": "g1_adjective_s05",
        "title": "形容詞5",
        "boss": "スライム5"
      },
      {
        "id": "g1_adjective_s06",
        "title": "形容詞6",
        "boss": "スライム6"
      }
    ]
  },
  {
    "id": "g1_adverb",
    "title": "副詞ダンジョン",
    "countLabel": "35語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_adverb_s01",
        "title": "副詞1",
        "boss": "スライム1"
      },
      {
        "id": "g1_adverb_s02",
        "title": "副詞2",
        "boss": "スライム2"
      },
      {
        "id": "g1_adverb_s03",
        "title": "副詞3",
        "boss": "スライム3"
      }
    ]
  },
  {
    "id": "g1_question",
    "title": "疑問詞ダンジョン",
    "countLabel": "17語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_question_s01",
        "title": "疑問詞1",
        "boss": "スライム1"
      }
    ]
  },
  {
    "id": "g1_noun_1",
    "title": "名詞ダンジョン①",
    "countLabel": "90語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_noun_1_s01",
        "title": "名詞①-1",
        "boss": "スライム1"
      },
      {
        "id": "g1_noun_1_s02",
        "title": "名詞①-2",
        "boss": "スライム2"
      },
      {
        "id": "g1_noun_1_s03",
        "title": "名詞①-3",
        "boss": "スライム3"
      },
      {
        "id": "g1_noun_1_s04",
        "title": "名詞①-4",
        "boss": "スライム4"
      },
      {
        "id": "g1_noun_1_s05",
        "title": "名詞①-5",
        "boss": "スライム5"
      },
      {
        "id": "g1_noun_1_s06",
        "title": "名詞①-6",
        "boss": "スライム6"
      },
      {
        "id": "g1_noun_1_s07",
        "title": "名詞①-7",
        "boss": "スライム7"
      },
      {
        "id": "g1_noun_1_s08",
        "title": "名詞①-8",
        "boss": "スライム8"
      },
      {
        "id": "g1_noun_1_s09",
        "title": "名詞①-9",
        "boss": "スライム9"
      }
    ]
  },
  {
    "id": "g1_noun_2",
    "title": "名詞ダンジョン②",
    "countLabel": "90語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_noun_2_s01",
        "title": "名詞②-1",
        "boss": "スライム1"
      },
      {
        "id": "g1_noun_2_s02",
        "title": "名詞②-2",
        "boss": "スライム2"
      },
      {
        "id": "g1_noun_2_s03",
        "title": "名詞②-3",
        "boss": "スライム3"
      },
      {
        "id": "g1_noun_2_s04",
        "title": "名詞②-4",
        "boss": "スライム4"
      },
      {
        "id": "g1_noun_2_s05",
        "title": "名詞②-5",
        "boss": "スライム5"
      },
      {
        "id": "g1_noun_2_s06",
        "title": "名詞②-6",
        "boss": "スライム6"
      },
      {
        "id": "g1_noun_2_s07",
        "title": "名詞②-7",
        "boss": "スライム7"
      },
      {
        "id": "g1_noun_2_s08",
        "title": "名詞②-8",
        "boss": "スライム8"
      },
      {
        "id": "g1_noun_2_s09",
        "title": "名詞②-9",
        "boss": "スライム9"
      }
    ]
  },
  {
    "id": "g1_noun_3",
    "title": "名詞ダンジョン③",
    "countLabel": "90語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_noun_3_s01",
        "title": "名詞③-1",
        "boss": "スライム1"
      },
      {
        "id": "g1_noun_3_s02",
        "title": "名詞③-2",
        "boss": "スライム2"
      },
      {
        "id": "g1_noun_3_s03",
        "title": "名詞③-3",
        "boss": "スライム3"
      },
      {
        "id": "g1_noun_3_s04",
        "title": "名詞③-4",
        "boss": "スライム4"
      },
      {
        "id": "g1_noun_3_s05",
        "title": "名詞③-5",
        "boss": "スライム5"
      },
      {
        "id": "g1_noun_3_s06",
        "title": "名詞③-6",
        "boss": "スライム6"
      },
      {
        "id": "g1_noun_3_s07",
        "title": "名詞③-7",
        "boss": "スライム7"
      },
      {
        "id": "g1_noun_3_s08",
        "title": "名詞③-8",
        "boss": "スライム8"
      },
      {
        "id": "g1_noun_3_s09",
        "title": "名詞③-9",
        "boss": "スライム9"
      }
    ]
  },
  {
    "id": "g1_noun_4",
    "title": "名詞ダンジョン④",
    "countLabel": "90語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_noun_4_s01",
        "title": "名詞④-1",
        "boss": "スライム1"
      },
      {
        "id": "g1_noun_4_s02",
        "title": "名詞④-2",
        "boss": "スライム2"
      },
      {
        "id": "g1_noun_4_s03",
        "title": "名詞④-3",
        "boss": "スライム3"
      },
      {
        "id": "g1_noun_4_s04",
        "title": "名詞④-4",
        "boss": "スライム4"
      },
      {
        "id": "g1_noun_4_s05",
        "title": "名詞④-5",
        "boss": "スライム5"
      },
      {
        "id": "g1_noun_4_s06",
        "title": "名詞④-6",
        "boss": "スライム6"
      },
      {
        "id": "g1_noun_4_s07",
        "title": "名詞④-7",
        "boss": "スライム7"
      },
      {
        "id": "g1_noun_4_s08",
        "title": "名詞④-8",
        "boss": "スライム8"
      },
      {
        "id": "g1_noun_4_s09",
        "title": "名詞④-9",
        "boss": "スライム9"
      }
    ]
  },
  {
    "id": "g1_noun_5",
    "title": "名詞ダンジョン⑤",
    "countLabel": "102語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime.png",
    "stages": [
      {
        "id": "g1_noun_5_s01",
        "title": "名詞⑤-1",
        "boss": "スライム1"
      },
      {
        "id": "g1_noun_5_s02",
        "title": "名詞⑤-2",
        "boss": "スライム2"
      },
      {
        "id": "g1_noun_5_s03",
        "title": "名詞⑤-3",
        "boss": "スライム3"
      },
      {
        "id": "g1_noun_5_s04",
        "title": "名詞⑤-4",
        "boss": "スライム4"
      },
      {
        "id": "g1_noun_5_s05",
        "title": "名詞⑤-5",
        "boss": "スライム5"
      },
      {
        "id": "g1_noun_5_s06",
        "title": "名詞⑤-6",
        "boss": "スライム6"
      },
      {
        "id": "g1_noun_5_s07",
        "title": "名詞⑤-7",
        "boss": "スライム7"
      },
      {
        "id": "g1_noun_5_s08",
        "title": "名詞⑤-8",
        "boss": "スライム8"
      },
      {
        "id": "g1_noun_5_s09",
        "title": "名詞⑤-9",
        "boss": "スライム9"
      },
      {
        "id": "g1_noun_5_s10",
        "title": "名詞⑤-10",
        "boss": "スライム10"
      }
    ]
  },
  {
    "id": "g1_phrase",
    "title": "熟語ダンジョン",
    "countLabel": "2熟語",
    "backgroundImg": "images/backgrounds/dungeon_unit01.png",
    "enemyImg": "images/enemies/slime_king.png",
    "wordType": "phrase",
    "stages": [
      {
        "id": "g1_phrase_s01",
        "title": "熟語1",
        "boss": "熟語スライム"
      }
    ]
  }
];

function getGrade1Dungeon(dungeonId) {
  return GRADE1_DUNGEONS.find(d => d.id === dungeonId);
}

function getGrade1StageWords(dungeonId, stageId) {
  const dungeon = getGrade1Dungeon(dungeonId);
  if (dungeon?.wordType === "phrase") return state.phrases.filter(p => p.grade === 1);
  return state.words.filter(w => w.grade === 1 && w.dungeon === dungeonId && w.stage === stageId && (w.type || "word") === "word");
}

function buildGrade1Quests() {
  return GRADE1_DUNGEONS.flatMap(dungeon => dungeon.stages.map((stage, index) => {
    const stageWords = getGrade1StageWords(dungeon.id, stage.id);
    const bossLife = Math.max(1, stageWords.length || 10);
    return {
      id: `${dungeon.id}_${stage.id}`,
      title: `${dungeon.title} ${stage.title}`,
      boss: stage.boss || `スライム${index + 1}`,
      bossLife,
      enemyImg: dungeon.enemyImg,
      backgroundImg: dungeon.backgroundImg,
      mode: "g1_stage",
      grade: 1,
      unit: "1年生",
      dungeon: dungeon.id,
      stage: stage.id,
      wordType: dungeon.wordType || "word"
    };
  }));
}

function getAllQuests() {
  return [...quests, ...buildGrade1Quests()];
}

const $ = (id) => document.getElementById(id);

const FALLBACK_ENEMY_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <ellipse cx="120" cy="148" rx="86" ry="64" fill="#8bd66f" stroke="#35682d" stroke-width="10"/>
  <circle cx="90" cy="128" r="13" fill="#223322"/>
  <circle cx="150" cy="128" r="13" fill="#223322"/>
  <path d="M88 164 Q120 190 152 164" fill="none" stroke="#223322" stroke-width="8" stroke-linecap="round"/>
</svg>`);

const FALLBACK_PLAYER_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <circle cx="120" cy="92" r="54" fill="#ffe2a8" stroke="#5b3b20" stroke-width="8"/>
  <circle cx="98" cy="90" r="8" fill="#2b2118"/><circle cx="142" cy="90" r="8" fill="#2b2118"/>
  <path d="M96 122 Q120 140 144 122" fill="none" stroke="#2b2118" stroke-width="7" stroke-linecap="round"/>
  <path d="M70 178 Q120 138 170 178 L164 222 H76 Z" fill="#6abf69" stroke="#2f6c36" stroke-width="8"/>
</svg>`);

const ASSET_PATHS = [
  'images/player/mugi.png',
  'images/player/mugi_down.png',
  'images/player/mugi_win.png',
  'images/enemies/slime.png',
  'images/enemies/slime_king.png',
  'images/enemies/ghost.png',
  'images/enemies/ghost_master.png',
  'images/enemies/goblin_boy.png',
  'images/enemies/goblin_girl.png',
  'images/backgrounds/dungeon_unit01.png',
  'images/backgrounds/dungeon_unit2.png',
];

const assetStatus = new Map();

function preloadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      assetStatus.set(src, true);
      resolve(true);
    };
    img.onerror = () => {
      assetStatus.set(src, false);
      console.warn(`画像を読み込めませんでした: ${src}`);
      resolve(false);
    };
    img.src = src;
  });
}

async function preloadAssets() {
  await Promise.all(ASSET_PATHS.map(preloadImage));
  setPlayerImageFallback();
}

function isAssetReady(src) {
  return assetStatus.get(src) === true;
}

function setPlayerImageFallback() {
  const player = document.querySelector('.player-img');
  if (!player) return;
  player.onerror = () => {
    player.onerror = null;
    player.src = FALLBACK_PLAYER_SVG;
  };
  if (!isAssetReady('images/player/mugi.png')) {
    player.src = FALLBACK_PLAYER_SVG;
  }
}

function setEnemyImage(src, alt) {
  const enemy = $('enemyImg');
  if (!enemy) return;
  const fallback = isAssetReady('images/enemies/slime.png') ? 'images/enemies/slime.png' : FALLBACK_ENEMY_SVG;
  const requested = isAssetReady(src) ? src : fallback;
  enemy.onerror = () => {
    enemy.onerror = null;
    enemy.src = fallback;
  };
  enemy.src = requested;
  enemy.alt = alt || '敵';
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const loaded = JSON.parse(raw);
    state.save = {
      ...state.save,
      ...loaded,
      playerLife: Number.isFinite(loaded.playerLife) ? loaded.playerLife : (loaded.hp ? Math.ceil(loaded.hp / 34) : PLAYER_MAX_LIFE),
      learned: loaded.learned || {},
      mastered: loaded.mastered || {},
      clearedQuests: loaded.clearedQuests || {},
      termTestProgress: {
        wordTranslation: loaded.termTestProgress?.wordTranslation || {},
        fillWritten: loaded.termTestProgress?.fillWritten || {}
      }
    };
  } catch (e) {
    console.warn("セーブデータを読み込めませんでした", e);
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state.save));
}

async function loadWords() {
  if (Array.isArray(window.MUGI_WORDS) && Array.isArray(window.MUGI_PHRASES)) {
    state.words = window.MUGI_WORDS;
    state.phrases = window.MUGI_PHRASES;
    return;
  }

  const [wordRes, phraseRes] = await Promise.all([fetch("words.json"), fetch("phrases.json")]);
  if (!wordRes.ok) throw new Error("words.jsonを読み込めませんでした");
  if (!phraseRes.ok) throw new Error("phrases.jsonを読み込めませんでした");
  state.words = await wordRes.json();
  state.phrases = await phraseRes.json();
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getReviewDelay(streak) {
  const days = [0, 1, 3, 7, 14, 30, 60];
  return days[Math.min(Math.max(streak, 1), days.length - 1)] * DAY_MS;
}

function isReviewDue(itemId, now = Date.now()) {
  const stats = getWordStats(itemId);
  return stats.attempts > 0 && (!stats.nextReviewAt || stats.nextReviewAt <= now);
}

function getStudyPriority(item, now = Date.now()) {
  const stats = getWordStats(item.id);
  if (stats.attempts === 0) return 600 + Math.random() * 30;

  const rate = stats.attempts > 0 ? stats.correct / stats.attempts : 0;
  const overdueDays = stats.nextReviewAt ? Math.max(0, now - stats.nextReviewAt) / DAY_MS : 1;
  const dueScore = isReviewDue(item.id, now) ? 1000 + Math.min(overdueDays, 30) * 10 : 0;
  const weakScore = stats.wrong * 45 + (1 - rate) * 250;
  return dueScore + weakScore - stats.streak * 12 + Math.random() * 20;
}

function selectBattleItems(items, limit) {
  const now = Date.now();
  return items
    .map(item => ({ item, priority: getStudyPriority(item, now) }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, Math.min(limit, items.length))
    .map(entry => entry.item);
}

function normalizeAnswer(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/\s+/g, " ");
}

function getAcceptedAnswers(item) {
  const primary = item.answer || item.en || item.phrase || "";
  const answers = [primary, ...(item.answers || [])];
  return answers.map(normalizeAnswer).filter(Boolean);
}

function getPrimaryAnswer(item) {
  return item.answer || item.en || item.phrase || "";
}

function isPhraseItem(item) {
  return Boolean(item && (item.type === "phrase" || item.phrase || item.answer));
}

function getWordStats(wordId) {
  const raw = state.save.learned[wordId] || {};
  const correct = Number(raw.correct ?? raw.count ?? 0);
  const wrong = Number(raw.wrong ?? 0);
  const attempts = Number(raw.attempts ?? (correct + wrong));
  const streak = Number(raw.streak ?? 0);
  const lastReviewedAt = Number(raw.lastReviewedAt ?? 0);
  const nextReviewAt = Number(raw.nextReviewAt ?? 0);
  return { correct, wrong, attempts, streak, lastReviewedAt, nextReviewAt };
}

function saveWordStats(wordId, stats) {
  state.save.learned[wordId] = stats;
  const rate = stats.attempts > 0 ? stats.correct / stats.attempts : 0;
  const neededCorrect = String(wordId).startsWith("p1_") || String(wordId).startsWith("p2_") ? 3 : 5;
  if (stats.correct >= neededCorrect && rate >= 0.8) {
    state.save.mastered[wordId] = true;
  } else {
    delete state.save.mastered[wordId];
  }
}

function showScreen(name) {
  ["screenHome", "screenBattle", "screenWordBook", "screenPhraseBook", "screenResult"].forEach(id => $(id).classList.remove("active"));
  $(name).classList.add("active");

  const shell = document.querySelector(".game-shell");
  if (shell) {
    shell.classList.toggle("wordbook-mode", name === "screenWordBook" || name === "screenPhraseBook");
    shell.classList.toggle("screen-home-mode", name === "screenHome");
    shell.classList.toggle("screen-battle-mode", name === "screenBattle");
    shell.classList.toggle("screen-result-mode", name === "screenResult");
  }

  const mobileTitle = $("mobileBarTitle");
  if (mobileTitle) {
    if (name === "screenBattle" && state.currentQuest) {
      mobileTitle.textContent = `${state.currentQuest.title} ${state.currentQuest.boss}に挑戦！`;
    } else if (name === "screenWordBook") {
      mobileTitle.textContent = "単語図鑑";
    } else if (name === "screenPhraseBook") {
      mobileTitle.textContent = "熟語図鑑";
    } else if (name === "screenResult") {
      mobileTitle.textContent = "バトル結果";
    } else {
      mobileTitle.textContent = "ムギクエスト";
    }
  }

  const stage = $("stage");
  if (stage && name !== "screenHome") {
    stage.classList.remove("home-mode");
  }
  const battleStageTitle = $("battleStageTitle");
  if (battleStageTitle) {
    battleStageTitle.classList.toggle("hidden", name !== "screenBattle" || !state.currentQuest);
  }

  if (name === "screenHome") {
    applyHomeStage();
  }
}

function openWordBook() {
  const current = document.querySelector(".screen.active");
  state.previousScreen = current ? current.id : "screenHome";
  renderWordBook();
  showScreen("screenWordBook");
}

function closeWordBook() {
  const target = state.previousScreen && state.previousScreen !== "screenWordBook" ? state.previousScreen : "screenHome";
  showScreen(target);
}

function openPhraseBook() {
  const current = document.querySelector(".screen.active");
  state.previousScreen = current ? current.id : "screenHome";
  renderPhraseBook();
  showScreen("screenPhraseBook");
}

function closePhraseBook() {
  const target = state.previousScreen && state.previousScreen !== "screenPhraseBook" ? state.previousScreen : "screenHome";
  showScreen(target);
}

function goTop() {
  state.currentQuest = null;
  state.currentWord = null;
  state.enemyLife = 0;
  state.enemyMaxLife = 0;
  state.correct = 0;
  state.gainExp = 0;
  state.battleLog = [];
  state.newLearnedIds = new Set();
  state.selectedG1Dungeon = null;
  state.previousScreen = "screenHome";
  state.playerMaxLife = PLAYER_MAX_LIFE;

  const stageElement = $("stage");
  if (stageElement) stageElement.classList.remove("result-mode", "result-win", "result-lose");

  renderQuests();
  renderLearningDashboard();
  updateStatus();
  renderBattleLog();
  showScreen("screenHome");
}

function heartsText(life, maxLife = state.playerMaxLife || PLAYER_MAX_LIFE) {
  return Array.from({ length: maxLife }, (_, i) => i < life ? "♥" : "♡").join(" ");
}

function playerStageHeartsHtml(life, maxLife, rowsOfFive = false) {
  const hearts = Array.from({ length: maxLife }, (_, i) => i < life ? "♥" : "♡");
  if (!rowsOfFive) return hearts.join(" ");

  const rows = [];
  for (let i = 0; i < hearts.length; i += 5) {
    rows.push(`<span class="player-heart-row">${hearts.slice(i, i + 5).join(" ")}</span>`);
  }
  return rows.join("");
}

function enemyHeartArray(life, maxLife) {
  if (!maxLife || maxLife <= 0) return ["empty"];
  const maxHalfUnits = maxLife;
  const currentHalfUnits = Math.max(0, Math.min(maxHalfUnits, life));
  const heartSlots = Math.ceil(maxHalfUnits / 2);
  const hearts = [];

  for (let i = 0; i < heartSlots; i++) {
    const remaining = currentHalfUnits - (i * 2);
    if (remaining >= 2) {
      hearts.push("full");
    } else if (remaining === 1) {
      hearts.push("half");
    } else {
      hearts.push("empty");
    }
  }

  return hearts;
}

function enemyHeartHtml(type) {
  const safeType = ["full", "half", "empty"].includes(type) ? type : "empty";
  return `<span class="enemy-heart enemy-heart-${safeType}" aria-hidden="true">♥</span>`;
}

function enemyHeartsHtml(life, maxLife) {
  return enemyHeartArray(life, maxLife).map(enemyHeartHtml).join("");
}

function enemyStageHeartsHtml(life, maxLife) {
  const hearts = enemyHeartArray(life, maxLife);
  const rows = [];
  for (let i = 0; i < hearts.length; i += 5) {
    rows.push(`<span class="enemy-heart-row">${hearts.slice(i, i + 5).map(enemyHeartHtml).join("")}</span>`);
  }
  return rows.join("");
}

function enemyLifeDisplay() {
  if (!state.currentQuest) return "-";
  return `<span class="enemy-hearts">${enemyHeartsHtml(state.enemyLife, state.enemyMaxLife)}</span>`;
}

function updateStatus() {
  const lifePercent = Math.max(0, Math.min(100, (state.save.playerLife / (state.playerMaxLife || PLAYER_MAX_LIFE)) * 100));
  const enemyPercent = state.enemyMaxLife > 0
    ? Math.max(0, Math.min(100, (state.enemyLife / state.enemyMaxLife) * 100))
    : 0;

  if ($("hpText")) $("hpText").textContent = heartsText(state.save.playerLife);
  if ($("hpBar")) $("hpBar").style.width = `${lifePercent}%`;

  if ($("playerStageLife")) {
    const playerLifeEl = $("playerStageLife");
    const isTwoRowLife = (state.playerMaxLife || PLAYER_MAX_LIFE) > 5;
    playerLifeEl.classList.toggle("player-life-two-rows", isTwoRowLife);
    playerLifeEl.innerHTML = playerStageHeartsHtml(
      state.save.playerLife,
      state.playerMaxLife || PLAYER_MAX_LIFE,
      isTwoRowLife
    );
  }
  if ($("enemyStageLife")) {
    $("enemyStageLife").innerHTML = state.currentQuest ? enemyStageHeartsHtml(state.enemyLife, state.enemyMaxLife) : "";
  }

  if ($("enemyStatusText")) {
    $("enemyStatusText").innerHTML = enemyLifeDisplay();
  }
  if ($("enemyStatusBar")) {
    $("enemyStatusBar").style.width = state.currentQuest ? `${enemyPercent}%` : "0%";
  }
}

function getNormalizedStats(raw) {
  const correct = Number(raw?.correct ?? raw?.count ?? 0);
  const wrong = Number(raw?.wrong ?? 0);
  const attempts = Number(raw?.attempts ?? (correct + wrong));
  return { correct, wrong, attempts };
}

function getMasterRateText(wordId) {
  const stats = getWordStats(wordId);
  if (stats.attempts === 0) return "0%";
  return `${Math.round((stats.correct / stats.attempts) * 100)}%`;
}

function getCorrectRate(stats) {
  return stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;
}

function isWordMastered(wordId) {
  const stats = getWordStats(wordId);
  return stats.correct >= 5 && getCorrectRate(stats) >= 80;
}

function isPhraseMastered(phraseId) {
  const stats = getWordStats(phraseId);
  return stats.correct >= 3 && getCorrectRate(stats) >= 80;
}

function getProgressCountText(stats) {
  return `${stats.correct}/${stats.attempts}回`;
}

function renderLearningDashboard() {
  renderUnitSummary();
  renderWordBook();
  renderPhraseBook();
}

function renderUnitSummary() {
  const list = $("unitSummaryList");
  if (!list) return;

  const title = document.querySelector(".unit-record-card .section-head h2");
  const caption = document.querySelector(".unit-record-card .section-head p");

  const isGrade1 = state.selectedGrade === 1;
  if (title) title.textContent = isGrade1 ? "復習の記録" : "Unitの記録";
  if (caption) caption.textContent = isGrade1 ? "品詞別の進み具合" : "Unit全体の進み具合";

  const groups = isGrade1
    ? ["動詞", "代名詞", "形容詞", "副詞", "疑問詞", "名詞"].map(name => ({
        name,
        words: state.words.filter(w => w.grade === 1 && (w.partOfSpeech || w.pos) === name && (w.type || "word") === "word")
      }))
    : [...new Set(state.words
        .filter(w => w.grade !== 1 && w.unit && (w.type || "word") === "word")
        .map(w => w.unit))]
        .map(unit => ({
          name: unit,
          words: state.words.filter(w => w.grade !== 1 && w.unit === unit && (w.type || "word") === "word")
        }));

  list.innerHTML = "";

  groups.filter(group => group.words.length > 0).forEach(group => {
    const total = group.words.length;
    const totals = group.words.reduce((acc, word) => {
      const stats = getWordStats(word.id);
      if (stats.correct > 0) acc.learned += 1;
      if (isWordMastered(word.id)) acc.mastered += 1;
      if (isReviewDue(word.id)) acc.due += 1;
      return acc;
    }, { learned: 0, mastered: 0, due: 0 });

    const row = document.createElement("div");
    row.className = "unit-summary-row";
    row.innerHTML = `
      <div class="unit-name">${group.name}</div>
      <div class="unit-metrics-box">
        <div class="unit-metric">
          <span>1回以上正解</span>
          <strong>${totals.learned}/${total}</strong>
        </div>
        <div class="unit-metric master">
          <span>完全習得数</span>
          <strong>${totals.mastered}/${total}</strong>
        </div>
        <div class="unit-metric due">
          <span>今日の復習</span>
          <strong>${totals.due}語</strong>
        </div>
      </div>
    `;
    list.appendChild(row);
  });

  if (!isGrade1) {
    const progress = state.save.termTestProgress || {};
    const wordTranslationCount = Object.values(progress.wordTranslation || {}).filter(Boolean).length;
    const fillWrittenCount = Object.values(progress.fillWritten || {}).filter(Boolean).length;
    const row = document.createElement("div");
    row.className = "unit-summary-row term-test-summary-row";
    row.innerHTML = `
      <div class="unit-name">中学校2年生定期テスト</div>
      <div class="unit-metrics-box term-test-metrics-box">
        <div class="unit-metric">
          <span>単語英訳</span>
          <strong>${Math.min(wordTranslationCount, 65)}/65</strong>
        </div>
        <div class="unit-metric master">
          <span>空所補充記述</span>
          <strong>${Math.min(fillWrittenCount, 51)}/51</strong>
        </div>
      </div>
    `;
    list.appendChild(row);
  }
}

function getWordBookWordsByFilter() {
  const wordItems = state.words.filter(w => (w.type || "word") === "word");
  return wordItems.filter(word => {
    if (state.wordBookGradeFilter === "1" && word.grade !== 1) return false;
    if (state.wordBookGradeFilter === "2" && word.grade === 1) return false;

    const stats = getWordStats(word.id);
    const mastered = isWordMastered(word.id);
    if (state.wordBookStatusFilter === "undiscovered") return stats.correct === 0;
    if (state.wordBookStatusFilter === "learned") return stats.correct > 0 && !mastered;
    if (state.wordBookStatusFilter === "mastered") return mastered;
    return true;
  });
}

function getWordLevelInfo() {
  const wordItems = getWordBookWordsByFilter();
  const totalWords = wordItems.length;
  const learnedCount = wordItems.filter(w => getWordStats(w.id).correct > 0).length;
  const masteredCount = wordItems.filter(w => isWordMastered(w.id)).length;
  const level = Math.floor(masteredCount / 10) + 1;
  const nextThreshold = level * 10;
  const remaining = Math.max(0, nextThreshold - masteredCount) || 10;
  return { totalWords, learnedCount, masteredCount, level, remaining };
}

function renderWordBookFilters() {
  document.querySelectorAll("[data-wordbook-grade]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.wordbookGrade === state.wordBookGradeFilter);
  });
  document.querySelectorAll("[data-wordbook-status]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.wordbookStatus === state.wordBookStatusFilter);
  });
}

function renderWordBookLevel() {
  const box = $("wordLevelBox");
  if (!box) return;
  const info = getWordLevelInfo();
  box.innerHTML = `
    <div class="word-level-stats">
      <span>1回以上正解 <strong>${info.learnedCount}/${info.totalWords}語</strong></span>
      <span>完全習得 <strong>${info.masteredCount}/${info.totalWords}語</strong></span>
      <span>次のレベルまで完全習得あと<strong>${info.remaining}語</strong></span>
    </div>
  `;
}

function getWordBookNo(word) {
  const sameGradeWords = state.words.filter(w => (w.type || "word") === "word" && (w.grade === 1) === (word.grade === 1));
  const fallbackIndex = sameGradeWords.findIndex(w => w.id === word.id);
  const no = word.no || String(fallbackIndex + 1).padStart(3, "0");
  return `${String(no).padStart(3, "0")}`;
}

function getWordBookStatus(word) {
  const stats = getWordStats(word.id);
  const mastered = isWordMastered(word.id);
  if (mastered) return "完全習得";
  if (stats.correct > 0) return "完全習得前";
  return "未発見";
}

function getWordBookRateText(stats) {
  if (!stats.attempts) return "0%";
  return `${getCorrectRate(stats)}%`;
}

function getWordBookMasterHint(word) {
  const stats = getWordStats(word.id);
  if (isWordMastered(word.id)) return "完全習得";
  if (stats.correct === 0 && stats.attempts === 0) return "未発見";

  const hints = [];
  const correctLeft = Math.max(0, 5 - stats.correct);
  const rate = getCorrectRate(stats);
  if (correctLeft > 0) hints.push(`あと${correctLeft}回正解`);
  if (rate < 80) hints.push("正答率80%未満");
  return hints.length ? hints.join("・") : "もう少し";
}

function getWordBookGradeOrder(word) {
  return word.grade === 1 ? 1 : 2;
}

function getWordBookSortKey(word) {
  const grade = getWordBookGradeOrder(word);
  const no = parseInt(word.no, 10);
  if (!Number.isNaN(no)) return { grade, no };
  const fallback = state.words.findIndex(w => w.id === word.id);
  return { grade, no: fallback < 0 ? 999999 : fallback };
}

function renderWordBook() {
  const list = $("wordBookList");
  if (!list) return;
  renderWordBookFilters();
  renderWordBookLevel();

  const wordItems = getWordBookWordsByFilter().sort((a, b) => {
    const ak = getWordBookSortKey(a);
    const bk = getWordBookSortKey(b);
    if (ak.grade !== bk.grade) return ak.grade - bk.grade;
    return ak.no - bk.no;
  });

  if (wordItems.length === 0) {
    list.innerHTML = `<div class="wordbook-empty">表示できる単語がありません。フィルターを変えてみよう。</div>`;
    return;
  }

  list.innerHTML = `
    <div class="wordbook-table wordbook-page-table wordbook-all-table">
      <div class="wordbook-row wordbook-header">
        <span>番号</span>
        <span>英語</span>
        <span>読み方</span>
        <span>日本語</span>
        <span>品詞</span>
        <span>正解数</span>
        <span>正答率</span>
        <span>状態</span>
      </div>
    </div>
  `;

  const table = list.querySelector(".wordbook-all-table");
  wordItems.forEach(word => {
    const stats = getWordStats(word.id);
    const mastered = isWordMastered(word.id);
    const discovered = stats.correct > 0;
    const row = document.createElement("div");
    row.className = `wordbook-row ${mastered ? "mastered" : ""} ${!discovered ? "undiscovered" : ""}`;
    row.innerHTML = `
      <span class="word-no">${getWordBookNo(word)}</span>
      <span class="word-en">${discovered ? word.en : "???"}</span>
      <span class="word-pron">${discovered ? (word.pron || "-") : "???"}</span>
      <span class="word-ja">${word.ja}</span>
      <span class="word-pos">${word.partOfSpeech || word.pos || "-"}</span>
      <span class="word-score">${stats.correct}/${stats.attempts}</span>
      <span class="word-rate">${getWordBookRateText(stats)}</span>
      <span class="word-state">${getWordBookMasterHint(word)}</span>
    `;
    table.appendChild(row);
  });
}

function setWordBookGradeFilter(value) {
  state.wordBookGradeFilter = value;
  renderWordBook();
}

function setWordBookStatusFilter(value) {
  state.wordBookStatusFilter = value;
  renderWordBook();
}

function getPhraseBookItemsByFilter() {
  return state.phrases.filter(item => {
    if (state.phraseBookGradeFilter === "1" && item.grade !== 1) return false;
    if (state.phraseBookGradeFilter === "2" && item.grade !== 2) return false;
    const stats = getWordStats(item.id);
    const mastered = isPhraseMastered(item.id);
    if (state.phraseBookStatusFilter === "undiscovered") return stats.correct === 0;
    if (state.phraseBookStatusFilter === "learned") return stats.correct > 0 && !mastered;
    if (state.phraseBookStatusFilter === "mastered") return mastered;
    return true;
  });
}

function renderPhraseBook() {
  const list = $("phraseBookList");
  const box = $("phraseLevelBox");
  if (!list || !box) return;
  document.querySelectorAll("[data-phrasebook-grade]").forEach(btn => btn.classList.toggle("active", btn.dataset.phrasebookGrade === state.phraseBookGradeFilter));
  document.querySelectorAll("[data-phrasebook-status]").forEach(btn => btn.classList.toggle("active", btn.dataset.phrasebookStatus === state.phraseBookStatusFilter));
  const items = getPhraseBookItemsByFilter().sort((a,b) => a.grade - b.grade || Number(a.no) - Number(b.no));
  const learned = items.filter(i => getWordStats(i.id).correct > 0).length;
  const mastered = items.filter(i => isPhraseMastered(i.id)).length;
  box.innerHTML = `<div class="word-level-stats"><span>1回以上正解 <strong>${learned}/${items.length}熟語</strong></span><span>完全習得 <strong>${mastered}/${items.length}熟語</strong></span></div>`;
  if (!items.length) { list.innerHTML = `<div class="wordbook-empty">表示できる熟語がありません。フィルターを変えてみよう。</div>`; return; }
  list.innerHTML = `<div class="wordbook-table wordbook-page-table phrasebook-table"><div class="wordbook-row wordbook-header"><span>番号</span><span>熟語</span><span>意味</span><span>学年・Unit</span><span>正解数</span><span>正答率</span><span>状態</span></div></div>`;
  const table = list.querySelector(".phrasebook-table");
  items.forEach(item => {
    const stats = getWordStats(item.id);
    const masteredItem = isPhraseMastered(item.id);
    const discovered = stats.correct > 0;
    const row = document.createElement("div");
    row.className = `wordbook-row ${masteredItem ? "mastered" : ""} ${!discovered ? "undiscovered" : ""}`;
    const correctLeft = Math.max(0, 3 - stats.correct);
    const rate = getCorrectRate(stats);
    let status = "未発見";
    if (masteredItem) status = "完全習得";
    else if (stats.attempts > 0) { const h=[]; if(correctLeft>0)h.push(`あと${correctLeft}回正解`); if(rate<80)h.push("正答率80%未満"); status=h.join("・") || "もう少し"; }
    row.innerHTML = `<span class="word-no">${String(item.no).padStart(3,"0")}</span><span class="phrase-en">${discovered ? item.phrase : "???"}</span><span class="phrase-ja">${item.meaning || item.ja}</span><span>${item.grade === 1 ? "1年生" : `2年生 ${item.unit}`}</span><span class="word-score">${stats.correct}/${stats.attempts}</span><span class="word-rate">${getWordBookRateText(stats)}</span><span class="word-state">${status}</span>`;
    table.appendChild(row);
  });
}

function setPhraseBookGradeFilter(value) { state.phraseBookGradeFilter = value; renderPhraseBook(); }
function setPhraseBookStatusFilter(value) { state.phraseBookStatusFilter = value; renderPhraseBook(); }

function getQuestGroupLabel(unit) {
  if (unit === "Unit0~1") return "Unit0~1";
  return unit;
}

function updateGradeButtons() {
  const grade1Btn = $("grade1Btn");
  const grade2Btn = $("grade2Btn");
  if (grade1Btn) grade1Btn.classList.toggle("active", state.selectedGrade === 1);
  if (grade2Btn) grade2Btn.classList.toggle("active", state.selectedGrade === 2);
}

function setSelectedGrade(grade) {
  state.selectedGrade = grade;
  state.selectedG1Dungeon = null;
  updateGradeButtons();
  renderQuests();
  renderLearningDashboard();
}

function renderGrade1DungeonMenu(questList) {
  const header = document.createElement("div");
  header.className = "quest-subhead";
  header.innerHTML = `
    <h3>１年生おさらいダンジョン</h3>
    <p>品詞ごとのダンジョンを選ぼう。</p>
  `;
  questList.appendChild(header);

  GRADE1_DUNGEONS.forEach(dungeon => {
    const card = document.createElement("article");
    card.className = "quest-card dungeon-card";
    card.innerHTML = `
      <div class="quest-title-row">
        <h3>${dungeon.title}</h3>
        <span class="badge boss-badge">${dungeon.countLabel}</span>
      </div>
      <button class="main-btn quest-start-btn" type="button">ステージへ</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      state.selectedG1Dungeon = dungeon.id;
      renderQuests();
    });
    questList.appendChild(card);
  });
}

function renderGrade1StageMenu(questList) {
  const dungeon = getGrade1Dungeon(state.selectedG1Dungeon);
  if (!dungeon) {
    state.selectedG1Dungeon = null;
    renderGrade1DungeonMenu(questList);
    return;
  }

  const header = document.createElement("div");
  header.className = "quest-subhead with-back";
  header.innerHTML = `
    <div>
      <h3>${dungeon.title}</h3>
      <p>${dungeon.countLabel} / ステージを選ぼう。</p>
    </div>
    <button class="ghost-btn" type="button">戻る</button>
  `;
  header.querySelector("button").addEventListener("click", () => {
    state.selectedG1Dungeon = null;
    renderQuests();
  });
  questList.appendChild(header);

  dungeon.stages.forEach((stage, index) => {
    const questId = `${dungeon.id}_${stage.id}`;
    const quest = buildGrade1Quests().find(q => q.id === questId);
    const words = getGrade1StageWords(dungeon.id, stage.id);
    const cleared = Boolean(state.save.clearedQuests?.[questId]);
    const card = document.createElement("article");
    card.className = `quest-card ${cleared ? "cleared" : ""}`;
    card.innerHTML = `
      <div class="quest-title-row">
        <h3>${stage.title}</h3>
        <span class="badge boss-badge">${words.length || quest.bossLife}${quest.wordType === "phrase" ? "熟語" : "語"}</span>
      </div>
      <button class="main-btn quest-start-btn" type="button">${cleared ? "★ " : ""}出発</button>
    `;
    card.querySelector("button").addEventListener("click", () => startQuest(questId));
    questList.appendChild(card);
  });
}

function renderGrade2Quests(questList) {
  const unitOrder = [...new Set(quests.map(q => q.unit))];

  unitOrder.forEach((unit, index) => {
    const group = document.createElement("section");
    group.className = "quest-group";

    const groupQuests = quests.filter(q => q.unit === unit);
    const label = getQuestGroupLabel(unit);

    group.innerHTML = `
      <button class="unit-toggle" type="button" aria-expanded="false">
        <span>${label}</span>
        <small>${groupQuests.length}ステージ</small>
        <b class="toggle-mark">▼</b>
      </button>
      <div class="quest-group-body"></div>
    `;

    const body = group.querySelector(".quest-group-body");
    groupQuests.forEach(quest => {
      const cleared = Boolean(state.save.clearedQuests?.[quest.id]);
      const card = document.createElement("article");
      card.className = `quest-card ${cleared ? "cleared" : ""}`;
      card.innerHTML = `
        <div class="quest-title-row">
          <h3>${quest.title}</h3>
          <span class="badge boss-badge">Boss ${quest.boss}</span>
        </div>
        <button class="main-btn quest-start-btn" type="button">${cleared ? "★ " : ""}出発</button>
      `;
      card.querySelector("button").addEventListener("click", () => startQuest(quest.id));
      body.appendChild(card);
    });

    const toggle = group.querySelector(".unit-toggle");
    toggle.addEventListener("click", () => {
      const isOpen = group.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    questList.appendChild(group);
  });
}

function renderQuests() {
  const questList = $("questList");
  questList.innerHTML = "";
  updateGradeButtons();

  if (state.selectedGrade === 1) {
    if (state.selectedG1Dungeon) {
      renderGrade1StageMenu(questList);
    } else {
      renderGrade1DungeonMenu(questList);
    }
    return;
  }

  renderGrade2Quests(questList);
}

function getQuestWords(quest, forBattle = true) {
  let filtered;
  if (["grade2_term_fill_choice", "grade2_term_fill_written"].includes(quest.mode)) {
    filtered = GRADE2_TERM_FILL_ITEMS;
  } else if (quest.mode === "grade2_term_tense_choice") {
    filtered = GRADE2_TERM_TENSE_ITEMS;
  } else if (quest.mode === "grade2_term_conjunction_choice") {
    filtered = GRADE2_TERM_CONJUNCTION_ITEMS;
  } else if (quest.mode === "grade2_term_reorder_choice") {
    filtered = GRADE2_TERM_REORDER_ITEMS;
  } else if (["grade2_term_test_words", "grade2_term_test_ja_choice"].includes(quest.mode)) {
    filtered = GRADE2_TERM_TEST_WORD_SPECS.map(spec => {
      const source = state.words.find(word => word.id === spec.id);
      if (!source && !spec.en) return null;
      return {
        ...(source || {}),
        ...spec,
        type: "word"
      };
    }).filter(Boolean);
  } else if (quest.mode === "unit2_long_writing") {
    filtered = [
      {
        id: "unit2_long_01",
        type: "long_sentence",
        ja: "スープが濃いので、私は札幌ラーメンが好きです。",
        en: "I like Sapporo ramen because the soup is thick.",
        answers: [
          "I like Sapporo ramen because the soup is thick",
          "Because the soup is thick, I like Sapporo ramen.",
          "Because the soup is thick, I like Sapporo ramen"
        ],
        displayAnswers: [
          "I like Sapporo ramen because the soup is thick.",
          "Because the soup is thick, I like Sapporo ramen."
        ],
        skipStats: true
      },
      {
        id: "unit2_long_02",
        type: "long_sentence",
        ja: "私は食べ物は世界中を旅すると思います。",
        en: "I think food travels around the world.",
        answers: [
          "I think food travels around the world",
          "I think that food travels around the world.",
          "I think that food travels around the world"
        ],
        displayAnswers: [
          "I think food travels around the world.",
          "I think that food travels around the world."
        ],
        skipStats: true
      }
    ];
  } else if (quest.mode === "unit2_test_prep") {
    const targetNos = new Set(["072","073","074","075","077","078","079","080","082","083","084","086","087","088","089","090","091","092","095","097"]);
    const testWords = state.words.filter(w => targetNos.has(String(w.no).padStart(3, "0")) && w.unit === "Unit2");
    const testPhrases = [
      { id: "test_p_come_from", type: "test_phrase", phrase: "come from", ja: "…出身である、…から来ている", answer: "come from", answers: [], pron: "カム フロム", blankCount: 2, skipStats: true },
      { id: "test_p_here_is_are", type: "test_phrase", phrase: "Here is [are] ...", ja: "これが…です／ここに…があります／…をどうぞ", answer: "here is", answers: ["here are"], pron: "ヒア イズ／ヒア アー", blankCount: 2, skipStats: true },
      { id: "test_p_be_interested_in", type: "test_phrase", phrase: "be interested in", ja: "…に興味がある", answer: "be interested in", answers: [], pron: "ビー インタレスティド イン", blankCount: 3, skipStats: true },
      { id: "test_p_kinds_of", type: "test_phrase", phrase: "kind(s) of ～", ja: "…種類の～", answer: "kind of", answers: ["kinds of"], pron: "カインド オブ／カインズ オブ", blankCount: 2, skipStats: true },
      { id: "test_p_name_after", type: "test_phrase", phrase: "name ... after ～", ja: "～にちなんで…を…と名付ける", answer: "name after", answers: [], pron: "ネイム アフター", blankCount: 2, skipStats: true }
    ];
    filtered = [...testWords, ...testPhrases];
  } else if (quest.wordType === "phrase") {
    if (quest.grade === 1 || quest.mode === "g1_stage") filtered = state.phrases.filter(p => p.grade === 1);
    else filtered = state.phrases.filter(p => p.grade === 2 && p.unit === quest.unit);
  } else if (quest.mode === "g1_stage") {
    filtered = state.words.filter(w => w.grade === 1 && w.dungeon === quest.dungeon && w.stage === quest.stage);
  } else if (quest.mode === "final") {
    filtered = state.words.filter(w => w.unit === quest.unit);
  } else {
    filtered = state.words.filter(w => w.unit === quest.unit && w.area === quest.area);
  }

  if (quest.wordType && !["phrase", "mixed_test", "long_writing", "term_test", "fill_test", "tense_test", "conjunction_test", "reorder_test"].includes(quest.wordType)) {
    filtered = filtered.filter(w => (w.type || "word") === quest.wordType);
  }

  if (!forBattle) return filtered;
  const limit = quest.bossLife;
  const progressKey = quest.mode === "grade2_term_test_words"
    ? "wordTranslation"
    : quest.mode === "grade2_term_fill_written"
      ? "fillWritten"
      : null;
  if (progressKey) {
    const completed = state.save.termTestProgress?.[progressKey] || {};
    const incompleteItems = shuffle(filtered.filter(item => !completed[item.id]));
    const completedItems = shuffle(filtered.filter(item => completed[item.id]));
    return [...incompleteItems, ...completedItems].slice(0, Math.min(limit, filtered.length));
  }
  return selectBattleItems(filtered, limit);
}

function applyQuestBackground(quest) {
  const stage = $("stage");
  if (!stage) return;
  const bg = quest.backgroundImg;
  if (bg && isAssetReady(bg)) {
    stage.style.backgroundImage = `url("${bg}"), linear-gradient(#2b2440, #171322)`;
  } else {
    stage.style.backgroundImage = "linear-gradient(135deg, #302447 0%, #171322 52%, #0f0d18 100%)";
  }
}

function applyHomeStage() {
  const stage = $("stage");
  if (!stage) return;
  stage.classList.add("home-mode");
  stage.classList.remove("result-mode", "result-win", "result-lose");
  stage.style.backgroundImage = 'url("images/backgrounds/forest1.png"), linear-gradient(#98d783, #5ba25f)';

  // ホームの森画面ではライフ表示を出さない。
  // 初回表示時はCSSのhome-mode付与前にupdateStatusが走るため、
  // テキストも空にしておく。
  if ($("playerStageLife")) $("playerStageLife").textContent = "";
  if ($("enemyStageLife")) $("enemyStageLife").textContent = "";

  const player = document.querySelector(".player-img");
  if (player) {
    player.src = isAssetReady("images/player/mugi.png") ? "images/player/mugi.png" : FALLBACK_PLAYER_SVG;
    player.style.opacity = "";
  }
}


function startQuest(questId) {
  const quest = getAllQuests().find(q => q.id === questId);
  if (!quest) return;

  const words = getQuestWords(quest, true);
  if (words.length === 0) {
    alert("このクエストの問題がまだありません。データを確認してください。");
    return;
  }

  state.currentQuest = quest;
  state.battleDeck = shuffle(words);
  state.currentWord = null;
  state.questionCount = 0;
  state.correct = 0;
  state.gainExp = 0;
  state.newLearnedIds = new Set();
  state.battleLog = [];
  state.enemyMaxLife = quest.bossLife;
  state.enemyLife = quest.bossLife;
  state.answered = false;
  state.playerMaxLife = quest.playerLife || PLAYER_MAX_LIFE;
  state.save.playerLife = state.playerMaxLife;

  applyQuestBackground(quest);
  const stageElement = $("stage");
  if (stageElement) stageElement.classList.remove("home-mode", "result-mode", "result-win", "result-lose");

  if ($("questLabel")) $("questLabel").textContent = quest.title;
  if ($("questionTitle")) $("questionTitle").textContent = `${quest.boss}に挑戦！`;
  if ($("battleStageTitle")) {
    const titleEl = $("battleStageTitle");
    titleEl.innerHTML = "";
    const questSpan = document.createElement("span");
    questSpan.className = "battle-stage-title-quest";
    questSpan.textContent = quest.title + " ";
    const bossSpan = document.createElement("span");
    bossSpan.className = "battle-stage-title-boss";
    bossSpan.textContent = `${quest.boss}に挑戦！`;
    titleEl.appendChild(questSpan);
    titleEl.appendChild(bossSpan);
    titleEl.classList.remove("hidden");
  }
  setEnemyImage(quest.enemyImg, quest.boss);
  const enemyElement = $("enemyImg");
  if (enemyElement) {
    enemyElement.classList.toggle("final-boss-position", quest.mode === "final");
  }
  $("enemyLifeLabel").textContent = `${quest.boss} ライフ`;

  updateStatus();
  renderBattleLog();
  renderLearningDashboard();
  showScreen("screenBattle");
  addBattleLog(`${quest.boss}が現れた！ ライフ ${state.enemyLife}/${state.enemyMaxLife}`, "normal");
  renderQuestion();
}

function isJapaneseChoiceQuest() {
  return state.currentQuest?.mode === "grade2_term_test_ja_choice";
}

function isFillChoiceQuest() {
  return [
    "grade2_term_fill_choice",
    "grade2_term_tense_choice",
    "grade2_term_conjunction_choice"
  ].includes(state.currentQuest?.mode);
}

function isTenseChoiceQuest() {
  return state.currentQuest?.mode === "grade2_term_tense_choice";
}

function isReorderChoiceQuest() {
  return state.currentQuest?.mode === "grade2_term_reorder_choice";
}

function isChoiceQuest() {
  return isJapaneseChoiceQuest() || isFillChoiceQuest() || isReorderChoiceQuest();
}

function isFillBlankItem(item) {
  return item?.type === "fill_blank";
}

function isReorderItem(item) {
  return item?.type === "reorder_pair";
}

function renderChoiceButtons(options, word, formatLabel = value => value) {
  const choiceList = $("choiceList");
  if (!choiceList) return;
  choiceList.innerHTML = "";

  options.forEach((option, index) => {
    const value = typeof option === "string" ? option : option.value;
    const labelText = typeof option === "string" ? formatLabel(option) : option.label;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.dataset.answer = normalizeAnswer(value);
    const mark = document.createElement("span");
    mark.className = "choice-mark";
    mark.textContent = String(index + 1);
    const label = document.createElement("span");
    label.textContent = labelText;
    button.append(mark, label);
    button.addEventListener("click", () => answer(normalizeAnswer(value), word));
    choiceList.appendChild(button);
  });
}

function renderJapaneseChoices(word) {
  const pool = getQuestWords(state.currentQuest, false)
    .filter(item => item.id !== word.id && item.ja !== word.ja);
  const options = shuffle([word, ...shuffle(pool).slice(0, 3)])
    .map(item => ({ value: item.ja, label: item.ja }));
  renderChoiceButtons(options, word);
}

function renderFillChoices(word) {
  let choices = Array.isArray(word.choices) ? [...word.choices] : [];
  if (!choices.length) {
    const pool = GRADE2_TERM_FILL_ITEMS
      .filter(item => item.id !== word.id && item.blankCount === word.blankCount && normalizeAnswer(item.en) !== normalizeAnswer(word.en))
      .map(item => item.en);
    choices = [word.en, ...shuffle([...new Set(pool)]).slice(0, 3)];
  }
  if (!choices.some(choice => normalizeAnswer(choice) === normalizeAnswer(word.en))) choices.push(word.en);
  choices = shuffle([...new Set(choices)]).slice(0, 4);
  renderChoiceButtons(choices, word, value => word.blankCount > 1 ? value.split(/\s+/).join(" / ") : value);
}

function renderReorderChoices(word) {
  const words = word.fullSentence.trim().split(/\s+/);
  const correctValue = normalizeAnswer(word.en);
  const candidates = [];
  words.forEach(second => {
    words.forEach(fourth => {
      const value = `${second}|||${fourth}`;
      if (normalizeAnswer(value) !== correctValue) {
        candidates.push({ value, label: `2番目：${second}　／　4番目：${fourth}` });
      }
    });
  });
  const uniqueCandidates = [...new Map(candidates.map(option => [normalizeAnswer(option.value), option])).values()];
  const [correctSecond, correctFourth] = word.en.split("|||");
  const correctOption = {
    value: word.en,
    label: `2番目：${correctSecond}　／　4番目：${correctFourth}`
  };
  renderChoiceButtons(shuffle([correctOption, ...shuffle(uniqueCandidates).slice(0, 3)]), word);
  return shuffle(words).join(" / ");
}

function renderQuestion() {
  if (state.enemyLife <= 0) return finishQuest(true);
  if (state.save.playerLife <= 0) return finishQuest(false);
  if (state.battleDeck.length === 0) return finishQuest(false);

  state.currentWord = state.battleDeck[0];
  state.questionCount += 1;
  state.answered = false;

  $("resultBox").classList.add("hidden");
  $("answerInput").value = "";
  $("answerInput").disabled = false;
  $("answerInput").classList.remove("correct", "wrong");
  $("answerBtn").disabled = false;
  if ($("progressText")) $("progressText").textContent = `${state.questionCount}問目`;
  if ($("progressInline")) $("progressInline").textContent = `${state.questionCount}問目`;
  updateEnemyLifeBar();
  const japaneseChoiceMode = isJapaneseChoiceQuest();
  const fillChoiceMode = isFillChoiceQuest();
  const reorderChoiceMode = isReorderChoiceQuest();
  const choiceMode = isChoiceQuest();
  const fillBlankMode = isFillBlankItem(state.currentWord);
  const reorderMode = isReorderItem(state.currentWord);
  $("jaText").textContent = japaneseChoiceMode ? state.currentWord.en : state.currentWord.ja;
  const phraseMode = isPhraseItem(state.currentWord);
  const longWritingMode = state.currentWord.type === "long_sentence";
  const phraseSentence = $("phraseSentence");
  const questionSmall = document.querySelector(".question-box .question-small");
  $("answerForm").classList.toggle("hidden", choiceMode);
  $("choiceList").classList.toggle("hidden", !choiceMode);
  $("choiceList").innerHTML = "";
  $("answerInput").classList.toggle("long-writing-input", longWritingMode);
  if (japaneseChoiceMode) {
    if (questionSmall) questionSmall.innerHTML = `<span id="progressInline">${state.questionCount}問目</span>　この英語の意味はどれ？`;
    phraseSentence.classList.add("hidden");
    phraseSentence.innerHTML = "";
    $("hintText").textContent = "正しい日本語を4つの中から選ぼう。";
    renderJapaneseChoices(state.currentWord);
  } else if (reorderChoiceMode) {
    if (questionSmall) questionSmall.innerHTML = `<span id="progressInline">${state.questionCount}問目</span>　並び替えたときの2番目と4番目を選ぼう！`;
    phraseSentence.textContent = `語句：${renderReorderChoices(state.currentWord)}`;
    phraseSentence.classList.remove("hidden");
    $("hintText").textContent = "日本語に合う英文を作り、2番目と4番目の語の組み合わせを選ぼう。";
  } else if (fillChoiceMode) {
    if (questionSmall) questionSmall.innerHTML = `<span id="progressInline">${state.questionCount}問目</span>　空所に入る語を選ぼう！`;
    phraseSentence.textContent = state.currentWord.question;
    phraseSentence.classList.remove("hidden");
    $("hintText").textContent = isTenseChoiceQuest()
      ? "時を表す語句に注目して、正しい動詞の形を選ぼう。"
      : `空所は${state.currentWord.blankCount}語です。選択肢の「／」は空所の区切りです。`;
    renderFillChoices(state.currentWord);
  } else if (fillBlankMode) {
    if (questionSmall) questionSmall.innerHTML = `<span id="progressInline">${state.questionCount}問目</span>　空所の語を順番に入力しよう！`;
    phraseSentence.textContent = state.currentWord.question;
    phraseSentence.classList.remove("hidden");
    $("hintText").textContent = `空所は${state.currentWord.blankCount}語です。半角スペースで区切って入力しよう。`;
  } else if (longWritingMode) {
    if (questionSmall) questionSmall.innerHTML = `<span id="progressInline">${state.questionCount}問目</span>　日本語を英文にしよう！`;
    phraseSentence.classList.add("hidden");
    phraseSentence.innerHTML = "";
    $("hintText").textContent = "英文を最初から最後まで入力しよう。大文字・小文字は区別しません。";
  } else if (phraseMode) {
    if (questionSmall) questionSmall.innerHTML = `<span id="progressInline">${state.questionCount}問目</span>　${state.currentWord.type === "test_phrase" ? "この日本語を熟語にすると？" : "空欄に入る熟語を入力しよう！"}`;
    const blanks = Array.from({length: state.currentWord.blankCount || normalizeAnswer(getPrimaryAnswer(state.currentWord)).split(" ").length}, () => `<span class="phrase-blank">（　　　）</span>`).join(" ");
    phraseSentence.innerHTML = `${state.currentWord.sentenceBefore ? `<span>${state.currentWord.sentenceBefore}</span> ` : ""}${blanks}${state.currentWord.sentenceAfter ? ` <span>${state.currentWord.sentenceAfter}</span>` : ""}`;
    phraseSentence.classList.remove("hidden");
    $("hintText").textContent = `空欄は${state.currentWord.blankCount || 1}語です。`;
  } else {
    if (questionSmall) questionSmall.innerHTML = `<span id="progressInline">${state.questionCount}問目</span>　この日本語を英単語にすると？`;
    phraseSentence.classList.add("hidden");
    phraseSentence.innerHTML = "";
    $("hintText").textContent = "ヒントボタンで読み方を表示できます。";
  }
  if ($("hintBtn")) $("hintBtn").disabled = false;
  if ($("speakBtn")) $("speakBtn").disabled = fillBlankMode || reorderMode || !("speechSynthesis" in window);

  if (!choiceMode && !window.matchMedia("(max-width: 560px)").matches) {
    setTimeout(() => $("answerInput").focus(), 50);
  }
}

function updateEnemyLifeBar() {
  const percent = Math.max(0, Math.min(100, (state.enemyLife / state.enemyMaxLife) * 100));
  if ($("enemyHpBar")) $("enemyHpBar").style.width = `${percent}%`;
  if ($("enemyLifeLabel")) {
    $("enemyLifeLabel").innerHTML = `${state.currentQuest.boss} ライフ <span class="enemy-hearts inline">${enemyHeartsHtml(state.enemyLife, state.enemyMaxLife)}</span>`;
  }
  if ($("enemyStageLife")) {
    $("enemyStageLife").innerHTML = enemyStageHeartsHtml(state.enemyLife, state.enemyMaxLife);
  }
}

function renderBattleLog() {
  const desktopLog = $("battleLogList");
  const mobileLog = $("mobileBattleLogList");
  const targets = [desktopLog, mobileLog].filter(Boolean);
  if (!targets.length) return;

  if (!state.battleLog.length) {
    targets.forEach(target => {
      target.innerHTML = "冒険を始めると、ここにバトルの記録が表示されます。";
    });
    return;
  }

  const desktopHtml = state.battleLog
    .slice(0, 6)
    .map(item => `<div class="battle-log-line ${item.type}">${item.text}</div>`)
    .join("");
  const mobileHtml = state.battleLog
    .slice(0, 2)
    .map(item => `<div class="battle-log-line ${item.type}">${item.text}</div>`)
    .join("");

  if (desktopLog) desktopLog.innerHTML = desktopHtml;
  if (mobileLog) mobileLog.innerHTML = mobileHtml;
}

function addBattleLog(text, type = "normal") {
  state.battleLog.unshift({ text, type });
  state.battleLog = state.battleLog.slice(0, 12);
  renderBattleLog();
}

function submitAnswer(event) {
  event.preventDefault();
  if (state.answered) return;

  const userAnswer = normalizeAnswer($("answerInput").value);
  if (!userAnswer) {
    $("hintText").textContent = "答えを入力してね。";
    $("answerInput").focus();
    return;
  }

  answer(userAnswer, state.currentWord);
}

function getEditDistance(a, b) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[b.length];
}

function isNearMiss(userAnswer, acceptedAnswers) {
  return acceptedAnswers.some(candidate => {
    if (candidate.length < 4 || userAnswer.length < 4) return false;
    const allowance = Math.min(2, Math.max(1, Math.floor(candidate.length * 0.12)));
    return getEditDistance(userAnswer, candidate) <= allowance;
  });
}

function answer(userAnswer, word) {
  if (state.answered) return;
  state.answered = true;

  const japaneseChoiceMode = isJapaneseChoiceQuest();
  const choiceMode = isChoiceQuest();
  const fillBlankMode = isFillBlankItem(word);
  const reorderMode = isReorderItem(word);
  const acceptedAnswers = japaneseChoiceMode ? [normalizeAnswer(word.ja)] : getAcceptedAnswers(word);
  const isCorrect = acceptedAnswers.includes(userAnswer);
  const nearMiss = !choiceMode && !isCorrect && isNearMiss(userAnswer, acceptedAnswers);
  const correctAnswer = japaneseChoiceMode ? word.ja : getPrimaryAnswer(word);
  const displayAnswer = reorderMode
    ? (() => {
        const [second, fourth] = correctAnswer.split("|||");
        return `2番目：${second} ／ 4番目：${fourth}`;
      })()
    : fillBlankMode
      ? correctAnswer.split(/\s+/).join(" / ")
      : correctAnswer;

  $("answerInput").disabled = true;
  $("answerBtn").disabled = true;
  if ($("hintBtn")) $("hintBtn").disabled = true;
  document.querySelectorAll("#choiceList .choice-btn").forEach(button => {
    button.disabled = true;
    if (button.dataset.answer === normalizeAnswer(correctAnswer)) button.classList.add("correct");
    if (!isCorrect && button.dataset.answer === userAnswer) button.classList.add("wrong");
  });

  if (isCorrect) {
    $("answerInput").classList.add("correct");
    state.correct += 1;
    state.gainExp += 10;
    state.enemyLife = Math.max(0, state.enemyLife - 1);
    state.battleDeck.shift();
    registerTermTestCompletion(word);
    if (!word.skipStats) registerCorrect(word);
    showPencilAttack();
    showDamage("やるな！", "enemy");
    addBattleLog(japaneseChoiceMode
      ? `正解！ ${word.en} は「${word.ja}」。${state.currentQuest.boss}のライフ ${state.enemyLife}/${state.enemyMaxLife}`
      : reorderMode
      ? `正解！ ${displayAnswer}。${state.currentQuest.boss}のライフ ${state.enemyLife}/${state.enemyMaxLife}`
      : fillBlankMode
      ? `正解！ 空所は「${displayAnswer}」。${state.currentQuest.boss}のライフ ${state.enemyLife}/${state.enemyMaxLife}`
      : `正解！ ${isPhraseItem(word) ? correctAnswer : word.en}で攻撃。${state.currentQuest.boss}のライフ ${state.enemyLife}/${state.enemyMaxLife}`, "good");
    $("resultTitle").textContent = "正解！";
    $("resultDetail").textContent = japaneseChoiceMode
      ? `${word.en} の意味は「${word.ja}」。読み方：${word.pron || "確認中"}。正答率：${getMasterRateText(word.id)}。`
      : reorderMode
      ? `正しい英文：${word.fullSentence}　${displayAnswer}`
      : fillBlankMode
      ? `${word.question}　正解：${displayAnswer}`
      : word.type === "long_sentence"
      ? `答えは「${(word.displayAnswers || [correctAnswer]).join('」または「')}」`
      : isPhraseItem(word)
        ? `正解：${correctAnswer}。熟語：${word.phrase}（${word.meaning || word.ja}）。`
        : `「${word.ja}」は ${correctAnswer}。読み方：${word.pron || "確認中"}。正答率：${getMasterRateText(word.id)}。`;
  } else {
    $("answerInput").classList.add("wrong");
    state.save.playerLife = Math.max(0, state.save.playerLife - 1);
    // 答えを見た直後の暗記にならないよう、数問後にもう一度出す。
    state.battleDeck.shift();
    state.battleDeck.splice(Math.min(RETRY_GAP, state.battleDeck.length), 0, word);
    if (!word.skipStats) registerWrong(word);
    showEnemyAttack();
    showDamage("油断したな！", "enemy", "player");
    addBattleLog(japaneseChoiceMode
      ? `ミス… ${word.en} の意味は「${word.ja}」。少し後でもう一度出題します。ムギのライフ ${state.save.playerLife}/${state.playerMaxLife || PLAYER_MAX_LIFE}`
      : reorderMode
      ? `ミス… 正しい組み合わせは「${displayAnswer}」。少し後でもう一度出題します。ムギのライフ ${state.save.playerLife}/${state.playerMaxLife || PLAYER_MAX_LIFE}`
      : fillBlankMode
      ? `ミス… 空所の正解は「${displayAnswer}」。少し後でもう一度出題します。ムギのライフ ${state.save.playerLife}/${state.playerMaxLife || PLAYER_MAX_LIFE}`
      : `${nearMiss ? "あと少し！" : "ミス…"} 正解は ${correctAnswer}。少し後でもう一度出題します。ムギのライフ ${state.save.playerLife}/${state.playerMaxLife || PLAYER_MAX_LIFE}`, "bad");
    $("resultTitle").textContent = nearMiss ? "つづりがあと少し！" : "Miss!";
    $("resultDetail").textContent = japaneseChoiceMode
      ? `選んだ意味：${userAnswer} / 正解：${word.ja}。${word.en}（${word.pron || "読み方確認中"}）`
      : reorderMode
      ? `正しい英文：${word.fullSentence}　正解：${displayAnswer}`
      : fillBlankMode
      ? `入力：${userAnswer} / 正解：${displayAnswer}。${word.question}`
      : isPhraseItem(word)
      ? `入力：${userAnswer} / 正解：${correctAnswer}。熟語：${word.phrase}（${word.meaning || word.ja}）。${nearMiss ? "文字の順番をよく見てみよう。" : ""}`
      : `入力：${userAnswer} / 正解：${correctAnswer}。「${word.ja}」は ${correctAnswer}。読み方：${word.pron || "確認中"}。${nearMiss ? "文字の抜けや順番を確認しよう。" : ""}`;
  }

  $("hintText").textContent = japaneseChoiceMode
    ? `意味：${word.ja}`
    : reorderMode
      ? `正しい英文：${word.fullSentence}`
      : `答え：${displayAnswer}`;
  updateEnemyLifeBar();
  $("resultBox").classList.remove("hidden");
  updateStatus();
  renderLearningDashboard();
  saveGame();
}

function registerCorrect(word) {
  const before = getWordStats(word.id);
  const now = Date.now();
  const streak = before.streak + 1;
  const stats = {
    ...before,
    correct: before.correct + 1,
    attempts: before.attempts + 1,
    streak,
    lastReviewedAt: now,
    nextReviewAt: now + getReviewDelay(streak)
  };
  if (before.correct === 0) state.newLearnedIds.add(word.id);
  saveWordStats(word.id, stats);
}

function registerTermTestCompletion(word) {
  const progressKey = state.currentQuest?.mode === "grade2_term_test_words"
    ? "wordTranslation"
    : state.currentQuest?.mode === "grade2_term_fill_written"
      ? "fillWritten"
      : null;
  if (!progressKey) return;
  state.save.termTestProgress = state.save.termTestProgress || { wordTranslation: {}, fillWritten: {} };
  state.save.termTestProgress[progressKey] = state.save.termTestProgress[progressKey] || {};
  state.save.termTestProgress[progressKey][word.id] = true;
}

function registerWrong(word) {
  const before = getWordStats(word.id);
  const now = Date.now();
  const stats = {
    ...before,
    wrong: before.wrong + 1,
    attempts: before.attempts + 1,
    streak: 0,
    lastReviewedAt: now,
    nextReviewAt: now
  };
  saveWordStats(word.id, stats);
}


function createEffect(className, text) {
  const stage = $("stage");
  if (!stage) return;
  const effect = document.createElement("div");
  effect.className = className;
  effect.textContent = text;
  stage.appendChild(effect);
  setTimeout(() => effect.remove(), 680);
}

function showPencilAttack() {
  createEffect("pencil-effect", "✏️");
}

function showEnemyAttack() {
  createEffect("enemy-attack-effect", "⚡");
}

function showDamage(text, bubbleTarget, hitTarget = bubbleTarget) {
  const pop = $("damagePop");
  const enemy = $("enemyImg");
  const player = document.querySelector(".player-img");

  pop.textContent = text;
  pop.classList.remove("target-enemy", "target-player");
  pop.classList.add(bubbleTarget === "player" ? "target-player" : "target-enemy");
  pop.classList.add("show");
  if (hitTarget === "enemy") enemy.classList.add("hit");
  if (hitTarget === "player") player.classList.add("hit");

  setTimeout(() => {
    pop.classList.remove("show", "target-enemy", "target-player");
    enemy.classList.remove("hit");
    player.classList.remove("hit");
  }, 520);
}

function nextQuestion() {
  if (state.enemyLife <= 0) return finishQuest(true);
  if (state.save.playerLife <= 0) return finishQuest(false);
  renderQuestion();
}

function finishQuest(cleared) {
  state.save.exp += state.gainExp;
  if (cleared && state.currentQuest) {
    state.save.clearedQuests = state.save.clearedQuests || {};
    state.save.clearedQuests[state.currentQuest.id] = true;
  }

  const stageElement = $("stage");
  if (stageElement) {
    stageElement.classList.add("result-mode");
    stageElement.classList.toggle("result-win", cleared);
    stageElement.classList.toggle("result-lose", !cleared);
  }

  const resultVisual = $("resultVisual");
  const resultWord = $("resultWord");
  const resultMugiDown = $("resultMugiDown");
  const resultMugiWin = $("resultMugiWin");
  if (resultVisual && resultWord && resultMugiDown && resultMugiWin) {
    resultVisual.classList.toggle("win", cleared);
    resultVisual.classList.toggle("lose", !cleared);
    resultWord.textContent = cleared ? "WIN" : "TRY AGAIN";
    resultMugiWin.classList.toggle("hidden", !cleared);
    resultMugiDown.classList.toggle("hidden", cleared);
  }

  const termTestLabel = {
    grade2_term_test_words: "単語チェック　英訳",
    grade2_term_test_ja_choice: "単語チェック　和訳",
    grade2_term_fill_choice: "空所補充（選択式）",
    grade2_term_fill_written: "空所補充（記述式）",
    grade2_term_tense_choice: "時制復習（選択式）",
    grade2_term_conjunction_choice: "接続詞（選択式）",
    grade2_term_reorder_choice: "並び替え（2番目・4番目）"
  }[state.currentQuest?.mode];
  $("clearTitle").textContent = cleared ? "ステージクリア！" : "ムギはつかれてしまった…";
  $("clearMessage").textContent = cleared
    ? (termTestLabel
        ? `中学校2年生定期テストの「${termTestLabel}」20問をクリアしました。`
        : state.currentQuest.mode === "unit2_test_prep"
        ? `${state.currentQuest.boss}を倒しました。単語20語の結果は単語図鑑の正答率に反映されています。熟語5問はテスト対策専用で、熟語図鑑の成績には反映されません。`
        : `${state.currentQuest.boss}を倒しました。完全習得は「${state.currentQuest.wordType === "phrase" ? 3 : 5}回以上正解」かつ「正答率80％以上」で登録されます。`)
    : `${state.currentQuest.boss}を倒せませんでした。でも、覚えた単語は記録されています。もう一度チャレンジしよう！`;
  $("correctCount").textContent = `${state.correct} 問`;
  $("gainExp").textContent = `${state.enemyLife} / ${state.enemyMaxLife}`;
  $("newLearned").textContent = state.newLearnedIds.size;

  saveGame();
  updateStatus();
  renderQuests();
  renderLearningDashboard();
  showScreen("screenResult");
}

function resetData() {
  if (!confirm("ムギクエストのセーブデータをリセットしますか？")) return;
  localStorage.removeItem(SAVE_KEY);
  state.save = {
    playerLife: PLAYER_MAX_LIFE,
    exp: 0,
    learned: {},
    mastered: {},
    clearedQuests: {},
    termTestProgress: { wordTranslation: {}, fillWritten: {} }
  };
  state.currentQuest = null;
  state.playerMaxLife = PLAYER_MAX_LIFE;
  state.enemyLife = 0;
  state.enemyMaxLife = 0;
  state.battleLog = [];
  updateStatus();
  renderBattleLog();
  renderQuests();
  renderLearningDashboard();
  const stageElement = $("stage");
  if (stageElement) stageElement.classList.remove("home-mode", "result-mode", "result-win", "result-lose");
  showScreen("screenHome");
}

function speakCurrentAnswer() {
  if (!state.currentWord || !("speechSynthesis" in window)) {
    $("hintText").textContent = "この端末では音声再生を利用できません。";
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(getPrimaryAnswer(state.currentWord));
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function exportSaveData() {
  const backup = {
    app: "mugiquest",
    version: 1,
    exportedAt: new Date().toISOString(),
    save: state.save
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mugiquest-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function sanitizeImportedStats(rawMap) {
  if (!rawMap || typeof rawMap !== "object" || Array.isArray(rawMap)) return {};
  return Object.fromEntries(Object.entries(rawMap).slice(0, 5000).map(([id, raw]) => {
    const source = raw && typeof raw === "object" ? raw : {};
    const correct = Math.max(0, Number(source.correct ?? source.count ?? 0) || 0);
    const wrong = Math.max(0, Number(source.wrong ?? 0) || 0);
    const attempts = Math.max(correct + wrong, Number(source.attempts ?? 0) || 0);
    return [id, {
      correct,
      wrong,
      attempts,
      streak: Math.max(0, Number(source.streak ?? 0) || 0),
      lastReviewedAt: Math.max(0, Number(source.lastReviewedAt ?? 0) || 0),
      nextReviewAt: Math.max(0, Number(source.nextReviewAt ?? 0) || 0)
    }];
  }));
}

function sanitizeCompletionMap(rawMap) {
  if (!rawMap || typeof rawMap !== "object" || Array.isArray(rawMap)) return {};
  return Object.fromEntries(Object.entries(rawMap).filter(([, completed]) => Boolean(completed)).slice(0, 5000));
}

async function importSaveData(file) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) throw new Error("ファイルが大きすぎます");
  const parsed = JSON.parse(await file.text());
  const imported = parsed?.save || parsed;
  if (!imported || typeof imported !== "object" || Array.isArray(imported)) {
    throw new Error("学習データの形式ではありません");
  }
  if (!confirm("現在の学習記録を、選択したバックアップで置き換えますか？")) return;

  const learned = sanitizeImportedStats(imported.learned);
  const mastered = {};
  Object.entries(learned).forEach(([id, stats]) => {
    const neededCorrect = String(id).startsWith("p1_") || String(id).startsWith("p2_") ? 3 : 5;
    if (stats.correct >= neededCorrect && stats.attempts > 0 && stats.correct / stats.attempts >= 0.8) mastered[id] = true;
  });

  state.save = {
    playerLife: PLAYER_MAX_LIFE,
    exp: Math.max(0, Number(imported.exp ?? 0) || 0),
    learned,
    mastered,
    clearedQuests: imported.clearedQuests && typeof imported.clearedQuests === "object" && !Array.isArray(imported.clearedQuests)
      ? imported.clearedQuests
      : {},
    termTestProgress: {
      wordTranslation: sanitizeCompletionMap(imported.termTestProgress?.wordTranslation),
      fillWritten: sanitizeCompletionMap(imported.termTestProgress?.fillWritten)
    }
  };
  saveGame();
  state.currentQuest = null;
  state.playerMaxLife = PLAYER_MAX_LIFE;
  renderQuests();
  renderLearningDashboard();
  updateStatus();
  showScreen("screenHome");
  alert("学習データを復元しました。");
}


function showHint() {
  if (!state.currentWord) return;
  if (state.currentWord.type === "long_sentence") {
    $("hintText").textContent = "ヒント：語順とつづりに注意して、英文全体を入力しよう。";
  } else if (isReorderItem(state.currentWord)) {
    $("hintText").textContent = "ヒント：主語の次に動詞が来る基本語順と、時を表す語句の位置を確認しよう。";
  } else if (isTenseChoiceQuest()) {
    $("hintText").textContent = "ヒント：every day、yesterday、tomorrowなど、時を表す語句を確認しよう。";
  } else if (isFillBlankItem(state.currentWord)) {
    $("hintText").textContent = `ヒント：空所は${state.currentWord.blankCount}語です。前後の文法と意味を確認しよう。`;
  } else if (isPhraseItem(state.currentWord)) {
    const pron = state.currentWord.pron || "";
    $("hintText").textContent = `読み方：${pron}／意味：${state.currentWord.meaning || state.currentWord.ja}／${state.currentWord.blankCount || 1}語`;
  } else {
    const pron = state.currentWord.pron || "読み方は準備中";
    $("hintText").textContent = `読み方：${pron}`;
  }
  if ($("hintBtn")) $("hintBtn").disabled = true;
}

function setMobileMenuOpen(open) {
  const overlay = $("mobileMenuOverlay");
  const btn = $("mobileMenuBtn");
  if (!overlay) return;
  overlay.classList.toggle("hidden", !open);
  overlay.setAttribute("aria-hidden", String(!open));
  if (btn) btn.setAttribute("aria-expanded", String(open));
}

function closeMobileMenu() {
  setMobileMenuOpen(false);
}

function bindEvents() {
  $("answerForm").addEventListener("submit", submitAnswer);
  $("nextBtn").addEventListener("click", nextQuestion);
  $("homeBtn").addEventListener("click", () => {
    const stageElement = $("stage");
    if (stageElement) stageElement.classList.remove("home-mode", "result-mode", "result-win", "result-lose");
    showScreen("screenHome");
  });
  if ($("retryBtn")) $("retryBtn").addEventListener("click", () => { if (state.currentQuest) startQuest(state.currentQuest.id); });
  if ($("topBtn")) $("topBtn").addEventListener("click", goTop);
  if ($("mobileMenuBtn")) $("mobileMenuBtn").addEventListener("click", () => setMobileMenuOpen(true));
  if ($("mobileMenuCloseBtn")) $("mobileMenuCloseBtn").addEventListener("click", closeMobileMenu);
  if ($("mobileMenuOverlay")) $("mobileMenuOverlay").addEventListener("click", event => {
    if (event.target === $("mobileMenuOverlay")) closeMobileMenu();
  });
  if ($("mobileTopBtn")) $("mobileTopBtn").addEventListener("click", () => { closeMobileMenu(); goTop(); });
  if ($("mobileGrade1Btn")) $("mobileGrade1Btn").addEventListener("click", () => { closeMobileMenu(); setSelectedGrade(1); showScreen("screenHome"); });
  if ($("mobileGrade2Btn")) $("mobileGrade2Btn").addEventListener("click", () => { closeMobileMenu(); setSelectedGrade(2); showScreen("screenHome"); });
  if ($("mobileWordBookBtn")) $("mobileWordBookBtn").addEventListener("click", () => { closeMobileMenu(); openWordBook(); });
  if ($("mobilePhraseBookBtn")) $("mobilePhraseBookBtn").addEventListener("click", () => { closeMobileMenu(); openPhraseBook(); });
  if ($("mobileResetBtn")) $("mobileResetBtn").addEventListener("click", () => { closeMobileMenu(); resetData(); });
  if ($("grade1Btn")) $("grade1Btn").addEventListener("click", () => setSelectedGrade(1));
  if ($("grade2Btn")) $("grade2Btn").addEventListener("click", () => setSelectedGrade(2));
  $("openWordBookBtn").addEventListener("click", openWordBook);
  if ($("openPhraseBookBtn")) $("openPhraseBookBtn").addEventListener("click", openPhraseBook);
  document.querySelectorAll("[data-wordbook-grade]").forEach(btn => {
    btn.addEventListener("click", () => setWordBookGradeFilter(btn.dataset.wordbookGrade));
  });
  document.querySelectorAll("[data-wordbook-status]").forEach(btn => {
    btn.addEventListener("click", () => setWordBookStatusFilter(btn.dataset.wordbookStatus));
  });
  document.querySelectorAll("[data-phrasebook-grade]").forEach(btn => btn.addEventListener("click", () => setPhraseBookGradeFilter(btn.dataset.phrasebookGrade)));
  document.querySelectorAll("[data-phrasebook-status]").forEach(btn => btn.addEventListener("click", () => setPhraseBookStatusFilter(btn.dataset.phrasebookStatus)));
  if ($("hintBtn")) $("hintBtn").addEventListener("click", showHint);
  if ($("speakBtn")) $("speakBtn").addEventListener("click", speakCurrentAnswer);
  document.querySelectorAll("[data-export-save]").forEach(btn => btn.addEventListener("click", () => {
    closeMobileMenu();
    exportSaveData();
  }));
  document.querySelectorAll("[data-import-save]").forEach(btn => btn.addEventListener("click", () => {
    closeMobileMenu();
    $("saveFileInput").click();
  }));
  if ($("saveFileInput")) $("saveFileInput").addEventListener("change", async event => {
    try {
      await importSaveData(event.target.files?.[0]);
    } catch (error) {
      console.error(error);
      alert("学習データを復元できませんでした。ムギクエストのバックアップファイルを選んでください。");
    } finally {
      event.target.value = "";
    }
  });
  $("wordBookBackBtn").addEventListener("click", closeWordBook);
  if ($("phraseBookBackBtn")) $("phraseBookBackBtn").addEventListener("click", closePhraseBook);
  $("backBtn").addEventListener("click", () => {
    renderQuests();
    renderLearningDashboard();
    const stageElement = $("stage");
    if (stageElement) stageElement.classList.remove("home-mode", "result-mode", "result-win", "result-lose");
    showScreen("screenHome");
  });
  $("resetBtn").addEventListener("click", resetData);
}

async function init() {
  loadSave();
  bindEvents();
  await preloadAssets();

  try {
    await loadWords();
    updateGradeButtons();
    renderQuests();
    renderLearningDashboard();
    updateStatus();
    renderBattleLog();
    showScreen("screenHome");
  } catch (error) {
    console.error(error);
    $("questList").innerHTML = `
      <article class="quest-card">
        <div>
          <h3>words.jsonを読み込めませんでした</h3>
          <p>VS CodeのLive Serverなどで起動してください。</p>
        </div>
      </article>
    `;
  }
}

init();
