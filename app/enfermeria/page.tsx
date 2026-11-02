"client"
"use client";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { User, Lock, LogOut, Search, Activity, Bluetooth, FileText, CheckCircle, Menu, X } from "lucide-react";
import { buscarPacientes, registrarSignosEnfermeria, obtenerHistorialPaciente, obtenerCitasPaciente } from "./actions";
import Image from "next/image";
import { obtenerSesionEnfermera } from "./actions";


export default function EnfermeriaDashboard() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("buscar");
  const [fechaCDMX, setFechaCDMX] = useState("");
  const [mensajeGlobal, setMensajeGlobal] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [nombreEnfermera, setNombreEnfermera] = useState("Enfermera");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [queryBusqueda, setQueryBusqueda] = useState("");
  const [resultadosPacientes, setResultadosPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<{id: number, nombre_completo: string, email: string} | null>(null);

  const [historialSignos, setHistorialSignos] = useState<any[]>([]);
  const [historialCitas, setHistorialCitas] = useState<any[]>([]);

  useEffect(() => {

    startTransition(async () => {
    const session = await obtenerSesionEnfermera();
    if (session && session.nombre) {
      setNombreEnfermera(session.nombre.split(' ')[0]); // Toma solo el primer nombre
    }
  });
    const intervalo = setInterval(() => {
      const date = new Date();
      const formatFecha = date.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City", day: "2-digit", month: "long", year: "numeric" });
      const formatHora = date.toLocaleTimeString("es-MX", { timeZone: "America/Mexico_City", hour: "2-digit", minute: "2-digit" });
      setFechaCDMX(`${formatFecha} ${formatHora}`);
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await buscarPacientes(queryBusqueda);
    setResultadosPacientes(res);
  };

  const cargarHistorial = async (pacienteId: number) => {
    startTransition(async () => {
      const signos = await obtenerHistorialPaciente(pacienteId);
      const citas = await obtenerCitasPaciente(pacienteId);
      setHistorialSignos(signos);
      setHistorialCitas(citas);
    });
  };

  const handleSignosSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeGlobal(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await registrarSignosEnfermeria({
        patientId: Number(formData.get("patientId")),
        presion: formData.get("presion") as string,
        frecuenciaCardiaca: Number(formData.get("frecuenciaCardiaca")),
        temperatura: Number(formData.get("temperatura")),
        observaciones: formData.get("observaciones") as string,
      });
      setMensajeGlobal({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if(res.success) {
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  const handleSeguridadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeGlobal({ texto: "Función de cambio de contraseña en desarrollo", tipo: "exito" });
    (e.target as HTMLFormElement).reset();
  };

  // --- NUEVA FUNCIÓN BLUETOOTH ---
  const conectarBluetooth = async () => {
    try {
const device = await (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true });
    
      setMensajeGlobal({ texto: `Conectado a: ${device.name || 'Dispositivo Médico'}`, tipo: "exito" });
      const statusEl = document.getElementById("bluetooth-status-enfermeria");
      if (statusEl) statusEl.innerText = `Estado: Conectado (${device.name || 'Dispositivo'})`;
    } catch (error) {
      console.error(error);
      setMensajeGlobal({ texto: "Conexión Bluetooth cancelada o fallida.", tipo: "error" });
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMensajeGlobal(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-rose-200">
        <Image src="/logo-texto.png" alt="AcompañaT" width={150} height={40} className="object-contain" priority />
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 hover:text-rose-600">
          <Menu size={28} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-rose-200 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-rose-100 flex justify-between items-start">
          <div>
            <Image src="/logo-texto.png" alt="AcompañaT" width={220} height={100} className="object-contain" priority />
            <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-1 rounded mt-2 inline-block">ENFERMERÍA</span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {[
            { id: "buscar", icon: Search, label: "Buscar Paciente" },
            { id: "historial", icon: FileText, label: "Historial / Citas" },
            { id: "signos", icon: Activity, label: "Captura Signos" },
            { id: "bluetooth", icon: Bluetooth, label: "Bluetooth" }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleTabChange(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-rose-600 text-white shadow-md' : 'hover:bg-rose-50 text-slate-600'}`}
            >
              <item.icon size={18}/> {item.label}
            </button>
          ))}
          <hr className="border-slate-100 my-4" />
          <button 
            onClick={() => handleTabChange("seguridad")} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'seguridad' ? 'bg-rose-600 text-white shadow-md' : 'hover:bg-rose-50 text-slate-600'}`}
          >
            <Lock size={18}/> Contraseña
          </button>
        </nav>
        
        <div className="p-4 border-t border-rose-100">
          <Link href="/login-corporativo" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all">
            <LogOut size={18}/> Cerrar Sesión
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6 md:mb-8 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hola, {nombreEnfermera}</h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">Estación de Guardia.</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs md:text-sm font-medium text-rose-600">Ciudad de México</p>
            <p className="text-[10px] md:text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {pacienteSeleccionado && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 max-w-4xl">
            <div>
              <p className="text-[10px] md:text-xs text-rose-700 uppercase font-bold tracking-wider mb-1">Paciente en atención</p>
              <p className="text-slate-900 text-sm md:text-base font-bold">{pacienteSeleccionado.nombre_completo} (ID: {pacienteSeleccionado.id})</p>
            </div>
            <button onClick={() => setPacienteSeleccionado(null)} className="text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white px-3 py-1.5 rounded-lg transition-colors w-full sm:w-auto text-center">Desmarcar</button>
          </div>
        )}

        {mensajeGlobal && (
          <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl border text-sm font-medium max-w-4xl ${mensajeGlobal.tipo === 'exito' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
            <CheckCircle size={18} /> {mensajeGlobal.texto}
          </div>
        )}

        {activeTab === "buscar" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-slate-800"><Search className="text-rose-600"/> Búsqueda</h2>
             <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
               <input type="text" value={queryBusqueda} onChange={(e)=>setQueryBusqueda(e.target.value)} placeholder="Buscar por Nombre, CURP o Correo..." className="flex-1 bg-white border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-3 text-slate-900 outline-none text-sm w-full shadow-sm" />
               <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-3 rounded-xl transition-colors w-full sm:w-auto shadow-sm">Buscar</button>
             </form>
             
             <div className="md:hidden space-y-4">
               {resultadosPacientes.length === 0 ? (
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm shadow-sm">
                   Realiza una búsqueda para cargar pacientes
                 </div>
               ) : (
                 resultadosPacientes.map(p => (
                   <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                     <div>
                       <p className="text-slate-900 font-bold text-base">{p.nombre_completo}</p>
                       <p className="text-slate-500 text-xs mt-0.5">CURP: {p.curp}</p>
                     </div>
                     <div className="flex gap-2 pt-2 border-t border-slate-100">
                       <button onClick={() => { setPacienteSeleccionado(p); cargarHistorial(p.id); setActiveTab("historial"); }} className="flex-1 text-rose-700 bg-rose-50 hover:bg-rose-100 font-medium text-xs border border-rose-200 py-2 rounded-xl text-center">
                         Historial
                       </button>
                       <button onClick={() => { setPacienteSeleccionado(p); setActiveTab("signos"); }} className="flex-1 bg-rose-600 text-white hover:bg-rose-700 border border-rose-700 py-2 rounded-xl font-medium text-xs text-center">
                         Capturar Signos
                       </button>
                     </div>
                   </div>
                 ))
               )}
             </div>

             <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                   <tr><th className="px-6 py-3 font-semibold">Nombre</th><th className="px-6 py-3 font-semibold">CURP</th><th className="px-6 py-3 text-right font-semibold">Acción</th></tr>
                 </thead>
                 <tbody>
                   {resultadosPacientes.length === 0 ? (
                     <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Realiza una búsqueda</td></tr>
                   ) : (
                     resultadosPacientes.map(p => (
                       <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                         <td className="px-6 py-4 text-slate-900 font-medium">{p.nombre_completo}</td>
                         <td className="px-6 py-4 text-slate-500">{p.curp}</td>
                         <td className="px-6 py-4 flex gap-3 justify-end">
                           <button onClick={() => { setPacienteSeleccionado(p); cargarHistorial(p.id); setActiveTab("historial"); }} className="text-rose-700 bg-rose-50 hover:bg-rose-100 font-medium text-xs border border-rose-200 px-3 py-1 rounded">Historial</button>
                           <button onClick={() => { setPacienteSeleccionado(p); setActiveTab("signos"); }} className="bg-rose-600 text-white hover:bg-rose-700 border border-rose-700 px-3 py-1 rounded font-medium text-xs">Capturar</button>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
           </section>
        )}

        {activeTab === "signos" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-slate-800"><Activity className="text-rose-600"/> Constantes</h2>
             <form onSubmit={handleSignosSubmit} className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5 md:space-y-6">
               <div>
                 <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">ID Paciente</label>
                 <input type="number" name="patientId" defaultValue={pacienteSeleccionado?.id || ""} required className="w-full sm:max-w-xs bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                 <div>
                   <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Presión Arterial</label>
                   <input type="text" name="presion" required placeholder="Ej: 120/80" className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Frec. Cardíaca</label>
                   <input type="number" name="frecuenciaCardiaca" required placeholder="LPM" className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Temp (°C)</label>
                   <input type="number" step="0.1" name="temperatura" required placeholder="Ej: 36.5" className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Observaciones</label>
                 <textarea name="observaciones" rows={3} className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl p-4 text-slate-900 outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium px-8 py-3 rounded-xl transition-colors">
                 Guardar Signos
               </button>
             </form>
           </section>
        )}

        {activeTab === "historial" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-slate-800"><FileText className="text-rose-600"/> Historial Clínico</h2>
             {!pacienteSeleccionado ? (
               <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 text-center shadow-sm"><p className="text-slate-500 mb-4 text-sm md:text-base">Selecciona un paciente en Buscar.</p></div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-sm md:text-base">Últimos Registros (Signos)</h3>
                   <div className="space-y-3 md:space-y-4">
                     {isPending ? <p className="text-slate-500 text-sm">Cargando...</p> : historialSignos.length === 0 ? <p className="text-slate-500 text-sm">Sin registros.</p> : (
                       historialSignos.map((s, idx) => (
                         <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                           <span className="text-slate-500 font-semibold">{new Date(s.created_at).toLocaleDateString()}</span>
                           <p className="text-slate-800 font-medium mt-1">PA: {s.presion} | FC: {s.frecuencia_cardiaca} | Temp: {s.temperatura}°C</p>
                           {s.observaciones && <p className="text-slate-600 italic mt-1 break-words">"{s.observaciones}"</p>}
                         </div>
                       ))
                     )}
                   </div>
                 </div>
                 <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-sm md:text-base">Citas del Año</h3>
                   <div className="space-y-2 md:space-y-3">
                     {historialCitas.length === 0 ? <p className="text-slate-500 text-sm">Sin citas.</p> : historialCitas.map((c, idx) => (
                       <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                         <p className="font-bold text-slate-800">{c.tipo}</p><p className="text-slate-600">{c.fecha}</p>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </section>
        )}

        {activeTab === "bluetooth" && (
           <section className="animate-in fade-in duration-300 max-w-2xl">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800"><Bluetooth className="text-rose-600"/> Enlace de Dispositivos Médicos</h2>
             
             <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 text-center shadow-sm space-y-6">
               <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-rose-50 rounded-full border border-rose-100">
                 <Bluetooth size={40} className="text-rose-600 animate-pulse" />
               </div>
               
               <div>
                 <h3 className="text-lg font-bold text-slate-800 mb-2">Sincronización de Constantes</h3>
                 <p className="text-slate-500 text-sm max-w-md mx-auto">
                   Vincula dispositivos médicos por Bluetooth LE para capturar signos vitales automáticamente.
                 </p>
               </div>

               <div id="bluetooth-status-enfermeria" className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
                 Estado: Desconectado
               </div>

               <button 
                 onClick={conectarBluetooth}
                 className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-8 py-3 rounded-xl shadow-sm text-sm flex items-center justify-center gap-2 w-full sm:w-auto mx-auto transition-colors"
               >
                 <Bluetooth size={18} /> Buscar y Vincular Dispositivo
               </button>
             </div>
           </section>
        )}

        {activeTab === "seguridad" && (
           <section className="animate-in fade-in duration-300 max-w-2xl">
             <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-slate-800">
               <Lock className="text-rose-600"/> Actualizar Contraseña
             </h2>
             <form onSubmit={handleSeguridadSubmit} className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 md:space-y-6">
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Contraseña Actual</label>
                 <input type="password" name="passwordActual" required className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Nueva Contraseña</label>
                 <input type="password" name="passwordNueva" required className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Confirmar Nueva Contraseña</label>
                 <input type="password" name="passwordConfirmar" required className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm shadow-sm">
                 {isPending ? "Procesando..." : "Actualizar Contraseña"}
               </button>
             </form>
           </section>
        )}

      </main>
    </div>
  );
}

