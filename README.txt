ムギクエスト Ver1.0 入力式・Unit2ダンジョン版

■ 起動方法
VS CodeのLive Serverなどで mugiquest_ver4 フォルダを開いて index.html を起動してください。
index.htmlを直接開くと、環境によって words.json が読み込めない場合があります。

■ 画像の置き場所
必須：
images/player/mugi.png
images/enemies/slime.png
images/backgrounds/forest1.png

追加すると表示される敵画像：
images/enemies/cat.png
images/enemies/ghost.png
images/enemies/tiger.png
images/enemies/venus.png
images/enemies/dragon.png

未配置の敵画像は slime.png を代わりに表示します。
UI画像は使わず、CSS中心でレイアウトしています。

■ Ver4.0の主な変更
・選択式ではなく「日本語訳 → 英単語・熟語入力」方式
・1ステージにつき敵は1体
・ムギはHPではなくハート3つのライフ制
・雑魚敵／通常ボスはライフ10
・最深階ボスはライフ20
・正解すると敵ライフを1減らす
・間違えるとムギのハートが1つ減る
・間違えた単語は再出題されやすいように後ろへ回る
・完全習得条件は「5回以上正解」かつ「正答率80％以上」

■ ステージ構成
Unit2ダンジョン1F：Boss 単語スライム　ライフ10
Unit2ダンジョン2F：Boss 単語キャット　ライフ10
Unit2ダンジョン3F：Boss 単語ゴースト　ライフ10
Unit2ダンジョン4F：Boss 単語タイガー　ライフ10
Unit2ダンジョン5F：Boss 熟語ヴィーナス　ライフ10
Unit2ダンジョン5F（最深階）：Boss 単語・熟語ドラゴン　ライフ20
復習の森：未完全習得の単語を復習

■ 単語の追加方法
words.json に以下の形式で追加できます。
{
  "id": "u2d1_011",
  "unit": "Unit2",
  "area": "dungeon1",
  "en": "orange",
  "ja": "オレンジ",
  "pron": "オレンジ",
  "example": "I like oranges."
}

別解を許可したい場合は、answers を追加できます。
例：
"answers": ["a glass of water", "water"]

Ver4.0 追加更新
----------------
・単語図鑑を追加しました。
・単語図鑑は「英単語　日本語　｜　正解数(率)　3/5回　75%　｜　状態」の1行表示です。
・Unitの記録を追加しました。
・Unitごとに「1回以上正解」と「完全習得数」を表示します。
・分母は words.json に登録されている該当Unitの単語数を自動で使います。
・完全習得条件は「5回以上正解」かつ「正答率80%以上」です。
