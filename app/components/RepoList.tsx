"use client";

import { useEffect, useState } from "react";

type Repo = { name: string };
type ReposResponse = { repos: Repo[]; error?: string };

export function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/repos", {
          // GETはキャッシュで「増えたのに増えない」になりやすいので開発中は切る
          cache: "no-store",
        });

        const data = (await res.json()) as ReposResponse;

        if (!res.ok) {
          // API側が { error } で返してる前提に合わせる
          throw new Error(data.error ?? `Request failed: ${res.status}`);
        }

        if (!aborted) {
          setRepos(data.repos ?? []);
        }
      } catch (e) {
        if (!aborted) {
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;

  return (
    <ul>
      {repos.map((r) => (
        <li key={r.name}>{r.name}</li>
      ))}
    </ul>
  );
}
