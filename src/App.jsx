import { useState, useEffect } from "react";

const EMAILJS_SERVICE = "service_v4pl56m";
const EMAILJS_TEMPLATE = "template_4srgsrz";
const EMAILJS_KEY = "ztjDqVGeC_Gq8smwK";

const BASE_QUESTIONS = [
  { id:"nombre_empresa", module:"Tu empresa", text:"¿Cuál es el nombre de tu empresa?", hint:"Esto nos ayuda a personalizar tu reporte.", type:"text", placeholder:"Ej: Distribuidora López, Clínica San Juan..." },
  { id:"nombre_contacto", module:"Tu empresa", text:"¿Cuál es tu nombre y cargo?", hint:"Para saber con quién estamos hablando.", type:"text", placeholder:"Ej: María López, Gerente de Operaciones..." },
  { id:"correo_contacto", module:"Tu empresa", text:"¿Cuál es tu correo electrónico?", hint:"Te enviaremos una copia de tu reporte de diagnóstico.", type:"text", placeholder:"Ej: maria@empresa.com" },
  { id:"sector", module:"Tu empresa", text:"¿En qué sector opera tu empresa?", hint:"Selecciona el que más se acerque.", type:"options", options:["Retail / Comercio","Manufactura / Producción","Servicios profesionales","Logística / Transporte","Salud / Clínicas","Educación / Capacitación","Finanzas / Seguros","Construcción / Inmobiliaria","Recursos Humanos / Temporal","Restaurantes / Alimentos","Tecnología / Software","Agropecuario / Agroindustria","Turismo / Hotelería","Medios / Marketing","Comercio exterior","Energía / Minería","ONG / Sector público","Otro"] },
  { id:"tamaño", module:"Tu empresa", text:"¿Cuántas personas trabajan en la empresa?", type:"options", options:["1-5","6-15","16-50","51-150","150+"] },
  { id:"antiguedad", module:"Tu empresa", text:"¿Cuántos años lleva operando?", type:"options", options:["Menos de 1 año","1-3 años","3-10 años","Más de 10 años"] },
  { id:"clientes", module:"Tu empresa", text:"¿A quién le vende principalmente?", type:"options", options:["A otras empresas (B2B)","A consumidores finales (B2C)","A ambos","Al gobierno / sector público"] },
  { id:"tiempo_manual", module:"Operación", text:"¿Cuántas horas semanales dedica su equipo a tareas repetitivas que podrían automatizarse?", hint:"Copiar datos, hacer reportes, enviar correos de seguimiento, llenar formularios.", type:"options", options:["Menos de 5 horas","5-15 horas","15-30 horas","Más de 30 horas","No lo sé"] },
  { id:"errores_frecuentes", module:"Operación", text:"¿Con qué frecuencia ocurren errores operativos como datos incorrectos o información perdida?", type:"options", options:["Rara vez","1-2 por semana","Varios por semana","Todo el tiempo"] },
  { id:"crecimiento", module:"Operación", text:"Si su empresa duplicara operaciones mañana, ¿qué pasaría?", hint:"Revela si sus procesos están listos para crecer.", type:"options", options:["Colapsaría -- no tenemos capacidad","Tendríamos que contratar mucha más gente","Podríamos manejarlo con esfuerzo extra","Lo manejaríamos sin problema"] },
  { id:"areas_problematicas", module:"Dolores", text:"¿En cuáles áreas hay más ineficiencia o pérdida de tiempo?", hint:"Selecciona todas las que apliquen.", type:"multi", options:["Conseguir y calificar nuevos clientes","Seguimiento a cotizaciones y propuestas","Procesamiento de pedidos o servicios","Coordinación interna entre áreas","Facturación, cobros y pagos","Compras, proveedores e inventario","Contratación y onboarding de personal","Atención y soporte al cliente","Generación de reportes e indicadores","Aprobaciones y autorizaciones","Cumplimiento legal o regulatorio","Programación de citas, turnos o entregas","Gestión de proyectos y tareas","Comunicación postventa con clientes","Nómina y pagos a empleados"] },
  { id:"donde_pierde_dinero", module:"Dolores", text:"¿En cuál situación pierde más dinero o deja de ganar?", type:"options", options:["Prospectos que no se convierten por falta de seguimiento","Errores que generan retrabajos","Tiempo de empleados en tareas sin valor","Clientes que se van por mala atención","Compras de emergencia por mala planificación","Decisiones tardías por falta de información","No lo sabemos"] },
  { id:"herramientas_actuales", module:"Tecnología", text:"¿Qué herramientas usa actualmente?", hint:"Selecciona todo lo que usa.", type:"multi", options:["Excel / Google Sheets","WhatsApp para coordinar trabajo","Correo electrónico como sistema principal","Software contable (Siigo, Alegra)","Software de nómina (Nominapp, Helisa)","CRM (HubSpot, Zoho, Salesforce)","ERP (SAP, Odoo, Oracle)","E-commerce (Shopify, Mercado Libre)","Herramientas de gestión (Trello, Notion, Asana)","Firma digital (DocuSign)","BI / Reportes (Power BI, Tableau)","Ninguna -- todo manual o en papel"] },
  { id:"nivel_integracion", module:"Tecnología", text:"¿Las herramientas que usa están conectadas entre sí?", hint:"Ej: cuando entra una venta, ¿se actualiza automáticamente la contabilidad?", type:"options", options:["No usamos herramientas digitales","No -- cada herramienta por su lado, copiamos datos manualmente","Algunas integradas pero la mayoría no","La mayoría están bien integradas"] },
  { id:"donde_vive_info", module:"Tecnología", text:"¿Dónde vive la información crítica del negocio?", hint:"Clientes, ventas, contratos, inventario.", type:"multi", options:["En la cabeza de personas clave","En Excel o Google Sheets","En carpetas de correo","En WhatsApp","En un sistema centralizado","En papel","En varias partes -- no hay un lugar único"] },
  { id:"dependencia_personas", module:"Personas", text:"¿Qué tan dependiente es la operación de personas específicas?", hint:"Si una persona clave se va esta semana, ¿qué pasa?", type:"options", options:["Algo se paraliza -- solo esa persona sabe hacerlo","Hay retrasos importantes pero se puede manejar","Los procesos están documentados y alguien puede cubrir","No depende de nadie específico"] },
  { id:"documentacion", module:"Personas", text:"¿Los procesos de la empresa están documentados?", type:"options", options:["No hay nada documentado -- todo en la memoria del equipo","Algunas cosas escritas pero nadie las usa","Documentación parcial en algunas áreas","La mayoría de procesos bien documentados y seguidos"] },
  { id:"resistencia", module:"Personas", text:"¿Cómo reaccionaría el equipo ante nuevas tecnologías o cambios?", type:"options", options:["Muy resistentes -- prefieren hacer las cosas como siempre","Neutrales -- adoptan si ven el beneficio","Abiertos -- están frustrados con los procesos actuales","Proactivos -- ellos mismos piden mejoras"] },
  { id:"objetivo_principal", module:"Visión", text:"¿Cuál es el objetivo principal que buscarías con la automatización?", type:"options", options:["Reducir costos operativos","Crecer sin contratar más personal","Mejorar la experiencia del cliente","Tener más control y visibilidad del negocio","Reducir errores y retrabajos","Liberar tiempo para actividades estratégicas","Cumplir regulaciones del sector"] },
  { id:"urgencia", module:"Visión", text:"¿Qué tan urgente es mejorar los procesos?", type:"options", options:["Solo explorando -- no hay urgencia","Lo necesitamos en los próximos 6 meses","Lo necesitamos en 2-3 meses","Es urgente -- está afectando el negocio ahora mismo"] },
  { id:"dolor_principal", module:"Visión", text:"En sus propias palabras: ¿cuál es el problema que más le quita el sueño en la operación hoy?", hint:"Esta es la pregunta más importante. Sea específico.", type:"text", placeholder:"Ej: pasamos demasiado tiempo haciendo seguimiento manual a clientes y se nos escapan oportunidades..." },
];

function buildFlow(a) {
  return [...BASE_QUESTIONS];
}

function generateReport(answers) {
  const h = answers.herramientas_actuales || [];
  const areas = answers.areas_problematicas || [];
  const horas = answers.tiempo_manual || "";
  const integracion = answers.nivel_integracion || "";
  const infoVive = answers.donde_vive_info || [];
  const errores = answers.errores_frecuentes || "";
  const crecimiento = answers.crecimiento || "";
  const dependencia = answers.dependencia_personas || "";
  const documentacion = answers.documentacion || "";
  const factors = [];
  let base = 30;

  if (horas.includes("Más de 30")) { base+=22; factors.push({label:"Más de 30 horas semanales en tareas manuales",pts:22}); }
  else if (horas.includes("15-30")) { base+=15; factors.push({label:"15-30 horas semanales en tareas manuales",pts:15}); }
  else if (horas.includes("5-15")) { base+=8; factors.push({label:"5-15 horas semanales en tareas manuales",pts:8}); }
  if (h.includes("Ninguna -- todo manual o en papel")) { base+=18; factors.push({label:"Opera sin herramientas digitales",pts:18}); }
  else if (!h.some(x=>x.includes("ERP")||x.includes("CRM"))) { base+=9; factors.push({label:"Sin ERP ni CRM",pts:9}); }
  if (integracion.includes("por su lado")) { base+=10; factors.push({label:"Herramientas desconectadas entre sí",pts:10}); }
  else if (integracion.includes("Algunas")) { base+=5; factors.push({label:"Integración parcial entre herramientas",pts:5}); }
  if (infoVive.includes("En la cabeza de personas clave")) { base+=7; factors.push({label:"Información crítica en la memoria de personas",pts:7}); }
  if (infoVive.includes("En varias partes -- no hay un lugar único")) { base+=5; factors.push({label:"Información dispersa sin lugar centralizado",pts:5}); }
  if (errores.includes("Todo el tiempo")) { base+=8; factors.push({label:"Errores operativos constantes",pts:8}); }
  else if (errores.includes("Varios")) { base+=5; factors.push({label:"Errores operativos frecuentes",pts:5}); }
  if (crecimiento.includes("Colapsaría")) { base+=8; factors.push({label:"Procesos no escalan con el crecimiento",pts:8}); }
  else if (crecimiento.includes("contratar")) { base+=5; factors.push({label:"Crecimiento requiere mucho personal",pts:5}); }
  if (dependencia.includes("paraliza")) { base+=6; factors.push({label:"Operación dependiente de personas clave",pts:6}); }
  if (documentacion.includes("No hay nada")) { base+=5; factors.push({label:"Procesos sin documentar",pts:5}); }

  const puntaje = Math.min(base, 97);
  const nivel = puntaje>=82?"Crítico":puntaje>=65?"Alto":puntaje>=45?"Medio":"Bajo";
  const ahorro = horas.includes("Más de 30")?"20-40 horas":horas.includes("15-30")?"10-20 horas":horas.includes("5-15")?"4-10 horas":"2-6 horas";
  const nivelTexto = nivel==="Crítico"?"muy alto":nivel==="Alto"?"alto":nivel==="Medio"?"moderado":"inicial";
  const resumen = `Con base en el diagnóstico, la empresa tiene un potencial ${nivelTexto} de automatización. ${h.includes("Ninguna -- todo manual o en papel")?"Actualmente opera casi completamente manual -- oportunidad enorme para ganar eficiencia con inversiones pequeñas.":integracion.includes("por su lado")?"Aunque usa herramientas digitales, no están conectadas, generando trabajo duplicado y errores.":"Tiene una base digital que puede potenciarse conectando sistemas y automatizando los flujos más repetitivos."} ${areas.length>=4?"Se identificaron múltiples áreas con fricciones que están afectando la productividad.":"Se identificaron oportunidades concretas en áreas clave."}`;

  const opLib = {
    "Conseguir y calificar nuevos clientes":{titulo:"Captación y calificación automática de leads",descripcion:"Formularios inteligentes que califican al prospecto automáticamente y notifican al equipo solo con los listos. Herramientas: HubSpot gratuito, Typeform + Zapier.",impacto:"Alto",tiempo:"2-3 semanas",roi:"70% menos tiempo de calificación, mayor tasa de cierre"},
    "Seguimiento a cotizaciones y propuestas":{titulo:"Seguimiento automático de cotizaciones",descripcion:"Recordatorios automáticos por WhatsApp o email a prospectos sin respuesta, con escalamiento al vendedor. Herramientas: HubSpot, Zoho CRM.",impacto:"Alto",tiempo:"1-2 semanas",roi:"Recuperación del 15-25% de ventas perdidas por olvido"},
    "Facturación, cobros y pagos":{titulo:"Automatización de facturación y cobros",descripcion:"Facturas automáticas al cerrar venta, recordatorios de pago por WhatsApp, conciliación automática. Herramientas: Siigo o Alegra + Zapier + WhatsApp Business.",impacto:"Alto",tiempo:"2-4 semanas",roi:"60% menos tiempo en facturación, reducción de cartera vencida"},
    "Contratación y onboarding de personal":{titulo:"Flujo automatizado de contratación",descripcion:"Filtrado de CVs, agendamiento de entrevistas, firma digital y onboarding por WhatsApp. Herramientas: Typeform + Airtable + DocuSign + Zapier.",impacto:"Alto",tiempo:"3-5 semanas",roi:"50-60% menos tiempo administrativo por contratación"},
    "Atención y soporte al cliente":{titulo:"Chatbot de atención 24/7",descripcion:"Bot de WhatsApp que responde preguntas frecuentes, agenda citas y escala a humano cuando es necesario. Herramientas: ManyChat, Respond.io.",impacto:"Alto",tiempo:"2-3 semanas",roi:"Atención 24/7, 40-60% menos consultas repetitivas al equipo"},
    "Generación de reportes e indicadores":{titulo:"Dashboard automático en tiempo real",descripcion:"Dashboard conectado a tus fuentes de datos que se actualiza solo. Herramientas: Google Looker Studio (gratuito) o Power BI.",impacto:"Medio",tiempo:"1-3 semanas",roi:"3-10 horas semanales menos en preparación de reportes"},
    "Coordinación interna entre áreas":{titulo:"Central de comunicación y tareas",descripcion:"Herramienta con asignación automática de tareas y notificaciones, eliminando el caos de WhatsApp interno. Herramientas: Slack, ClickUp, Monday.",impacto:"Medio",tiempo:"1-2 semanas",roi:"Menos tiempo perdido buscando información y confirmando avances"},
    "Compras, proveedores e inventario":{titulo:"Control de inventario automatizado",descripcion:"Alertas de stock mínimo, órdenes de compra automáticas. Herramientas: Google Sheets + Apps Script o Odoo.",impacto:"Medio",tiempo:"2-4 semanas",roi:"Eliminación de quiebres de stock y compras de emergencia"},
    "Procesamiento de pedidos o servicios":{titulo:"Flujo automatizado de pedidos",descripcion:"Desde que entra el pedido: registro automático, asignación, notificaciones al cliente y factura al cerrar. Herramientas: Airtable + Zapier.",impacto:"Alto",tiempo:"3-4 semanas",roi:"Menos errores en pedidos, más capacidad sin contratar"},
    "Aprobaciones y autorizaciones":{titulo:"Flujos de aprobación digitales",descripcion:"Aprobaciones con un clic desde el celular, con trazabilidad completa. Herramientas: Monday.com, Jotform.",impacto:"Medio",tiempo:"1 semana",roi:"Decisiones 3-5x más rápidas con trazabilidad total"},
    "Programación de citas, turnos o entregas":{titulo:"Agendamiento automático",descripcion:"Sistema de reservas online con confirmaciones y recordatorios automáticos. Herramientas: Calendly o Google Calendar + Zapier.",impacto:"Medio",tiempo:"1-2 semanas",roi:"Menos mensajes de ida y vuelta, reducción de no-shows"},
    "Comunicación postventa con clientes":{titulo:"Automatización de postventa",descripcion:"Encuesta de satisfacción, reactivación de inactivos, comunicación de nuevos productos. Herramientas: WhatsApp Business API + Mailchimp.",impacto:"Medio",tiempo:"2-3 semanas",roi:"Más retención y ventas recurrentes sin esfuerzo"},
    "Gestión de proyectos y tareas":{titulo:"Sistema centralizado de proyectos",descripcion:"Tareas, responsables, fechas y avances en un solo lugar con alertas automáticas. Herramientas: ClickUp, Asana o Notion.",impacto:"Medio",tiempo:"1-2 semanas",roi:"Menos tareas perdidas y retrasos"},
    "Cumplimiento legal o regulatorio":{titulo:"Gestión automatizada de contratos",descripcion:"Generación de contratos, firma digital, alertas de vencimiento y archivo centralizado. Herramientas: DocuSign + Google Drive.",impacto:"Medio",tiempo:"2-3 semanas",roi:"Reducción de riesgos legales y tiempo documental"},
    "Nómina y pagos a empleados":{titulo:"Automatización de nómina",descripcion:"Cálculo automático, generación de desprendibles y pagos programados integrados a contabilidad. Herramientas: Nominapp o Helisa + Siigo.",impacto:"Alto",tiempo:"2-3 semanas",roi:"70% menos tiempo en procesamiento de nómina"},
  };

  const oportunidades = [];
  for (const area of areas) {
    if (opLib[area] && oportunidades.length < 5) oportunidades.push(opLib[area]);
  }
  if (oportunidades.length < 3) {
    const fallbacks = [opLib["Generación de reportes e indicadores"],opLib["Coordinación interna entre áreas"],opLib["Comunicación postventa con clientes"]];
    for (const f of fallbacks) { if (oportunidades.length>=3) break; if(f&&!oportunidades.find(o=>o.titulo===f.titulo)) oportunidades.push(f); }
  }

  let quick_win = "Crear un formulario de Google conectado a una hoja de cálculo para centralizar la información más dispersa. Se hace en pocas horas y da visibilidad inmediata.";
  if (areas.includes("Facturación, cobros y pagos")) quick_win="Configurar mensajes automáticos de cobro en WhatsApp Business para facturas vencidas. Gratis, se configura en 2-3 horas.";
  else if (areas.includes("Seguimiento a cotizaciones y propuestas")) quick_win="Crear un pipeline en HubSpot gratuito. En medio día el equipo tiene visibilidad de todas las cotizaciones.";
  else if (areas.includes("Atención y soporte al cliente")) quick_win="Configurar respuestas automáticas en WhatsApp Business para las preguntas más frecuentes. Gratis, 1 hora de configuración.";

  const riesgos = [];
  if (dependencia.includes("paraliza")) riesgos.push("Alta dependencia de personas clave. Antes de automatizar, documentar cómo funciona el proceso con quien lo conoce.");
  if (documentacion.includes("No hay nada")) riesgos.push("Sin procesos documentados es difícil automatizar con precisión. El primer paso es mapear el proceso actual.");
  if ((answers.resistencia||"").includes("resistentes")) riesgos.push("La resistencia del equipo es el obstáculo más común. Involucrarlos desde el diseño y mostrar beneficios concretos para ellos.");
  if (integracion.includes("por su lado")) riesgos.push("Herramientas desconectadas requerirán conectores como Zapier o Make. Este costo debe incluirse en la planeación.");
  if (!riesgos.length) riesgos.push("La empresa tiene buena base para automatizar. El principal riesgo es querer hacerlo todo a la vez -- empezar con un proceso, medir, y escalar.");

  const siguiente_paso = `Agendar una sesión de trabajo de 2 horas para mapear en detalle el proceso de "${(answers.dolor_principal||"su operación principal").slice(0,60)}...". Con ese mapa se diseña la automatización correcta y se define el cronograma.`;
  return {puntaje, nivel, resumen, ahorro_estimado:ahorro, oportunidades, quick_win, riesgos:riesgos.join(" "), siguiente_paso, factors};
}

async function sendEmail(answers, report) {
  const ops = report.oportunidades.map((o,i) => (i+1)+". "+o.titulo+" ("+o.impacto+") -- "+o.tiempo).join("\n");
  const respuestas = Object.entries(answers).map(([k,v]) => k+": "+(Array.isArray(v)?v.join(", "):v)).join("\n");
  try {
    await fetch("https://formspree.io/f/xojrzlvv", {
      method: "POST",
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      body: JSON.stringify({
        empresa: answers.nombre_empresa || "Sin nombre",
        contacto: answers.nombre_contacto || "Sin contacto",
        sector: answers.sector || "N/A",
        tamaño: answers.tamaño || "N/A",
        puntaje: String(report.puntaje)+" / 100 -- "+report.nivel,
        dolor_principal: answers.dolor_principal || "No especificado",
        quick_win: report.quick_win,
        oportunidades: ops,
        todas_las_respuestas: respuestas,
        _replyto: answers.correo_contacto || "",
        email: answers.correo_contacto || "",
      })
    });
  } catch(e) {
    console.error("Formspree error:", e);
  }
}


export default function App() {
  const [view, setView] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flow, setFlow] = useState(() => buildFlow({}));
  const [multiSelected, setMultiSelected] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [report, setReport] = useState(null);
  const [dots, setDots] = useState("");
  const [history, setHistory] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [emailSent, setEmailSent] = useState(false);



  useEffect(() => {
    if (view === "loading") {
      const t = setInterval(() => setDots(d => d.length>=3?"":d+"."), 380);
      const done = setTimeout(async () => {
        const r = generateReport(answers);
        setReport(r);
        await sendEmail(answers, r);
        setEmailSent(true);
        setView("report");
      }, 2400);
      return () => { clearInterval(t); clearTimeout(done); };
    }
  }, [view]);

  const question = flow[qIndex];
  const totalQ = flow.length;
  const modules = [...new Set(flow.map(q => q.module))];
  const currentModule = question?.module;
  const progress = totalQ > 0 ? ((qIndex+1)/totalQ)*100 : 0;

  const advance = (newAnswers) => {
    setHistory(h => [...h, {answers, qIndex, flow, multiSelected, textInput}]);
    const nextIdx = qIndex + 1;
    if (nextIdx < flow.length) { setQIndex(nextIdx); }
    else { setAnswers(newAnswers); setView("loading"); }
    setMultiSelected([]); setTextInput("");
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length-1];
    setHistory(h => h.slice(0,-1));
    setAnswers(prev.answers);
    setQIndex(prev.qIndex);
    setFlow(prev.flow);
    const prevQ = prev.flow[prev.qIndex];
    if (prevQ) {
      const prevAns = prev.answers[prevQ.id];
      if (prevQ.type==="multi") setMultiSelected(prevAns||[]);
      else if (prevQ.type==="text") setTextInput(prevAns||"");
      else { setMultiSelected([]); setTextInput(""); }
    }
  };

  const handleOption = (opt) => {
    const na = {...answers, [question.id]:opt};
    setAnswers(na);
    advance(na);
  };
  const confirmMulti = (skip=false) => {
    if (!skip && !multiSelected.length) return;
    const na = {...answers, [question.id]:multiSelected};
    setAnswers(na);
    advance(na);
  };
  const confirmText = () => {
    if (!textInput.trim()) return;
    const na = {...answers, [question.id]:textInput};
    setAnswers(na);
    advance(na);
  };
  const restart = () => {
    setView("intro"); setQIndex(0); setAnswers({}); setFlow(buildFlow({}));
    setMultiSelected([]); setTextInput(""); setReport(null); setHistory([]);
    setShowBreakdown(false); setEmailSent(false);
  };

  const ic = i => i==="Alto"?"#00ff87":i==="Medio"?"#ffd166":"#888";
  const nc = n => n==="Crítico"?"#ff6b6b":n==="Alto"?"#00ff87":n==="Medio"?"#ffd166":"#888";

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",color:"#f0ede8",fontFamily:"DM Mono,Courier New,monospace",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .fade{animation:fadeUp 0.28s ease forwards}
        .btn-opt{background:transparent;border:1px solid #222;color:#bbb;padding:13px 18px;text-align:left;cursor:pointer;font-family:'DM Mono',monospace;font-size:13px;transition:all 0.14s;border-radius:2px;line-height:1.5;width:100%}
        .btn-opt:hover,.btn-opt.sel{border-color:#00ff87;color:#00ff87;background:rgba(0,255,135,0.07)}
        .btn-p{background:#00ff87;color:#0a0a0a;border:none;padding:13px 28px;cursor:pointer;font-family:'DM Mono',monospace;font-size:13px;font-weight:500;letter-spacing:.05em;border-radius:2px;transition:opacity 0.14s}
        .btn-p:hover{opacity:.85}.btn-p:disabled{opacity:.25;cursor:default}
        .btn-ghost{background:transparent;border:1px solid #2a2a2a;color:#555;padding:10px 16px;cursor:pointer;font-family:'DM Mono',monospace;font-size:12px;border-radius:2px;transition:all 0.14s}
        .btn-ghost:hover{border-color:#444;color:#888}
        .btn-back{background:transparent;border:none;color:#444;padding:8px 0;cursor:pointer;font-family:'DM Mono',monospace;font-size:12px;transition:color 0.14s}
        .btn-back:hover{color:#888}
        .btn-wa{background:#25D366;color:#fff;border:none;padding:13px 24px;cursor:pointer;font-family:'DM Mono',monospace;font-size:13px;font-weight:500;border-radius:2px;transition:opacity 0.14s;text-decoration:none;display:inline-block}
        .btn-wa:hover{opacity:.85}
        textarea{background:#111;border:1px solid #222;color:#f0ede8;font-family:'DM Mono',monospace;font-size:13px;padding:14px;width:100%;resize:none;border-radius:2px;outline:none;line-height:1.7}
        textarea:focus{border-color:#00ff87}
        .card{background:#111;border:1px solid #1c1c1c;border-radius:3px;padding:18px 20px}
        .tag{display:inline-block;padding:3px 9px;border-radius:2px;font-size:11px;letter-spacing:.07em;font-weight:500}
        .bar{height:3px;background:#1e1e1e;border-radius:2px;overflow:hidden;margin-top:10px}
        .fill{height:100%;background:linear-gradient(90deg,#00ff87,#00d4ff);border-radius:2px;transition:width 1.2s ease}
        .brow{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #1a1a1a;font-size:11px}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0a0a0a}::-webkit-scrollbar-thumb{background:#222}
      `}</style>

      <div style={{width:"100%",maxWidth:580}}>

        {/* Header */}
        <div style={{marginBottom:28,borderBottom:"1px solid #181818",paddingBottom:18}}>
          <div style={{fontSize:10,letterSpacing:".22em",color:"#444",marginBottom:5}}>DIAGNÓSTICO GRATUITO</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:".08em",lineHeight:1}}>
            AUTOMA<br/><span style={{color:"#00ff87",fontSize:18,letterSpacing:".15em"}}>AUTOMATIZACIÓN EMPRESARIAL</span>
          </div>
        </div>

        {/* INTRO */}
        {view==="intro" && (
          <div className="fade">
            <p style={{fontSize:13,color:"#777",lineHeight:1.9,marginBottom:24}}>Muchas empresas pierden horas cada semana en tareas que podrían hacerse solas. Este diagnóstico identifica exactamente dónde están esas oportunidades -- y qué hacer primero.</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:26}}>
              {["Preguntas que se adaptan a tu sector y respuestas","Cubre cualquier industria y tamaño de empresa","Reporte inmediato con oportunidades concretas y ROI","Quick win implementable esta misma semana"].map(t=>(
                <div key={t} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:13,color:"#888"}}>
                  <span style={{color:"#00ff87",fontSize:9,marginTop:4,flexShrink:0}}>></span>{t}
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:26}}>
              {modules.map((m,i)=>(
                <div key={m} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 14px",background:"#111",border:"1px solid #181818",borderRadius:2}}>
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,color:"#2a2a2a",minWidth:16}}>{i+1}</span>
                  <span style={{fontSize:12,color:"#666"}}>{m}</span>
                </div>
              ))}
            </div>
            <button className="btn-p" onClick={()=>setView("quiz")}>INICIAR DIAGNÓSTICO -></button>
          </div>
        )}

        {/* QUIZ */}
        {view==="quiz" && question && (
          <div key={question.id} className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <button className="btn-back" onClick={history.length>0?goBack:()=>setView("intro")}><- {history.length>0?"Volver":"Inicio"}</button>
              <span style={{fontSize:10,color:"#333"}}>{qIndex+1} / {totalQ}</span>
            </div>
            <div style={{height:2,background:"#1a1a1a",borderRadius:2,overflow:"hidden",marginBottom:18}}>
              <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#00ff87,#00d4ff)",transition:"width .4s ease",borderRadius:2}}/>
            </div>
            <div style={{display:"flex",gap:4,marginBottom:20,flexWrap:"wrap"}}>
              {modules.map(m=>{
                const mQs=flow.filter(q=>q.module===m);
                const firstIdx=flow.findIndex(q=>q.module===m);
                const done=qIndex>firstIdx+mQs.length-1;
                const active=m===currentModule;
                return <span key={m} style={{fontSize:10,padding:"3px 8px",borderRadius:2,background:active?"rgba(0,255,135,0.08)":"transparent",color:done?"#00ff87":active?"#00ff87":"#2a2a2a",border:`1px solid ${active?"#00ff8733":"#1a1a1a"}`}}>{done?"v ":""}{m}</span>;
              })}
            </div>

            <h2 style={{fontSize:15,fontWeight:400,lineHeight:1.7,marginBottom:question.hint?8:18,color:"#e8e5e0"}}>{question.text}</h2>
            {question.hint && <p style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:18,fontStyle:"italic"}}>{question.hint}</p>}

            {question.type==="options" && (
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {question.options.map(opt=>(
                  <button key={opt} className={`btn-opt${answers[question.id]===opt?" sel":""}`} onClick={()=>handleOption(opt)}>{opt}</button>
                ))}
              </div>
            )}

            {question.type==="multi" && (
              <div>
                <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
                  {question.options.map(opt=>(
                    <button key={opt} className={`btn-opt${multiSelected.includes(opt)?" sel":""}`} onClick={()=>setMultiSelected(p=>p.includes(opt)?p.filter(o=>o!==opt):[...p,opt])}>
                      <span style={{marginRight:9,opacity:multiSelected.includes(opt)?1:0.2}}>v</span>{opt}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn-p" onClick={()=>confirmMulti(false)} disabled={!multiSelected.length}>CONTINUAR {multiSelected.length>0?`(${multiSelected.length})`:""} -></button>
                  <button className="btn-ghost" onClick={()=>confirmMulti(true)}>Ninguna aplica</button>
                </div>
              </div>
            )}

            {question.type==="text" && (
              <div>
                <textarea rows={5} placeholder={question.placeholder} value={textInput} onChange={e=>setTextInput(e.target.value)} style={{marginBottom:14}}/>
                <button className="btn-p" onClick={confirmText} disabled={!textInput.trim()}>GENERAR REPORTE -></button>
              </div>
            )}
          </div>
        )}

        {/* LOADING */}
        {view==="loading" && (
          <div className="fade" style={{textAlign:"center",padding:"70px 0"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:".12em",color:"#00ff87",marginBottom:14,animation:"pulse 1.2s ease infinite"}}>ANALIZANDO{dots}</div>
            <div style={{fontSize:11,color:"#444"}}>Generando tu reporte personalizado</div>
          </div>
        )}

        {/* REPORT */}
        {view==="report" && report && (
          <div className="fade" style={{paddingBottom:40}}>

            {/* Score */}
            <div className="card" style={{marginBottom:12,borderColor:"#00ff8720"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:10,color:"#444",letterSpacing:".14em",marginBottom:4}}>POTENCIAL DE AUTOMATIZACIÓN</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:56,color:"#00ff87",lineHeight:1}}>{report.puntaje}</span>
                    <span style={{fontSize:22,color:"#2a2a2a"}}>/100</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <span className="tag" style={{background:`${nc(report.nivel)}15`,color:nc(report.nivel),border:`1px solid ${nc(report.nivel)}35`,display:"block",marginBottom:7}}>{report.nivel}</span>
                  <div style={{fontSize:11,color:"#555"}}>~{report.ahorro_estimado}<br/><span style={{color:"#444"}}>recuperables/semana</span></div>
                </div>
              </div>
              <div className="bar"><div className="fill" style={{width:`${report.puntaje}%`}}/></div>
              <div style={{fontSize:12,color:"#666",marginTop:12,lineHeight:1.85}}>{report.resumen}</div>

              <button className="btn-ghost" onClick={()=>setShowBreakdown(s=>!s)} style={{marginTop:14,fontSize:11,padding:"7px 12px"}}>
                {showBreakdown?"^ Ocultar desglose del puntaje":"v ¿Cómo se calculó este puntaje?"}
              </button>
              {showBreakdown && (
                <div style={{marginTop:12,background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:2,padding:"14px 16px"}}>
                  <div style={{fontSize:10,color:"#555",letterSpacing:".1em",marginBottom:10}}>FACTORES QUE DETERMINARON TU PUNTAJE</div>
                  <div style={{fontSize:11,color:"#666",lineHeight:1.7,marginBottom:12}}>
                    Un puntaje alto <span style={{color:"#00ff87"}}>no es malo</span> -- significa que hay muchas oportunidades concretas de ganar eficiencia. Un puntaje bajo significa que ya estás bien digitalizado.
                  </div>
                  <div style={{fontSize:10,color:"#444",marginBottom:6}}>PUNTOS BASE: 30</div>
                  {report.factors.map((f,i)=>(
                    <div key={i} className="brow">
                      <span style={{color:"#777",flex:1,paddingRight:12}}>{f.label}</span>
                      <span style={{color:"#00ff87",fontWeight:500}}>+{f.pts}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,marginTop:4,fontSize:12,fontWeight:500}}>
                    <span style={{color:"#999"}}>TOTAL</span>
                    <span style={{color:"#00ff87"}}>{report.puntaje} / 100</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Win */}
            <div className="card" style={{marginBottom:12,borderColor:"#ffd16620",background:"rgba(255,209,102,0.02)"}}>
              <div style={{fontSize:10,color:"#ffd166aa",letterSpacing:".14em",marginBottom:9}}>! QUICK WIN -- IMPLEMENTABLE ESTA SEMANA</div>
              <div style={{fontSize:13,lineHeight:1.85,color:"#ddd"}}>{report.quick_win}</div>
            </div>

            {/* Oportunidades */}
            <div style={{fontSize:10,color:"#444",letterSpacing:".14em",marginBottom:9}}>OPORTUNIDADES IDENTIFICADAS</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
              {report.oportunidades.map((op,i)=>(
                <div key={i} className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10}}>
                    <div style={{fontSize:13,fontWeight:500,color:"#f0ede8",lineHeight:1.4}}>{op.titulo}</div>
                    <span className="tag" style={{background:`${ic(op.impacto)}12`,color:ic(op.impacto),border:`1px solid ${ic(op.impacto)}30`,flexShrink:0}}>{op.impacto}</span>
                  </div>
                  <div style={{fontSize:12,color:"#666",lineHeight:1.85,marginBottom:10}}>{op.descripcion}</div>
                  <div style={{fontSize:11,color:"#555",borderTop:"1px solid #1a1a1a",paddingTop:8}}>
                    <span style={{color:"#444"}}>ROI: </span>{op.roi} . <span style={{color:"#444"}}>Tiempo: </span>{op.tiempo}
                  </div>
                </div>
              ))}
            </div>

            {/* Riesgos */}
            <div className="card" style={{marginBottom:12,borderColor:"#ff6b6b15"}}>
              <div style={{fontSize:10,color:"#ff6b6b55",letterSpacing:".14em",marginBottom:9}}>! RIESGOS A CONSIDERAR</div>
              <div style={{fontSize:12,color:"#666",lineHeight:1.85}}>{report.riesgos}</div>
            </div>

            {/* Siguiente paso */}
            <div className="card" style={{marginBottom:12,borderColor:"#00ff8715"}}>
              <div style={{fontSize:10,color:"#444",letterSpacing:".14em",marginBottom:9}}>SIGUIENTE PASO RECOMENDADO</div>
              <div style={{fontSize:13,lineHeight:1.85,color:"#ddd"}}>{report.siguiente_paso}</div>
            </div>

            {/* CTA */}
            <div className="card" style={{marginBottom:28,borderColor:"#25D36630",background:"rgba(37,211,102,0.03)",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#25D366aa",letterSpacing:".14em",marginBottom:10}}>¿LISTO PARA AUTOMATIZAR?</div>
              <div style={{fontSize:13,color:"#888",lineHeight:1.7,marginBottom:16}}>Un asesor de Automa puede revisar este diagnóstico contigo y diseñar el plan de automatización en una sola llamada.</div>
              <a className="btn-wa" href="https://wa.me/573104095961?text=Hola,%20acabo%20de%20hacer%20el%20diagnóstico%20de%20Automa%20y%20quiero%20hablar%20con%20un%20asesor." target="_blank" rel="noreferrer">
                 HABLAR CON UN ASESOR
              </a>
            </div>

            <button className="btn-p" onClick={restart}>NUEVO DIAGNÓSTICO</button>
          </div>
        )}

      </div>
    </div>
  );
}
