import { RepoList } from "./components/RepoList";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>git-remote-playground</h1>

      <section style={{ marginTop: 16 }}>
        <h2>Repositories</h2>
        <RepoList />
      </section>
    </main>
  );
}
