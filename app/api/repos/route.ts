import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const REPOS_DIR = path.resolve('repos');

export async function POST() {
  // 念のため repos/ がなければ作る
  if (!fs.existsSync(REPOS_DIR)) {
    fs.mkdirSync(REPOS_DIR);
  }

  const repoName = 'sample.git';
  const repoPath = path.join(REPOS_DIR, repoName);

  if (fs.existsSync(repoPath)) {
    return NextResponse.json(
      { error: 'Repository already exists' },
      { status: 400 }
    );
  }

  try {
    execSync(`git init --bare ${repoPath}`);
    return NextResponse.json({
      message: 'Bare repository created',
      name: repoName,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
