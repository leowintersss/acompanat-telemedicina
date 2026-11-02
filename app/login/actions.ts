"use server";

import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function loginPaciente(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
        const cookieStore = await cookies();
        
        const user = await sql`SELECT * FROM patients WHERE email = ${email}`;
        
        if (user.length > 0) {
            const pacienteEncontrado = user[0];
            
            if (pacienteEncontrado.password_hash === password || pacienteEncontrado.password === password) {
                
                // 1. Creamos el gafete (JSON) EXACTO que pide tu middleware
                const credencial = JSON.stringify({ 
                    id: pacienteEncontrado.id, 
                    role: "paciente",
                    nombre: pacienteEncontrado.nombre_completo 
                });
                
                // 2. Le ponemos el nombre EXACTO de la cookie: "session_user"
                cookieStore.set('session_user', credencial, { path: '/' });
                
                return { success: true, url: '/paciente' };
            } else {
                return { success: false, message: "La contraseña es incorrecta." };
            }
        }
        
        return { success: false, message: "Este correo no está registrado." };
        
    } catch (e: any) {
        console.error("Error SQL:", e.message || e);
        return { success: false, message: "Error interno en las tablas de la base de datos." };
    }
}
