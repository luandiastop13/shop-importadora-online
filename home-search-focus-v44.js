/* Home search first-tap focus V44 */
(()=>{
function bind(){
  const btn=document.querySelector('#home .homeV13Search');
  if(!btn||btn.dataset.searchV44==='1')return;
  btn.dataset.searchV44='1';
  btn.removeAttribute('onclick');
  btn.onclick=null;
  btn.addEventListener('click',e=>{
    e.preventDefault();
    try{go('stock')}catch{}
    const q=document.getElementById('q');
    if(!q)return;
    try{q.focus({preventScroll:true})}catch{try{q.focus()}catch{}}
    try{const n=String(q.value||'').length;q.setSelectionRange(n,n)}catch{}
    requestAnimationFrame(()=>{try{q.scrollIntoView({block:'center',behavior:'smooth'})}catch{}});
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
window.addEventListener('pageshow',bind);
})();
