import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No note selected. Select a note on the left, or{" "}
      <Link to="new" className="text-indigo-500 underline">
        create a new note.
      </Link>
    </p>
  );
}
