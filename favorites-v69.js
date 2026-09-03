/* Shop Importadora V69 — Favoritos do lojista */
(()=>{
  const KEY='shop_favorites_v69';

  function injectFavoriteStyleV69(){
    if(document.getElementById('favoritesStyleV69'))return;
    const s=document.createElement('style');
    s.id='favoritesStyleV69';
    s.textContent=`
      .favoriteHeartV69{position:absolute!important;right:7px!important;top:7px!important;z-index:35!important;width:36px!important;height:36px!important;min-width:36px!important;min-height:36px!important;padding:0!important;border-radius:50%!important;border:1px solid #3a444f!important;background:#0d1217e8!important;color:#d7dde3!important;display:grid!important;place-items:center!important;font:900 20px/1 system-ui,-apple-system,sans-serif!important;box-shadow:0 4px 12px #0007!important;backdrop-filter:blur(6px);touch-action:manipulation}
      .favoriteHeartV69.on{background:#ef1d2f!important;border-color:#ff5967!important;color:#fff!important}
      .favoriteHeartV69:active{transform:scale(.92)}
      #favorites{padding-top:2px}.favoritesCardV69{padding:12px!important}.favoritesHeadV69{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}.favoritesHeadV69>div{flex:1;min-width:0}.favoritesHeadV69 h2{margin:2px 0 3px;font-size:22px!important}.favoritesHeadV69 p{margin:0;color:#89949f;font-size:11px!important;line-height:1.4}.favoritesCountV69{border:1px solid #35404a;background:#171e25;border-radius:99px;padding:6px 9px;font-size:10px;font-weight:900;white-space:nowrap}.favoritesEmptyV69{grid-column:1/-1;text-align:center;padding:30px 12px;border:1px dashed #303a45;border-radius:14px;background:#10161b}.favoritesEmptyV69 b{display:block;font-size:15px;margin-bottom:5px}.favoritesEmptyV69 span{display:block;color:#87929d;font-size:11px;line-height:1.45;margin-bottom:12px}.favoriteNavV69 .favoriteNavCountV69{margin-left:auto;min-width:21px;height:21px;padding:0 6px;border-radius:99px;background:#ef1d2f;color:#fff;display:grid;place-items:center;font-size:9px;font-weight:950}
      @media(max-width:560px){.favoriteHeartV69{right:5px!important;top:5px!important;width:33px!important;height:33px!important;min-width:33px!important;min-height:33px!important;font-size:18px!important}.favoritesHeadV69 h2{font-size:20px!important}.favoritesHeadV69 p{font-size:10.5px!important}}
    `;
    document.head.appendChild(s);
  }

  function userKey(){
    try{return String((typeof s!=='undefined'&&s?.user?.id)||(typeof p!=='undefined'&&p?.id)||'default')}
    catch{return 'default'}
  }
  function readAll(){
    try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}
    catch{return{}}
  }
  function getSet(){const all=readAll(),a=Array.isArray(all[userKey()])?all[userKey()]:[];return new Set(a.map(String))}
  function saveSet(set){const all=readAll();all[userKey()]=[...set];localStorage.setItem(KEY,JSON.stringify(all))}
  function productList(){try{return typeof cat!=='undefined'&&Array.isArray(cat)?cat:[]}catch{return[]}}
  function cardProductId(card){return card?.querySelector('.compactActions[data-product]')?.dataset.product||card?.querySelector('[onclick*="openProductDetail"]')?.getAttribute('onclick')?.match(/openProductDetail\(['\"]([^'\"]+)/)?.[1]||''}
  function syncNavCount(){const b=document.getElementById('favoriteNavCountV69');if(b)b.textContent=String(getSet().size)}

  function decorateCards(root=document){
    const favs=getSet();
    root.querySelectorAll('#home .premiumProdCard,#stock .premiumProdCard,#favorites .premiumProdCard,#home .prod,#stock .prod,#favorites .prod').forEach(card=>{
      const id=cardProductId(card);if(!id)return;
      const img=card.querySelector('.premiumProdImage,.img');if(!img)return;
      let b=img.querySelector(':scope>.favoriteHeartV69');
      if(!b){
        b=document.createElement('button');b.type='button';b.className='favoriteHeartV69';
        b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.toggleFavoriteV69(id,b)});
        img.appendChild(b);
      }
      const on=favs.has(String(id));b.classList.toggle('on',on);b.textContent=on?'♥':'♡';b.setAttribute('aria-label',on?'Remover dos favoritos':'Adicionar aos favoritos');
    });
  }

  function ensureUI(){
    injectFavoriteStyleV69();
    const main=document.querySelector('#app .main')||document.querySelector('.main');
    if(main&&!document.getElementById('favorites')){
      const sec=document.createElement('section');sec.id='favorites';sec.className='screen';
      sec.innerHTML='<div class="card favoritesCardV69"><div class="favoritesHeadV69"><div><div class="mut">MINHA LISTA</div><h2>Meus favoritos ❤️</h2><p>Produtos que você marcou para encontrar e comprar mais rápido.</p></div><span id="favoritesCountV69" class="favoritesCountV69">0 produtos</span></div><div id="favoritesGridV69" class="grid"></div></div>';
      const admin=document.getElementById('admin');admin?main.insertBefore(sec,admin):main.appendChild(sec);
    }
    const nav=document.querySelector('.clientNav');
    if(nav&&!nav.querySelector('.favoriteNavV69')){
      const b=document.createElement('button');b.className='favoriteNavV69';b.innerHTML='❤️ <span>Meus favoritos</span><b id="favoriteNavCountV69" class="favoriteNavCountV69">0</b>';b.onclick=()=>window.openFavoritesV69();
      const stock=[...nav.querySelectorAll('button')].find(x=>String(x.getAttribute('onclick')||'').includes('stock'));stock?.after(b)||nav.prepend(b);
    }
    syncNavCount();
  }

  function renderFavorites(){
    ensureUI();const set=getSet(),items=productList().filter(x=>set.has(String(x.id))&&x.active!==false),grid=document.getElementById('favoritesGridV69'),count=document.getElementById('favoritesCountV69');
    if(count)count.textContent=items.length+' produto'+(items.length===1?'':'s');if(!grid)return;
    const fn=typeof proCard==='function'?proCard:(typeof card==='function'?card:null);
    grid.innerHTML=items.length&&fn?items.map(fn).join(''):'<div class="favoritesEmptyV69"><b>Nenhum favorito ainda</b><span>Toque no coração de um produto para guardar aqui.</span><button class="btn red" onclick="go(\'stock\')">Ver catálogo</button></div>';
    requestAnimationFrame(()=>decorateCards(grid));syncNavCount();
  }

  window.toggleFavoriteV69=function(id){
    const set=getSet(),k=String(id);if(set.has(k)){set.delete(k);toast?.('Removido dos favoritos')}else{set.add(k);toast?.('Adicionado aos favoritos')}
    saveSet(set);decorateCards(document);syncNavCount();if(document.getElementById('favorites')?.classList.contains('on'))renderFavorites();
  };
  window.openFavoritesV69=function(){ensureUI();try{clientSide?.(false)}catch{};go?.('favorites');renderFavorites()};

  function boot(){
    ensureUI();decorateCards(document);syncNavCount();
    const main=document.querySelector('#app .main')||document.querySelector('.main');
    if(main)new MutationObserver(m=>{if(m.some(x=>x.addedNodes?.length))requestAnimationFrame(()=>decorateCards(main))}).observe(main,{childList:true,subtree:true});
    window.addEventListener('pageshow',()=>{ensureUI();decorateCards(document);syncNavCount()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,180),{once:true});else setTimeout(boot,180);
})();
