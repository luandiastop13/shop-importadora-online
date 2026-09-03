/* V28 — Funcionalidades da área do lojista, sem alterar a base V27 */
let deliveryAddresses=[], authEmail='';
const _loadAllV27=loadAll,_loadOrdersV27=loadOrders,_loadNotesV27=loadNotes,_renderCartV27=renderCart,_goV27=go,_checkoutV27=checkout;

window.clientSide=function(open){$('clientSide')?.classList.toggle('open',!!open);$('clientScrim')?.classList.toggle('on',!!open)};
window.clientGo=function(id){clientSide(false);go(id);renderClientUI()};

go=function(id){clientSide(false);_goV27(id);if(['home','billing','addresses','account'].includes(id))renderClientUI()};

loadOrders=async function(){await _loadOrdersV27();renderClientUI()};
loadNotes=async function(){await _loadNotesV27();renderClientUI()};
renderCart=function(){_renderCartV27();renderClientUI()};
checkout=function(){_checkoutV27();populateAddressSelect();checkoutShippingChanged()};

async function loadAuthIdentity(){try{const r=await fetch(U+'/auth/v1/user',{headers:{apikey:K,Authorization:'Bearer '+s.access_token}});if(r.ok){const u=await r.json();authEmail=u?.email||s?.user?.email||'';if(s){s.user=u;localStorage.setItem(SK,JSON.stringify(s))}}else authEmail=s?.user?.email||''}catch{authEmail=s?.user?.email||''}}
async function loadAddresses(){try{const d=await api('/rest/v1/rpc/get_my_addresses_v1',{method:'POST',body:'{}'});deliveryAddresses=Array.isArray(d)?d:[]}catch(e){deliveryAddresses=[];console.warn('addresses',e.message)}renderAddresses();populateAddressSelect()}
loadAll=async function(){await _loadAllV27();await Promise.all([loadAddresses(),loadAuthIdentity()]);renderClientUI()};

function val(id){return $(id)?.value?.trim()||''}
function setv(id,v){if($(id))$(id).value=v||''}
function renderClientUI(){
  if(!p)return;
  const store=p.store_name||p.responsible_name||'Lojista';
  if($('helloRetailer'))$('helloRetailer').textContent=`Olá, ${store} 👋`;
  if($('clientSideStore'))$('clientSideStore').textContent=store;
  if($('clientSideName'))$('clientSideName').textContent=p.responsible_name||'Lojista Shop Importadora';
  const active=ord.filter(o=>!['completed','cancelled'].includes(o.status)).length;
  const bought=ord.filter(o=>o.status!=='cancelled').reduce((z,o)=>z+(+o.total||0),0);
  const unread=notes.filter(n=>!n.is_read).length;
  const cartQty=Object.values(cart).reduce((z,q)=>z+(+q||0),0);
  if($('clientStats'))$('clientStats').innerHTML=`<div class="clientStat"><strong>${active}</strong><span>Pedidos em andamento</span></div><div class="clientStat"><strong>${money(bought)}</strong><span>Total em pedidos</span></div><div class="clientStat"><strong>${unread}</strong><span>Notificações novas</span></div><div class="clientStat"><strong>${cartQty}</strong><span>Itens no carrinho</span></div>`;
  if($('billingSummary'))$('billingSummary').innerHTML=`<div class="infoBox"><small>Loja / Razão social</small><b>${esc(p.store_name||'Não informado')}</b></div><div class="infoBox"><small>CPF / CNPJ</small><b>${esc(p.document||'Não informado')}</b></div><div class="infoBox"><small>Responsável</small><b>${esc(p.responsible_name||'Não informado')}</b></div><div class="infoBox"><small>WhatsApp</small><b>${esc(p.phone||'Não informado')}</b></div><div class="infoBox full"><small>Endereço de faturamento</small><b>${esc(formatProfileAddress())}</b></div>`;
  setv('bfStore',p.store_name);setv('bfName',p.responsible_name);setv('bfDoc',p.document);setv('bfPhone',p.phone);setv('bfCep',p.cep);setv('bfStreet',p.street);setv('bfNumber',p.address_number);setv('bfDistrict',p.district);setv('bfComplement',p.complement);setv('bfCity',p.city);setv('bfState',p.state);
  setv('acStore',p.store_name);setv('acName',p.responsible_name);setv('acPhone',p.phone);setv('acCity',p.city);setv('acState',p.state);setv('acEmail',authEmail||s?.user?.email||'');
  renderAddresses();populateAddressSelect();
}
function formatProfileAddress(){const a=[p?.street,p?.address_number,p?.district,p?.city,p?.state,p?.cep].filter(Boolean);return a.length?a.join(' • '):'Endereço de faturamento ainda não cadastrado'}

async function saveBilling(){try{
  await api('/rest/v1/rpc/update_my_profile_v2',{method:'POST',body:JSON.stringify({p_store_name:val('bfStore'),p_responsible_name:val('bfName'),p_phone:val('bfPhone'),p_document:val('bfDoc'),p_cep:val('bfCep'),p_street:val('bfStreet'),p_address_number:val('bfNumber'),p_district:val('bfDistrict'),p_complement:val('bfComplement'),p_city:val('bfCity'),p_state:val('bfState').toUpperCase()})});
  await loadProfile();renderClientUI();toast('Dados de faturamento salvos');
}catch(e){toast(e.message)}}

async function saveAccount(){try{
  await api('/rest/v1/rpc/update_my_profile_v2',{method:'POST',body:JSON.stringify({p_store_name:val('acStore'),p_responsible_name:val('acName'),p_phone:val('acPhone'),p_document:p?.document||'',p_cep:p?.cep||'',p_street:p?.street||'',p_address_number:p?.address_number||'',p_district:p?.district||'',p_complement:p?.complement||'',p_city:val('acCity'),p_state:val('acState').toUpperCase()})});
  await loadProfile();renderClientUI();toast('Cadastro atualizado');
}catch(e){toast(e.message)}}

async function changePassword(){try{const password=val('newPass');if(password.length<6)return toast('Use uma senha com pelo menos 6 caracteres');const r=await fetch(U+'/auth/v1/user',{method:'PUT',headers:hdr(),body:JSON.stringify({password})});const t=await r.text();if(!r.ok){let d;try{d=JSON.parse(t)}catch{d={}};throw Error(d?.message||t||'Não foi possível alterar a senha')}setv('newPass','');toast('Senha alterada com sucesso')}catch(e){toast(e.message)}}

function renderAddresses(){if(!$('addressRows'))return;$('addressRows').innerHTML=deliveryAddresses.length?deliveryAddresses.map(a=>`<div class="addressCard ${a.is_default?'default':''}"><div class="addressCardHead"><div><b>${esc(a.label||'Entrega')}</b><small>${esc(a.recipient_name||p?.responsible_name||'')}</small></div>${a.is_default?'<span class="addressTag">Principal</span>':''}</div><div class="addressText">📍 ${esc(a.street)}, ${esc(a.address_number)}${a.complement?' • '+esc(a.complement):''}<br>${esc(a.district)} • ${esc(a.city)} / ${esc(a.state)} • CEP ${esc(a.cep)}${a.phone?'<br>📞 '+esc(a.phone):''}</div><div class="addressActions"><button class="btn" onclick="openAddress('${a.id}')">Editar</button>${!a.is_default?`<button class="btn" onclick="makeDefaultAddress('${a.id}')">Tornar principal</button>`:''}<button class="btn" onclick="deleteAddress('${a.id}')">Excluir</button></div></div>`).join(''):'<div class="row"><div><b>Nenhum endereço de entrega cadastrado</b><small>Cadastre um endereço ou use os dados de faturamento.</small></div></div>'}

function openAddress(id=''){const a=id?deliveryAddresses.find(x=>x.id===id):null;$('addrTitle').textContent=a?'Editar endereço':'Novo endereço';setv('addrId',a?.id);setv('addrLabel',a?.label||'Entrega');setv('addrRecipient',a?.recipient_name||p?.responsible_name);setv('addrPhone',a?.phone||p?.phone);setv('addrCep',a?.cep);setv('addrStreet',a?.street);setv('addrNumber',a?.address_number);setv('addrDistrict',a?.district);setv('addrComplement',a?.complement);setv('addrCity',a?.city);setv('addrState',a?.state);$('addrDefault').checked=!!a?.is_default;$('addressModal').classList.add('on')}
function copyBillingToAddress(){openAddress();setv('addrLabel','Endereço de faturamento');setv('addrRecipient',p?.responsible_name);setv('addrPhone',p?.phone);setv('addrCep',p?.cep);setv('addrStreet',p?.street);setv('addrNumber',p?.address_number);setv('addrDistrict',p?.district);setv('addrComplement',p?.complement);setv('addrCity',p?.city);setv('addrState',p?.state);if(!$('addrCep').value||!$('addrStreet').value)toast('Complete primeiro seus dados de faturamento')}
async function saveAddress(){try{await api('/rest/v1/rpc/upsert_my_address_v1',{method:'POST',body:JSON.stringify({p_id:val('addrId')||null,p_label:val('addrLabel'),p_recipient_name:val('addrRecipient'),p_phone:val('addrPhone'),p_cep:val('addrCep'),p_street:val('addrStreet'),p_address_number:val('addrNumber'),p_district:val('addrDistrict'),p_complement:val('addrComplement'),p_city:val('addrCity'),p_state:val('addrState').toUpperCase(),p_is_default:$('addrDefault').checked})});closeM('addressModal');await loadAddresses();renderClientUI();toast('Endereço salvo')}catch(e){toast(e.message)}}
async function deleteAddress(id){if(!confirm('Excluir este endereço de entrega?'))return;try{await api('/rest/v1/rpc/delete_my_address_v1',{method:'POST',body:JSON.stringify({p_id:id})});await loadAddresses();renderClientUI();toast('Endereço excluído')}catch(e){toast(e.message)}}
async function makeDefaultAddress(id){const a=deliveryAddresses.find(x=>x.id===id);if(!a)return;try{await api('/rest/v1/rpc/upsert_my_address_v1',{method:'POST',body:JSON.stringify({p_id:a.id,p_label:a.label,p_recipient_name:a.recipient_name,p_phone:a.phone,p_cep:a.cep,p_street:a.street,p_address_number:a.address_number,p_district:a.district,p_complement:a.complement,p_city:a.city,p_state:a.state,p_is_default:true})});await loadAddresses();renderClientUI();toast('Endereço principal atualizado')}catch(e){toast(e.message)}}

function populateAddressSelect(){if(!$('caSel'))return;const current=$('caSel').value;$('caSel').innerHTML='<option value="">Selecione um endereço salvo</option>'+deliveryAddresses.map(a=>`<option value="${a.id}">${esc(a.label||'Entrega')} — ${esc(a.city)}/${esc(a.state)}${a.is_default?' (principal)':''}</option>`).join('');if(deliveryAddresses.some(a=>a.id===current))$('caSel').value=current;else{const d=deliveryAddresses.find(a=>a.is_default);if(d)$('caSel').value=d.id}}
function useSavedAddress(id){const a=deliveryAddresses.find(x=>x.id===id);if(!a)return;setv('cc',a.cep);setv('ct',a.street);setv('cno',a.address_number);setv('cbairro',a.district);setv('cci',a.city);setv('cu',a.state);if(a.recipient_name)setv('cn',a.recipient_name);if(a.phone)setv('cp',a.phone)}
function checkoutShippingChanged(){if(!$('cm'))return;const carrier=$('cm').value==='carrier';if($('caSel'))$('caSel').classList.toggle('hide',!carrier);if(carrier){populateAddressSelect();const d=deliveryAddresses.find(a=>a.id===$('caSel')?.value)||deliveryAddresses.find(a=>a.is_default);if(d){$('caSel').value=d.id;useSavedAddress(d.id)}}}

renderClientUI();
