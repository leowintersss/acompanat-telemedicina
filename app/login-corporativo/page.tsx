"client"
"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginStaff } from "./actions";

export default function LoginCorporativo() {
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
        const result = await loginStaff(formData);
        
        if (result?.success && result?.url) {
          router.push(result.url);
          router.refresh();
        } else {
          setError(result?.message || "Credenciales incorrectas o error al iniciar sesión.");
        }
      } catch (err) {
        console.error("Error al iniciar sesión:", err);
        setError("Ocurrió un error de conexión.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-purple-600"></div>
        
        <div className="text-center mb-8 mt-2 flex flex-col items-center">
          <Image 
            src="/logo-completo.png" 
            alt="Logo AcompañaT Staff" 
            width={280} 
            height={280} 
            className="object-contain mb-3"
            priority 
          />
      
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-2 font-semibold">Acceso de Personal Médico</p>
        </div>
        
        {error && <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg text-center font-medium">{error}</div>}

        <form ref={formRef} method="POST" onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Correo Electrónico</label>
            <input type="email" name="email" required className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-3 text-slate-900 outline-none text-sm transition-colors" />
          </div>
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Contraseña</label>
            <input type="password" name="password" required className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-3 text-slate-900 outline-none text-sm transition-colors" />
          </div>
          
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isPending} 
            className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors mt-4 shadow-sm"
          >
            {isPending ? "Validando credenciales..." : "Ingresar al Sistema"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-xs text-slate-500">
          Uso exclusivo para personal autorizado.
        </p>
      </div>
    </div>
  );
}
