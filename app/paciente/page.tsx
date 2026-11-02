"use client";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { User, Lock, Calendar, LogOut, CheckCircle, Menu, X } from "lucide-react";
import { actualizarPerfilPaciente, cambiarPasswordPaciente, obtenerCitasFuturas, obtenerDatosPaciente, obtenerSesionPaciente } from "./actions";
import Image from "next/image";

export default function PacienteDashboard() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("citas");
  const [fechaCDMX, setFechaCDMX] = useState("");
  
  const [mensajePerfil, setMensajePerfil] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [mensajeSeguridad, setMensajeSeguridad] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  const [misCitas, setMisCitas] = useState<any[]>([]);
  const [datosBasicos, setDatosBasicos] = useState<any>({});
  const [pacienteActivoId, setPacienteActivoId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargandoInicial(true);
        const session = await obtenerSesionPaciente();
        
        const idPaciente = session?.id || session?.userId || session?.usuario_id;
        
        if (idPaciente) {
          setPacienteActivoId(idPaciente);
          const citas = await obtenerCitasFuturas(idPaciente);
          const datos = await obtenerDatosPaciente(idPaciente);
          
          setMisCitas(citas || []);
          
          // Extraemos los datos de la BD si existen
          const datosFormateados = Array.isArray(datos) ? datos[0] : (datos || {});
          
          // FORZAMOS LA INYECCIÓN DEL NOMBRE DESDE LA SESIÓN
          // Así, aunque la BD devuelva null, el nombre principal aparecerá
          setDatosBasicos({
            nombre_completo: session.nombre || datosFormateados.nombre_completo || "",
            ...datosFormateados
          });
        }
      } catch (error) {
        console.error("Error al cargar la info:", error);
      } finally {
        setCargandoInicial(false);
      }
    };

    cargarDatos();

    const intervalo = setInterval(() => {
      const date = new Date();
      const formatFecha = date.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City", day: "2-digit", month: "long", year: "numeric" });
      const formatHora = date.toLocaleTimeString("es-MX", { timeZone: "America/Mexico_City", hour: "2-digit", minute: "2-digit" });
      setFechaCDMX(`${formatFecha} ${formatHora}`);
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const handlePerfilSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajePerfil(null);
    if (!pacienteActivoId) return;
    
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await actualizarPerfilPaciente(pacienteActivoId, formData);
      setMensajePerfil({ texto: res.message, tipo: res.success ? "exito" : "error" });
    });
  };

  const handleSeguridadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeSeguridad(null);
    if (!pacienteActivoId) return;

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await cambiarPasswordPaciente(pacienteActivoId, formData);
      setMensajeSeguridad({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if(res.success) (e.target as HTMLFormElement).reset();
    });
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMensajePerfil(null);
    setMensajeSeguridad(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-emerald-200">
        <Image src="/logo-texto.png" alt="AcompañaT" width={150} height={40} className="object-contain" priority />
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 hover:text-emerald-600">
          <Menu size={28} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-emerald-200 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-emerald-100 flex justify-between items-start">
          <div>
            <Image src="/logo-texto.png" alt="AcompañaT" width={220} height={100} className="object-contain" priority />
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded mt-2 inline-block">PACIENTE</span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <button onClick={() => handleTabChange("citas")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'citas' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-50 text-slate-600'}`}>
            <Calendar size={18}/> Mis Citas
          </button>
          <button onClick={() => handleTabChange("perfil")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'perfil' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-50 text-slate-600'}`}>
            <User size={18}/> Datos del Perfil
          </button>
          <button onClick={() => handleTabChange("seguridad")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'seguridad' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-emerald-50 text-slate-600'}`}>
            <Lock size={18}/> Contraseña
          </button>
        </nav>

        <div className="p-4 border-t border-emerald-100">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all">
            <LogOut size={18}/> Cerrar Sesión
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6 md:mb-8 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Hola, {datosBasicos.nombre_completo ? datosBasicos.nombre_completo.split(' ')[0] : '...'}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Bienvenido a tu portal de salud.</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs md:text-sm font-medium text-emerald-600">Ciudad de México</p>
            <p className="text-[10px] md:text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {activeTab === "citas" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-slate-800">
               <Calendar className="text-emerald-600"/> Próximas Citas Agendadas
             </h2>
             <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
               {cargandoInicial ? (<p className="text-slate-500 text-sm">Cargando tus citas...</p>
               ) : misCitas.length === 0 ? (
                 <p className="text-slate-500 text-sm">No tienes citas próximas agendadas.</p>
               ) : (
                 misCitas.map((cita) => {
                   const fechaObj = new Date(cita.fecha_cita);
                   return (
                     <div key={cita.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
                       <div>
                         <p className="text-emerald-700 font-bold text-base md:text-lg">
                           {fechaObj.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                         </p>
                         <p className="text-slate-900 font-medium text-sm md:text-base">{cita.tipo_cita}</p>
                         <p className="text-slate-500 text-xs mt-1">Enfermera asignada: {cita.enfermera || "Sin asignar"}</p>
                       </div>
                       <div className="w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0 mt-1 sm:mt-0">
                         <p className="text-xs md:text-sm font-semibold text-slate-700">{fechaObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs</p>
                         <span className="text-[10px] md:text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded border border-emerald-200 inline-block font-medium mt-1">
                           {cita.estado}
                         </span>
                       </div>
                     </div>
                   );
                 })
               )}
             </div>
           </section>
        )}

        {activeTab === "perfil" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-slate-800">
               <User className="text-emerald-600"/> Tu Perfil Médico
             </h2>
             {mensajePerfil && (
               <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl border text-sm font-medium ${mensajePerfil.tipo === 'exito' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                 <CheckCircle size={18} /> {mensajePerfil.texto}
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Información Personal (Solo lectura)</h3>
                  
                  {cargandoInicial ? <p className="text-slate-500 text-sm">Cargando...</p> : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase text-slate-500 font-semibold">Nombre Completo</p>
                        <p className="text-slate-900 font-medium">{datosBasicos.nombre_completo || "..."}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-slate-500 font-semibold">Correo Electrónico</p>
                        <p className="text-slate-900 font-medium">{datosBasicos.email || "..."}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-slate-500 font-semibold">CURP</p>
                        <p className="text-slate-900 font-medium">{datosBasicos.curp || "..."}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs uppercase text-slate-500 font-semibold">Sexo</p>
                          <p className="text-slate-900 font-medium">{datosBasicos.sexo || "..."}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-500 font-semibold">Nacimiento</p>
                          <p className="text-slate-900 font-medium">{datosBasicos.fecha_nacimiento || "..."}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 mt-4 italic">Para modificar esta información crítica, contacte a administración.</p>
                </div>

<form onSubmit={handlePerfilSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
  <div>
    <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Información Complementaria (Editable)</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-semibold">Tipo de Sangre</label>
        <input type="text" name="tipoSangre" defaultValue={datosBasicos.tipo_sangre || ""} placeholder="Ej: O+" maxLength={5} className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-slate-900 outline-none text-sm" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-semibold">Teléfono</label>
        <input type="tel" name="telefono" defaultValue={datosBasicos.telefono || ""} placeholder="10 dígitos" maxLength={10} className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-slate-900 outline-none text-sm" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-semibold">RFC</label>
        <input type="text" name="rfc" defaultValue={datosBasicos.rfc || ""} placeholder="13 caracteres" maxLength={13} className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-slate-900 outline-none text-sm uppercase" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-semibold">NSS</label>
        <input type="text" name="nss" defaultValue={datosBasicos.nss || ""} placeholder="Número de Seguridad Social (11 dígitos)" maxLength={11} className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-slate-900 outline-none text-sm" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-600 mb-1 font-semibold">Domicilio</label>
        <textarea name="domicilio" defaultValue={datosBasicos.domicilio || ""} placeholder="Calle, Número, Colonia, C.P., Municipio" rows={2} className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-slate-900 outline-none text-sm resize-none"></textarea>
      </div>
    </div>
  </div>
  <button type="submit" disabled={isPending || !pacienteActivoId} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm mt-6">
    {isPending ? "Guardando..." : "Guardar Cambios"}
  </button>
</form>
             </div>
           </section>
        )}

        {activeTab === "seguridad" && (
           <section className="animate-in fade-in duration-300 max-w-2xl">
             <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-slate-800">
               <Lock className="text-emerald-600"/> Actualizar Contraseña
             </h2>
             {mensajeSeguridad && (
               <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl border text-sm font-medium ${mensajeSeguridad.tipo === 'exito' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                 <CheckCircle size={18} /> {mensajeSeguridad.texto}
               </div>
             )}
             <form onSubmit={handleSeguridadSubmit} className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 md:space-y-6">
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Contraseña Actual</label>
                 <input type="password" name="passwordActual" required className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Nueva Contraseña</label>
                 <input type="password" name="passwordNueva" required className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Confirmar Nueva Contraseña</label>
                 <input type="password" name="passwordConfirmar" required className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending || !pacienteActivoId} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm shadow-sm">
                 {isPending ? "Procesando..." : "Actualizar Contraseña"}
               </button>
             </form>
           </section>
        )}
      </main>
    </div>
  );
}