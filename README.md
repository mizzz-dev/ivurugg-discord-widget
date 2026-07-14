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

ビルド不要の静的構成です。

```text
index.html
styles.css
script.js
_headers
```

Node.jsやパッケージインストールは不要です。

## ローカル確認

単純な静的ファイルのため、`index.html`をブラウザで開けます。

HTTPサーバーで確認する場合:

```bash
python -m http.server 8080
```

`http://localhost:8080` を開きます。

## Cloudflare Pages設定

GitHub連携済みPagesプロジェクトでは、以下の設定を使用します。

| 設定 | 値 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | 空欄 |
| Build output directory | `/` |
| Root directory | `/` |

デプロイ後、Cloudflare Pagesの `Custom domains` から以下を追加します。

```text
widget.ivuru.ivrm.jp
```

CloudflareがDNSレコードと証明書を自動設定できる状態では、その案内に従います。既存レコードが競合する場合は、同名のA / AAAA / CNAMEレコードを確認してから接続します。

## 次フェーズ

1. 実画像・ブランドアセットへの差し替え
2. GitHub Activity API連携
3. Minecraftサーバー状態API連携
4. Discord OAuth2 / Social SDKの技術検証
5. 表示データの管理方法をJSONまたはAPIへ分離

## Repository

- GitHub: https://github.com/mizzz-dev/ivurugg-discord-widget
- Linear: IVR-192
