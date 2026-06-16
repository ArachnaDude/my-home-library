import "./PlaceholderPage.css";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="page placeholder-page">
      <header className="page__header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <p className="placeholder-page__notice">Coming soon.</p>
    </main>
  );
}
