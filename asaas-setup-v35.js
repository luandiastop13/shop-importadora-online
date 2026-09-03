/* Asaas secure setup V35 */
(()=>{
const A=id=>document.getElementById(id);
function injectSetupV35(){
  const page=A('a-credit');if(!page)return;
  const off=page.querySelector('.asaasStatusV34.off');
  if(!off||page.querySelector('.asaasSetupV35'))return;
  const box=document.createElement('div');box.className='asaasSetupV35';
  box.innerHTML=`<div><small>CONFIGURAÇÃO SEGURA</small><b>Conectar conta Asaas de produção</b><span>Cole aqui a chave API da sua conta Asaas. Ela será armazenada criptografada e não ficará visível depois de salvar.</span></div><div class="asaasSetupFormV35"><input id="asaasProdKeyV35" class="field" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="$aact_prod_..."><button id="asaasSaveV35" class="btn red" onclick="saveAndActivateAsaasV35()">Salvar e ativar boleto</button></div><p>O token do Webhook é criado automaticamente. Não envie sua chave de API pelo chat.</p>`;
  off.after(box);
}
async function edgeSetupV35(){
  const r=await fetch(U+'/functions/v1/asaas-boleto',{method:'POST',headers:{apikey:K,Authorization:'Bearer '+s.access_token,'Content-Type':'application/json'},body:JSON.stringify({action:'setup_webhook'})});
  const t=await r.text();let d={};try{d=t?JSON.parse(t):{}}catch{d={error:t}};
  if(!r.ok||d?.ok===false)throw Error(d?.error||d?.message||'Falha ao configurar Webhook Asaas');
  return d;
}
window.saveAndActivateAsaasV35=async function(){
  const input=A('asaasProdKeyV35'),btn=A('asaasSaveV35'),key=(input?.value||'').trim();
  if(!key)return toast('Cole a chave API de produção do Asaas');
  if(!key.startsWith('$aact_prod_'))return toast('Use a chave de API da produção do Asaas');
  try{
    if(btn){btn.disabled=true;btn.textContent='Configurando...'};
    await api('/rest/v1/rpc/admin_save_asaas_credentials_v1',{method:'POST',body:JSON.stringify({p_api_key:key})});
    if(input)input.value='';
    await edgeSetupV35();
    toast('Boleto Asaas ativado com sucesso');
    if(typeof window.loadAdminCreditV34==='function')await window.loadAdminCreditV34();
  }catch(e){
    const map={ASAAS_PRODUCTION_API_KEY_REQUIRED:'Use uma chave de produção do Asaas',ASAAS_API_KEY_REQUIRED:'Informe a chave da API Asaas'};
    toast(map[e.message]||e.message);
  }finally{if(btn){btn.disabled=false;btn.textContent='Salvar e ativar boleto'}}
};
function bootV35(){injectSetupV35();const target=A('a-credit')||document.body;new MutationObserver(()=>injectSetupV35()).observe(target,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bootV35,150),{once:true});else setTimeout(bootV35,150);
})();
