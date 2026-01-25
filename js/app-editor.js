(function(){
  var getById = StorageAPI.getById;
  var createPlan = StorageAPI.createPlan;
  var updatePlan = StorageAPI.updatePlan;

  var getQueryParam = Utils.getQueryParam;
  var uid = Utils.uid;

  var id = getQueryParam("id");

  var elTipo = document.querySelector("#tipo");
  var elPeriodo = document.querySelector("#periodo");
  var elMateria = document.querySelector("#materia");
  var elGrupo = document.querySelector("#grupo");
  var elDocente = document.querySelector("#docente");
  var elProposito = document.querySelector("#proposito");
  var elAprendizajes = document.querySelector("#aprendizajes");
  var elObservaciones = document.querySelector("#observaciones");
  var elEvaluacion = document.querySelector("#evaluacion");
  var elRecursos = document.querySelector("#recursos");

  var elInicio = document.querySelector("#inicio");
  var elDesarrollo = document.querySelector("#desarrollo");
  var elCierre = document.querySelector("#cierre");

  var btnSave = document.querySelector("#btnSave");
  var btnView = document.querySelector("#btnView");

  var current = null;

  function linesToArray(text){
    return (text||"").split("\n").map(function(s){ return s.trim(); }).filter(Boolean);
  }
  function arrayToLines(arr){
    return (arr || []).join("\n");
  }
  function readForm(){
    var tipo = elTipo.value;
    return {
      tipo: tipo,
      periodo: elPeriodo.value.trim(),
      materia: elMateria.value.trim(),
      grupo: elGrupo.value.trim(),
      docente: elDocente.value.trim(),
      proposito: elProposito.value.trim(),
      aprendizajes: linesToArray(elAprendizajes.value),
      actividades: {
        inicio: linesToArray(elInicio.value),
        desarrollo: linesToArray(elDesarrollo.value),
        cierre: linesToArray(elCierre.value),
      },
      evaluacion: linesToArray(elEvaluacion.value),
      recursos: linesToArray(elRecursos.value),
      observaciones: elObservaciones.value.trim(),
    };
  }
  function fillForm(plan){
    elTipo.value = plan.tipo || "semana";
    elPeriodo.value = plan.periodo || "";
    elMateria.value = plan.materia || "";
    elGrupo.value = plan.grupo || "";
    elDocente.value = plan.docente || "";
    elProposito.value = plan.proposito || "";
    elAprendizajes.value = arrayToLines(plan.aprendizajes);
    elInicio.value = arrayToLines(plan.actividades && plan.actividades.inicio);
    elDesarrollo.value = arrayToLines(plan.actividades && plan.actividades.desarrollo);
    elCierre.value = arrayToLines(plan.actividades && plan.actividades.cierre);
    elEvaluacion.value = arrayToLines(plan.evaluacion);
    elRecursos.value = arrayToLines(plan.recursos);
    elObservaciones.value = plan.observaciones || "";
  }
  function ensureDefaults(p){
    var now = Date.now();
    return {
      id: p.id || uid(),
      tipo: p.tipo || "semana",
      docente: p.docente || "",
      materia: p.materia || "",
      grupo: p.grupo || "",
      periodo: p.periodo || (p.tipo === "parcial" ? "Parcial 1" : "Semana 1"),
      proposito: p.proposito || "",
      aprendizajes: p.aprendizajes || [],
      actividades: p.actividades || { inicio: [], desarrollo: [], cierre: [] },
      evaluacion: p.evaluacion || [],
      recursos: p.recursos || [],
      observaciones: p.observaciones || "",
      createdAt: p.createdAt || now,
      updatedAt: p.updatedAt || now,
    };
  }
  function setViewLink(planId){
    btnView.href = "./view.html?id="+encodeURIComponent(planId);
  }
  function init(){
    if (id){
      var plan = getById(id);
      if (!plan){
           Swal.fire({
  icon: "error",
  title: "Oops...",
  theme: 'dark',
  text: "No se econtro la planeación",
  footer: '<a href="#">Quieres volver a intentarlo?</a>'
});
        location.href = "./dashboard.html";
        return;
      }
      current = ensureDefaults(plan);
      fillForm(current);
      setViewLink(current.id);
    } else {
      current = ensureDefaults({ tipo: "semana" });
      createPlan(current);
      fillForm(current);
      setViewLink(current.id);
      var url = new URL(location.href);
      url.searchParams.set("id", current.id);
      history.replaceState({}, "", url);
    }
  }
  function validate(data){
    var missing = [];
    if (!data.materia) missing.push("Materia");
    if (!data.grupo) missing.push("Grupo");
    if (!data.periodo) missing.push("Periodo");
    if (!data.docente) missing.push("Docente");
    return missing;
  }

  btnSave.addEventListener("click", function(){
    var patch = readForm();
    var miss = validate(patch);
    if (miss.length){
      var ok = confirm("Faltan: "+miss.join(", ")+".\n¿Guardar de todos modos?");
      if (!ok) return;
    }
    var updated = updatePlan(current.id, patch);
    if (!updated){
         Swal.fire({
  icon: "error",
  title: "Oops...",
  theme: 'dark',
  text: "Error al guardar",
  footer: '<a href="#">Quieres volver a intentarlo?</a>'
});
      return;
    }
    current = updated;
    setViewLink(current.id);
      Swal.fire({
  position: "top-end",
  theme: 'dark',
  icon: "success",
  title: "Tu trabajo ha sido guardado",
  showConfirmButton: false,
  timer: 1500
});
  });

  
  //IA 
  var btnIA = document.getElementById("btnIA");
  var aiTitulo = document.getElementById("aiTitulo");
  var aiDescripcion = document.getElementById("aiDescripcion");
  var aiEstilo = document.getElementById("aiEstilo");
  var aiStatus = document.getElementById("aiStatus");

  function showAI(msg, isError){
    if(!aiStatus) return;
    aiStatus.style.display = "block";
    aiStatus.innerHTML = msg;
    aiStatus.style.borderColor = isError ? "rgba(255,90,122,.6)" : "rgba(56,211,159,.6)";
    aiStatus.style.background = isError ? "rgba(255,90,122,.10)" : "rgba(56,211,159,.10)";
  }

  function splitKeywords(text){
    return (text || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  function pick(n, arr){
    var out = [];
    for (var i=0; i<Math.min(n, arr.length); i++) out.push(arr[i]);
    return out;
  }

  function uniq(arr){
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function generarLocal(payload){
    var tipo = payload.tipo || "semana";
    var materia = (payload.materia || "la materia").trim();
    var grupo = (payload.grupo || "el grupo").trim();
    var titulo = (payload.titulo || "el tema").trim();
    var desc = (payload.descripcion || "").trim();
    var estilo = payload.estilo || "practico";

    var kws = uniq(splitKeywords(titulo + " " + desc));
    var focus = kws.slice(0, 6).join(", ");

    var tono = {
      practico: {
        intro: "de forma práctica y guiada",
        verbs: ["aplicar", "resolver", "practicar", "construir", "probar"]
      },
      formal: {
        intro: "con rigor y claridad",
        verbs: ["analizar", "identificar", "explicar", "argumentar", "demostrar"]
      },
      dinamico: {
        intro: "de manera dinámica y participativa",
        verbs: ["explorar", "crear", "colaborar", "presentar", "mejorar"]
      }
    }[estilo] || { intro:"de forma práctica", verbs:["aplicar","practicar","resolver"] };

    function AE(action, obj){
      return action.charAt(0).toUpperCase()+action.slice(1) + " " + obj;
    }

    var aprendizajes = [];
    if (kws.length){
      aprendizajes.push(AE(tono.verbs[0], `conceptos clave de ${titulo}`));
      aprendizajes.push(AE(tono.verbs[1] || "aplicar", `procedimientos relacionados con ${titulo}`));
      if (kws.length > 2) aprendizajes.push(AE(tono.verbs[2] || "practicar", `habilidades: ${pick(3,kws).join(", ")}`));
    } else {
      aprendizajes = [
        AE(tono.verbs[0], `conceptos clave de ${titulo}`),
        AE(tono.verbs[1] || "aplicar", `el tema en ejercicios y ejemplos`)
      ];
    }

    var proposito = `Que ${grupo} comprenda ${titulo} ${tono.intro} en ${materia}, y produzca una evidencia verificable.`;
    if (desc) proposito += ` Enfoque: ${desc}.`;


    var inicio = [
      "Pase de lista y encuadre del objetivo del día",
      `Pregunta detonadora relacionada con ${titulo}`,
      "Recuperación de conocimientos previos (lluvia de ideas)"
    ];

    var desarrollo = [
      `Explicación breve + ejemplo(s) sobre ${titulo}`,
      "Actividad guiada paso a paso (individual o por parejas)",
      "Actividad práctica (ejercicios / problema / mini-proyecto)",
      "Acompañamiento y retroalimentación durante la práctica"
    ];

    var cierre = [
      "Socialización de resultados (2–3 equipos comparten)",
      "Conclusiones y aclaración de dudas",
      "Ticket de salida: 3 preguntas o mini-ejercicio"
    ];

  
    if (tipo === "parcial"){
      inicio = [
        "Presentación de propósito del parcial y criterios de evaluación",
        "Diagnóstico rápido (sondeo / cuestionario breve)",
        `Acuerdos del proyecto/secuencia del parcial: ${titulo}`
      ];
      desarrollo = [
        "Secuencia didáctica por bloques (teoría breve + práctica)",
        "Evidencias parciales (entregables por semana)",
        "Proyecto integrador del parcial (producto final)",
        "Retroalimentación y mejora iterativa"
      ];
      cierre = [
        "Cierre del parcial: presentación de evidencias",
        "Autoevaluación y coevaluación (si aplica)",
        "Registro de aprendizajes y áreas de mejora"
      ];
    }


    var m = materia.toLowerCase();
    var recursos = ["Pizarrón", "Proyector", "Cuaderno/hojas"];
    var evaluacion = ["Lista de cotejo (participación y evidencia)"];

    if (m.includes("program") || m.includes("informat") || m.includes("tic") || m.includes("comput")){
      recursos = ["Computadora", "Editor/IDE", "Internet (si aplica)", "Proyector"];
      evaluacion = ["Ejercicio práctico", "Lista de cotejo", "Rúbrica (si hay proyecto)"];
      desarrollo[2] = "Actividad práctica en computadora (ejercicios / mini-proyecto)";
    } else if (m.includes("mat") || m.includes("cálcul") || m.includes("algebra")){
      recursos = ["Pizarrón", "Marcadores", "Calculadora (si aplica)", "Guía de ejercicios"];
      evaluacion = ["Ejercicios resueltos", "Lista de cotejo", "Quiz corto"];
    } else if (m.includes("españ") || m.includes("lect") || m.includes("liter")){
      recursos = ["Lectura impresa/digital", "Marcatextos", "Pizarrón"];
      evaluacion = ["Producto escrito", "Rúbrica", "Participación en discusión"];
      desarrollo[2] = "Actividad de lectura/análisis + producto escrito breve";
    } else if (m.includes("ingl") || m.includes("english")){
      recursos = ["Audio/video", "Pizarrón", "Fichas de vocabulario"];
      evaluacion = ["Speaking/participación", "Producto escrito corto", "Lista de cotejo"];
    }

    // Afinar con keywords
    if (kws.includes("proyecto") || kws.includes("proyectos")){
      evaluacion = uniq(["Rúbrica de proyecto", "Evidencias parciales", "Presentación final"].concat(evaluacion));
    }
    if (kws.includes("examen") || kws.includes("evaluación") || kws.includes("evaluacion")){
      evaluacion = uniq(evaluacion.concat(["Examen / instrumento escrito"]));
    }

    return {
      proposito: proposito,
      aprendizajes: uniq(aprendizajes),
      actividades: {
        inicio: inicio,
        desarrollo: desarrollo,
        cierre: cierre
      },
      evaluacion: uniq(evaluacion),
      recursos: uniq(recursos),
      observaciones: "Adecuaciones: considerar ritmos de aprendizaje, apoyos visuales y ejemplos contextualizados."
    };
  }

  function fillFromLocal(plan){
    if (!plan) return;
    if (plan.proposito) elProposito.value = plan.proposito;
    if (Array.isArray(plan.aprendizajes)) elAprendizajes.value = plan.aprendizajes.join("\n");
    if (plan.actividades){
      if (Array.isArray(plan.actividades.inicio)) elInicio.value = plan.actividades.inicio.join("\n");
      if (Array.isArray(plan.actividades.desarrollo)) elDesarrollo.value = plan.actividades.desarrollo.join("\n");
      if (Array.isArray(plan.actividades.cierre)) elCierre.value = plan.actividades.cierre.join("\n");
    }
    if (Array.isArray(plan.evaluacion)) elEvaluacion.value = plan.evaluacion.join("\n");
    if (Array.isArray(plan.recursos)) elRecursos.value = plan.recursos.join("\n");
    if (plan.observaciones && !elObservaciones.value.trim()) elObservaciones.value = plan.observaciones;
  }

  function onGenerarClick(){
    var titulo = (aiTitulo && aiTitulo.value || "").trim();
    var descripcion = (aiDescripcion && aiDescripcion.value || "").trim();

    if(!titulo || !descripcion){
      showAI("Escribe <b>Tema/Título</b> y <b>Descripción</b> para generar.", true);
      return;
    }

    var plan = generarLocal({
      tipo: elTipo.value,
      materia: elMateria.value,
      grupo: elGrupo.value,
      titulo: titulo,
      descripcion: descripcion,
      estilo: (aiEstilo && aiEstilo.value) || "practico"
    });

    fillFromLocal(plan);
    showAI("Revisa, ajusta y luego presiona <b>Guardar</b>.", false);
  }

  if(btnIA){ btnIA.addEventListener("click", onGenerarClick); }

  init();
})();