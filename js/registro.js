window.addEventListener('DOMContentLoaded', function () {

    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    const telefono = document.getElementById('telefono');
    const boton = document.getElementById('boton');

    if (boton) {
        boton.addEventListener('click', function () {

            const correo = usuario.value.trim();

         
            if (correo === '' || password.value.trim() === '' || telefono.value.trim() === '') {
                alert("Rellena todos los campos");
                return;
            }

          
            if (!correo.endsWith('@cecytea.edu.mx')) {
                alert("Solo se permiten correos con dominio @cecytea.edu.mx");
                return;
            }

            const userData = {
                usuario: correo,
                password: password.value.trim(),
                telefono: telefono.value.trim()
            };

            localStorage.setItem('user', JSON.stringify(userData));
            alert("Usuario registrado correctamente");
            window.location.href = "index.html";
        });
    }
});