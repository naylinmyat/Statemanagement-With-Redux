import ClientProviders from "./ClientProviders";
import "./globals.css";

export const metadata = {
  title: "Players and Teams",
  description: "This is for code test.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
