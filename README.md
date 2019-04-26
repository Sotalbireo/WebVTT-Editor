# WebVTT-Editor rev2

日本語りどみ

**注意：不安定開発版につき、機能はなかったりなかったりする**

## これなん

YouTube などの動画に字幕として使える「WebVTT」ファイルデータを作ったり直したりするアプリケーション。
機能は気まぐれで増える予定。
いわゆる Electron アプリなのでそれなりに重い。

## インストール方法

いずれ真っ当にリリースをしますが、現在はソースでの配布のみです。

### とりあえず使いたい人

```bash
cd ~ && git clone https://github.com/Sotalbireo/WebVTT-Editor.git　&& yarn
```

### こだわりのある人

任意のフォルダに`git clone`して`yarn`なりで依存パッケージを揃えてください。

## つかいかた

### ビルドする

1. インストール (`git clone`) したレポジトリフォルダで `yarn build`
1. `./dist` フォルダの中にある実行ファイルを起動

### ビルドしない

1. インストール (`git clone`) したレポジトリフォルダで `yarn devel`

### キーボードショートカット

key | action
:---:|---
Space | 再生・一時停止
Shift-z | 動画を10分戻す
z | 動画を1分戻す
x | 動画を10秒戻す
← | コマ戻し（60fps）
→ | コマ送り（60fps）
c | 動画を10秒送る
v | 動画を1分送る
Shift-v | 動画を10分送る
Ctrl-s | 字幕ファイルを上書き保存して反映させる

## 動作確認環境

以下の環境では動作を確認しています。

* macOS mojave (10.14.3) / Node 10.15.x

## 開発環境

よその環境を試していないので、問題があったら揃えてみてください。

* macOS mojave (10.14.3)
* Node 10.15.1 (LTS)
* yarn 1.13.0

## 参考

* [WebVTT: The Web Video Text Tracks Format](https://w3c.github.io/webvtt/)
