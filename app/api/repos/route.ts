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
    const name = typeof body.name === "string" ? body.name : "";

    if(!name) {
      return NextResponse.json({ error: "name is required"}, { status: 400 });
    }

    const repoName = name.endsWith(".git") ? name : `${name}.git`;
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

