
/* Admin product thumbnails V48 — nomes visíveis + ações integradas */
(()=>{
  function productRowsV48(){
    if(typeof adm==='undefined'||!adm?.products)return;
    const root=document.getElementById('aProducts');
    if(!root)return;
    const q=(document.getElementById('aq')?.value||'').trim().toLowerCase();
    const a=(adm.products||[]).filter(x=>((String(x.name||'')+' '+String(x.sku||'')+' '+String(x.brand||'')).toLowerCase()).includes(q));
    root.innerHTML=a.map(x=>{
      const img=x.image_url?'<img loading="lazy" src="'+esc(x.image_url)+'" alt="'+esc(x.name||'Produto')+'">':'<span>📦</span>';
      return '<div class="adminRow adminProductThumbRow adminProductRowV48">'
        +'<div class="adminProductIdentityV43">'
          +'<button type="button" class="adminProductThumbV43" onclick="editProduct(\''+x.id+'\')" aria-label="Editar produto">'+img+'</button>'
          +'<div class="adminProductTextV43"><b class="adminProductNameV48">'+esc(x.name||'Produto sem nome')+'</b><small>'+esc(x.sku||'')+(x.brand?' • '+esc(x.brand):'')+'</small></div>'
        +'</div>'
        +'<div class="adminProductPriceV48"><small>Preço</small><b>'+money(x.sale_price)+'</b></div>'
        +'<div class="adminProductStockV48"><small>Estoque</small><b>'+Number(x.stock_qty||0)+' un.</b></div>'
        +'<div class="adminProductActionsV48">'
          +'<button class="btn" onclick="editProduct(\''+x.id+'\')">Editar</button>'
          +'<button class="btn adminDeleteV48" onclick="deleteAdminProductV48(\''+x.id+'\',this)">Excluir</button>'
        +'</div>'
      +'</div>';
    }).join('')||'<div class="mut">Nenhum produto.</div>';
  }

  window.deleteAdminProductV48=async function(id,btn){
    const x=(typeof adm!=='undefined'&&adm?.products||[]).find(p=>p.id===id);
    const name=x?.name||'este produto';
    if(!confirm('Excluir "'+name+'"?\n\nO produto sairá do catálogo e do estoque. Pedidos antigos continuarão preservados.'))return;
    const old=btn?.textContent||'Excluir';
    try{
      if(btn){btn.disabled=true;btn.textContent='Excluindo...'}
      await api('/rest/v1/rpc/admin_delete_product_v1',{method:'POST',body:JSON.stringify({p_product_id:id})});
      await Promise.all([loadCat(),loadAdmin()]);
      toast('Produto excluído com sucesso');
    }catch(e){
      toast(({PRODUCT_NOT_FOUND:'Produto não encontrado',ADMIN_REQUIRED:'Acesso de administrador necessário'})[e?.message]||e?.message||'Não foi possível excluir o produto');
    }finally{
      if(btn&&document.body.contains(btn)){btn.disabled=false;btn.textContent=old}
    }
  };

  const old=typeof renderAdminProducts==='function'?renderAdminProducts:null;
  renderAdminProducts=function(){try{return productRowsV48()}catch(e){console.warn('admin products v48',e);return old?.apply(this,arguments)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{try{if(typeof adm!=='undefined'&&adm?.ok)productRowsV48()}catch{}},250),{once:true});
  else setTimeout(()=>{try{if(typeof adm!=='undefined'&&adm?.ok)productRowsV48()}catch{}},250);
})();
