'use server'

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL="postgresql://neondb_owner:npg_Ur4c6uKOFVaS@ep-crimson-dream-b49s2cbz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
// Paso 1: Registro básico con contraseña de 8+ caracteres y selectores independientes
export async function registrarPaso1(datos: {
  nombre: string
  email: string
  password: string
  dia: string
  mes: string
  anio: string
  sexo: string
  curp: string
}) {
  try {
    const emailLimPIO = datos.email.trim().toLowerCase()

    if (datos.password.length < 8) {
      return { success: false, message: 'La contraseña debe tener al menos 8 caracteres.' }
    }

    if (!datos.sexo) {
      return { success: false, message: 'Por favor seleccione una opción de sexo.' }
    }

    // Armar fecha de nacimiento YYYY-MM-DD
    const fechaNacimiento = `${datos.anio}-${datos.mes.padStart(2, '0')}-${datos.dia.padStart(2, '0')}`

    // Insertar paciente básico
    const resultado = await sql`
      INSERT INTO patients (nombre_completo, email, password_hash, fecha_nacimiento, sexo, curp)
      VALUES (${datos.nombre}, ${emailLimPIO}, ${datos.password}, ${fechaNacimiento}, ${datos.sexo}, ${datos.curp.toUpperCase()})
      RETURNING id, email
    `

    return { success: true, message: 'Registro básico exitoso', email: resultado[0].email }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error al registrar: ${err.message || 'Correo o CURP ya duplicados'}` }
  }
}

// Paso 2: Guardar datos complementarios
export async function guardarDatosComplementarios(email: string, datos: {
  rfc: string
  telefono: string
  nss: string
  domicilio: string
  tipoSangre: string
  membresia: string
}) {
  try {
    await sql`
      UPDATE patients 
      SET rfc = ${datos.rfc.toUpperCase()},
          telefono = ${datos.telefono},
          nss = ${datos.nss},
          domicilio = ${datos.domicilio},
          tipo_sangre = ${datos.tipoSangre},
          membresia = ${datos.membresia}
      WHERE email = ${email}
    `
    return { success: true, message: 'Guardado exitoso' }
  } catch (error: unknown) {
    const err = error as { message?: string }
    return { success: false, message: `Error al guardar datos: ${err.message || 'Desconocido'}` }
  }
}