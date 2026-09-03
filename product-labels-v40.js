/* Commercial product labels V40 */
(()=>{
  const LABELS={novo:'NOVO',oferta:'OFERTA',mais_vendido:'MAIS VENDIDO',ultimas_unidades:'ÚLTIMAS UNIDADES'};
  const klass=v=>v?` promo-${String(v).replace(/_/g,'-')}`:'';
  const badge=v=>LABELS[v]?`<span class="promoBadgeV40${klass(v)}">${LABELS[v]}</span>`:'';
  const merge=(arr,rows)=>{const m=new Map((rows||[]).map(r=>[r.product_id,r.promo_label||null]));(arr||[]).forEach(x=>{if(m.has(x.id))x.promo_label=m.get(x.id)});};
  async function loadClientLabels(){try{const rows=await api('/rest/v1/rpc/get_product_promo_labels_v1',{method:'POST',body:'{}'});merge(cat,rows)}catch(e){console.warn('promo labels',e.message)}}
  async function loadAdminLabels(){if(!adm?.ok)return;try{const rows=await api('/rest/v1/rpc/get_admin_product_promo_labels_v1',{method:'POST',body:'{}'});merge(adm.products,rows)}catch(e){console.warn('admin promo labels',e.message)}}
  function decorateCard(base,x){let h=base(x),b=badge(x?.promo_label);if(!b)return h;const m='</div><div class="prodMeta">';if(h.includes(m))return h.replace(m,b+m);const m2='</div><small>';return h.includes(m2)?h.replace(m2,b+m2):h}
  const cardBase=typeof proCard==='function'?proCard:card;
  function promoCardV40(x){return decorateCard(cardBase,x)}
  proCard=promoCardV40;card=promoCardV40;
  function repaint(){try{renderProducts?.();if(typeof paintHomeFeaturedV37==='function')paintHomeFeaturedV37();else if(document.getElementById('homeGrid'))document.getElementById('homeGrid').innerHTML=(cat||[]).filter(x=>x.active!==false&&x.featured&&+x.stock_qty>0).slice(0,6).map(promoCardV40).join('')}catch(e){console.warn('promo repaint',e.message)}}
  const loadCatBaseV40=loadCat;
  loadCat=async function(){const r=await loadCatBaseV40.apply(this,arguments);await loadClientLabels();repaint();return r};
  const loadAdminBaseV40=loadAdmin;
  loadAdmin=async function(){const r=await loadAdminBaseV40.apply(this,arguments);await loadAdminLabels();try{renderAdminProducts?.()}catch{}return r};
  function ensureControl(){if(!adm?.ok)return;const grid=document.querySelector('#productModal .productEditBox .two');if(!grid||document.getElementById('promoLabelControlV40'))return;const d=document.createElement('div');d.id='promoLabelControlV40';d.className='promoLabelControlV40 full';d.innerHTML='<div><b>🏷️ Etiqueta comercial</b><small>Mostrada sobre a foto do produto na Home e no catálogo.</small></div><select id="ppromoLabelV40" class="field"><option value="">Sem etiqueta</option><option value="novo">NOVO</option><option value="oferta">OFERTA</option><option value="mais_vendido">MAIS VENDIDO</option><option value="ultimas_unidades">ÚLTIMAS UNIDADES</option></select>';const featured=document.getElementById('featuredControlV37');featured?.after(d)||grid.appendChild(d)}
  const editBaseV40=editProduct;
  editProduct=function(id=''){const r=editBaseV40.apply(this,arguments);setTimeout(()=>{ensureControl();const x=id?(adm.products||[]).find(p=>p.id===id):null;const s=document.getElementById('ppromoLabelV40');if(s)s.value=x?.promo_label||''},0);return r};
  function patchDetail(){const x=detailProduct,box=document.getElementById('detailMainImage');if(!box)return;box.querySelector('.detailPromoBadgeV40')?.remove();if(!LABELS[x?.promo_label])return;const el=document.createElement('span');el.className=`promoBadgeV40 detailPromoBadgeV40${klass(x.promo_label)}`;el.textContent=LABELS[x.promo_label];box.appendChild(el)}
  const openDetailBaseV40=window.openProductDetail;
  if(typeof openDetailBaseV40==='function')window.openProductDetail=function(){const r=openDetailBaseV40.apply(this,arguments);setTimeout(patchDetail,0);return r};
  const setDetailBaseV40=window.setDetailImage;
  if(typeof setDetailBaseV40==='function')window.setDetailImage=function(){const r=setDetailBaseV40.apply(this,arguments);setTimeout(patchDetail,0);return r};
  const saveBaseV40=saveProduct;
  saveProduct=async function(){ensureControl();const desired=document.getElementById('ppromoLabelV40')?.value||'',id0=val('pi'),sku0=val('psku');await saveBaseV40.apply(this,arguments);let x=id0?(adm.products||[]).find(p=>p.id===id0):(adm.products||[]).find(p=>String(p.sku||'')===String(sku0||''));if(!x){await loadAdmin();x=(adm.products||[]).find(p=>String(p.sku||'')===String(sku0||''))}if(!x)return;try{await api('/rest/v1/rpc/admin_set_product_promo_label_v1',{method:'POST',body:JSON.stringify({p_product_id:x.id,p_label:desired||null})});x.promo_label=desired||null;const c=(cat||[]).find(p=>p.id===x.id);if(c)c.promo_label=desired||null;repaint();try{renderAdminProducts?.()}catch{}toast(desired?'Produto salvo com etiqueta '+LABELS[desired]:'Produto salvo sem etiqueta')}catch(e){toast(e.message==='INVALID_PROMO_LABEL'?'Etiqueta inválida':e.message)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensureControl,0),{once:true});else setTimeout(ensureControl,0);
})();
