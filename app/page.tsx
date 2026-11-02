import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* HEADER / NAVEGACIÓN SUPERIOR */}
      <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo-texto.png" 
              alt="AcompañaT Logo" 
              width={240} 
              height={120} 
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
              href="/registro" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Registro de Pacientes
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
                className="inline-flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-md transition-all hover:shadow-lg text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Ingresar al Sistema
              </Link>
              <Link 
                href="/registro" 
                className="inline-flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium px-8 py-3.5 rounded-xl transition-colors text-base"
              >
                Registrarse como Paciente
              </Link>
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
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Portal de Pacientes</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Consulta tus citas programadas, edita tu información complementaria y revisa tu perfil médico en línea.
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Link 
                  href="/login" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all text-center block shadow-sm"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/registro" 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-xl text-xs transition-colors text-center block"
                >
                  ¿Nuevo paciente? Regístrate aquí
                </Link>
              </div>
            </div>

            {/* Tarjeta Enfermería */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Estación de Enfermería</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Gestión de signos vitales, enlace de dispositivos médicos por Bluetooth y control directo de la atención.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link 
                  href="/login-corporativo" 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl text-sm transition-all text-center block shadow-sm"
                >
                  Acceso Enfermería
                </Link>
              </div>
            </div>

            {/* Tarjeta Administrador */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Panel Administrativo</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Supervisión general de usuarios, control de citas, flujos del sistema y administración de privilegios.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link 
                  href="/login-corporativo" 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl text-sm transition-all text-center block shadow-sm"
                >
                  Acceso Administrador
                </Link>
              </div>
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