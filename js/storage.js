(function(){
  var KEY = "planeador_cecytea_v1";
  function safeParse(json, fallback){
    try { return JSON.parse(json); } catch (e){ return fallback; }
  }
  function getAll(){
    var raw = localStorage.getItem(KEY);
    var parsed = safeParse(raw, []);
    return Array.isArray(parsed) ? parsed : [];
  }
  function saveAll(plans){
    var safe = Array.isArray(plans) ? plans : [];
    localStorage.setItem(KEY, JSON.stringify(safe));
  }
  function createPlan(plan){
    var plans = getAll();
    plans.unshift(plan);
    saveAll(plans);
    return plan;
  }
  function updatePlan(id, patch){
    var plans = getAll();
    var idx = plans.findIndex(function(p){ return p.id === id; });
    if (idx === -1) return null;
    plans[idx] = Object.assign({}, plans[idx], patch, { updatedAt: Date.now() });
    saveAll(plans);
    return plans[idx];
  }
  function deletePlan(id){
    var plans = getAll().filter(function(p){ return p.id !== id; });
    saveAll(plans);
  }
  function getById(id){
    return getAll().find(function(p){ return p.id === id; }) || null;
  }
  window.StorageAPI = { getAll:getAll, saveAll:saveAll, createPlan:createPlan, updatePlan:updatePlan, deletePlan:deletePlan, getById:getById, KEY: KEY };
})();