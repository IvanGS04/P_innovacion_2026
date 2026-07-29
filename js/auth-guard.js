window.addEventListener("DOMContentLoaded", async function () {
  // Protegemos pantallas privadas: si Supabase no tiene sesion activa, volvemos al login.
  const { data, error } = await window.PlanixSupabase.auth.getSession();

  if (error || !data.session) {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
    return;
  }

  // Conservamos esta bandera para codigo antiguo que todavia la usa como referencia visual.
  localStorage.setItem("loggedIn", "true");
});
