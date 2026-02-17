window.addEventListener('DOMContentLoaded', function(){

    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    const btn = document.getElementById('button');

    btn.addEventListener('click', function(){

        const userData = localStorage.getItem('user');

        if(!userData){
            alert("No hay usuarios registrados");
            return;
        }

        const user = JSON.parse(userData);

        if(usuario.value.trim() === user.usuario &&
           password.value.trim() === user.password){

            localStorage.setItem("loggedIn", "true");
            window.location.href = "dashboard.html";

        } else {
            alert("Usuario o contraseña incorrectos");
        }

    });

});