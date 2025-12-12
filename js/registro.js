document.addEventListener("DOMContentLoaded", () => {
  FormUtils.addSharedAnimations();

  const form = document.getElementById("registerForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const name = document.getElementById("name");
  const apellidoP = document.getElementById("ApellidoP");
  const apellidoM = document.getElementById("ApellidoM");

  const toggle = document.getElementById("passwordToggle");
  FormUtils.setupFloatingLabels(form);
  FormUtils.setupPasswordToggle(password, toggle);

  function validateTextField(input, fieldId, message) {
    const v = (input.value || "").trim();
    if (!v) {
      FormUtils.showError(fieldId, message);
      return false;
    }
    FormUtils.clearError(fieldId);
    FormUtils.showSuccess(fieldId);
    return true;
  }

  function validateEmailField() {
    const result = FormUtils.validateInstitutionalEmail(email.value);
    if (!result.isValid) {
      FormUtils.showError("email", result.message);
      return false;
    }
    FormUtils.clearError("email");
    FormUtils.showSuccess("email");
    return true;
  }

  function validatePasswordField() {
    const result = FormUtils.validatePassword(password.value);
    if (!result.isValid) {
      FormUtils.showError("password", result.message);
      return false;
    }
    FormUtils.clearError("password");
    FormUtils.showSuccess("password");
    return true;
  }

  // Validación en vivo (opcional pero se siente pro)
  email.addEventListener("blur", validateEmailField);
  password.addEventListener("blur", validatePasswordField);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok =
      validateTextField(name, "name", "Nombre es requerido") &
      validateTextField(apellidoP, "ApellidoP", "Apellido paterno es requerido") &
      validateTextField(apellidoM, "ApellidoM", "Apellido materno es requerido") &
      validateEmailField() &
      validatePasswordField();

    if (!ok) {
      FormUtils.showNotification("Revisa los campos marcados.", "error", form);
      return;
    }

    // Aquí “registras”. Como no tienes backend, puedes simular:
    FormUtils.showNotification("Registro exitoso. Ahora inicia sesión.", "success", form);

    // Si quieres guardar en localStorage (demo):
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
      name: name.value.trim(),
      apellidoP: apellidoP.value.trim(),
      apellidoM: apellidoM.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value // (en real: NUNCA guardar así, se hashea en backend)
    });
    localStorage.setItem("users", JSON.stringify(users));

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  });
});
