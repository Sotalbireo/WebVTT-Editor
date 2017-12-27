# WEBVTT-Editor

日本語りどみ

## これなん

HTML5の<VIDEO />で使える字幕ファイル規格「vtt」のタイムスタンプを、動画見ながらしこしこ打てるやつ。
機能は増える予定。

## インストール方法

インストールしたいフォルダの親フォルダで以下のコマンドを入力されたし。

```bash
git clone https://github.com/Sotalbireo/WebVTT-Editor.git　&& npm i
```

## つかいかた

`~/WebVTT-Editor`にインストールしたとします。

1. `~/WebVTT-Editor/data/`フォルダ内に「`video.mp4`」という名前で動画ファイルを保存して
1. `~/WebVTT-Editor`で`npm start`または`npm run electron`すると立ち上がります。
1. がんばれ

## キーボードショートカット

key | action
:---:|---
Shift-c　| 動画を10分戻す
c | 動画を1分戻す
v, ← | 動画を10秒戻す
b | コマ送り
n, → | 動画を10秒送る
m | 動画を1分送る
Shift-m | 動画を10分送る
i | 字幕キューの開始点を打つ
p | 字幕キューの終了点を打つ
o | 字幕キューの終了点と開始点を打つ（p,iの連打に相当：キュー間に空白が開かない）
\ | 直前の[ipo]の打刻を削除する（直前のみ）
Ctrl-s | 字幕ファイルを上書き保存する（現在は`data/subtitle.vtt`固定）

## 開発環境

よその環境を試していないので、問題があったら揃えてみてください。

* Windows 7
* Node 8.9.3 (LTS)
* npm 5.5.1
