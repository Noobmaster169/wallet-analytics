import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar";
import AppWalletProvider from "../components/AppWalletProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});


export const metadata: Metadata = {
  title: "Wallet Analytic App",
  description: "App for Solana Wallet Analytics",
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <AppWalletProvider>
        <div className="h-[100vh]">
          {/*<NavBar />*/}
          <div className="pt-15">
            <div className="h-[100vh] pt-24">
              {children}
            </div>
          </div>
        </div>
        </AppWalletProvider>
      </body>
    </html>
  );
}