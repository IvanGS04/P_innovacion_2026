window.addEventListener('DOMContentLoaded', function () {

    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    const btn = document.getElementById('button');

    if (btn) {
        btn.addEventListener('click', function () {

            const correo = usuario.value.trim();

       
            if (!correo.endsWith('@cecytea.edu.mx')) {
                alert("Solo se permite iniciar sesión con correos @cecytea.edu.mx");
                return;
            }

            const userData = localStorage.getItem('user');

            if (!userData) {
                alert("No hay usuarios registrados");
                return;
            }

            const user = JSON.parse(userData);

            if (correo === user.usuario &&
                password.value.trim() === user.password) {

                localStorage.setItem("loggedIn", "true");
                window.location.href = "dashboard.html";

            } else {
                alert("Usuario o contraseña incorrectos");
            }
        });
    }
});