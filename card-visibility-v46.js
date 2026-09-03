
/* Margin fallback and shared card visibility V46 */
(()=>{const baseCard=typeof proCard==='function'?proCard:card;function withMargin(x){let h=baseCard(x);if(!h||!h.includes('prodInfoRow')||h.includes('prodProfitPill'))return h;const target='</div><div class="prodActions';const pill='<span class="prodProfitPill noMarginV46">Margem não informada</span>';return h.includes(target)?h.replace(target,pill+target):h}proCard=withMargin;card=withMargin;function repaint(){try{renderProducts?.();if(typeof paintHomeFeaturedV37==='function')paintHomeFeaturedV37();}catch(e){console.warn('margin v46',e)}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(repaint,0),{once:true});else setTimeout(repaint,0);})();

/* V67 — leitura ampliada em todo o aplicativo */
(()=>{
  function applyReadabilityV67(){
    if(document.getElementById('readabilityV67'))return;
    const s=document.createElement('style');
    s.id='readabilityV67';
    s.textContent=`
      html{font-size:16px!important;-webkit-text-size-adjust:100%!important;text-size-adjust:100%!important}
      body{font-size:16px!important;line-height:1.45!important}
      body p,body li,body td,body th,body div,body span,body em{line-height:1.42}
      body p{font-size:14px!important}
      body small,.mut,.msg,.settingsTip,.checkoutSavedHint,.accountHead p,.catalogHead p,.clientStat span,.metric span,.sideBrand small,.clientSideHead small,.row small,.prod small,.infoBox small,.addressCardHead small,.addressText,.defaultCheck,.stockSectionTitle p,.stockProduct small,.stockQty small,.stockMoney small,.stockMovement small,.stockMovementAfter small,.dashItem small,.healthCard small,.quoteNotice,.premiumCartBenefits span,.premiumCartSummaryTop small,.premiumCartSubtotal small,.premiumCartSubtotal span,.premiumCartLineTotal small,.premiumCartLineTotal span,.approvedCheckoutTitle p,.approvedCheckoutCardHead small,.approvedOrderTop small,.approvedOrderAmount small,.approvedOrderMeta small,.approvedStep span,.approvedOrderDetailHead small,.approvedDetailGrid small,.approvedDetailTotal small,.approvedProfile small,.approvedProfile span,.approvedPaneHead .mut,.approvedPaneHead p,.approvedFieldGroup label,.boletoHeroV34 small,.boletoHeroV34 span,.boletoLineV34 small,.creditMiniV34 span,.creditCustomerV34 small,.creditFieldV34 small,.creditUseV34 small,.asaasStatusV34 small,.asaasStatusV34 span,.bannerGuideV36 span,.bannerPreviewTopV36 small,.bannerPreviewTopV36 span,.bannerFileV36 span,.bannerAdminFootV36 span,.featuredControlTextV37 span,.promoLabelControlV40 small,.adminProductTextV43 small,.adminProductPriceV48 small,.adminProductStockV48 small{font-size:13px!important;line-height:1.45!important}
      .mut{font-weight:750!important;letter-spacing:.055em!important}
      button,.btn,.field,input,select,textarea{font-size:16px!important;line-height:1.25!important}
      input,select,textarea,.field{min-height:46px!important}
      textarea{min-height:96px!important;line-height:1.45!important}
      .btn,button{min-height:44px;font-weight:850!important}
      h1{font-size:clamp(30px,6vw,42px)!important;line-height:1.08!important}
      h2{font-size:clamp(22px,4.8vw,28px)!important;line-height:1.15!important}
      h3{font-size:18px!important;line-height:1.25!important}
      .brand b{font-size:22px!important}.brand small{font-size:13px!important}
      .login p{font-size:14px!important}.login h1{font-size:32px!important}
      .bar strong{font-size:16px!important}.bar strong small{font-size:12px!important}
      .helloRetailer{font-size:22px!important}.sectionTitle h2{font-size:23px!important}
      .clientStat strong,.metric strong{font-size:27px!important}.clientStat span,.metric span{font-size:12.5px!important}
      .clientSideHead b{font-size:16px!important}.clientNav button,.nav button{font-size:14px!important;min-height:46px!important}.clientNavSep{font-size:12px!important}
      .bottom{padding-top:7px!important}.bottom button{font-size:12px!important;min-height:56px!important;line-height:1.2!important}.bottom button b{font-size:20px!important;margin-bottom:2px}
      .catalogHead h2,.accountHead h2{font-size:25px!important}.accountBadge{font-size:12px!important}
      .prod h3,.premiumProdCard .prodName,.adminProductNameV48{font-size:14px!important;line-height:1.4!important;min-height:40px!important}
      .prod .price,.premiumProdCard .price{font-size:23px!important}.oldPrice{font-size:12px!important}.marginMini{font-size:12px!important}
      .prodBrand,.prodSku,.prodTierBadge,.tierHint,.prodStockPill,.prodProfitPill,.promoBadgeV40{font-size:12px!important}
      .prodActions .btn,.premiumActions>.btn{font-size:13px!important}
      .row b{font-size:14px!important}.row small{font-size:12.5px!important}
      .price{font-size:23px!important}.infoBox b{font-size:15px!important}.addressCardHead b{font-size:15px!important}.addressTag{font-size:12px!important}.addressText,.defaultCheck{font-size:13px!important}
      .accountCard h3{font-size:18px!important}.accountForm .field{font-size:16px!important}
      .adminTop h2{font-size:24px!important}.sideBrand b{font-size:15px!important}.sideBrand small{font-size:12px!important}
      .adminRow b,.adminProductTextV43 .adminProductNameV48,.adminProductPriceV48 b,.adminProductStockV48 b{font-size:14px!important}.adminRow small{font-size:12px!important}
      .stockHead h2{font-size:25px!important}.stockKpi strong{font-size:24px!important}.stockKpi small{font-size:12px!important}.stockRow b{font-size:14px!important}.stockState{font-size:12px!important}.stockMovementMain b,.stockMovementQty,.stockMovementAfter b{font-size:13px!important}
      .approvedCheckoutTitle .mut,.approvedCheckoutCardHead small{font-size:11px!important}.approvedCheckoutStep{font-size:12px!important}.approvedCheckoutStep i{font-size:12px!important;width:26px!important;height:26px!important}
      .approvedOrderFilter{font-size:12px!important}.approvedOrdersHead p{font-size:13px!important}.approvedOrdersCount{font-size:12px!important}.approvedOrderTop b{font-size:15px!important}.approvedStatus{font-size:11px!important}.approvedOrderAmount strong{font-size:23px!important}.approvedPay{font-size:11px!important}.approvedOrderMeta b{font-size:12px!important}.approvedStep i{font-size:10px!important;width:22px!important;height:22px!important}.approvedStep span{font-size:10.5px!important}
      .approvedProfile h2{font-size:21px!important}.approvedActive{font-size:11px!important}.approvedAccountTab{font-size:11px!important}.approvedAccountTab b{font-size:17px!important}.approvedPaneHead h2{font-size:22px!important}
      .paymentBtnV34 b{font-size:15px!important}.paymentBtnV34 span{font-size:12px!important}.creditMiniV34 span{font-size:11px!important}.boletoHeroV34 strong{font-size:30px!important}.boletoHeroV34>b{font-size:12px!important}.boletoOkV34,.boletoWarnV34 b,.boletoLineV34 b{font-size:13px!important}.boletoWarnV34 span{font-size:12px!important}
      .creditHeadV34 h2,.bannerAdminHeadV36 h2{font-size:25px!important}.creditHeadV34 p,.bannerAdminHeadV36 p{font-size:13px!important}.asaasStatusV34 b{font-size:14px!important}.creditCustomerV34 b{font-size:14px!important}.creditApproveV34{font-size:12px!important}.creditFieldV34 .field{font-size:15px!important}.creditUseV34 b{font-size:12px!important}
      .bannerAdminBadgeV36,.bannerGuideV36 b,.bannerPreviewTopV36 b,.bannerFileV36 b,.bannerAdminFootV36 b{font-size:12px!important}
      .featuredControlTextV37 b{font-size:13px!important}.featuredCountV37{font-size:11px!important}.promoLabelControlV40 b{font-size:13px!important}
      .toast{font-size:13px!important;line-height:1.35!important;padding:10px 14px!important}
      .modalHead h2{font-size:22px!important}
      body *{overflow-wrap:anywhere}
      @media(max-width:700px){
        body{font-size:16px!important}.main{padding-left:10px!important;padding-right:10px!important}
        .grid{gap:10px!important}.prod,.premiumProdCard{padding:10px!important}
        .prod h3,.premiumProdCard .prodName{font-size:13.5px!important;min-height:38px!important}
        .prod small,.premiumProdCard small{font-size:12px!important}
        .prod .price,.premiumProdCard .price{font-size:21px!important}
        .btn,button{font-size:14px!important}
        input,select,textarea,.field{font-size:16px!important}
        .clientNav button,.nav button{font-size:14px!important}
        .bottom button{font-size:12px!important}
        .approvedOrderMeta{grid-template-columns:1fr!important}
        .approvedOrderActions{grid-template-columns:1fr!important}
      }
    `;
    document.head.appendChild(s);
    document.documentElement.dataset.readability='v67';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyReadabilityV67,{once:true});else applyReadabilityV67();
})();
