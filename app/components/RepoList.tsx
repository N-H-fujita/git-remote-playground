"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Repo = { name: string };
type RepoResponse = { repos: Repo[], error?: string }

export function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortedRef = useRef(false);

  const fetchRepos = useCallback(async (mode: "initial" | "refresh") => {
    const setBusy = mode === "initial" ? setLoading : setRefreshing;

    try {
      setBusy(true);
      setError(null);

      const res = await fetch("/api/repos", { cache: "no-store" });
      const data = (await res.json()) as RepoResponse;

      if(!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`);

      if(!abortedRef.current) setRepos(data.repos ?? []);
    } catch(e) {
      if(!abortedRef.current) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    } finally {
      if(!abortedRef.current) setBusy(false);
    }
  }, [abortedRef]);

  useEffect(() => {
    abortedRef.current = false;
    void fetchRepos("initial");
    return () => {
      abortedRef.current = true;
    };
  }, [fetchRepos]);

  if(loading) return <p>Loading...</p>
  // if(error) return <p style={{ color: "crimson" }}>Error: {error}</p>

  return(
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => void fetchRepos("refresh")}
          disabled={loading || refreshing}
        >
          {refreshing ? "Reloading..." : "Reload"}
        </button>
        {error && <span style={{ color: "crimson" }}>Error: {error}</span> }
      </div>
      <ul style={{ marginTop: 12 }}>
        {repos.map((r) => (
          <li key={r.name}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}