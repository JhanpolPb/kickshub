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
 const { loading, setLoading } = useState(false); 

  const { login } = useAuth ();
  const { router } = useRouter ();

  const handleSubmit = async (e) => {
    e.preventDefault(true),
    setLoanding (null),
    setError
  }
  
  try{
    const data = await loginService(email, password);
    login (data.user, data.token);
    router.push ("/catalog");

  }catch(err){
    
    
  }

}