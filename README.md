# Minecraft Loot Table Randomizer

Minecraft (Java Edition) のルートテーブル（ドロップアイテム等）をランダム化するデータパックを生成するウェブツールです。

## 元のプロジェクト表記 (Credit)

本プログラムは、[Misode](https://github.com/misode) 氏が開発・公開している [misode.github.io](https://github.com/misode/misode.github.io) をベースにして作成（フォーク）されています。

- **オリジナルのリポジトリ**: [https://github.com/misode/misode.github.io](https://github.com/misode/misode.github.io)
- **オリジナルサイト**: [https://misode.github.io/](https://misode.github.io/)

---

## 開発とローカル実行 (Development)

1. Node.js (18以上推奨), npm, git がインストールされていることを確認してください。
2. 依存関係のインストール:
   ```bash
   npm install
   ```
3. 開発サーバーの起動:
   ```bash
   npm run dev
   ```
4. ブラウザで `http://localhost:3000` を開きます。

---

## GitHub Pages でのデプロイ (Deployment)

このリポジトリには GitHub Actions ワークフロー (`.github/workflows/deploy.yml`) が含まれています。
リポジトリの `main` または `master` ブランチにプッシュすると、自動的にビルドが行われ GitHub Pages へデプロイされます。

### 設定手順:
1. GitHub リポジトリの **Settings** > **Pages** に移動します。
2. **Build and deployment** の **Source** を `GitHub Actions` に設定します。

---

## マイクリアップデート時の同期手順 (Upstream Merge Guide)

Minecraft のバージョンが上がり、元となったプログラム (`misode/misode.github.io`) の更新を反映したい場合は、以下の手順でマージを行ってください。

### 1. アップストリームリモートの追加 (初回のみ)
```bash
git remote add upstream https://github.com/misode/misode.github.io.git
```

### 2. 最新変更の取得とマージ
```bash
git fetch upstream
git merge upstream/master
```
*(※履歴が分離されている等のエラーが出る場合は `git merge upstream/master --allow-unrelated-histories` を使用してください)*

### 3. コンフリクト解決と動作確認
コンフリクトが発生した場合は手動で解消し、ビルドが問題なく通るか確認します。
```bash
npm install
npm run lint
npm run build
```

### 4. プッシュ
変更をリモートリポジトリへプッシュすることで、GitHub Pages に最新のマイクラ対応版がデプロイされます。
```bash
git push origin main
```
