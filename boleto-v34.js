/* Boleto 30 dias + crédito de cliente V34 */
(()=>{
const A=id=>document.getElementById(id);
const EDGE=U+'/functions/v1/asaas-boleto';
let boletoState={selected:'pix',status:null,adminCredits:[],orders:[],currentIssue:null,currentOrder:null};

const errPt=e=>({
  BOLETO_PROVIDER_NOT_CONFIGURED:'A integração do boleto ainda não está configurada.',
  ASAAS_API_KEY_MISSING:'A chave da API Asaas ainda não foi cadastrada.',
  ASAAS_WEBHOOK_TOKEN_INVALID:'O token do Webhook Asaas ainda não foi configurado corretamente.',
  CREDIT_NOT_APPROVED:'O crédito para boleto ainda não foi aprovado para este cliente.',
  CREDIT_LIMIT_NOT_SET:'Defina um limite de crédito para liberar o boleto.',
  CREDIT_LIMIT_EXCEEDED:'O valor do pedido ultrapassa o crédito disponível.',
  DOCUMENT_REQUIRED_FOR_BOLETO:'Cadastre CPF ou CNPJ nos dados de faturamento.',
  VALID_CPF_CNPJ_REQUIRED:'Cadastre um CPF ou CNPJ válido nos dados de faturamento.',
  ADMIN_REQUIRED:'Acesso de administrador necessário.'
})[String(e||'')]||String(e||'Erro na operação');

async function boletoEdge(body){
  if(!s?.access_token)throw Error('Faça login novamente');
  const r=await fetch(EDGE,{method:'POST',headers:{apikey:K,Authorization:'Bearer '+s.access_token,'Content-Type':'application/json'},body:JSON.stringify(body||{})});
  const t=await r.text();let d={};try{d=t?JSON.parse(t):{}}catch{d={error:t}}
  if(!r.ok||d?.ok===false)throw Error(errPt(d?.error||d?.message||'Falha na integração Asaas'));
  return d;
}

async function loadBoletoStatusV34(){
  try{boletoState.status=await boletoEdge({action:'status'})}catch(e){boletoState.status={ok:false,configured:false,error:e.message}}
  return boletoState.status;
}

function creditV34(){return boletoState.status?.credit||{}}
function boletoReadyV34(){const c=creditV34();return !!(boletoState.status?.configured&&c.credit_approved&&c.document_present&&Number(c.credit_available)>0)}
function boletoReasonV34(){
  const st=boletoState.status||{},c=creditV34();
  if(!st.api_key_present)return 'Integração Asaas aguardando configuração';
  if(!st.webhook_token_valid)return 'Webhook Asaas aguardando configuração';
  if(!st.enabled)return 'Boleto ainda não foi ativado pelo administrador';
  if(!c.document_present)return 'Cadastre CPF/CNPJ no faturamento';
  if(!c.credit_approved)return 'Crédito para boleto ainda não aprovado';
  if(Number(c.credit_available)<=0)return 'Sem crédito disponível no momento';
  return 'Boleto indisponível';
}

function ensureBoletoModalV34(){
  if(A('boletoModalV34'))return;
  const m=document.createElement('div');m.id='boletoModalV34';m.className='modal';
  m.innerHTML=`<div class="modalBox boletoModalBoxV34"><div class="modalHead"><div><div class="mut">PEDIDO CRIADO</div><h2>Boleto 30 dias</h2></div><button class="btn" onclick="closeM('boletoModalV34')">✕</button></div><div id="boletoResultV34"></div><button class="btn saveWide" onclick="closeM('boletoModalV34');go('orders')">Acompanhar meu pedido</button></div>`;
  document.body.appendChild(m);
}

function fmtDateV34(v){if(!v)return '—';try{return new Date(String(v).length===10?v+'T12:00:00':v).toLocaleDateString('pt-BR')}catch{return String(v)}}
window.copyBoletoLineV34=async function(){const line=boletoState.currentIssue?.identification_field||boletoState.currentOrder?.boleto_identification_field||'';if(!line)return toast('Linha digitável ainda não disponível');try{await navigator.clipboard.writeText(line);toast('Linha digitável copiada')}catch{toast('Copie a linha digitável exibida')}};
window.openBoletoUrlV34=function(){const d=boletoState.currentIssue||{},o=boletoState.currentOrder||{},url=d.bank_slip_url||d.invoice_url||o.boleto_bank_slip_url||o.boleto_invoice_url;if(!url)return toast('Link do boleto ainda não disponível');window.open(url,'_blank','noopener,noreferrer')};
window.retryBoletoIssueV34=async function(orderId){try{const d=await boletoEdge({action:'issue',order_id:orderId});boletoState.currentIssue=d;const o=(boletoState.orders||[]).find(x=>String(x.id)===String(orderId))||boletoState.currentOrder||{};renderBoletoResultV34(o,d,null);await loadBoletoOrdersV34()}catch(e){toast(e.message)}};

function renderBoletoResultV34(o,issue,issueError){
  ensureBoletoModalV34();boletoState.currentOrder=o||{};boletoState.currentIssue=issue||null;
  const out=A('boletoResultV34');if(!out)return;
  const due=issue?.due_date||o?.boleto_due_date||o?.payment_due_at;
  const line=issue?.identification_field||o?.boleto_identification_field||'';
  const hasUrl=!!(issue?.bank_slip_url||issue?.invoice_url||o?.boleto_bank_slip_url||o?.boleto_invoice_url);
  out.innerHTML=`<div class="boletoHeroV34"><div><small>Pedido #${esc(o?.order_number||'')}</small><strong>${money(o?.total||0)}</strong><span>Vencimento ${fmtDateV34(due)}</span></div><b>30 dias</b></div>${issueError?`<div class="boletoWarnV34"><b>Pedido criado, boleto pendente de emissão</b><span>${esc(issueError)}</span><button class="btn red" onclick="retryBoletoIssueV34('${esc(o?.order_id||o?.id||'')}')">Tentar emitir novamente</button></div>`:`<div class="boletoOkV34">✓ Boleto emitido com sucesso</div>`}${line?`<div class="boletoLineV34"><small>Linha digitável</small><b>${esc(line)}</b><button class="btn" onclick="copyBoletoLineV34()">Copiar linha digitável</button></div>`:''}${hasUrl?`<button class="btn red saveWide" onclick="openBoletoUrlV34()">Abrir boleto</button>`:''}<div class="mut boletoFootV34">O pagamento será atualizado automaticamente quando o Asaas confirmar o recebimento.</div>`;
  A('boletoModalV34').classList.add('on');
}

function ensurePaymentChoiceV34(){
  const modal=A('checkout'),box=modal?.querySelector('.pixChoice');if(!box)return;
  box.classList.add('paymentChoiceV34');box.id='paymentChoiceV34';
  const card=box.closest('.approvedCheckoutCard');const head=card?.querySelector('.approvedCheckoutCardHead b');if(head)head.textContent='Escolha a forma de pagamento';
  renderPaymentChoiceV34();
}

function renderPaymentChoiceV34(){
  const box=A('paymentChoiceV34');if(!box)return;const c=creditV34(),ready=boletoReadyV34();
  box.innerHTML=`<div class="paymentButtonsV34"><button type="button" class="paymentBtnV34 ${boletoState.selected==='pix'?'on':''}" onclick="selectPaymentV34('pix')"><b>PIX</b><span>Pagamento à vista</span></button><button type="button" class="paymentBtnV34 ${boletoState.selected==='boleto_30d'?'on':''} ${ready?'':'disabled'}" onclick="selectPaymentV34('boleto_30d')"><b>Boleto 30 dias</b><span>${ready?`Crédito disponível ${money(c.credit_available||0)}`:esc(boletoReasonV34())}</span></button></div>${ready?`<div class="creditMiniV34"><span>Limite aprovado: <b>${money(c.credit_limit||0)}</b></span><span>Disponível: <b>${money(c.credit_available||0)}</b></span><span>Prazo: <b>${Number(c.credit_days)||30} dias</b></span></div>`:''}`;
}
window.selectPaymentV34=function(v){if(v==='boleto_30d'&&!boletoReadyV34())return toast(boletoReasonV34());boletoState.selected=v;renderPaymentChoiceV34()};

const checkoutBeforeV34=window.checkout;
if(typeof checkoutBeforeV34==='function')window.checkout=function(){checkoutBeforeV34.apply(this,arguments);boletoState.selected='pix';setTimeout(async()=>{await loadBoletoStatusV34();ensurePaymentChoiceV34()},30)};

window.placeOrder=async function(){
  const btn=A('confirmOrderBtn');let created=null;
  try{
    const method=boletoState.selected==='boleto_30d'?'boleto_30d':'pix';
    if(method==='boleto_30d'){await loadBoletoStatusV34();if(!boletoReadyV34())throw Error(boletoReasonV34())}
    const items=Object.entries(cart||{}).map(([product_id,quantity])=>({product_id,quantity:+quantity}));
    const body={p_store_name:A('cs').value,p_responsible_name:A('cn').value,p_phone:A('cp').value,p_document:p?.document||'',p_cep:A('cc').value,p_street:A('ct').value,p_address_number:A('cno').value,p_district:A('cbairro').value,p_complement:'',p_city:A('cci').value,p_state:A('cu').value,p_shipping_method:A('cm').value,p_payment_method:method,p_coupon_code:'',p_items:items};
    if(btn){btn.disabled=true;btn.textContent=method==='boleto_30d'?'Criando pedido e boleto...':'Criando pedido...'}
    const result=await api('/rest/v1/rpc/create_shop_order_v5',{method:'POST',body:JSON.stringify(body)});created=Array.isArray(result)?result[0]:result;
    let issue=null,issueError=null;
    if(method==='boleto_30d'){try{issue=await boletoEdge({action:'issue',order_id:created.order_id})}catch(e){issueError=e.message}}
    cart={};localStorage.setItem(CK,'{}');closeM('checkout');
    await Promise.all([loadCat(),loadOrders(),typeof loadCheckoutSettings==='function'?loadCheckoutSettings():Promise.resolve()]);
    if(method==='boleto_30d'){await loadBoletoOrdersV34();const full=(boletoState.orders||[]).find(x=>String(x.id)===String(created.order_id))||created;renderBoletoResultV34({...full,...created},issue,issueError)}
    else{renderPixResult(created);A('pixModal')?.classList.add('on')}
  }catch(e){toast(errPt(e.message))}finally{if(btn){btn.disabled=false;btn.textContent='Confirmar pedido'}}
};

async function loadBoletoOrdersV34(){try{boletoState.orders=await api('/rest/v1/rpc/get_my_orders_v4',{method:'POST',body:'{}'})||[]}catch{boletoState.orders=[]}patchOrdersV34();return boletoState.orders}
function paymentLabelV34(o){if(o?.payment_method==='boleto_30d')return o.payment_status==='paid'?'Boleto pago':'Boleto 30 dias';return o?.payment_status==='paid'?'PIX pago':'PIX pendente'}
function patchOrdersV34(){
  const cards=[...document.querySelectorAll('#orders .approvedOrder')];cards.forEach(card=>{const txt=card.querySelector('.approvedOrderTop b')?.textContent||'',num=(txt.match(/#(\d+)/)||[])[1];const o=(boletoState.orders||[]).find(x=>String(x.order_number)===String(num));if(!o)return;const pay=card.querySelector('.approvedPay');if(pay)pay.textContent=(o.payment_status==='paid'?'✓ ':'• ')+paymentLabelV34(o);const meta=[...card.querySelectorAll('.approvedOrderMeta>div')].find(x=>x.querySelector('small')?.textContent==='PAGAMENTO');if(meta?.querySelector('b'))meta.querySelector('b').textContent=o.payment_method==='boleto_30d'?'BOLETO 30 DIAS':'PIX';if(o.payment_method==='boleto_30d'){const acts=card.querySelector('.approvedOrderActions');if(acts&&!acts.querySelector('.boletoOpenBtnV34')){const b=document.createElement('button');b.className='btn red boletoOpenBtnV34';b.textContent=o.boleto_bank_slip_url||o.boleto_invoice_url?'Abrir boleto':'Emitir boleto';b.onclick=()=>showOrderBoletoV34(o.id);acts.appendChild(b)}}});
}
window.showOrderBoletoV34=async function(id){let o=(boletoState.orders||[]).find(x=>String(x.id)===String(id));if(!o){await loadBoletoOrdersV34();o=(boletoState.orders||[]).find(x=>String(x.id)===String(id))}if(!o)return toast('Pedido não encontrado');let issue=null,err=null;if(!o.boleto_bank_slip_url&&!o.boleto_invoice_url){try{issue=await boletoEdge({action:'issue',order_id:o.id});await loadBoletoOrdersV34();o=(boletoState.orders||[]).find(x=>String(x.id)===String(id))||o}catch(e){err=e.message}}renderBoletoResultV34(o,issue,err)};

const loadOrdersBeforeV34=window.loadOrders;
if(typeof loadOrdersBeforeV34==='function')window.loadOrders=async function(){await loadOrdersBeforeV34.apply(this,arguments);await loadBoletoOrdersV34();setTimeout(patchOrdersV34,0)};
const detailBeforeV34=window.approvedOrderDetailV25;
if(typeof detailBeforeV34==='function')window.approvedOrderDetailV25=function(id){detailBeforeV34.apply(this,arguments);const o=(boletoState.orders||[]).find(x=>String(x.id)===String(id));if(!o||o.payment_method!=='boleto_30d')return;setTimeout(()=>{const box=A('approvedOrderDetailModal')?.querySelector('.approvedOrderDetailBox');if(!box)return;box.querySelectorAll('.approvedDetailGrid>div').forEach(d=>{if(d.querySelector('small')?.textContent==='Pagamento'&&d.querySelector('b'))d.querySelector('b').textContent=paymentLabelV34(o)});if(!box.querySelector('.boletoDetailActionV34')){const b=document.createElement('button');b.className='btn red saveWide boletoDetailActionV34';b.textContent=o.boleto_bank_slip_url||o.boleto_invoice_url?'Abrir boleto':'Emitir boleto';b.onclick=()=>showOrderBoletoV34(o.id);box.appendChild(b)}},0)};

function ensureAdminCreditV34(){
  const nav=document.querySelector('#side .nav');if(nav&&!nav.querySelector('[data-p="credit"]')){const b=document.createElement('button');b.dataset.p='credit';b.innerHTML='💳 Crédito / Boleto';b.onclick=()=>adminPage('credit');const customers=nav.querySelector('[data-p="customers"]');customers?.after(b)}
  const content=document.querySelector('.adminContent');if(content&&!A('a-credit')){const p=document.createElement('div');p.id='a-credit';p.className='ap';content.appendChild(p)}
}
async function loadAdminCreditV34(){
  ensureAdminCreditV34();const page=A('a-credit');if(!page)return;if(!adm?.ok){page.innerHTML='<div class="mut">Acesso de administrador necessário.</div>';return}page.innerHTML='<div class="creditLoadingV34">Carregando crédito dos clientes...</div>';
  try{const [rows,status]=await Promise.all([api('/rest/v1/rpc/get_admin_customer_credit_v1',{method:'POST',body:'{}'}),loadBoletoStatusV34()]);boletoState.adminCredits=rows||[];renderAdminCreditV34(status)}catch(e){page.innerHTML=`<div class="card"><b>Não foi possível carregar o crédito</b><p class="mut">${esc(e.message)}</p></div>`}
}
function renderAdminCreditV34(status=boletoState.status){
  const page=A('a-credit');if(!page)return;const rows=boletoState.adminCredits||[];const ready=!!status?.credentials_ready,enabled=!!status?.enabled;
  page.innerHTML=`<div class="creditHeadV34"><div><div class="mut">PAGAMENTO A PRAZO</div><h2>Boleto 30 dias</h2><p>Aprove crédito individualmente e controle o limite disponível de cada lojista.</p></div><button class="btn" onclick="loadAdminCreditV34()">↻ Atualizar</button></div><div class="asaasStatusV34 ${enabled?'ok':ready?'warn':'off'}"><div><small>INTEGRAÇÃO ASAAS</small><b>${enabled?'Boleto ativo':ready?'Credenciais prontas — falta ativar':'Credenciais ainda não configuradas'}</b><span>${enabled?'Webhook e emissão de boletos habilitados.':ready?'Clique em configurar para criar o Webhook e ativar o boleto.':'Cadastre ASAAS_API_KEY e ASAAS_WEBHOOK_TOKEN nos Secrets do Supabase.'}</span></div>${ready&&!enabled?'<button class="btn red" onclick="setupAsaasV34()">Configurar e ativar</button>':''}${enabled?'<button class="btn" onclick="disableBoletoV34()">Desativar boleto</button>':''}</div><div class="creditGridHeadV34"><b>Clientes</b><span>${rows.length} cadastrados</span></div><div class="creditRowsV34">${rows.map(c=>`<div class="creditRowV34"><div class="creditCustomerV34"><b>${esc(c.store_name||c.responsible_name||'Cliente')}</b><small>${esc(c.responsible_name||'')} ${c.city?`• ${esc(c.city)}/${esc(c.state||'')}`:''}</small><span class="${c.document_present?'docOkV34':'docWarnV34'}">${c.document_present?'✓ CPF/CNPJ cadastrado':'! Sem CPF/CNPJ'}</span></div><label class="creditApproveV34"><input id="crOk-${c.id}" type="checkbox" ${c.credit_approved?'checked':''}> Crédito aprovado</label><div class="creditFieldV34"><small>Limite</small><input id="crLimit-${c.id}" class="field" type="number" min="0" step="0.01" value="${Number(c.credit_limit)||0}"></div><div class="creditFieldV34"><small>Prazo</small><input id="crDays-${c.id}" class="field" type="number" min="1" max="180" step="1" value="${Number(c.credit_days)||30}"></div><div class="creditUseV34"><small>Usado / disponível</small><b>${money(c.credit_used||0)} / ${money(c.credit_available||0)}</b></div><button class="btn red" onclick="saveCreditV34('${c.id}')">Salvar</button></div>`).join('')||'<div class="mut">Nenhum cliente cadastrado.</div>'}</div>`;
}
window.loadAdminCreditV34=loadAdminCreditV34;
window.saveCreditV34=async function(id){try{const approved=!!A('crOk-'+id)?.checked,limit=Number(A('crLimit-'+id)?.value)||0,days=Math.max(1,Math.min(180,Math.floor(Number(A('crDays-'+id)?.value)||30)));await api('/rest/v1/rpc/admin_set_customer_credit_v1',{method:'POST',body:JSON.stringify({p_user_id:id,p_approved:approved,p_limit:limit,p_days:days})});toast('Crédito atualizado');await loadAdminCreditV34()}catch(e){toast(errPt(e.message))}};
window.setupAsaasV34=async function(){try{const r=await boletoEdge({action:'setup_webhook'});toast(r?.enabled?'Boleto ativado com sucesso':'Configuração concluída');await loadAdminCreditV34()}catch(e){toast(errPt(e.message))}};
window.disableBoletoV34=async function(){if(!confirm('Desativar boleto para novos pedidos? Os boletos já emitidos continuam válidos.'))return;try{await boletoEdge({action:'disable_boleto'});toast('Boleto desativado');await loadAdminCreditV34()}catch(e){toast(errPt(e.message))}};

const adminPageBeforeV34=window.adminPage;
if(typeof adminPageBeforeV34==='function')window.adminPage=function(x){ensureAdminCreditV34();adminPageBeforeV34.apply(this,arguments);if(x==='credit'){document.querySelectorAll('.ap').forEach(e=>e.classList.remove('on'));A('a-credit')?.classList.add('on');document.querySelectorAll('#side .nav button').forEach(e=>e.classList.toggle('on',e.dataset.p==='credit'));if(A('adminTitle'))A('adminTitle').textContent='Crédito / Boleto';if(innerWidth<900)side(false);loadAdminCreditV34()}};

function bootV34(){ensureBoletoModalV34();ensureAdminCreditV34();loadBoletoStatusV34().then(()=>{ensurePaymentChoiceV34();if(A('orders')?.classList.contains('on'))loadBoletoOrdersV34()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bootV34,80),{once:true});else setTimeout(bootV34,80);
})();
