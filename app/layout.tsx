import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simulador ALU",
  description:
    "Suma y resta en n bits con vistas binarias y decimales (ℕ y complemento a 2).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] font-sans text-[var(--foreground)]">
        {children}
        <footer className="mt-auto border-t border-zinc-200 py-4 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 text-xs text-zinc-500 dark:text-zinc-500">
            <span>Desarrollado por Leo Turzi</span>
            <span aria-hidden>·</span>
            <a
              href="https://github.com/leoturzi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil de GitHub de Leo Turzi"
              className="flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.222 0 4.61-2.804 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              leoturzi
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
