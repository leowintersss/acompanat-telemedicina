"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

const sql = neon(process.env.DATABASE_URL!);

// a2) Cambiar contraseña
export async function cambiarPasswordPaciente(pacienteId: number, formData: FormData) {
  try {
    const actual = formData.get("passwordActual") as string;
    const nueva = formData.get("passwordNueva") as string;
    const confirmar = formData.get("passwordConfirmar") as string;

    if (nueva !== confirmar) {
      return { success: false, message: "Las contraseñas nuevas no coinciden." };
    }

    await sql`
      UPDATE patients 
      SET password_hash = ${nueva}
      WHERE id = ${pacienteId}
    `;

    return { success: true, message: "La contraseña se actualizó con éxito." };
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return { success: false, message: "Error al actualizar la contraseña." };
  }
}

// a3) Consultar citas futuras desde la BD Real
export async function obtenerCitasFuturas(pacienteId: number) {
  try {
    const citas = await sql`
      SELECT c.id, c.fecha_cita, c.tipo_cita, c.estado, n.nombre_completo as enfermera
      FROM citas c
      LEFT JOIN nurses n ON c.nurse_id = n.id
      WHERE c.patient_id = ${pacienteId} AND c.fecha_cita >= CURRENT_DATE
      ORDER BY c.fecha_cita ASC
      LIMIT 5
    `;
    return citas;
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
}


import { cookies } from 'next/headers';

export async function obtenerSesionPaciente() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_user");
    
    if (sessionCookie) {
      // Retorna el JSON extraído que usamos en el login
      return JSON.parse(sessionCookie.value);
    }
    return null;
  } catch (error) {
    console.error("Error al leer la sesión del paciente:", error);
    return null;
  }
}


export async function obtenerDatosPaciente(pacienteId: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Agregamos rfc, nss, domicilio y membresia a la consulta
    const res = await sql`
      SELECT nombre_completo, email, curp, sexo, fecha_nacimiento, tipo_sangre, telefono, rfc, nss, domicilio, membresia 
      FROM patients 
      WHERE id = ${pacienteId}
    `;
    
    if (res.length > 0) {
      const paciente = res[0];
      if (paciente.fecha_nacimiento instanceof Date) {
        paciente.fecha_nacimiento = paciente.fecha_nacimiento.toISOString().split('T')[0];
      }
      return paciente;
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo datos del paciente:", error);
    return null;
  }
}

export async function actualizarPerfilPaciente(pacienteId: number, formData: FormData) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Capturamos todos los campos del nuevo formulario
    const tipoSangre = formData.get("tipoSangre")?.toString() || null;
    const telefono = formData.get("telefono")?.toString() || null;
    const rfc = formData.get("rfc")?.toString() || null;
    const nss = formData.get("nss")?.toString() || null;
    const domicilio = formData.get("domicilio")?.toString() || null;

    // Actualizamos la base de datos
    await sql`
      UPDATE patients 
      SET 
        tipo_sangre = ${tipoSangre}, 
        telefono = ${telefono},
        rfc = ${rfc},
        nss = ${nss},
        domicilio = ${domicilio}
      WHERE id = ${pacienteId}
    `;

    return { success: true, message: "Perfil actualizado correctamente" };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return { success: false, message: "Hubo un error al actualizar los datos" };
  }
}