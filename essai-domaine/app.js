(function(){
  var W = window;
  var reduit = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── BARRE : elle se pose sur un fond des qu on quitte le haut ── */
  var nav = document.querySelector('.nav');
  function majNav(){ if(nav) nav.classList.toggle('dur', W.scrollY > 24); }
  majNav();
  W.addEventListener('scroll', majNav, {passive:true});

  /* ── VOLET LATERAL ── */
  var burger = document.querySelector('.burger'),
      volet  = document.querySelector('.volet'),
      voile  = document.querySelector('.voile');
  function ouvrir(o){
    if(!volet) return;
    volet.classList.toggle('on', o);
    if(voile) voile.classList.toggle('on', o);
    if(burger) burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    document.body.style.overflow = o ? 'hidden' : '';
  }
  if(burger) burger.addEventListener('click', function(){ ouvrir(!volet.classList.contains('on')); });
  if(voile)  voile.addEventListener('click', function(){ ouvrir(false); });
  if(volet)  volet.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ ouvrir(false); });
  });
  /* la touche Echap referme : on n enferme jamais le visiteur */
  W.addEventListener('keydown', function(e){ if(e.key === 'Escape') ouvrir(false); });

  /* ── TITRES DECOUPES EN MOTS ──
     Ils montent un par un quand la section arrive. Ca vit au doigt comme a la
     souris, donc ca marche aussi sur telephone ou il n y a pas de survol. ── */
  document.querySelectorAll('h2.titre').forEach(function(h){
    var mots = h.textContent.trim().split(/\s+/);
    h.textContent = '';
    mots.forEach(function(m, i){
      var w = document.createElement('span'); w.className = 'mot';
      var b = document.createElement('b'); b.textContent = m;
      b.style.transitionDelay = (i * 0.05) + 's';
      w.appendChild(b); h.appendChild(w);
      if(i < mots.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });

  /* ── REVELATIONS AU SCROLL ── */
  var cibles = document.querySelectorAll('.rv, h2.titre');
  if(reduit || !('IntersectionObserver' in W)){
    cibles.forEach(function(el){ el.classList.add('vu'); });
  } else {
    var io = new IntersectionObserver(function(entrees){
      entrees.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('vu'); io.unobserve(en.target); }
      });
    }, {rootMargin:'0px 0px -12% 0px', threshold:0.05});
    cibles.forEach(function(el){ io.observe(el); });
  }

  /* ── FORMULAIRE ──
     Sur un hebergement statique il n y a pas de serveur pour recevoir un envoi.
     Plutot qu un formulaire qui ne fait rien (le pire des cas : le visiteur croit
     avoir envoye sa demande), on ouvre son logiciel de mail avec le message
     deja redige. Rien ne se perd. A remplacer par un vrai service d envoi le jour
     de la mise en production. */
  var form = document.getElementById('devis');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var v = function(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var nom = v('nom'), tel = v('tel'), mail = v('mail'), msg = v('msg');
      if(!nom || (!tel && !mail)){
        var av = form.querySelector('.avis-form');
        if(!av){
          av = document.createElement('p'); av.className = 'avis-form';
          form.insertBefore(av, form.querySelector('.envoi'));
        }
        av.textContent = 'Merci d indiquer votre nom et au moins un moyen de vous joindre.';
        return;
      }
      var corps = 'Nom : ' + nom + String.fromCharCode(10)
                + 'Telephone : ' + (tel || 'non renseigne') + String.fromCharCode(10)
                + 'Email : ' + (mail || 'non renseigne') + String.fromCharCode(10)
                + String.fromCharCode(10) + 'Demande :' + String.fromCharCode(10) + msg;
      window.location.href = 'mailto:contact@romain-couverture-94.fr'
        + '?subject=' + encodeURIComponent('Demande de devis - ' + nom)
        + '&body=' + encodeURIComponent(corps);
    });
  }

  /* ── L INVITE DE SCROLL DISPARAIT AU PREMIER GESTE ──
     Une invitation qui reste affichee dit au visiteur qu on doute qu il ait compris. ── */
  var invite = document.querySelector('.invite');
  function partir(){ if(invite) invite.classList.add('off'); }
  W.addEventListener('scroll', partir, {passive:true, once:true});
  W.addEventListener('wheel', partir, {passive:true, once:true});
  W.addEventListener('touchstart', partir, {passive:true, once:true});
})();
