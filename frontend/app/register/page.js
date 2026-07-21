"use client" 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/authContext";
import { login as loginService } from "../../src/services/authService";
import Link from "next/link";


export default function RegisterPage(){
  const [name, setName] = useState ("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

}