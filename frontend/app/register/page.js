"use client" 
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage(){
  const [name, setName] = useState ("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
}