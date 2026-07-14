import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.js";

const env = {
  ASSETS: {
    async fetch(request) {
      const url = new URL(request.url);
      return new Response(`asset:${url.pathname}`, { status: 200 });
    }
  }
};

test("ヘルスチェックが正常レスポンスを返す", async () => {
  const response = await worker.fetch(
    new Request("https://widget.example.com/api/health"),
    env
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.service, "ivurugg-discord-widget");
  assert.equal(body.version, "2026-07-14.2");
});

test("プロフィールAPIが表示データを返す", async () => {
  const response = await worker.fetch(
    new Request("https://widget.example.com/api/profile"),
    env
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.identity.name, "ivuruGG");
  assert.equal(body.project.progress, 45);
  assert.ok(Array.isArray(body.games));
});

test("存在しないAPIはJSONの404を返す", async () => {
  const response = await worker.fetch(
    new Request("https://widget.example.com/api/unknown"),
    env
  );
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error, "NOT_FOUND");
});

test("通常パスはStatic Assetsへ委譲する", async () => {
  const response = await worker.fetch(
    new Request("https://widget.example.com/"),
    env
  );

  assert.equal(await response.text(), "asset:/");
});
