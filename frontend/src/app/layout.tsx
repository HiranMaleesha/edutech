import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import { Toaster } from "react-hot-toast";

/**
 * Inter font configuration for the application.
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Poppins font configuration for the application.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

/**
 * Metadata configuration for the Next.js application.
 */
export const metadata: Metadata = {
  title: "Aspirex - Transform Your Career",
  description: "Join 100,000+ learners and earn accredited diplomas trusted by top employers",
};

/**
 * Root layout component for the entire application.
 * Provides global context, navigation, and toast notifications.
 *
 * @param props - Component props containing children
 * @returns JSX element representing the root layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${poppins.variable} font-sans`}
      >
        <AuthProvider>
          <div className="min-h-screen bg-[#FFF9F3]">
            <Navigation />
            <main>
              {children}
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
