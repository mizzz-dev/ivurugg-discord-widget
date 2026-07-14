# ivuruGG Discord Widget

ivuruGGの活動・ゲーム・開発情報を表示する、Discord向けプロフィールウィジェットです。

## 公開URL

- 本番: `https://widget.ivuru.ivrm.jp`
- Worker標準URL: Cloudflareで発行される `*.workers.dev`

## 現在の機能

- ivuruGGプロフィール表示
- Developer × Gamerブランド表示
- 開発中プロジェクトと進捗表示
- Minecraft / GitHubの仮ステータス表示
- 好きなゲーム表示
- ライトモード / ダークモード
- Web Share API・URLコピー
- レスポンシブ対応
- Workers APIからの動的プロフィール取得
- API接続失敗時のフォールバック表示
- ヘルスチェックAPI
- Worker APIの自動テスト

現時点のMinecraft・GitHub数値はデザイン確認用の仮データです。

## 技術構成

Cloudflare Workers Static AssetsとWorker APIを組み合わせています。

```text
public/
  index.html
  styles.css
  script.js
  _headers
src/
  index.js
  profile.js
tests/
  worker.test.mjs
wrangler.jsonc
package.json
```

- `public/`: ブラウザへ配信する静的ファイル
- `src/profile.js`: ウィジェット表示データ
- `src/index.js`: APIルーティングとStatic Assets配信
- `tests/`: Node.js標準テストランナーによるAPIテスト

## API

### `GET /api/health`

デプロイ状態を確認します。

```json
{
  "status": "ok",
  "service": "ivurugg-discord-widget",
  "version": "2026-07-14.2",
  "timestamp": "2026-07-14T00:00:00.000Z"
}
```

### `GET /api/profile`

ウィジェットに表示するプロフィール情報を返します。

表示内容を変更する場合は、`src/profile.js`を編集します。

## ローカル開発

前提:

- Node.js 20以上

依存関係をインストールします。

```bash
npm install
```

Workerと静的サイトをローカル起動します。

```bash
npx wrangler dev
```

Wranglerが表示したローカルURLをブラウザで開きます。

## テスト・デプロイ前確認

```bash
npm test
npm run deploy:dry-run
```

まとめて実行する場合:

```bash
npm run check
```

## Cloudflare Workers Builds設定

| 設定 | 値 |
| --- | --- |
| Git repository | `mizzz-dev/ivurugg-discord-widget` |
| Production branch | `main` |
| Build command | なし |
| Deploy command | `npm run deploy` |
| Root directory | 空欄 |
| Wrangler config | `wrangler.jsonc` |

ルートディレクトリは`/`ではなく空欄にします。リポジトリ直下に`package.json`と`wrangler.jsonc`があるため、サブディレクトリ指定は不要です。

## GitHub Actionsから直接デプロイ

Cloudflare Workers Buildsを迂回する場合は、以下のGitHub Actions Secretsを登録します。

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

登録後、`main`へのpushまたはActions画面の手動実行でデプロイされます。

## カスタムドメイン

Cloudflareの対象Workerへ次を設定します。

```text
widget.ivuru.ivrm.jp
```

同名の古いWorker Custom Domain、Route、A / AAAA / CNAMEレコードが存在する場合は競合するため、対象Workerを確認してから割り当てます。

## デプロイ確認

以下のURLで確認します。

```text
https://widget.ivuru.ivrm.jp/api/health
https://widget.ivuru.ivrm.jp/api/profile
```

`/api/health`の`version`が`2026-07-14.2`であれば、このバージョンが反映されています。

## 次フェーズ

1. 実画像・ブランドアセットへの差し替え
2. GitHub Activity API連携
3. Minecraftサーバー状態API連携
4. Discord OAuth2 / Social SDKの技術検証
5. プロフィール管理画面の設計

## 管理

- GitHub: `mizzz-dev/ivurugg-discord-widget`
- Linear: `IVR-192`
