// UNIT4_test の問題写真から転記。氏名・クラス等は収録しない。
window.MUGI_UNIT4_TEST = {
  part12: [
    ["homestay", "ホームステイ"],
    ["advice", "忠告、助言"],
    ["member", "一員、メンバー"],
    ["guest", "客、泊まり客"],
    ["follow", "…に従う、…を守る"],
    ["rule", "規則、ルール"],
    ["host", "（招待した客をもてなす）主人（役）"],
    ["perfect", "完全な、完ぺきな、最適な"],
    ["have to", "…しなければならない（2語）"],
    ["must", "…しなければならない（助動詞・1語）"],
    ["shower", "シャワー"],
    ["limit", "限界、限度、制限"],
    ["mustn't", "must not の短縮形"]
  ],
  rt1: [
    ["elderly", "年配の"],
    ["couple", "夫婦"],
    ["living room", "居間、リビングルーム"],
    ["finish", "…を終える"],
    ["nothing", "何も…ない"],
    ["should", "…すべきである"],
    ["plate", "（浅い）取り皿"],
    ["hurt", "…を傷つける"],
    ["feeling", "感情、気持ち"],
    ["go to bed", "床につく、寝る"]
  ],
  rt2: [
    ["answer", "…に答える"],
    ["enter", "（場所）に入る"],
    ["explain", "…を説明する"],
    ["felt", "feel の過去分詞"],
    ["feel", "…と感じる、気持ちがする"],
    ["end", "（期間、行為などの）終わり、最後"],
    ["kept", "keep の過去形"],
    ["keep", "…し続ける（keep ...ing の動詞・1語）"],
    ["carefully", "注意深く"],
    ["take off", "（服など）を脱ぐ"],
    ["feel like ...ing", "…したい気がする（動名詞の形も入力）", ["feel like ing", "feel like ~ing", "feel like -ing"]],
    ["in the end", "結局"],
    ["each other", "たがい（に）"],
    ["keep ...ing", "…し続ける（動名詞の形も入力）", ["keep ing", "keep ~ing", "keep -ing"]],
    ["in the future", "未来に、将来に"],
    ["couldn't", "could not の短縮形"]
  ],
  sentences: [
    ["You have to speak English.", "あなたは英語を話さなければいけません。", ["You must speak English."]],
    ["You do not have to speak perfect English.", "あなたは完璧な英語を話さなくてもよいです。", ["You don't have to speak perfect English."]],
    ["We must save water.", "私たちは水を節約しなければなりません。", ["We have to save water."]],
    ["We must not take long showers.", "私たちは長時間シャワーを浴びてはなりません。", ["We mustn't take long showers.", "We must not take a long shower.", "We mustn't take a long shower."]],
    ["They enjoy reading books.", "彼らは本を読むことを楽しみます。"],
    ["Talking with him was fun.", "彼と話すことは楽しかったです。", ["Talking to him was fun."]]
  ]
};

// カタカナは発音の目安。...ing は動名詞を表す。
const UNIT4_TEST_READINGS = {
  "part12": [
    "ホームステイ",
    "アドバイス",
    "メンバー",
    "ゲスト",
    "フォロー",
    "ルール",
    "ホウスト",
    "パーフェクト",
    "ハフ トゥー",
    "マスト",
    "シャワー",
    "リミット",
    "マスント"
  ],
  "rt1": [
    "エルダリー",
    "カプル",
    "リビング ルーム",
    "フィニッシュ",
    "ナッシング",
    "シュッド",
    "プレイト",
    "ハート",
    "フィーリング",
    "ゴウ トゥー ベッド"
  ],
  "rt2": [
    "アンサー",
    "エンター",
    "イクスプレイン",
    "フェルト",
    "フィール",
    "エンド",
    "ケプト",
    "キープ",
    "ケアフリー",
    "テイク オフ",
    "フィール ライク …イング",
    "イン ジ エンド",
    "イーチ アザー",
    "キープ …イング",
    "イン ザ フューチャー",
    "クドゥント"
  ]
};

// 1つの空所につき1語。元のキーセンテンスの文法事項を練習する。
const UNIT4_KEY_SENTENCE_BLANKS = [
  { question: "You ＿＿ ＿＿ speak English.", en: "have to" },
  { question: "You ＿＿ ＿＿ ＿＿ ＿＿ speak perfect English.", en: "do not have to" },
  { question: "We ＿＿ save water.", en: "must" },
  { question: "We ＿＿ ＿＿ take long showers.", en: "must not" },
  { question: "They enjoy ＿＿ books.", en: "reading" },
  { question: "＿＿ with him was fun.", en: "Talking" }
];

Object.entries(window.MUGI_UNIT4_TEST).forEach(([section, rows]) => {
  window.MUGI_UNIT4_TEST[section] = rows.map(([en, ja, alternatives = []], index) => {
    const sentence = section === "sentences";
    if (sentence) {
      const blank = UNIT4_KEY_SENTENCE_BLANKS[index];
      return {
        id: `u4_test_${section}_${String(index + 1).padStart(2, "0")}`,
        unit: "Unit4 テスト対策",
        type: "fill_blank",
        ja,
        fullSentence: en,
        ...blank,
        blankCount: blank.en.split(/\s+/).length,
        answers: [],
        skipStats: true
      };
    }
    return {
      id: `u4_test_${section}_${String(index + 1).padStart(2, "0")}`,
      unit: "Unit4 テスト対策",
      type: en.includes(" ") ? "test_phrase" : "word",
      en, ja,
      pron: UNIT4_TEST_READINGS[section]?.[index] || "",
      phrase: !sentence && en.includes(" ") ? en : undefined,
      blankCount: !sentence ? en.split(/\s+/).length : undefined,
      answers: alternatives,
      displayAnswers: [en],
      skipStats: true
    };
  });
});
