'use strict';
(()=>{
 const $=s=>document.querySelector(s),services=window.TIGER_SERVICES||{},selected=new Map();
 const menu=$('.menu-toggle'),nav=$('#navigation');
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
 nav?.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
 if($('#year'))$('#year').textContent=new Date().getFullYear();
 if(!$('#service-picker'))return;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
 const option=(v,t)=>`<option value="${esc(v)}">${esc(t||v)}</option>`;
 const select=(id,key,label,choices)=>`<label>${label}<select data-service="${id}" data-key="${key}">${choices.map(x=>option(x)).join('')}</select></label>`;
 const extra={access:['System type',['Existing garage integration','New garage door / opener','Pedestrian access','Business access control']],climate:['Existing HVAC',['Not sure','Conventional system','Heat pump','Multi-zone system']],integration:['Current platform',['Not sure / mixed platforms','Apple Home','Google Home','Amazon Alexa','Other platform']],cabling:['Cable type',['Not sure — recommend a solution','Cat6 / Ethernet','Speaker cable','Other low-voltage']],automation:['Preferred platform',['No preference / need guidance','Apple Home','Google Home','Amazon Alexa','Other platform']],lighting:['Installation location',['Interior','Landscape','Hardscape','Roofline','Multiple areas']],theater:['Room status',['Existing finished room','Renovation / open walls','Dedicated theater build','Need design guidance']],audio:['Speaker arrangement',['In-ceiling / in-wall','Freestanding speakers','Outdoor speakers','Mixed / need guidance']],network:['Property layout',['One level','Two levels','Three or more levels','Multiple buildings']],it:['Property / use',['Home','Home office','Business','Multiple locations']],tv:['Wall / placement',['Drywall','Brick / masonry','Stone / tile','Above fireplace','Not sure']]};
 function renderDetails(){
  $('#service-details').innerHTML=selected.size?[...selected].map(([id,v])=>{
   const s=services[id];const max=id==='network'?1000000:10000;
   return `<fieldset class="service-detail"><legend>${esc(s.label)}</legend><div class="form-grid">${select(id,'scope','Project focus',s.scopes)}<label>${esc(s.quantityLabel)} <span class="optional">(approx.)</span><input type="number" min="1" max="${max}" step="1" inputmode="numeric" placeholder="Not sure yet" data-service="${id}" data-key="quantity" value="${esc(v.quantity)}"></label>${select(id,'equipment','Equipment', ['Need recommendations','I will supply equipment','Use existing equipment','Mix of new and existing'])}${select(id,'stage','Project stage',['Existing finished space','Renovation / open walls','New construction','Not sure yet'])}${select(id,'detail',extra[id][0],extra[id][1])}${select(id,'timing','Preferred timing',['Flexible / exploring','Within a month','1–3 months','3+ months'])}</div><p class="fine">Measurements are approximate. Compatibility and installation requirements are confirmed during review.</p></fieldset>`;
  }).join(''):'<p class="empty">Select a service above to get started.</p>';
  document.querySelectorAll('[data-service][data-key]').forEach(el=>{const val=selected.get(el.dataset.service)[el.dataset.key];if(val!==undefined)el.value=val});
 }
 function pricing(id,v){
  const p=services[id].pricing,vals=[p.baseLow,p.baseHigh,p.unitLow,p.unitHigh];
  if(!vals.every(x=>typeof x==='number'&&Number.isFinite(x)&&x>=0))return null;
  if(p.baseHigh<p.baseLow||p.unitHigh<p.unitLow)return null;
  const usesQuantity=p.unitLow>0||p.unitHigh>0,q=Number(v.quantity);
  if(usesQuantity&&(!Number.isInteger(q)||q<1))return null;
  return {low:p.baseLow+(usesQuantity?q:0)*p.unitLow,high:p.baseHigh+(usesQuantity?q:0)*p.unitHigh};
 }
 function brief(){
  return ['TIGER TECH CONSULTING — PROJECT BRIEF','Personalized quote request; not a final price.','',...[...selected].flatMap(([id,v])=>[services[id].label,`  Project: ${v.scope}`,`  ${services[id].quantityLabel}: ${v.quantity||'To be confirmed'}`,`  Equipment: ${v.equipment}`,`  Space: ${v.stage}`,`  ${extra[id][0]}: ${v.detail}`,`  Timing: ${v.timing}`,'']),'Final scope, compatibility, equipment, installation conditions, permits, and applicable taxes require review.'].join('\n');
 }
 function update(){
  let low=0,high=0,unpriced=0;
  $('#summary-items').innerHTML=selected.size?[...selected].map(([id,v])=>{let p=pricing(id,v);if(p){low+=p.low;high+=p.high}else unpriced++;return `<div class="summary-item"><span>${esc(services[id].label)}<small>${esc(v.scope)}${v.quantity?' · '+esc(v.quantity)+' '+esc(services[id].unit):''}</small></span><span>${p?money(p.low)+'–'+money(p.high):'Quote required'}</span></div>`}).join(''):'<p>No services selected yet.</p>';
  const priced=selected.size-unpriced;
  $('#price-area').innerHTML=priced?`<span>${unpriced?'Priced services subtotal':'Preliminary project range'}</span><strong>${money(low)}–${money(high)}</strong><p>${unpriced?`${unpriced} service(s) still need a custom quote and are NOT included above. `:''}Not a final quote. Scope and site review required.</p>`:'<span>Personalized estimate</span><strong>Built around your scope.</strong><p>Pricing is provided after we review your project. No unverified instant prices.</p>';
  $('#request-estimate').disabled=!selected.size;$('#download-brief').disabled=!selected.size;
  $('#project-summary').value=selected.size?brief():'';
 }
 $('#service-picker').innerHTML=Object.entries(services).map(([id,s])=>`<label class="service-choice"><input type="checkbox" value="${id}"><span>${esc(s.label)}</span></label>`).join('');
 function add(id){selected.set(id,{scope:services[id].scopes[0],quantity:'',equipment:'Need recommendations',stage:'Existing finished space',detail:extra[id][1][0],timing:'Flexible / exploring'})}
 $('#service-picker').addEventListener('change',e=>{const id=e.target.value;if(e.target.checked)add(id);else selected.delete(id);renderDetails();update()});
 $('#service-details').addEventListener('input',e=>{const el=e.target;if(!el.dataset.service)return;el.setCustomValidity('');if(el.type==='number'&&el.value&&!el.validity.valid){el.setCustomValidity('Enter a whole number within the allowed range.');el.reportValidity();return}el.setCustomValidity('');selected.get(el.dataset.service)[el.dataset.key]=el.value;update()});
 $('#request-estimate').addEventListener('click',()=>{if(!selected.size)return;$('#builder-status').textContent='Your selected services are attached to the contact form below.';if(!$('#message').value)$('#message').value='Please prepare an estimate for my selected services.\n\nAdditional project details: ';$('#contact').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});$('#contact-form input[name="name"]').focus({preventScroll:true})});
 $('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([brief()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='tiger-tech-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#builder-status').textContent='Project brief downloaded.'});
 $('#reset-project').addEventListener('click',()=>{selected.clear();document.querySelectorAll('#service-picker input').forEach(el=>el.checked=false);renderDetails();update();$('#builder-status').textContent='Project selections cleared. Your contact message has not been changed.'});
 $('#contact-form').addEventListener('submit',()=>{$('#project-summary').value=selected.size?brief():''});
 const preselected=new URLSearchParams(location.search).get('service');if(services[preselected]){add(preselected);$(`#service-picker input[value="${preselected}"]`).checked=true}renderDetails();update();
})();
