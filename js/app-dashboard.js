(function () {
  var getAll = StorageAPI.getAll;
  var saveAll = StorageAPI.saveAll;
  var createPlan = StorageAPI.createPlan;
  var deletePlan = StorageAPI.deletePlan;

  var fmtDate = Utils.fmtDate;
  var normalizeText = Utils.normalizeText;
  var uid = Utils.uid;

  var elList = document.querySelector("#list");
  var elEmpty = document.querySelector("#empty");
  var elQ = document.querySelector("#q");
  var elType = document.querySelector("#type");
  var elOrder = document.querySelector("#order");

  var cTotal = document.querySelector("#countTotal");
  var cParcial = document.querySelector("#countParcial");
  var cSemana = document.querySelector("#countSemana");

  function templateBase(tipo) {
    var now = Date.now();
    var plan = {
      id: uid(),
      tipo: tipo,
      docente: "",
      materia: "",
      grupo: "",
      periodo: (tipo === "semana" ? "Semana 1" : "Parcial 1"),
      proposito: "",
      aprendizajes: [],
      actividades: { inicio: [], desarrollo: [], cierre: [] },
      evaluacion: [],
      recursos: [],
      observaciones: "",
      createdAt: now,
      updatedAt: now,
    };

    if (tipo === "semana") {
      plan.proposito = "Lograr que el grupo alcance el objetivo de la semana.";
      plan.actividades.inicio = ["Pase de lista y encuadre", "Pregunta detonadora"];
      plan.actividades.desarrollo = ["Actividad principal guiada", "Trabajo en equipo / práctica"];
      plan.actividades.cierre = ["Conclusiones", "Ticket de salida / retroalimentación"];
      plan.evaluacion = ["Lista de cotejo (participación y evidencia)"];
      plan.recursos = ["Proyector / Pizarrón", "Material impreso / digital"];
    } else {
      plan.proposito = "Desarrollar los aprendizajes del parcial mediante actividades secuenciadas.";
      plan.aprendizajes = ["Aprendizaje esperado 1", "Aprendizaje esperado 2"];
      plan.actividades.desarrollo = ["Proyecto / secuencia didáctica del parcial (resumen)"];
      plan.evaluacion = ["Evidencia 1", "Evidencia 2", "Examen / rúbrica"];
      plan.recursos = ["Guía / Presentaciones", "Laboratorio / Internet"];
    }
    return plan;
  }

  function counts(plans) {
    var parcial = plans.filter(p => p.tipo === "parcial").length;
    var semana = plans.filter(p => p.tipo === "semana").length;
    cTotal.textContent = plans.length;
    cParcial.textContent = parcial;
    cSemana.textContent = semana;
  }

  function applyFilters(plans) {
    var q = normalizeText(elQ.value);
    var type = elType.value;

    var out = plans;

    if (type !== "all") out = out.filter(p => p.tipo === type);

    if (q) {
      out = out.filter(p => {
        var blob = normalizeText(
          (p.materia || "") +
          " " +
          (p.grupo || "") +
          " " +
          (p.docente || "") +
          " " +
          (p.periodo || "") +
          " " +
          (p.tipo || "")
        );
        return blob.includes(q);
      });
    }

    var order = elOrder.value;
    if (order === "new") out = out.sort((a, b) => b.createdAt - a.createdAt);
    if (order === "old") out = out.sort((a, b) => a.createdAt - b.createdAt);
    if (order === "az") out = out.sort((a, b) => (a.materia || "").localeCompare(b.materia || ""));

    return out;
  }

  function card(plan) {
    var tipoLabel = plan.tipo === "parcial" ? "Parcial" : "Semana";
    var meta = [
      plan.materia ? "Materia: " + plan.materia : "Materia: (sin definir)",
      plan.grupo ? "Grupo: " + plan.grupo : "Grupo: (sin definir)",
      plan.docente ? "Docente: " + plan.docente : "Docente: (sin definir)",
      "Periodo: " + (plan.periodo || "-"),
      "Creada: " + fmtDate(plan.createdAt),
    ].join(" • ");

    return `
      <div class="item">
        <div class="itemTop">
          <div>
            <p class="itemTitle">${tipoLabel} • ${plan.materia || "Sin materia"} (${plan.grupo || "Sin grupo"})</p>
            <div class="itemMeta">${meta}</div>
          </div>

          <div class="itemBtns">
            <a class="btn mini" href="./editor.html?id=${plan.id}">Editar</a>
            <button class="btn mini" data-pdf="${plan.id}">📄 PDF</button>
            <button class="btn mini" data-word="${plan.id}">📝 Word</button>
            <button class="btn mini danger" data-del="${plan.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    var plans = getAll();
    counts(plans);
    var visible = applyFilters(plans);
    elList.innerHTML = visible.map(card).join("");
    elEmpty.style.display = plans.length === 0 ? "block" : "none";
  }

  
  elList.addEventListener("click", function (e) {
    const btn = e.target;

    // PDF
   if (btn.dataset.pdf) {
  e.stopPropagation();

  const plan = StorageAPI.getById(btn.dataset.pdf);
  if (!plan) {
    alert("No se encontró la planeación");
    return;
  }

  Utils.downloadPDF(plan);
  return;
}

    // WORD
    if (btn.dataset.word) {
      e.stopPropagation();
      const plan = StorageAPI.getById(btn.dataset.word);
      if (plan) Utils.downloadWord(plan);
      return;
    }

    // ELIMINAR
    if (btn.dataset.del) {
      e.stopPropagation();
      const id = btn.dataset.del;

      Swal.fire({
        title: "¿Quieres eliminar esta planeación?",
        text: "No se podrá recuperar después",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
      }).then(result => {
        if (result.isConfirmed) {
          deletePlan(id);
          render();
          Swal.fire("Eliminada", "", "success");
        }
      });
    }
  });

  function onUseTemplate(e) {
    var t = e.target.dataset.template;
    if (!t) return;
    var plan = templateBase(t);
    createPlan(plan);
    location.href = "./editor.html?id=" + encodeURIComponent(plan.id);
  }

  document.querySelectorAll("[data-template]").forEach(btn =>
    btn.addEventListener("click", onUseTemplate)
  );

  document.querySelector("#btnExport").addEventListener("click", function () {
    var data = getAll();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "planeaciones.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  const fileInput = document.querySelector("#fileImport");

if (fileInput) {
  fileInput.addEventListener("change", function (e) {
    var f = e.target.files[0];
    if (!f) return;

    var reader = new FileReader();
    reader.onload = function () {
      var parsed = JSON.parse(reader.result);
      var current = getAll();
      var ids = new Set(current.map(p => p.id));

      parsed.forEach(p => {
        if (p.id && !ids.has(p.id)) current.push(p);
      });

      saveAll(current);
      render();
    };
    reader.readAsText(f);
  });
}

  [elQ, elType, elOrder].forEach(el => el.addEventListener("input", render));

  render();
})();
