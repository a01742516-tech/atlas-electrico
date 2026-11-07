'use strict';

const transmissionYears = [
  {year:2022, km:110685, mva:116082, source:'PAMRNT 2024–2038'},
  {year:2023, km:110846, mva:113688, source:'PAMRNT 2024–2038'},
  {year:2024, km:111138, mva:116625, source:'PAMRNT 2025–2039'}
];
const systemDetails = {
  sin:{name:'Sistema Interconectado Nacional (SIN)',detail:'Integra siete regiones de control interconectadas: Central, Oriental, Occidental, Noroeste, Norte, Noreste y Peninsular. CENACE describe la red troncal del SIN entre 115 y 400 kV.',link:'Red nacional interconectada',source:'CENACE · PAMRNT 2025–2039, sección 3.1 y Figura 3.2.2.'},
  sibc:{name:'Sistema Interconectado Baja California (SIBC)',detail:'Opera separado del SIN. Mantiene interconexión con el Western Electricity Coordinating Council (WECC) de Estados Unidos mediante dos líneas de corriente alterna de 230 kV.',link:'Interconexión internacional documentada',source:'CENACE · PAMRNT 2025–2039, sección 3.1, PDF p. 28.'},
  sibcs:{name:'Sistema Interconectado Baja California Sur (SIBCS)',detail:'Sistema eléctrico aislado del SIN, del SIBC y del Sistema Mulegé (SIM), de acuerdo con la descripción de CENACE.',link:'Aislado de los otros sistemas aquí mostrados',source:'CENACE · PAMRNT 2025–2039, sección 3.1, PDF p. 28.'},
  mulege:{name:'Sistema Mulegé (SIM)',detail:'Opera eléctricamente aislado del SIN, SIBC y SIBCS. No se representan líneas de transmisión para este sistema.',link:'Aislado de los otros sistemas aquí mostrados',source:'CENACE · PAMRNT 2025–2039, sección 3.1, PDF p. 28.'}
};
const transmissionFmt = new Intl.NumberFormat('es-MX');
const transmissionPct = (a,b)=>(a/b-1)*100;
function bindRangeNudgers(ids){
 document.querySelectorAll(`[data-range]`).forEach(button=>{
  if(!ids.includes(button.dataset.range)||button.dataset.rangeReady==='true')return;
  button.dataset.rangeReady='true';
  button.addEventListener('click',()=>{
   const input=document.getElementById(button.dataset.range);if(!input)return;
   const decimals=(input.step.split('.')[1]||'').length,step=Number(input.step)||1;
   const value=Math.max(Number(input.min),Math.min(Number(input.max),Number(input.value)+Number(button.dataset.direction)*step));
   input.value=value.toFixed(decimals);input.dispatchEvent(new Event('input',{bubbles:true}));
   input.dispatchEvent(new Event('change',{bubbles:true}));
  });
 });
}
function renderTransmissionKpis(){
 const first=transmissionYears[0],last=transmissionYears.at(-1),delta=transmissionPct(last.km,first.km);
 document.getElementById('transmission-kpis').innerHTML=[
  ['LONGITUD DE LÍNEAS RNT',`${transmissionFmt.format(last.km)} <small>km</small>`,'Inventario 2024 · CENACE'],
  ['CAMBIO 2022–2024',`+${delta.toFixed(2)}<small>%</small>`,`${transmissionFmt.format(last.km-first.km)} km netos en el periodo`],
  ['TRANSFORMACIÓN RNT',`${transmissionFmt.format(last.mva)} <small>MVA</small>`,'Capacidad efectiva reportada · 2024'],
  ['NIVELES DE TENSIÓN','69–400 <small>kV</small>','RNT definida desde 69 kV; SIN 115–400 kV']
 ].map((x,i)=>`<article class="generation-kpi ${i===0?'primary-kpi':''}"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small><button class="source-link" data-source="cenace-transmission">CENACE · fuente ↗</button></article>`).join('');
}
function renderTransmissionBarChart(elementId,key,unit){
 const rows=transmissionYears,W=560,H=218,left=68,right=20,top=19,bottom=32,plotH=H-top-bottom,vals=rows.map(r=>r[key]),min=Math.min(...vals)*.975,max=Math.max(...vals)*1.015,range=max-min,bar=74,gap=(W-left-right-rows.length*bar)/(rows.length+1);
 let svg=`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
 for(let i=0;i<=3;i++){const value=range*i/3,y=top+plotH*(1-i/3);svg+=`<line x1="${left}" y1="${y}" x2="${W-right}" y2="${y}" stroke="#e6edf1"/><text x="${left-8}" y="${y+4}" text-anchor="end" fill="#81909d" font-size="10" font-family="Roboto Mono">${transmissionFmt.format(Math.round(value/100)*100)}</text>`}
 rows.forEach((r,i)=>{const x=left+gap+(bar+gap)*i,y=top+plotH-(r[key]-min)/range*plotH,h=H-bottom-y;svg+=`<rect x="${x}" y="${y}" width="${bar}" height="${h}" rx="5" fill="${i===rows.length-1?'#F5A623':'#0B3154'}" opacity="${i===rows.length-1?1:.78}"/><text x="${x+bar/2}" y="${y-7}" text-anchor="middle" fill="#0B3154" font-size="11" font-weight="700" font-family="Roboto Mono">${transmissionFmt.format(r[key])}</text><text x="${x+bar/2}" y="${H-10}" text-anchor="middle" fill="#52677a" font-size="11" font-family="Roboto Mono">${r.year}</text>`});
 svg+='</svg>';document.getElementById(elementId).innerHTML=svg;
}
function activeSystem(id){
 document.querySelectorAll('.system-node,.geo-system-chip').forEach(n=>n.classList.toggle('selected',n.dataset.system===id));
 const data=systemDetails[id];document.getElementById('system-detail').innerHTML=`<span class="system-detail-label">${data.link}</span><h4>${data.name}</h4><p>${data.detail}</p><small>${data.source}</small><button type="button" class="source-link" data-source="cenace-transmission">Abrir ficha y páginas ↗</button>`;
}
function transmissionModel(powerMW,voltageKV,resistanceOhm,pf){
 const currentA=powerMW*1e6/(Math.sqrt(3)*voltageKV*1e3*pf),lossMW=3*currentA*currentA*resistanceOhm/1e6;
 return {currentA,lossMW,share:lossMW/powerMW*100};
}
function drawTransmissionSimulation(){
 const p=Number(document.getElementById('sim-power').value),v=Number(document.getElementById('sim-voltage').value),r=Number(document.getElementById('sim-resistance').value),pf=Number(document.getElementById('sim-pf').value),result=transmissionModel(p,v,r,pf),fmt=(x,d=1)=>new Intl.NumberFormat('es-MX',{maximumFractionDigits:d,minimumFractionDigits:d}).format(x);
 document.getElementById('sim-power-output').textContent=`${p} MW`;document.getElementById('sim-voltage-output').textContent=`${v} kV`;document.getElementById('sim-resistance-output').textContent=`${fmt(r)} Ω`;document.getElementById('sim-pf-output').textContent=pf.toFixed(2);
 document.getElementById('sim-current').innerHTML=`${fmt(result.currentA,1)} <small>A</small>`;document.getElementById('sim-loss').innerHTML=`${fmt(result.lossMW,3)} <small>MW</small>`;document.getElementById('sim-loss-share').innerHTML=`${fmt(result.share,2)} <small>%</small>`;
 const W=720,H=255,left=60,right=56,top=22,bottom=42,plotW=W-left-right,plotH=H-top-bottom,voltages=[69,115,161,230,300,400],series=voltages.map(kv=>({kv,...transmissionModel(p,kv,r,pf)})),maxI=series[0].currentA*1.06,maxL=series[0].lossMW*1.06;
 const x=kv=>left+(kv-69)/(400-69)*plotW,yI=a=>top+(maxI-a)/maxI*plotH,yL=a=>top+(maxL-a)/maxL*plotH;
 let svg=`<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
 [0,.25,.5,.75,1].forEach(t=>{const yy=top+t*plotH;svg+=`<line x1="${left}" y1="${yy}" x2="${W-right}" y2="${yy}" stroke="#e7edf1"/><text x="${left-8}" y="${yy+4}" text-anchor="end" fill="#0B3154" font-size="9" font-family="Roboto Mono">${fmt(maxI*(1-t),0)}</text><text x="${W-right+8}" y="${yy+4}" fill="#b5780e" font-size="9" font-family="Roboto Mono">${fmt(maxL*(1-t),2)}</text>`});
 svg+=`<text x="${left}" y="12" fill="#0B3154" font-size="9" font-family="Roboto Mono">CORRIENTE · A</text><text x="${W-right}" y="12" text-anchor="end" fill="#b5780e" font-size="9" font-family="Roboto Mono">PÉRDIDAS · MW</text>`;
 for(const kv of [69,115,161,230,300,400])svg+=`<line x1="${x(kv)}" y1="${top+plotH}" x2="${x(kv)}" y2="${top+plotH+4}" stroke="#92a1ad"/><text x="${x(kv)}" y="${H-13}" text-anchor="middle" fill="#52677a" font-size="10" font-family="Roboto Mono">${kv}</text>`;
 const line=(key,scale,color)=>{const points=series.map(s=>`${x(s.kv)},${scale(s[key])}`).join(' ');return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${series.map(s=>`<circle cx="${x(s.kv)}" cy="${scale(s[key])}" r="4" fill="${color}"/>`).join('')}`};
 svg+=line('currentA',yI,'#0B3154')+line('lossMW',yL,'#F5A623');
 const currentY=yI(result.currentA),lossY=yL(result.lossMW);svg+=`<line x1="${x(v)}" y1="${top}" x2="${x(v)}" y2="${top+plotH}" stroke="#FFD36A" stroke-dasharray="4 4"/><circle cx="${x(v)}" cy="${currentY}" r="6" fill="#0B3154" stroke="#fff" stroke-width="2"/><circle cx="${x(v)}" cy="${lossY}" r="6" fill="#F5A623" stroke="#fff" stroke-width="2"/><text x="${x(v)}" y="${H-29}" text-anchor="middle" fill="#0B3154" font-size="9" font-weight="700" font-family="Roboto Mono">${v} kV · seleccionado</text></svg>`;
 document.getElementById('transmission-sim-chart').innerHTML=svg;
}
function initializeTransmission(){
 renderTransmissionKpis();renderTransmissionBarChart('transmission-length-chart','km','km');renderTransmissionBarChart('transmission-capacity-chart','mva','MVA');activeSystem('sin');
 document.querySelectorAll('.system-node,.geo-system-chip').forEach(button=>button.addEventListener('click',()=>activeSystem(button.dataset.system)));
 bindRangeNudgers(['sim-power','sim-voltage','sim-resistance','sim-pf']);
 ['sim-power','sim-voltage','sim-resistance','sim-pf'].forEach(id=>{const control=document.getElementById(id);control.addEventListener('input',drawTransmissionSimulation);control.addEventListener('change',drawTransmissionSimulation)});drawTransmissionSimulation();
}
initializeTransmission();
