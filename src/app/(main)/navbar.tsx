import ModeToggle from "@/components/mode-toggle";
import UserDropdown from "@/components/user-dropdown";
import Link from "next/link";

export function Navbar() {
  // TODO: Display logged-in user

  return (
    <header className="bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          login-auth
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
