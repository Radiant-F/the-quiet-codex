import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import "./index.css";
import { useMemo } from "react";
import { Provider } from "react-redux";
import { getStore } from "./redux/store";
import { AuthBootstrap } from "./features/auth";
import { I18nProvider } from "./i18n";
import { ThemeProvider } from "./theme";

export function Layout({ children }: { children: React.ReactNode }) {
  // Memoize the store to ensure we get the same instance throughout the render
  // On server: creates a new store for this request
  // On client: returns the singleton store
  const store = useMemo(() => getStore(), []);

  // Inline script to set theme before hydration to prevent flash
  // This runs synchronously before React hydrates
  const themeScript = `
    (function() {
      try {
        var stored = localStorage.getItem('theme-mode');
        var theme = stored === 'light' || stored === 'dark' ? stored : 
          (stored === 'system' || !stored) ? 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
            'dark';
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>The Quiet Codex</title>
        <meta property="og:title" content="The Quiet Codex" />
        <meta
          property="og:description"
          content="Your personal productivity companion."
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href={`${import.meta.env.BASE_URL}vite.svg`} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <Provider store={store}>
          <ThemeProvider>
            <I18nProvider>
              <AuthBootstrap />
              {children}
            </I18nProvider>
          </ThemeProvider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto theme-page min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{message}</h1>
      <p className="text-lg mb-4">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-black/50 rounded-lg">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
