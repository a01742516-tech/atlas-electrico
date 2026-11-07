'use strict';

const divisions = [
 {id:1,name:'Baja California',code:'BC',services:2032,mv:21606,saidi22:20.09,saidi:19.77,saifi:.53,tech22:3.78,tech:3.82,nontech:3.02,x:77,y:232},
 {id:2,name:'Noroeste',code:'NO',services:2284,mv:42343,saidi22:18.02,saidi:16.27,saifi:.39,tech22:4.36,tech:4.30,nontech:6.19,x:271,y:356},
 {id:3,name:'Norte',code:'NTE',services:2415,mv:41142,saidi22:16.37,saidi:16.23,saifi:.38,tech22:3.97,tech:3.97,nontech:12.49,x:413,y:387},
 {id:4,name:'Golfo Norte',code:'GN',services:3732,mv:47661,saidi22:17.80,saidi:17.44,saifi:.35,tech22:3.29,tech:3.25,nontech:12.99,x:565,y:388},
 {id:5,name:'Golfo Centro',code:'GC',services:2155,mv:31647,saidi22:25.01,saidi:23.40,saifi:.39,tech22:5.33,tech:5.19,nontech:4.70,x:592,y:504},
 {id:6,name:'Bajío',code:'BAJ',services:4944,mv:69044,saidi22:17.04,saidi:16.63,saifi:.32,tech22:5.01,tech:4.98,nontech:6.98,x:514,y:518},
 {id:7,name:'Jalisco',code:'JAL',services:3595,mv:36059,saidi22:18.32,saidi:17.89,saifi:.41,tech22:4.78,tech:4.64,nontech:6.76,x:448,y:563},
 {id:8,name:'Centro Occidente',code:'CO',services:2590,mv:32647,saidi22:15.49,saidi:15.05,saifi:.30,tech22:5.49,tech:5.37,nontech:2.94,x:525,y:588},
 {id:9,name:'Centro Sur',code:'CS',services:3193,mv:39438,saidi22:18.55,saidi:16.64,saifi:.43,tech22:6.47,tech:6.43,nontech:4.08,x:591,y:635},
 {id:10,name:'Centro Oriente',code:'COR',services:3543,mv:28117,saidi22:11.06,saidi:9.74,saifi:.25,tech22:4.79,tech:4.79,nontech:6.27,x:652,y:610},
 {id:11,name:'Oriente',code:'ORI',services:3329,mv:45734,saidi22:15.68,saidi:14.92,saifi:.21,tech22:6.74,tech:6.36,nontech:13.83,x:693,y:608},
 {id:12,name:'Sureste',code:'SUE',services:4071,mv:66354,saidi22:42.10,saidi:36.33,saifi:.63,tech22:8.38,tech:7.99,nontech:7.60,x:716,y:673},
 {id:13,name:'Peninsular',code:'PEN',services:2205,mv:21953,saidi22:14.63,saidi:14.32,saifi:.39,tech22:4.09,tech:3.94,nontech:5.02,x:944,y:562},
 {id:14,name:'Valle de México Norte',code:'VMN',services:3106,mv:10540,saidi22:20.46,saidi:18.17,saifi:.49,tech22:3.88,tech:3.84,nontech:12.36,x:548,y:535},
 {id:15,name:'Valle de México Centro',code:'VMC',services:2167,mv:5771,saidi22:12.73,saidi:12.32,saifi:.39,tech22:3.87,tech:3.80,nontech:11.82,x:585,y:552},
 {id:16,name:'Valle de México Sur',code:'VMS',services:2924,mv:11409,saidi22:17.66,saidi:14.18,saifi:.41,tech22:4.24,tech:4.28,nontech:9.03,x:565,y:585}
];
const divisionSvgNS='http://www.w3.org/2000/svg';
const divisionFmt=new Intl.NumberFormat('es-MX');
let selectedDivision=1;
const nationalDistributionSeries=[
 {title:'Usuarios de Servicio Básico',unit:'millones de usuarios',max:55,values:[{year:2022,value:47.4,label:'47.4'},{year:2023,value:48.2,label:'48.2'},{year:2024,value:49.02,label:'49.02'}]},
 {title:'Longitud de redes MT + BT',unit:'miles de km',max:1000,values:[{year:2022,value:889,label:'889'},{year:2023,value:894,label:'894'},{year:2024,value:901,label:'901'}]},
 {title:'Pérdidas en distribución',unit:'porcentaje · incluye alta tensión',max:14,values:[{year:2022,value:11.05,label:'11.05%'},{year:2023,value:10.86,label:'10.86%'},{year:2024,value:10.69,label:'10.69%'}]},
 {title:'SAIDI de distribución',unit:'minutos por usuario · año',max:24,values:[{year:2022,value:19.248,label:'19.248'},{year:2023,value:17.788,label:'17.788'},{year:2024,value:16.708,label:'16.708'}]}
];
function svgElement(name,attrs={},textContent=''){const e=document.createElementNS(divisionSvgNS,name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));if(textContent)e.textContent=textContent;return e;}
function renderNationalDistributionSeries(){
 const root=document.getElementById('distribution-national-series');if(!root)return;
 root.innerHTML=nationalDistributionSeries.map(metric=>{
  const W=390,H=174,left=35,right=12,top=30,bottom=32,plotH=H-top-bottom,plotW=W-left-right,barW=48,gap=(plotW-3*barW)/4;
  let svg=`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><line x1="${left}" y1="${top+plotH}" x2="${W-right}" y2="${top+plotH}" stroke="#cbd6df" stroke-width="1.4"/><line x1="${left}" y1="${top+plotH/2}" x2="${W-right}" y2="${top+plotH/2}" stroke="#e6edf1"/><text x="${left-6}" y="${top+4}" text-anchor="end" fill="#718292" font-size="11" font-family="Roboto Mono">${metric.max}</text><text x="${left-6}" y="${top+plotH+4}" text-anchor="end" fill="#718292" font-size="11" font-family="Roboto Mono">0</text>`;
  metric.values.forEach((point,i)=>{const x=left+gap+i*(barW+gap),height=Math.max(2,point.value/metric.max*plotH),y=top+plotH-height,fill=point.year===2024?'#F5A623':'#0B3154';svg+=`<rect x="${x}" y="${y}" width="${barW}" height="${height}" rx="5" fill="${fill}"><title>${point.year}: ${point.label} · ${metric.unit}</title></rect><text x="${x+barW/2}" y="${Math.max(17,y-7)}" text-anchor="middle" fill="#061B30" font-size="12" font-weight="700" font-family="Roboto Mono">${point.label}</text><text x="${x+barW/2}" y="${H-10}" text-anchor="middle" fill="#52677a" font-size="12" font-family="Roboto Mono">${point.year}</text>`});
  svg+='</svg>';return `<section class="national-mini-chart"><div class="national-mini-chart-head"><h4>${metric.title}</h4><span>${metric.unit}</span></div>${svg}</section>`;
 }).join('');
}
function renderDistributionKpis(){
 const services=48286,mv=551465,lv=342741,lossTWh=33.947,receivedTWh=263.551,lossPct=lossTWh/receivedTWh*100;
 const items=[['SERVICIOS REGISTRADOS',`${(services/1000).toFixed(3)} <small>millones</small>`,'CFE · 2023 · valor reportado'],['RED MT + BT',`${divisionFmt.format(mv+lv)} <small>km</small>`,'Cálculo Atlas · CFE · 2023'],['SAIDI NACIONAL',`17.79 <small>min/usuario</small>`,'Continuidad · CFE · 2023'],['PÉRDIDA TOTAL RGD',`${lossPct.toFixed(2)}<small>%</small>`,`${lossTWh} TWh de ${receivedTWh} TWh ingresados`]];
 document.getElementById('distribution-kpis').innerHTML=items.map((x,i)=>`<article class="generation-kpi ${i===0?'primary-kpi':''}"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small><button class="source-link" data-source="cfe-distribution">Fuente y alcance ↗</button></article>`).join('');
}
function selectDivision(id){selectedDivision=id;const d=divisions.find(x=>x.id===id);document.querySelectorAll('.division-marker,.division-legend-item').forEach(e=>e.classList.toggle('selected',Number(e.dataset.division)===id));renderDivisionDetail(d);renderDistributionCharts();}
function renderDivisionMap(){
 const svg=document.getElementById('distribution-map-svg');svg.innerHTML='';
 divisions.forEach(d=>{
  const g=svgElement('g',{class:`division-marker${selectedDivision===d.id?' selected':''}`,tabindex:0,role:'button','data-division':d.id,'aria-label':`División ${d.id}: ${d.name}. ${divisionFmt.format(d.services)} mil servicios registrados. Seleccionar para ver datos.`});
  g.append(svgElement('title',{},`División ${d.id} · ${d.name} · ${divisionFmt.format(d.services)} mil servicios`));
  g.append(svgElement('circle',{class:'division-marker-ring',cx:d.x,cy:d.y,r:23}));g.append(svgElement('circle',{class:'division-marker-face',cx:d.x,cy:d.y,r:19}));
  g.append(svgElement('text',{class:'division-marker-number',x:d.x,y:d.y+4},String(d.id).padStart(2,'0')));
  g.append(svgElement('text',{class:'division-marker-count',x:d.x,y:d.y+34},`${(d.services/1000).toFixed(1)}M`));
  g.addEventListener('click',()=>selectDivision(d.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectDivision(d.id)}});svg.append(g);
 });
 const legend=document.getElementById('division-legend');legend.innerHTML=divisions.map(d=>`<button class="division-legend-item${d.id===selectedDivision?' selected':''}" type="button" data-division="${d.id}"><b>${String(d.id).padStart(2,'0')}</b><span>${d.name}</span></button>`).join('');
 legend.addEventListener('click',e=>{const btn=e.target.closest('[data-division]');if(btn)selectDivision(Number(btn.dataset.division))});
}
function renderDivisionDetail(d){
 const root=document.getElementById('division-detail');root.innerHTML=`<span class="division-detail-kicker">DIVISIÓN ${String(d.id).padStart(2,'0')} · DATOS 2023</span><h3>${d.name}</h3><div class="division-metric-main"><strong>${(d.services/1000).toFixed(3)} <small>M</small></strong><span>servicios de suministro registrados</span></div><div class="division-detail-grid"><div><span>LÍNEAS DE MEDIA TENSIÓN</span><b>${divisionFmt.format(d.mv)} <small>km</small></b></div><div><span>SAIDI</span><b>${d.saidi.toFixed(2)} <small>min/usuario</small></b></div><div><span>SAIFI</span><b>${d.saifi.toFixed(2)} <small>interrupciones/usuario</small></b></div><div><span>PÉRDIDAS TÉCNICAS</span><b>${d.tech.toFixed(2)} <small>%</small></b></div><div><span>PÉRDIDAS NO TÉCNICAS</span><b>${d.nontech.toFixed(2)} <small>%</small></b></div></div><div class="division-detail-note">CFE reporta los servicios en miles en su tabla; el dato mostrado se expresa en millones como conversión. Las pérdidas de la Tabla V.5 son preliminares y son métricas distintas al balance energético total.</div><button class="source-badge source-link" data-source="cfe-distribution">CFE · Tablas III.1, V.1 y V.5 ↗</button>`;
}
function horizontalBars(id,key,max,labelFormat){
 const rows=[...divisions].sort((a,b)=>b[key]-a[key]);
 document.getElementById(id).innerHTML=`<div class="dist-bar-list">${rows.map(d=>`<div class="dist-bar-row${d.id===selectedDivision?' selected':''}"><span class="dist-bar-label">${String(d.id).padStart(2,'0')} · ${d.name}</span><span class="dist-bar-track"><i style="width:${Math.max(0,Math.min(100,d[key]/max*100)).toFixed(2)}%"></i></span><strong>${labelFormat(d[key])}</strong></div>`).join('')}</div>`;
}
function renderDistributionLossChart(){
 const rows=[...divisions].sort((a,b)=>(b.tech+b.nontech)-(a.tech+a.nontech)),max=20;
 document.getElementById('distribution-loss-chart').innerHTML=`<div class="dist-loss-list">${rows.map(d=>`<div class="dist-loss-row${d.id===selectedDivision?' selected':''}"><span class="dist-bar-label">${String(d.id).padStart(2,'0')} · ${d.name}</span><span class="dist-loss-track"><i class="tech" style="width:${d.tech/max*100}%"></i><i class="nontech" style="width:${d.nontech/max*100}%"></i></span><strong>${d.tech.toFixed(2)}% + ${d.nontech.toFixed(2)}%</strong></div>`).join('')}</div><span class="dist-scale">Escala de pérdidas combinadas: 0–20 %</span>`;
}
function renderCenaceInfraChart(){
 const rows=[{year:2022,mt:548411,bt:340759},{year:2023,mt:551465,bt:342741},{year:2024,mt:555336,bt:345966}],max=600000;
 document.getElementById('distribution-infra-chart').innerHTML=`<div class="dist-year-list">${rows.map(r=>`<div class="dist-year-row"><b>${r.year}</b><div class="dist-year-group"><span>MT</span><i class="dist-bar-track"><em class="mt" style="width:${r.mt/max*100}%"></em></i><strong>${divisionFmt.format(r.mt)} km</strong></div><div class="dist-year-group"><span>BT</span><i class="dist-bar-track"><em class="bt" style="width:${r.bt/max*100}%"></em></i><strong>${divisionFmt.format(r.bt)} km</strong></div></div>`).join('')}</div><span class="dist-scale">Escala común: 0–600,000 km · datos fuera del MEM</span>`;
}
function renderDistributionCharts(){
 if(!document.getElementById('distribution-services-chart'))return;
 horizontalBars('distribution-services-chart','services',5200,v=>divisionFmt.format(v));
 horizontalBars('distribution-lines-chart','mv',72000,v=>divisionFmt.format(v));
 renderDistributionLossChart();renderCenaceInfraChart();
}
function drawTransformer(){
 const vp=Number(document.getElementById('transformer-vp').value),ratio=Number(document.getElementById('transformer-ratio').value),s=Number(document.getElementById('transformer-power').value),vs=vp/ratio,ip=s/vp,is=s/vs,fmt=(v,d=1)=>new Intl.NumberFormat('es-MX',{maximumFractionDigits:d,minimumFractionDigits:d}).format(v);
 document.getElementById('transformer-vp-output').textContent=`${fmt(vp,2)} kV`;document.getElementById('transformer-ratio-output').textContent=`${ratio} : 1`;document.getElementById('transformer-power-output').textContent=`${s} kVA`;document.getElementById('transformer-vs').innerHTML=`${fmt(vs*1000,1)} <small>V</small>`;document.getElementById('transformer-ip').innerHTML=`${fmt(ip,2)} <small>A</small>`;document.getElementById('transformer-is').innerHTML=`${fmt(is,2)} <small>A</small>`;
 const W=690,H=190,left=140,right=90,barW=W-left-right,items=[{name:'Tensión primaria',value:vp,unit:'kV',color:'#0B3154',scaleMax:35},{name:'Tensión secundaria',value:vs,unit:'kV',color:'#F5A623',scaleMax:35},{name:'Corriente primaria',value:ip,unit:'A',color:'#0B3154',scaleMax:100},{name:'Corriente secundaria',value:is,unit:'A',color:'#F5A623',scaleMax:1500}];
 let svg=`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
 items.forEach((a,i)=>{const y=13+i*43,w=Math.max(3,Math.min(1,a.value/a.scaleMax)*barW);svg+=`<text x="${left-10}" y="${y+15}" text-anchor="end" fill="#52677a" font-size="10" font-family="Inter,Arial">${a.name}</text><rect x="${left}" y="${y}" width="${barW}" height="23" rx="5" fill="#eef2f5"/><rect x="${left}" y="${y}" width="${w}" height="23" rx="5" fill="${a.color}"/><text x="${left+barW+8}" y="${y+15}" fill="#0B3154" font-size="10" font-weight="700" font-family="Roboto Mono">${fmt(a.value,a.unit==='kV'?2:1)} ${a.unit}</text>`});svg+='</svg>';document.getElementById('transformer-chart').innerHTML=svg;
}
function initializeDistribution(){
 initializeTransformerControls();
 renderDistributionKpis();renderNationalDistributionSeries();renderDivisionMap();selectDivision(selectedDivision);
}
function initializeTransformerControls(){
 const ids=['transformer-vp','transformer-ratio','transformer-power'];
 ids.forEach(id=>{
  const input=document.getElementById(id);
  if(!input||input.dataset.transformerReady==='true')return;
  input.dataset.transformerReady='true';
  input.addEventListener('input',drawTransformer);
  input.addEventListener('change',drawTransformer);
 });
 bindRangeNudgers(ids);
 drawTransformer();
}
initializeDistribution();
