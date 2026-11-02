"client"
"use client";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { User, Lock, LogOut, Search, Activity, Bluetooth, FileText, Users, Shield, CheckCircle, Menu, X } from "lucide-react";
import { registrarEnfermera, obtenerEnfermeras, obtenerCoAminstradores, buscarPacientes, registrarSignosAdmin, obtenerHistorialPaciente, obtenerCitasPaciente, cambiarPasswordAdmin } from "./actions";
import Image from "next/image";
import { obtenerSesionAdmin } from "./actions";

export default function AdminDashboard() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("buscar");
  const [fechaCDMX, setFechaCDMX] = useState("");
  const [mensajeGlobal, setMensajeGlobal] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [nombreAdmin, setNombreAdmin] = useState("Administrador");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [passAleatoria, setPassAleatoria] = useState(true);
  const [passGeneradaVisual, setPassGeneradaVisual] = useState<string | null>(null);
  const [listaEnfermeras, setListaEnfermeras] = useState<any[]>([]);
  const [listaCoadmins, setListaCoadmins] = useState<any[]>([]);

  const [queryBusqueda, setQueryBusqueda] = useState("");
  const [resultadosPacientes, setResultadosPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<{id: number, nombre_completo: string, email: string} | null>(null);
  const [historialSignos, setHistorialSignos] = useState<any[]>([]);
  const [historialCitas, setHistorialCitas] = useState<any[]>([]);

  const cargarDatosUsuarios = async () => {
    const enfermeras = await obtenerEnfermeras();
    const admins = await obtenerCoAminstradores();
    setListaEnfermeras(enfermeras);
    setListaCoadmins(admins);
  };

  useEffect(() => {
    cargarDatosUsuarios();

    cargarDatosUsuarios();
  startTransition(async () => {
    const session = await obtenerSesionAdmin();
    if (session && session.nombre) {
      setNombreAdmin(session.nombre.split(' ')[0]);
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

  const handleAltaEnfermera = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeGlobal(null);
    setPassGeneradaVisual(null);
    const formData = new FormData(e.currentTarget);
    formData.append("passAleatoria", passAleatoria.toString());

    startTransition(async () => {
      const res = await registrarEnfermera(formData);
      setMensajeGlobal({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if (res.success) {
        if (res.passwordGenerada) setPassGeneradaVisual(res.passwordGenerada);
        (e.target as HTMLFormElement).reset();
        cargarDatosUsuarios();
      }
    });
  };

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
      const res = await registrarSignosAdmin({
        patientId: Number(formData.get("patientId")),
        presion: formData.get("presion") as string,
        frecuenciaCardiaca: Number(formData.get("frecuenciaCardiaca")),
        temperatura: Number(formData.get("temperatura")),
        observaciones: formData.get("observaciones") as string,
      });
      setMensajeGlobal({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if(res.success) (e.target as HTMLFormElement).reset();
    });
  };

  const handleSeguridadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeGlobal(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await cambiarPasswordAdmin(formData);
      setMensajeGlobal({ texto: res.message, tipo: res.success ? "exito" : "error" });
      if(res.success) (e.target as HTMLFormElement).reset();
    });
  };

  // --- NUEVA FUNCIÓN BLUETOOTH ---
  const conectarBluetooth = async () => {
    try {
        const device = await (navigator as any).bluetooth.requestDevice({ acceptAllDevices: true });
        // optionalServices: ['battery_service'] // Puedes añadir servicios específicos aquí
      
      setMensajeGlobal({ texto: `Conectado a: ${device.name || 'Dispositivo Médico'}`, tipo: "exito" });
      const statusEl = document.getElementById("bluetooth-status-admin");
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
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-purple-200">
        <Image src="/logo-texto.png" alt="AcompañaT" width={150} height={40} className="object-contain" priority />
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 hover:text-purple-600">
          <Menu size={28} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-purple-200 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-purple-100 flex justify-between items-start">
          <div>
            <Image src="/logo-texto.png" alt="AcompañaT" width={220} height={100} className="object-contain" priority />
            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded mt-2 inline-block">ADMIN</span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: "buscar", icon: Search, label: "Buscar Paciente" },
            { id: "historial", icon: FileText, label: "Historial / Citas" },
            { id: "signos", icon: Activity, label: "Captura Signos" },
            { id: "bluetooth", icon: Bluetooth, label: "Bluetooth" }
          ].map((item) => (
            <button key={item.id} onClick={() => handleTabChange(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === item.id ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-purple-50 text-slate-600'}`}>
              <item.icon size={18}/> {item.label}
            </button>
          ))}
          <hr className="border-slate-100 my-4" />
          <button onClick={() => handleTabChange("enfermeras")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'enfermeras' ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-purple-50 text-slate-600'}`}><Users size={18}/> Personal Enfermería</button>
          <button onClick={() => handleTabChange("coadmins")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'coadmins' ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-purple-50 text-slate-600'}`}><Shield size={18}/> Co-Administradores</button>
          <hr className="border-slate-100 my-4" />
          <button onClick={() => handleTabChange("seguridad")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === 'seguridad' ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-purple-50 text-slate-600'}`}><Lock size={18}/> Contraseña</button>
        </nav>
        <div className="p-4 border-t border-purple-100">
          <Link href="/login-corporativo" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all"><LogOut size={18}/> Cerrar Sesión</Link>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-200 pb-4 gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hola, {nombreAdmin}</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Panel de Control General.</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm font-medium text-purple-600">Ciudad de México</p>
            <p className="text-xs text-slate-500">{fechaCDMX}</p>
          </div>
        </header>

        {pacienteSeleccionado && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-4xl">
            <div>
              <p className="text-xs text-purple-700 uppercase font-bold tracking-wider mb-1">Paciente Activo (Revisión Admin)</p>
              <p className="text-slate-900 font-medium">{pacienteSeleccionado.nombre_completo} (ID: {pacienteSeleccionado.id})</p>
            </div>
            <button onClick={() => setPacienteSeleccionado(null)} className="text-xs text-slate-500 hover:text-slate-800 border border-slate-300 bg-white px-3 py-1.5 rounded-lg transition-colors w-full sm:w-auto">Desmarcar</button>
          </div>
        )}

        {mensajeGlobal && (
          <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl border text-sm font-medium max-w-4xl ${mensajeGlobal.tipo === 'exito' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
            <CheckCircle size={18} className="shrink-0" /> {mensajeGlobal.texto}
          </div>
        )}

        {activeTab === "buscar" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800"><Search className="text-purple-600"/> Búsqueda</h2>
             <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-4 mb-8">
               <input type="text" value={queryBusqueda} onChange={(e)=>setQueryBusqueda(e.target.value)} placeholder="Buscar por Nombre, CURP o Correo..." className="flex-1 bg-white border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-3 text-slate-900 outline-none text-sm shadow-sm" />
               <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm">Buscar</button>
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
                       <button onClick={() => { setPacienteSeleccionado(p); cargarHistorial(p.id); setActiveTab("historial"); }} className="flex-1 text-purple-700 bg-purple-50 hover:bg-purple-100 font-medium text-xs border border-purple-200 py-2 rounded-xl text-center">
                         Historial
                       </button>
                       <button onClick={() => { setPacienteSeleccionado(p); setActiveTab("signos"); }} className="flex-1 bg-purple-600 text-white hover:bg-purple-700 border border-purple-700 py-2 rounded-xl font-medium text-xs text-center">
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
                     <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Realiza una búsqueda para cargar pacientes</td></tr>
                   ) : (
                     resultadosPacientes.map(p => (
                       <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                         <td className="px-6 py-4 text-slate-900 font-medium">{p.nombre_completo}</td>
                         <td className="px-6 py-4 text-slate-500">{p.curp}</td>
                         <td className="px-6 py-4 flex gap-3 justify-end">
                           <button onClick={() => { setPacienteSeleccionado(p); cargarHistorial(p.id); setActiveTab("historial"); }} className="text-purple-700 bg-purple-50 hover:bg-purple-100 font-medium text-xs border border-purple-200 px-3 py-1 rounded">Historial</button>
                           <button onClick={() => { setPacienteSeleccionado(p); setActiveTab("signos"); }} className="bg-purple-600 text-white hover:bg-purple-700 border border-purple-700 px-3 py-1 rounded font-medium text-xs">Capturar</button>
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
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800"><Activity className="text-purple-600"/> Constantes</h2>
             <form onSubmit={handleSignosSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
               <div>
                 <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">ID Paciente</label>
                 <input type="number" name="patientId" defaultValue={pacienteSeleccionado?.id || ""} required className="w-full max-w-xs bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div>
                   <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Presión Arterial</label>
                   <input type="text" name="presion" required placeholder="Ej: 120/80" className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Frec. Cardíaca</label>
                   <input type="number" name="frecuenciaCardiaca" required placeholder="LPM" className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Temp (°C)</label>
                   <input type="number" step="0.1" name="temperatura" required placeholder="Ej: 36.5" className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Observaciones</label>
                 <textarea name="observaciones" rows={3} className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl p-4 text-slate-900 outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium px-8 py-3 rounded-xl transition-colors">
                 Guardar Signos (Vía Admin)
               </button>
             </form>
           </section>
        )}

        {activeTab === "historial" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800"><FileText className="text-purple-600"/> Historial Clínico</h2>
             {!pacienteSeleccionado ? (
               <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm"><p className="text-slate-500 mb-4">Selecciona un paciente en Buscar.</p></div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Últimos Registros (vital_signs)</h3>
                   <div className="space-y-4">
                     {isPending ? <p className="text-slate-500 text-sm">Cargando...</p> : historialSignos.length === 0 ? <p className="text-slate-500 text-sm">Sin registros.</p> : (
                       historialSignos.map((s, idx) => (
                         <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                           <span className="text-slate-500 font-semibold">{new Date(s.created_at).toLocaleDateString()}</span>
                           <p className="text-slate-800 font-medium mt-1">PA: {s.presion} | FC: {s.frecuencia_cardiaca} | Temp: {s.temperatura}°C</p>
                           {s.observaciones && <p className="text-slate-600 italic mt-1">"{s.observaciones}"</p>}
                         </div>
                       ))
                     )}
                   </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Citas del Año</h3>
                   <div className="space-y-3">
                     {historialCitas.map((c, idx) => (
                       <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between">
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
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800"><Bluetooth className="text-purple-600"/> Enlace de Dispositivos Médicos</h2>
             
             <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 text-center shadow-sm space-y-6">
               <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-purple-50 rounded-full border border-purple-100">
                 <Bluetooth size={40} className="text-purple-600 animate-pulse" />
               </div>
               
               <div>
                 <h3 className="text-lg font-bold text-slate-800 mb-2">Sincronización de Constantes</h3>
                 <p className="text-slate-500 text-sm max-w-md mx-auto">
                   Vincula dispositivos médicos por Bluetooth LE para supervisar la captura remota de signos vitales.
                 </p>
               </div>

               <div id="bluetooth-status-admin" className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
                 Estado: Desconectado
               </div>

               <button 
                 onClick={conectarBluetooth}
                 className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-xl shadow-sm text-sm flex items-center justify-center gap-2 w-full sm:w-auto mx-auto transition-colors"
               >
                 <Bluetooth size={18} /> Buscar y Vincular Dispositivo
               </button>
             </div>
           </section>
        )}

        {activeTab === "enfermeras" && (
           <section className="animate-in fade-in duration-300">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800"><Users className="text-purple-600"/> Gestión de Personal de Enfermería</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                 <h3 className="text-lg font-bold mb-4 text-slate-900 border-b border-slate-100 pb-2">Registrar Nueva Enfermera</h3>
                 <form onSubmit={handleAltaEnfermera} className="space-y-5">
                   <div>
                     <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Nombre Completo</label>
                     <input type="text" name="nombre" required className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-slate-900" />
                   </div>
                   <div>
                     <label className="block text-xs uppercase font-semibold text-slate-600 mb-2">Correo Electrónico</label>
                     <input type="email" name="email" required className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-slate-900" />
                   </div>
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                     <div className="flex items-center justify-between mb-2">
                       <label className="text-sm font-medium text-slate-700">Generar contraseña aleatoria</label>
                       <button type="button" onClick={() => setPassAleatoria(!passAleatoria)} className={`w-12 h-6 rounded-full transition-colors relative ${passAleatoria ? 'bg-purple-600' : 'bg-slate-300'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${passAleatoria ? 'translate-x-7' : 'translate-x-1'}`}></div>
                       </button>
                     </div>
                     {!passAleatoria && (
                       <input type="password" name="password" required={!passAleatoria} placeholder="Contraseña manual..." className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-purple-500 text-slate-900 mt-3" />
                     )}
                   </div>
                   <button type="submit" disabled={isPending} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm">
                     {isPending ? "Registrando en BD..." : "Crear Cuenta"}
                   </button>
                 </form>
                 {passGeneradaVisual && (
                   <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-center">
                     <p className="text-purple-700 mb-1 font-semibold">Contraseña generada (Cópiala ahora):</p>
                     <p className="text-xl font-mono text-slate-900 font-bold tracking-widest">{passGeneradaVisual}</p>
                   </div>
                 )}
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit max-h-[600px] overflow-y-auto">
                 <h3 className="text-lg font-bold mb-4 text-slate-900 border-b border-slate-100 pb-2">Plantilla Activa ({listaEnfermeras.length})</h3>
                 <div className="space-y-3">
                    {listaEnfermeras.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No hay enfermeras registradas.</p> : (
                      listaEnfermeras.map((enf) => (
                        <div key={enf.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <div><p className="text-slate-900 text-sm font-bold">{enf.nombre_completo}</p><p className="text-slate-500 text-xs">{enf.email}</p></div>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">Activa</span>
                        </div>
                      ))
                    )}
                 </div>
               </div>
             </div>
           </section>
        )}

        {activeTab === "coadmins" && (
           <section className="animate-in fade-in duration-300 max-w-4xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800"><Shield className="text-purple-600"/> Co-Administradores</h2>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                {listaCoadmins.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No hay co-administradores registrados.</p> : (
                  listaCoadmins.map((admin) => (
                    <div key={admin.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">{admin.nombre_completo?.charAt(0) || "A"}</div>
                        <div><p className="text-slate-900 font-bold">{admin.nombre_completo}</p><p className="text-slate-500 text-xs">{admin.email}</p></div>
                      </div>
                    </div>
                  ))
                )}
             </div>
           </section>
        )}

        {activeTab === "seguridad" && (
           <section className="animate-in fade-in duration-300 max-w-2xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
               <Lock className="text-purple-600"/> Actualizar Contraseña Admin
             </h2>
             <form onSubmit={handleSeguridadSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Contraseña Actual</label>
                 <input type="password" name="passwordActual" required className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Nueva Contraseña</label>
                 <input type="password" name="passwordNueva" required className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <div>
                 <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2 font-semibold">Confirmar Nueva Contraseña</label>
                 <input type="password" name="passwordConfirmar" required className="w-full bg-slate-50 border border-slate-300 focus:border-purple-500 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm" />
               </div>
               <button type="submit" disabled={isPending} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm">
                 {isPending ? "Procesando..." : "Actualizar Contraseña"}
               </button>
             </form>
           </section>
        )}

      </main>
    </div>
  );
}
