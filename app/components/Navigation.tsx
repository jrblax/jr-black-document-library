import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/sermons", label: "Sermons" },
  { href: "/documents", label: "Documents" },
  { href: "/blog", label: "Blog" },
  { href: "/notes", label: "Notes" },
  { href: "/signup", label: "Signup" },
  { href: "/login", label: "Login" },
];

export default function Navigation() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-8 py-4 text-sm"
      >
        <Link className="mr-auto font-semibold" href="/">
          J. R. Black Document Library
        </Link>
        {links.slice(1).map((link) => (
          <Link
            className="transition-colors hover:text-blue-600"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
