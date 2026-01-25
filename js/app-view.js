(function () {
  var getById = StorageAPI.getById;
  var getQueryParam = Utils.getQueryParam;
  var escapeHtml = Utils.escapeHtml;
  var fmtDate = Utils.fmtDate;

  var id = getQueryParam("id");
  var doc = document.querySelector("#doc");
  var btnEdit = document.querySelector("#btnEdit");
  var btnPrint = document.querySelector("#btnPrint");

  function li(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return '<p class="small">(Sin información)</p>';
    }
    return (
      "<ul>" +
      items.map(function (x) {
        return "<li>" + escapeHtml(x) + "</li>";
      }).join("") +
      "</ul>"
    );
  }

  function render(plan) {
    var tipoLabel =
      plan.tipo === "parcial"
        ? "Planeación por Parcial"
        : "Planeación Semanal";

    var actividades = plan.actividades || {
      inicio: [],
      desarrollo: [],
      cierre: [],
    };

    var meta = `
      <div class="block">
        <div class="meta">
          <b>Tipo:</b> ${escapeHtml(tipoLabel)}<br>
          <b>Materia:</b> ${escapeHtml(plan.materia || "-")} &nbsp;|&nbsp;
          <b>Grupo:</b> ${escapeHtml(plan.grupo || "-")} &nbsp;|&nbsp;
          <b>Periodo:</b> ${escapeHtml(plan.periodo || "-")}<br>
          <b>Docente:</b> ${escapeHtml(plan.docente || "-")}<br>
          <b>Creada:</b> ${escapeHtml(fmtDate(plan.createdAt))} &nbsp;|&nbsp;
          <b>Actualizada:</b> ${escapeHtml(fmtDate(plan.updatedAt))}
        </div>
      </div>
    `;

    doc.innerHTML = `
      <h1>${escapeHtml(tipoLabel)}</h1>
      ${meta}

      <div class="block">
        <h2>Propósito / Intención didáctica</h2>
        <p>${escapeHtml(plan.proposito || "(Sin propósito)")}</p>
      </div>

      <div class="block">
        <h2>Aprendizajes esperados</h2>
        ${li(plan.aprendizajes)}
      </div>

      <div class="block">
        <h2>Actividades</h2>

        <h3>Inicio</h3>
        ${li(actividades.inicio)}

        <h3>Desarrollo</h3>
        ${li(actividades.desarrollo)}

        <h3>Cierre</h3>
        ${li(actividades.cierre)}
      </div>

      <div class="block">
        <h2>Evaluación (evidencias / instrumentos)</h2>
        ${li(plan.evaluacion)}
      </div>

      <div class="block">
        <h2>Recursos</h2>
        ${li(plan.recursos)}
      </div>

      <div class="block">
        <h2>Observaciones / Adecuaciones</h2>
        <p>${escapeHtml(plan.observaciones || "(Sin observaciones)")}</p>
      </div>

      <p class="small">
        Generado con Planeador – Prototipo LocalStorage
      </p>
    `;
  }

  function init() {
    if (!id) {
      doc.innerHTML =
        "<p>No se proporcionó ID. Vuelve al dashboard.</p>";
      return;
    }

    var plan = getById(id);
    if (!plan) {
      doc.innerHTML =
        "<p>No se encontró la planeación. Vuelve al dashboard.</p>";
      return;
    }

    if (btnEdit) {
      btnEdit.href =
        "./editor.html?id=" + encodeURIComponent(id);
    }

    render(plan);
  }

  if (btnPrint) {
    btnPrint.addEventListener("click", function () {
      window.print();
    });
  }

  init();


  var params = new URLSearchParams(location.search);
  if (params.get("print") === "true") {
    setTimeout(function () {
      window.print();
    }, 500);
  }
})();
