# ivuruGG Discord Widget

ivuruGGの活動・ゲーム・開発情報を表示するDiscord向けプロフィールウィジェットです。

## 公開URL

- 本番候補: `https://widget.ivuru.ivrm.jp`
- Cloudflare Pagesの初期ドメイン: Pagesプロジェクト作成時に発行された `*.pages.dev`

## 現在のMVP

- ivuruGGプロフィール表示
- Developer × Gamerブランド表示
- 開発中プロジェクトと進捗表示
- Minecraft / GitHubの仮ステータス表示
- 好きなゲーム表示
- ライトモード / ダークモード
- Web Share API・URLコピー
- レスポンシブ対応
- Cloudflare Pages向けセキュリティヘッダー

現時点の数値はデザイン確認用の仮データです。GitHub APIやMinecraft APIとの接続は次フェーズで実装します。

## 技術構成

依存パッケージなしの静的構成です。Cloudflare Pages向けにはNode.js標準機能だけで`dist`を生成します。

```text
index.html
styles.css
script.js
_headers
package.json
scripts/build.mjs
```

## ローカル確認

単純な静的ファイルのため、`index.html`をブラウザで開けます。

HTTPサーバーで確認する場合:

```bash
python -m http.server 8080
```

`http://localhost:8080` を開きます。

Cloudflare Pagesと同じ出力を確認する場合:

```bash
npm run build
python -m http.server 8080 --directory dist
```

## Cloudflare Pages設定

GitHub連携済みPagesプロジェクトでは、以下の設定を使用します。

| 設定 | 値 |
| --- | --- |
| Git repository | `mizzz-dev/ivurugg-discord-widget` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 空欄 |

設定変更後は、`Deployments`から最新コミットのデプロイを再実行します。

デプロイ後、Cloudflare Pagesの`Custom domains`から以下を追加します。

```text
widget.ivuru.ivrm.jp
```

同名のWorker Route、Custom Domain、A / AAAA / CNAMEレコードが既に存在する場合は競合します。`Hello world`が表示される場合は、対象ドメインが初期Workerへ向いていないか確認し、正しいPagesプロジェクトへ割り当て直します。

## 正常表示の確認

正常に反映されると、ページタイトルと本文に以下が表示されます。

```text
ivuruGG Discord Widget
Developer × Gamer
```

`Hello world`が表示される場合は、GitHubの`main`ではなくCloudflare初期テンプレートが配信されています。

## 次フェーズ

1. 実画像・ブランドアセットへの差し替え
2. GitHub Activity API連携
3. Minecraftサーバー状態API連携
4. Discord OAuth2 / Social SDKの技術検証
5. 表示データの管理方法をJSONまたはAPIへ分離

## Repository

- GitHub: https://github.com/mizzz-dev/ivurugg-discord-widget
- Linear: IVR-192
