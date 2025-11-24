"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: credentials.email,
      password: credentials.password
    });

    setIsLoading(false);
    if (result?.error) {
      alert("Credenciais inválidas");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Login administrativo</h1>
        <p className="mt-2 text-sm text-slate-500">Acesse seu painel conectado ao Bling.</p>
        <div className="mt-6 space-y-4">
          <Input placeholder="E-mail" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
          <Input
            placeholder="Senha"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}

