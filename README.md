# スタンプラリー App

## 目次

- [スタンプラリー App](#スタンプラリー-app)
  - [目次](#目次)
  - [概要](#概要)
  - [主な機能](#主な機能)
  - [開発環境のセットアップ](#開発環境のセットアップ)
  - [環境変数の設定](#環境変数の設定)
  - [ディレクトリ構成](#ディレクトリ構成)
  - [コーディング規約](#コーディング規約)
  - [テストについて](#テストについて)
  - [デプロイ方法](#デプロイ方法)
  - [開発フロー](#開発フロー)
  - [コントリビュート方法](#コントリビュート方法)
  - [FAQ・トラブルシューティング](#faqトラブルシューティング)
    - [Q. Supabase の認証がうまく動きません](#q-supabase-の認証がうまく動きません)
    - [Q. CSS が反映されない](#q-css-が反映されない)
    - [Q. 新しいページや API を追加したい](#q-新しいページや-api-を追加したい)
  - [ライセンス](#ライセンス)
  - [その他](#その他)

---

## 概要

このアプリは、ユーザーが QR コードをスキャンしてスタンプを集めることができる Web アプリです。  
管理者はスタンプスポットの管理やユーザーの進捗確認ができます。

---

## 主な機能

- ユーザー認証（サインアップ・ログイン・パスワードリセット）
- QR コードによるスタンプ取得
- スタンプスポットの一覧表示・進捗管理
- 管理者用ダッシュボード
- レスポンシブデザイン

---

## 開発環境のセットアップ

1. **リポジトリをクローン**

   ```sh
   git clone https://github.com/your-username/stamp-rally-app.git
   cd stamp-rally-app
   ```

2. **依存パッケージのインストール**

   Node.js 18 以上推奨。  
   パッケージマネージャーは`npm`/`yarn`/`pnpm`/`bun`いずれも利用可能です。

   ```sh
   npm install
   # または
   yarn install
   # または
   pnpm install
   # または
   bun install
   ```

3. **開発サーバーの起動**

   ```sh
   npm run dev
   # または
   yarn dev
   # または
   pnpm dev
   # または
   bun dev
   ```

   ブラウザで [http://localhost:3000](http://localhost:3000) を開いて動作確認できます。

---

## 環境変数の設定

Supabase の API キーなどを`.env.local`に設定します。  
`.env.example`を参考に、必要な値を記入してください。

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- Supabase のプロジェクト設定 > API から取得できます。
- `.env.local`は**絶対に公開しないでください**（`.gitignore`で除外済み）。

---

## ディレクトリ構成

```
app/            ... Next.jsのページ・レイアウト
  ├─ dashboard/ ... ダッシュボード関連ページ
  ├─ auth/      ... 認証関連ページ
  ├─ scan/      ... QRスキャンページ
  └─ components/ ... ページ固有コンポーネント
components/     ... 再利用可能なUIコンポーネント
lib/            ... Supabaseクライアントやユーティリティ
public/         ... 画像やSVGなどの静的ファイル
types/          ... 型定義（必要に応じて追加）
```

- `lib/supabase/` ... Supabase クライアントのラッパー
- `lib/utils.ts` ... 共通ユーティリティ関数
- `app/layout.tsx` ... 全体レイアウト
- `app/globals.css` ... グローバル CSS（Tailwind CSS 使用）

---

## コーディング規約

- **言語**: TypeScript（`.ts`, `.tsx`）
- **フォーマット**: Prettier 推奨（VSCode 拡張など）
- **Lint**: `npm run lint`で ESLint チェック
- **命名規則**: キャメルケース（例: `userStampList`）、型はパスカルケース（例: `UserStamp`）
- **コンポーネント**: 関数コンポーネント（React Hooks 推奨）
- **スタイル**: Tailwind CSS を優先して利用

---

## テストについて

現状ユニットテストは未導入ですが、今後 Jest や Testing Library の導入を検討しています。  
テスト追加の際は`__tests__/`ディレクトリを作成し、`*.test.ts(x)`形式で配置してください。

---

## デプロイ方法

Vercel 推奨。  
Vercel に GitHub リポジトリを連携し、環境変数を設定するだけで自動デプロイされます。

- [Vercel でデプロイ](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fstamp-rally-app)
- 環境変数（Supabase の URL とキー）を Vercel のプロジェクト設定で追加

---

## 開発フロー

1. **新しいブランチを作成**

   ```sh
   git checkout -b feature/your-feature
   ```

2. **機能追加・修正**

   - コードは TypeScript で記述してください。
   - UI は`components/`配下にコンポーネント化してください。
   - Supabase との通信は`lib/supabase/`配下で行ってください。

3. **コミットメッセージ例**

   ```
   fix: ログイン画面のバグ修正
   feat: スタンプ取得機能を追加
   ```

4. **プルリクエスト作成**

   - 変更内容・動作確認方法を明記してください。
   - レビュー後、マージします。

---

## コントリビュート方法

- Issue や Pull Request は日本語で OK です。
- 質問や相談も気軽に Issue でどうぞ。
- コード規約や Lint は`npm run lint`で確認できます。
- 初心者の方も大歓迎です。分からないことは Issue で質問してください！

---

## FAQ・トラブルシューティング

### Q. Supabase の認証がうまく動きません

- `.env.local`の値が正しいか確認してください。
- Supabase のプロジェクト設定で Auth が有効か確認してください。

### Q. CSS が反映されない

- `app/globals.css`で Tailwind CSS がインポートされているか確認してください。
- `postcss.config.mjs`や`tailwind.config.ts`の設定を見直してください。

### Q. 新しいページや API を追加したい

- ページは`app/`配下にディレクトリを作成し、`page.tsx`を追加してください。
- API ルートは`app/api/`配下に追加できます。

---

## ライセンス

このプロジェクトは MIT ライセンスです。

---

## その他

- データベーススキーマや Supabase の設定方法は`docs/`や Wiki にまとめていきます。
- コントリビューションガイドや設計方針も随時追加予定です。

---

**開発に関する質問や提案は Issue でお気軽にどうぞ！**
