# chrome_extension-freee_overtime

freee の残業時間、残労働日数を計算・表示する Chrome 用拡張機能です。

freee の勤怠ページ(`https://p.secure.freee.co.jp/#work_records/{yyyy}/{m}/employees/{id}`)にアクセスした際に、勤怠のまとめ領域に `労働日数x8h`,`残業時間`,`残労働日数` を追加します。

## 使い方

インストールした後は該当ページを開くと自動的に実行されます。

## インストール方法

### Chrome ウェブストアからインストール

未申請

### ソースからインストール

Chrome の拡張機能設定からデベロッパーモードをオンにし、このディレクトリを読み込みます。

## ファイル構成

```files
├─ archive # 拡張機能としては使用されません
│   ├── content_script_org.js # 元になったブックマークレットをそのまま js ファイルにしたもの
│   └── original_bookmarklet.js # 元になったブックマークレット
├─ images
│   └── icon-128.png # 拡張機能のアイコン
├─ .gitignore
├─ content_script.js # 所定のページに挿入するスクリプト
├─ manifest.json # 拡張機能の設定ファイル
└─ README.md # このファイル
```
