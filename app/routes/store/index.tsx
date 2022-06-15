import { Hero } from "~/components/Hero";

export default function Store() {
  return (
    <main>
      <Hero
        background={{
          url: "heroBackground.png",
        }}
        size="small"
        title="Store"
      />
    </main>
  );
}
