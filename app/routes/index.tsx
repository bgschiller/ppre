import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main>
      <p>If your provider gave you a code to use, enter it here:</p>
      <Link to="/plans/new">Create a new Plan</Link>
    </main>
  );
}
