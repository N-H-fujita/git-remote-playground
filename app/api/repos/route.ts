import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const REPOS_DIR = path.resolve("repos");

function ensureReposDir() {
  if (!fs.existsSync(REPOS_DIR)) {
    fs.mkdirSync(REPOS_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    ensureReposDir();

    const entries = fs.readdirSync(REPOS_DIR, { withFileTypes: true });

    const repos = entries
      .filter((e) => e.isDirectory() && e.name.endsWith(".git"))
      .map((e) => ({ name: e.name }));

    return NextResponse.json(repos);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    ensureReposDir();

    // JSONを受け取る(失敗したら空オブジェクト)
    const body = await req.json().catch(() => ({}));
    const rawName = typeof body.name === "string" ? body.name.trim() : "";

    if (!rawName) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // バリデーション（まずは最小ルール）
    // - パス区切り（/ \）や空白、制御文字などを禁止
    // - 英数と . _ - のみ許可
    if (!/^[a-zA-Z0-9._-]+$/.test(rawName)) {
      return NextResponse.json(
        { error: 'invalid name (use a-z A-Z 0-9 "._-")' },
        { status: 400 }
      );
    }

    // 正規化：必ず .git を付ける
    const repoName = rawName.endsWith(".git") ? rawName : `${rawName}.git`;
    const repoPath = path.join(REPOS_DIR, repoName);

    if (fs.existsSync(repoPath)) {
      return NextResponse.json(
        { error: "Repository already exists" },
        { status: 400 }
      );
    }

    execSync(`git init --bare "${repoPath}"`);
    return NextResponse.json({
      message: "Bare repository created",
      name: repoName,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


