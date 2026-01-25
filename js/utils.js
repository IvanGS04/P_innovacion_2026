(function () {

  function uid() {
    return "PLN-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function fmtDate(ts) {
    var d = new Date(ts);
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return (
      d.getFullYear() + "-" +
      pad(d.getMonth() + 1) + "-" +
      pad(d.getDate()) + " " +
      pad(d.getHours()) + ":" +
      pad(d.getMinutes())
    );
  }

  function getQueryParam(name) {
    var url = new URL(location.href);
    return url.searchParams.get(name);
  }

  function escapeHtml(str) {
    str = str == null ? "" : String(str);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeText(s) {
    return (s || "").toLowerCase().trim();
  }

  
  function list(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return "<p>(Sin información)</p>";
    }
    return "<ul>" + items.map(function (a) {
      return "<li>" + escapeHtml(a) + "</li>";
    }).join("") + "</ul>";
  }


  function downloadWord(plan) {
    if (!plan) return;

    var actividades = plan.actividades || { inicio: [], desarrollo: [], cierre: [] };

    var html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(plan.titulo || "Planeación")}</title>
</head>
<body>
  <h1>${escapeHtml(plan.titulo || "Planeación")}</h1>

  <p><b>Materia:</b> ${escapeHtml(plan.materia || "-")}</p>
  <p><b>Grupo:</b> ${escapeHtml(plan.grupo || "-")}</p>
  <p><b>Tipo:</b> ${escapeHtml(plan.tipo || "-")}</p>
  <p><b>Periodo:</b> ${escapeHtml(plan.periodo || "-")}</p>
  <hr>

  <h2>Propósito</h2>
  <p>${escapeHtml(plan.proposito || "(Sin propósito)")}</p>

  <h2>Aprendizajes esperados</h2>
  ${list(plan.aprendizajes)}

  <h2>Actividades</h2>

  <h3>Inicio</h3>
  ${list(actividades.inicio)}

  <h3>Desarrollo</h3>
  ${list(actividades.desarrollo)}

  <h3>Cierre</h3>
  ${list(actividades.cierre)}

  <h2>Evaluación</h2>
  ${list(plan.evaluacion)}

  <h2>Recursos</h2>
  ${list(plan.recursos)}

  <h2>Observaciones</h2>
  <p>${escapeHtml(plan.observaciones || "(Sin observaciones)")}</p>

  <p><small>Generado con Planeador CECYTEA</small></p>
</body>
</html>
`;

    var blob = new Blob(
      ["\ufeff", html],
      { type: "application/msword" }
    );

    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = (plan.titulo || "planeacion").replace(/\s+/g, "_") + ".doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }





 function downloadPDF(plan) {
  if (!plan) return;

  var actividades = plan.actividades || { inicio: [], desarrollo: [], cierre: [] };

 
  var container = document.createElement("div");
  container.style.background = "#ffffff";
  container.style.color = "#000000";
  container.style.padding = "30px";
  container.style.fontFamily = "Arial, Helvetica, sans-serif";
  container.style.fontSize = "12pt";
  container.style.lineHeight = "1.5";
  container.style.width = "210mm"; // A4

  container.innerHTML = `
    <h1 style="text-align:center;font-size:20pt;margin-bottom:20px;">
      ${escapeHtml(plan.titulo || "Planeación")}
    </h1>

    <p><b>Materia:</b> ${escapeHtml(plan.materia || "-")}</p>
    <p><b>Grupo:</b> ${escapeHtml(plan.grupo || "-")}</p>
    <p><b>Tipo:</b> ${escapeHtml(plan.tipo || "-")}</p>
    <p><b>Periodo:</b> ${escapeHtml(plan.periodo || "-")}</p>

    <hr style="margin:20px 0;border:1px solid #000"/>

    <h2 style="font-size:14pt;">Propósito</h2>
    <p>${escapeHtml(plan.proposito || "(Sin propósito)")}</p>

    <h2 style="font-size:14pt;">Aprendizajes esperados</h2>
    ${list(plan.aprendizajes)}

    <h2 style="font-size:14pt;">Actividades</h2>

    <h3>Inicio</h3>
    ${list(actividades.inicio)}

    <h3>Desarrollo</h3>
    ${list(actividades.desarrollo)}

    <h3>Cierre</h3>
    ${list(actividades.cierre)}

    <h2 style="font-size:14pt;">Evaluación</h2>
    ${list(plan.evaluacion)}

    <h2 style="font-size:14pt;">Recursos</h2>
    ${list(plan.recursos)}

    <p style="margin-top:40px;font-size:10pt;text-align:center;">
      Generado con Planeador CECYTEA
    </p>
  `;

  html2pdf()
    .from(container)
    .set({
      margin: 10,
      filename: (plan.titulo || "planeacion").replace(/\s+/g, "_") + ".pdf",
      html2canvas: {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    })
    .save();
}



 window.Utils = {
  uid,
  fmtDate,
  getQueryParam,
  escapeHtml,
  normalizeText,
  downloadWord,
  downloadPDF
};

})();
