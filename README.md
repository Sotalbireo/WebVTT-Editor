# WebVTT-Editor rev2

日本語りどみ

**注意：不安定開発版につき、機能はなかったりなかったりする**

## これなん

HTML5.x の`<TRACK />`で使える字幕ファイル規格「vtt」のタイムスタンプを、動画見ながらしこしこ打てるやつ。
機能は増える予定。
いわゆる Electron アプリなのでそれなりに重い。

## インストール方法

### とりあえず使いたい人

```bash
cd ~ && git clone https://github.com/Sotalbireo/WebVTT-Editor.git　&& yarn
```

### こだわりのある人

任意のフォルダに`git clone`して`yarn`なりで依存パッケージを揃えてください

## つかいかた

### ビルドする

1. インストール (`git clone`) したレポジトリフォルダで `yarn build`
1. `./dist` フォルダの中にある実行ファイルを起動

### ビルドしない

1. インストール (`git clone`) したレポジトリフォルダで `yarn devel`

以下機能はまだなんもない

### キーボードショートカット

key | action
:---:|---
Shift-c | 動画を10分戻す
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

* macOS mojave (10.14.3)
* Node 10.15.1 (LTS)
* yarn 1.13.0

## 参考

* [WebVTT: The Web Video Text Tracks Format](https://w3c.github.io/webvtt/)
