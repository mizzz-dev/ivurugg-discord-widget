import { cp, mkdir, rm } from "node:fs/promises";

const outputDir = new URL("../dist/", import.meta.url);
const rootDir = new URL("../", import.meta.url);

const files = ["index.html", "styles.css", "script.js", "_headers"];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const file of files) {
  await cp(new URL(file, rootDir), new URL(file, outputDir));
}

try {
  await cp(new URL("assets/", rootDir), new URL("assets/", outputDir), {
    recursive: true,
  });
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}

console.log("Cloudflare Pages向けにdistを生成しました。");
