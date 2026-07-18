import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { Footer } from "./_shared/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./_shared/Navbar";


const exo = Exo_2({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EmpNexa",
  description: "Manage People. Build Better Teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning
      className={`${exo.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
