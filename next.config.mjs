/** @type {import('next').NextConfig} */
const nextConfig = {
  // La regla estricta que pide tu terminal para el emulador
  allowedDevOrigins: ["10.0.2.2", "10.0.2.2:3000"],
  
  // Mantenemos la regla estándar de Server Actions por compatibilidad
  serverActions: {
    allowedOrigins: ["10.0.2.2", "10.0.2.2:3000", "localhost:3000"],
  }
};

export default nextConfig;