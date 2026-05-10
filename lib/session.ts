/**
 * getSessionId()
 * Returns a stable UUID for the current browser session.
 * Creates and stores one in localStorage if it doesn't exist yet.
 * Used as the "userId" for guest cart and booking operations.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server-side";

  const key = "technie_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    // crypto.randomUUID() is available in all modern browsers
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
