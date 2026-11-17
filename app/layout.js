import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["400", "500", "600", "700", "800"] });

export const metadata = {
  title: "SIM-TLHP | Inspektorat Daerah Kabupaten Kupang",
  description: "Sistem Informasi Manajemen Tindak Lanjut Hasil Pemeriksaan Inspektorat Daerah Kabupaten Kupang.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
