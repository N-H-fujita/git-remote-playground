# git-remote-playground

GitHub などの外部リモートリポジトリが制限された環境でも、
**Git を用いたチーム開発フローを学習・検証するためのローカルGit管理ツール**です。

## 背景 / Motivation

- Git 自体はローカル環境で問題なく利用できる
- 一方で、GitHub などの外部リモートリポジトリサービスを
  自由に利用できない環境も存在する
- そのような環境下では、Git を用いたチーム開発フロー
  （ブランチ運用・PR・レビュー）を学習・検証することが難しい

そこで **「GitHub が担っている役割を分解し、ローカル環境だけで再現できないか？」**
と考え、このプロジェクトを作成しました。

## このプロジェクトでやっていること

- ローカル環境に **bare repository（擬似リモート）** を作成
- GitHub が担っている役割を分解
  - Git操作（push / pull / branch）は Git 本体に任せる
  - 表示・管理・UI をアプリケーション側で実装
- GitHub風の操作感をローカルだけで再現

※ セキュリティ・認証・権限管理は学習目的のため考慮していません。

## 構成概要

git-remote-playground/
├─ app/ # Next.js (UI + API Routes)
├─ repos/ # ローカル bare repositories（※ Git管理外）
├─ docs/
├─ README.md

- **GitHub（このリポジトリ）**
  - アプリケーションのソースコード管理
- **repos/**
  - ローカルで動作する擬似リモートGitリポジトリ
  - `.gitignore` により GitHub には含めない

## 技術スタック

- Next.js
  - App Router
  - API Routes（Node.js）
- React
- Git（bare repository）
- Node.js (`child_process` を使用して git コマンド実行)

## 想定ユースケース

- Git / GitHub の仕組みを理解するための学習環境
- GitHub 利用制限環境での代替案検討（PoC）
- Git の履歴・差分・ブランチ構造の可視化練習
- PR（Pull Request）の概念理解
  （※ GitHub固有の機能ではなく、Git の merge をUIとして表現したもの）


## 開発状況

- [ ] Next.js プロジェクト初期化
- [ ] ローカル bare repository 作成機能
- [ ] リポジトリ一覧表示
- [ ] コミット履歴表示
- [ ] 差分表示（PR風）
- [ ] Issue / Backlog（簡易）

## メモ

- 本プロジェクトは **GitHubそのものを再実装するものではありません**
- GitHub が提供する UI / 管理機能を分解し、
  Git の本質的な仕組みを理解することを目的としています

## License

MIT