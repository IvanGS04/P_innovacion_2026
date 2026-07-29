window.addEventListener("DOMContentLoaded", function () {
  const usuario = document.getElementById("usuario");
  const password = document.getElementById("password");
  const btn = document.getElementById("btnLogin");

  if (!btn) return;

  btn.addEventListener("click", async function () {
    const correo = usuario.value.trim();
    const pass = password.value.trim();

    // Validamos los campos antes de llamar a Supabase.
    if (correo === "" || pass === "") {
      alert("Rellena todos los campos");
      return;
    }

    // Mantenemos la regla institucional que ya tenia el proyecto.
    if (!correo.endsWith("@cecytea.edu.mx")) {
      alert("Solo se permite iniciar sesion con correos @cecytea.edu.mx");
      return;
    }

    // Evitamos doble clic mientras Supabase valida las credenciales.
    btn.disabled = true;
    btn.textContent = "Iniciando...";

    try {
      // Login real: Supabase compara el correo y la contrasena en su sistema de Auth.
      const { error } = await window.PlanixSupabase.auth.signInWithPassword({
        email: correo,
        password: pass
      });

      if (error) {
        // Mostramos el mensaje real de Supabase para detectar si falta confirmar correo
        // o si el usuario ya existia con una contrasena distinta.
        alert("No se pudo iniciar sesion: " + error.message);
        return;
      }

      // Conservamos esta bandera para pantallas antiguas que todavia la consultan.
      localStorage.setItem("loggedIn", "true");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("No se pudo iniciar sesion. Revisa tu conexion e intenta de nuevo.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Iniciar sesion";
    }
  });
});
