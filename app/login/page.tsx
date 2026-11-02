"client"
"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginPaciente } from "./actions";

export default function LoginPaciente() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    
    startTransition(async () => {
      try {
        const res = await loginPaciente(formData);
        if (res?.success && res?.url) {
          router.push(res.url);
          router.refresh();
        } else {
          setError(res?.message || "Error al iniciar sesión.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Ocurrió un error de conexión con la base de datos.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
        
        <div className="text-center mb-8 flex flex-col items-center">
          <Image 
            src="/logo-completo.png" 
            alt="Logo AcompañaT" 
            width={280} 
            height={280} 
            className="object-contain mb-4"
            priority 
          />
          <p className="text-slate-500 text-sm font-semibold">Portal exclusivo para Pacientes</p>
        </div>
        
        {error && <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg text-center font-medium">{error}</div>}

        <form ref={formRef} method="POST" onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Correo Electrónico</label>
            <input type="email" name="email" required className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-3 text-slate-900 outline-none text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Contraseña</label>
            <input type="password" name="password" required className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-3 text-slate-900 outline-none text-sm transition-colors" />
          </div>
          
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isPending} 
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-4 shadow-sm"
          >
            {isPending ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-xs text-slate-500">
          ¿Eres personal médico? <a href="/login-corporativo" className="text-emerald-600 hover:underline font-semibold">Ingresa aquí</a>
        </p>
      </div>
    </div>
  );
}
