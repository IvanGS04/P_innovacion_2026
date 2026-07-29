window.addEventListener("DOMContentLoaded", function () {
  const usuario = document.getElementById("usuario");
  const password = document.getElementById("password");
  const telefono = document.getElementById("telefono");
  const boton = document.getElementById("boton");
  const nombre = document.querySelector('[name="nombre"]');
  const apellidos = document.querySelector('[name="apellido_paterno"]');

  if (!boton) return;

  boton.addEventListener("click", async function () {
    const correo = usuario.value.trim();
    const pass = password.value.trim();
    const tel = telefono.value.trim();
    const nombreCompleto = [nombre?.value.trim(), apellidos?.value.trim()]
      .filter(Boolean)
      .join(" ");

    // Validamos los campos que el formulario necesita antes del registro.
    if (correo === "" || pass === "" || tel === "" || nombreCompleto === "") {
      alert("Rellena todos los campos");
      return;
    }

    // Mantenemos la regla institucional que ya tenia el proyecto.
    if (!correo.endsWith("@cecytea.edu.mx")) {
      alert("Solo se permiten correos con dominio @cecytea.edu.mx");
      return;
    }

    // Supabase exige contrasenas de al menos 6 caracteres para email/password.
    if (pass.length < 6) {
      alert("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    boton.disabled = true;
    boton.textContent = "Registrando...";

    try {
      // Registro real: Supabase crea el usuario y guarda datos extra en user_metadata.
      const { error } = await window.PlanixSupabase.auth.signUp({
        email: correo,
        password: pass,
        options: {
          data: {
            nombre: nombreCompleto,
            telefono: tel
          }
        }
      });

      if (error) {
        alert("No se pudo registrar: " + error.message);
        return;
      }

      alert("Usuario registrado correctamente");
      window.location.href = "index.html";
    } catch (error) {
      alert("No se pudo registrar. Revisa tu conexion e intenta de nuevo.");
    } finally {
      boton.disabled = false;
      boton.textContent = "Registrar";
    }
  });
});
