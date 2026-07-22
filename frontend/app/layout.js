import Navbar from "@/src/components/navbar";
import { AuthProvider } from "../src/context/authContext";
import "./globals.css";

export const metadata = {
    title: "KicksHub",
    description: "Tu tienda de sneakers de confianza",
    keywords: ["sneakers", "tenis", "nike", "adidas"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}