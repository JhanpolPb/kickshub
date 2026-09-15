import Navbar from "@/src/components/navbar";
import { AuthProvider } from "../src/context/authContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: {
    default: "KicksHub — Tu tienda de sneakers",
    template: "%s | KicksHub",
  },
  description: "Los mejores sneakers en un solo lugar. Autenticidad garantizada.",
  keywords: ["sneakers", "zapatos", "tenis", "nike", "adidas", "jordan", "kickshub"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#111",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "0.9rem",
                padding: "12px 16px",
              },
              success: {
                iconTheme: { primary: "#22c55e", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#fff" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
