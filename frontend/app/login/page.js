"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import { login as loginService } from "../../src/services/authService";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const { loading, setLoading } = useState(false); 
}