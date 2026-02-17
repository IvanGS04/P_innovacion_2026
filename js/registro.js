window.addEventListener('DOMContentLoaded', function(){
    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    const telefono = document.getElementById('telefono');
    const boton = document.getElementById('boton');

    boton.addEventListener('click', function(){
        const userData = {
        usuario: usuario.value.trim(),
        password: password.value.trim(),
        telefono: telefono.value.trim()
        };

        if(userData.usuario === '' ||
            userData.password === '' ||
            userData.telefono === ''){
            alert("Rellena todos los campos");
            return;
        }

        localStorage.setItem('user', JSON.stringify(userData));

        alert("Usuario registrado");
        window.location.href = "index.html";
    });
});