(()=>{
function addStyle(){
  if(document.getElementById('adminNoteCleanStyleV32'))return;
  const s=document.createElement('style');
  s.id='adminNoteCleanStyleV32';
  s.textContent='.adminNoteHistoryHead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0 10px;padding-top:14px;border-top:1px solid #24272e}.adminNoteHistoryHead h3{margin:0 0 3px}.adminNoteHistoryHead p{margin:0}.adminNoteHistoryRows{display:grid;gap:8px}.adminNoteHistoryRow{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #292d34;border-radius:12px;background:#111318}.adminNoteHistoryMain{min-width:0;flex:1}.adminNoteHistoryMain b,.adminNoteHistoryMain small{display:block}.adminNoteHistoryMeta{display:flex;gap:7px;flex-wrap:wrap;margin-top:5px;color:#8f949e;font-size:11px}.adminNoteDelete{flex:0 0 auto}.adminNoteEmpty{padding:18px;text-align:center;color:#8f949e;border:1px dashed #2b2e35;border-radius:12px}@media(max-width:620px){.adminNoteHistoryHead{align-items:flex-start;flex-direction:column}.adminNoteHistoryHead .btn{width:100%}.adminNoteHistoryRow{align-items:flex-start}.adminNoteDelete{padding:8px 10px}}';
  document.head.appendChild(s);
}
function paint(){
  addStyle();
  const page=document.getElementById('a-notifications'),list=document.getElementById('aNotes');
  if(!page||!list||typeof adm==='undefined'||!adm.ok)return;
  let head=document.getElementById('adminNoteHistoryHeadV32');
  if(!head){head=document.createElement('div');head.id='adminNoteHistoryHeadV32';head.className='adminNoteHistoryHead';list.before(head)}
  head.innerHTML='<div><h3>Histórico de notificações</h3><p class="mut">Remova avisos antigos somente desta tela administrativa.</p></div><button class="btn" onclick="adminClearNotificationHistoryV32()">Limpar histórico</button>';
  const a=Array.isArray(adm.history)?adm.history:[];
  list.className='adminNoteHistoryRows';
  list.innerHTML=a.length?a.map(n=>'<div class="adminNoteHistoryRow"><div class="adminNoteHistoryMain"><b>'+esc(n.title)+'</b><small>'+esc(n.body)+'</small><div class="adminNoteHistoryMeta"><span>'+new Date(n.created_at).toLocaleString('pt-BR')+'</span><span>'+(n.user_id?'Cliente específico':'Todos / sistema')+'</span>'+(n.push_dispatched_at?'<span>Push enviado</span>':'')+'</div></div><button class="btn adminNoteDelete" onclick="adminHideNotificationV32(\''+n.id+'\')">Excluir</button></div>').join(''):'<div class="adminNoteEmpty">O histórico está limpo.</div>';
}
window.adminHideNotificationV32=async function(id){
  if(!confirm('Excluir esta notificação do histórico do administrador? O cliente continuará com a notificação recebida.'))return;
  try{
    await api('/rest/v1/rpc/admin_hide_notification_v1',{method:'POST',body:JSON.stringify({p_notification_id:id})});
    adm.history=adm.history.filter(n=>n.id!==id);
    paint();toast('Notificação removida do histórico');
  }catch(e){toast(e.message)}
};
window.adminClearNotificationHistoryV32=async function(){
  const total=(adm.history||[]).length;
  if(!total)return toast('O histórico já está limpo');
  if(!confirm('Limpar todo o histórico de notificações do administrador? As notificações dos clientes serão mantidas.'))return;
  try{
    const n=await api('/rest/v1/rpc/admin_clear_notification_history_v1',{method:'POST',body:'{}'});
    adm.history=[];paint();toast((Number(n)||total)+' notificação(ões) removida(s) do painel');
  }catch(e){toast(e.message)}
};
const renderAdminV32=renderAdmin;
renderAdmin=function(){renderAdminV32();paint()};
const adminPageV32=adminPage;
adminPage=function(x){adminPageV32(x);if(x==='notifications')setTimeout(paint,0)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(paint,0),{once:true});else setTimeout(paint,0);
})();
