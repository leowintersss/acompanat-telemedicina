import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* HEADER / NAVEGACIÓN SUPERIOR */}
      <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Aquí puedes ajustar la ruta si tu archivo se llama diferente en /public */}
            <Image 
              src="/logo-texto.png" 
              alt="AcompañaT Logo" 
              width={160} 
              height={40} 
              className="object-contain"
              priority 
            />
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors px-4 py-2"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/login" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md"
            >
              Acceso a Portal
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION PRINCIPAL */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Columna de Texto */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Plataforma de Telemedicina Avanzada
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Cuidado médico inteligente, <span className="text-emerald-600">cerca de ti.</span>
            </h1>
            
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Conectamos pacientes, personal de enfermería y administración en un entorno seguro, sincronizado y optimizado para el seguimiento clínico en tiempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/login" 
                className="inline-flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-md transition-all hover:shadow-lg text-base"
              >
                Ingresar al Sistema
              </Link>
              <a 
                href="#accesos" 
                className="inline-flex justify-center items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                Conocer Perfiles
              </a>
            </div>
          </div>

          {/* Columna Visual / Logotipo Completo */}
          <div className="flex justify-center items-center bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>
            <div className="text-center space-y-6 z-10">
              <Image 
                src="/logo-completo.png" 
                alt="AcompañaT Isotipo y Logotipo" 
                width={260} 
                height={260} 
                className="object-contain mx-auto drop-shadow-md"
              />
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                Seguridad • Conectividad • Bienestar
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* SECCIÓN DE TARJETAS DE ACCESO RÁPIDO */}
      <section id="accesos" className="bg-slate-50 border-t border-slate-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Portales Especializados</h2>
            <p className="text-slate-600 text-sm">Acceso centralizado y seguro según el rol operativo dentro de la plataforma.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta Paciente */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl mb-6">
                  P
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Portal de Pacientes</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Consulta tus citas programadas, edita tu información complementaria (tipo de sangre, NSS, domicilio) y revisa tu perfil médico.
                </p>
              </div>
              <Link 
                href="/login" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm inline-flex items-center gap-1 group"
              >
                Acceder como Paciente <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Tarjeta Enfermería */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl mb-6">
                  E
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Estación de Enfermería</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Gestión de signos vitales, enlace de dispositivos médicos por Bluetooth y control directo de la atención al paciente.
                </p>
              </div>
              <Link 
                href="/login" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm inline-flex items-center gap-1 group"
              >
                Acceder a Enfermería <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Tarjeta Administrador */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl mb-6">
                  A
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Panel Administrativo</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Supervisión general de usuarios, control de citas, flujos del sistema y administración de privilegios en la base de datos.
                </p>
              </div>
              <Link 
                href="/login" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm inline-flex items-center gap-1 group"
              >
                Acceder como Admin <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AcompañaT. Todos los derechos reservados.</p>
          <p className="text-emerald-600 font-medium">Plataforma de Telemedicina Conectada</p>
        </div>
      </footer>

    </div>
  );
}