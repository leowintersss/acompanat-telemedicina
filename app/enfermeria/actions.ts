"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';


const sql = neon(process.env.DATABASE_URL!);

// b3) Buscar pacientes en la tabla 'patients'
export async function buscarPacientes(query: string) {
  try {
    const search = `%${query}%`;
    const resultados = await sql`
      SELECT id, nombre_completo, curp, email 
      FROM patients 
      WHERE nombre_completo ILIKE ${search} OR curp ILIKE ${search} OR email ILIKE ${search}
      LIMIT 10
    `;
    return resultados;
  } catch (error) {
    console.error("Error al buscar pacientes:", error);
    return [];
  }
}

// b5 y b6) Registrar signos en la tabla 'vital_signs'
export async function registrarSignosEnfermeria(data: {
  patientId: number;
  presion: string;
  frecuenciaCardiaca: number;
  temperatura: number;
  observaciones: string;
}) {
  try {
    await sql`
      INSERT INTO vital_signs (
        patient_id, presion, frecuencia_cardiaca, temperatura, observaciones
      ) VALUES (
        ${data.patientId}, ${data.presion}, ${data.frecuenciaCardiaca}, 
        ${data.temperatura}, ${data.observaciones || null}
      )
    `;
    revalidatePath("/enfermeria");
    return { success: true, message: "Signos vitales registrados en el expediente." };
  } catch (error) {
    console.error("Error BD Signos:", error);
    return { success: false, message: "Error al registrar signos vitales." };
  }
}

// b4) Obtener Historial Clínico
export async function obtenerHistorialPaciente(pacienteId: number) {
  try {
    const historial = await sql`
      SELECT * FROM vital_signs 
      WHERE patient_id = ${pacienteId}
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    return historial;
  } catch (error) {
    return [];
  }
}

export async function obtenerCitasPaciente(pacienteId: number) {
  try {
    const citas = await sql`
      SELECT id, fecha_cita, tipo_cita as tipo, estado 
      FROM citas 
      WHERE patient_id = ${pacienteId}
      ORDER BY fecha_cita DESC
    `;
    
    // Formateamos la fecha para que la interfaz roja y morada la lean directamente
    return citas.map(c => ({
      id: c.id,
      fecha: new Date(c.fecha_cita).toLocaleString('es-MX', { 
        timeZone: 'America/Mexico_City',
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      tipo: c.tipo,
      estado: c.estado
    }));
  } catch (error) {
    console.error("Error BD Citas:", error);
    return [];
  }
}

export async function obtenerSesionEnfermera() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_user");
    if (sessionCookie) {
      return JSON.parse(sessionCookie.value);
    }
    return null;
  } catch (error) {
    console.error("Error al leer sesión de enfermera:", error);
    return null;
  }
}