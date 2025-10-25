import { db } from "../db/config";
import { Users } from "../db/schema";
import { eq } from "drizzle-orm";

const email = process.argv[2];

if (!email) {
  console.error("❌ Por favor proporciona un email");
  console.log("Uso: pnpm tsx scripts/make-admin.ts tu-email@ejemplo.com");
  process.exit(1);
}

async function makeAdmin() {
  try {
    // Buscar el usuario por email
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1);

    if (!user) {
      console.error(`❌ No se encontró un usuario con el email: ${email}`);
      process.exit(1);
    }

    // Actualizar el rol a admin
    await db
      .update(Users)
      .set({ role: "admin" } as any)
      .where(eq(Users.email, email));

    console.log("✅ Usuario actualizado exitosamente");
    console.log("📧 Email:", email);
    console.log("👤 Nombre:", user.name || "Sin nombre");
    console.log("🔑 Nuevo rol: admin");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al actualizar el usuario:", error);
    process.exit(1);
  }
}

makeAdmin();
