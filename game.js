const SAVE_KEY = "mugiquest_ver4_save";
const PLAYER_MAX_LIFE = 5;

const state = {
  words: [],
  save: {
    playerLife: PLAYER_MAX_LIFE,
    exp: 0,
    learned: {},
    mastered: {},
    clearedQuests: {}
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
  previousScreen: "screenHome",
  selectedGrade: 2,
  selectedG1Dungeon: null,
  wordBookGradeFilter: "all",
  wordBookStatusFilter: "all"
};

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
    bossLife: 16,
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
  }
];

function getGrade1Dungeon(dungeonId) {
  return GRADE1_DUNGEONS.find(d => d.id === dungeonId);
}

function getGrade1StageWords(dungeonId, stageId) {
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
      wordType: "word"
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
      clearedQuests: loaded.clearedQuests || {}
    };
  } catch (e) {
    console.warn("セーブデータを読み込めませんでした", e);
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state.save));
}

async function loadWords() {
  const res = await fetch("words.json");
  if (!res.ok) throw new Error("words.jsonを読み込めませんでした");
  state.words = await res.json();
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
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

function getAcceptedAnswers(word) {
  const answers = [word.en, ...(word.answers || [])];
  return answers.map(normalizeAnswer).filter(Boolean);
}

function getWordStats(wordId) {
  const raw = state.save.learned[wordId] || {};
  const correct = Number(raw.correct ?? raw.count ?? 0);
  const wrong = Number(raw.wrong ?? 0);
  const attempts = Number(raw.attempts ?? (correct + wrong));
  return { correct, wrong, attempts };
}

function saveWordStats(wordId, stats) {
  state.save.learned[wordId] = stats;
  const rate = stats.attempts > 0 ? stats.correct / stats.attempts : 0;
  if (stats.correct >= 5 && rate >= 0.8) {
    state.save.mastered[wordId] = true;
  } else {
    delete state.save.mastered[wordId];
  }
}

function showScreen(name) {
  ["screenHome", "screenBattle", "screenWordBook", "screenResult"].forEach(id => $(id).classList.remove("active"));
  $(name).classList.add("active");

  const shell = document.querySelector(".game-shell");
  if (shell) {
    shell.classList.toggle("wordbook-mode", name === "screenWordBook");
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

  const stageElement = $("stage");
  if (stageElement) stageElement.classList.remove("result-mode", "result-win", "result-lose");

  renderQuests();
  renderLearningDashboard();
  updateStatus();
  renderBattleLog();
  showScreen("screenHome");
}

function heartsText(life) {
  return Array.from({ length: PLAYER_MAX_LIFE }, (_, i) => i < life ? "♥" : "♡").join(" ");
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
  const lifePercent = Math.max(0, Math.min(100, (state.save.playerLife / PLAYER_MAX_LIFE) * 100));
  const enemyPercent = state.enemyMaxLife > 0
    ? Math.max(0, Math.min(100, (state.enemyLife / state.enemyMaxLife) * 100))
    : 0;

  if ($("hpText")) $("hpText").textContent = heartsText(state.save.playerLife);
  if ($("hpBar")) $("hpBar").style.width = `${lifePercent}%`;

  if ($("playerStageLife")) {
    $("playerStageLife").textContent = heartsText(state.save.playerLife);
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

function getProgressCountText(stats) {
  return `${stats.correct}/${stats.attempts}回`;
}

function renderLearningDashboard() {
  renderUnitSummary();
  renderWordBook();
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
      return acc;
    }, { learned: 0, mastered: 0 });

    const row = document.createElement("div");
    row.className = "unit-summary-row";
    row.innerHTML = `
      <div class="unit-name">${group.name}</div>
      <div class="unit-metric">
        <span>1回以上正解</span>
        <strong>${totals.learned}/${total}</strong>
      </div>
      <div class="unit-metric master">
        <span>完全習得数</span>
        <strong>${totals.mastered}/${total}</strong>
      </div>
    `;
    list.appendChild(row);
  });
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
        <span class="badge boss-badge">${words.length || quest.bossLife}語</span>
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
  if (quest.mode === "g1_stage") {
    filtered = state.words.filter(w => w.grade === 1 && w.dungeon === quest.dungeon && w.stage === quest.stage);
  } else if (quest.mode === "final") {
    filtered = state.words.filter(w => w.unit === quest.unit);
  } else {
    filtered = state.words.filter(w => w.unit === quest.unit && w.area === quest.area);
  }

  if (quest.wordType) {
    filtered = filtered.filter(w => (w.type || "word") === quest.wordType);
  }

  if (!forBattle) return filtered;
  const limit = quest.bossLife;
  return shuffle(filtered).slice(0, Math.min(limit, filtered.length));
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
    alert("このクエストの単語がまだありません。words.jsonを確認してください。");
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
  state.save.playerLife = PLAYER_MAX_LIFE;

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
  $("jaText").textContent = state.currentWord.ja;
  $("hintText").textContent = "ヒントボタンで読み方を表示できます。";
  if ($("hintBtn")) $("hintBtn").disabled = false;

  if (!window.matchMedia("(max-width: 560px)").matches) {
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

function answer(userAnswer, word) {
  if (state.answered) return;
  state.answered = true;

  const acceptedAnswers = getAcceptedAnswers(word);
  const isCorrect = acceptedAnswers.includes(userAnswer);
  const correctAnswer = word.en;

  $("answerInput").disabled = true;
  $("answerBtn").disabled = true;
  if ($("hintBtn")) $("hintBtn").disabled = true;

  if (isCorrect) {
    $("answerInput").classList.add("correct");
    state.correct += 1;
    state.gainExp += 10;
    state.enemyLife = Math.max(0, state.enemyLife - 1);
    state.battleDeck.shift();
    registerCorrect(word);
    showPencilAttack();
    showDamage("やるな！", "enemy");
    addBattleLog(`正解！ ${word.en}で攻撃。${state.currentQuest.boss}のライフ ${state.enemyLife}/${state.enemyMaxLife}`, "good");
    $("resultTitle").textContent = "正解！";
    $("resultDetail").textContent = `「${word.ja}」は ${correctAnswer}。読み方：${word.pron || "確認中"}。正答率：${getMasterRateText(word.id)}。`;
  } else {
    $("answerInput").classList.add("wrong");
    state.save.playerLife = Math.max(0, state.save.playerLife - 1);
    // 間違えた問題は正解するまで、すぐに同じ問題を出す
    registerWrong(word);
    showEnemyAttack();
    showDamage("油断したな！", "enemy", "player");
    addBattleLog(`ミス… 正解は ${correctAnswer}。同じ問題にもう一度挑戦！ ムギのライフ ${state.save.playerLife}/${PLAYER_MAX_LIFE}`, "bad");
    $("resultTitle").textContent = "Miss!";
    $("resultDetail").textContent = `入力：${userAnswer} / 正解：${correctAnswer}。「${word.ja}」は ${correctAnswer}。読み方：${word.pron || "確認中"}。`;
  }

  $("hintText").textContent = `答え：${correctAnswer}`;
  updateEnemyLifeBar();
  $("resultBox").classList.remove("hidden");
  updateStatus();
  renderLearningDashboard();
  saveGame();
}

function registerCorrect(word) {
  const before = getWordStats(word.id);
  const stats = { correct: before.correct + 1, wrong: before.wrong, attempts: before.attempts + 1 };
  if (before.correct === 0) state.newLearnedIds.add(word.id);
  saveWordStats(word.id, stats);
}

function registerWrong(word) {
  const before = getWordStats(word.id);
  const stats = { correct: before.correct, wrong: before.wrong + 1, attempts: before.attempts + 1 };
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

  $("clearTitle").textContent = cleared ? "ステージクリア！" : "ムギはつかれてしまった…";
  $("clearMessage").textContent = cleared
    ? `${state.currentQuest.boss}を倒しました。完全習得は「5回以上正解」かつ「正答率80％以上」で登録されます。`
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
  state.save = { playerLife: PLAYER_MAX_LIFE, exp: 0, learned: {}, mastered: {}, clearedQuests: {} };
  state.currentQuest = null;
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


function showHint() {
  if (!state.currentWord) return;
  const pron = state.currentWord.pron || "読み方は準備中";
  $("hintText").textContent = `読み方：${pron}`;
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
  if ($("mobileResetBtn")) $("mobileResetBtn").addEventListener("click", () => { closeMobileMenu(); resetData(); });
  if ($("grade1Btn")) $("grade1Btn").addEventListener("click", () => setSelectedGrade(1));
  if ($("grade2Btn")) $("grade2Btn").addEventListener("click", () => setSelectedGrade(2));
  $("openWordBookBtn").addEventListener("click", openWordBook);
  document.querySelectorAll("[data-wordbook-grade]").forEach(btn => {
    btn.addEventListener("click", () => setWordBookGradeFilter(btn.dataset.wordbookGrade));
  });
  document.querySelectorAll("[data-wordbook-status]").forEach(btn => {
    btn.addEventListener("click", () => setWordBookStatusFilter(btn.dataset.wordbookStatus));
  });
  if ($("hintBtn")) $("hintBtn").addEventListener("click", showHint);
  $("wordBookBackBtn").addEventListener("click", closeWordBook);
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
