/* Certimens — interactions minimales (aucune dépendance externe). */
(function () {
  "use strict";

  /* Menu mobile ----------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    // Le tiroir se superpose à la page. Sans verrou, le doigt qui le parcourt
    // fait défiler l'accueil derrière lui, et on se retrouve ailleurs en le
    // refermant. La classe est posée sur <html> : c'est elle qui porte le
    // défilement de la page.
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.documentElement.classList.toggle("has-nav-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    // Au-dessus de 980 px le tiroir n'existe plus : la feuille de style le
    // masque, mais le verrou de défilement, lui, survivrait à l'élargissement
    // de la fenêtre et bloquerait une page sans menu ouvert.
    var narrow = window.matchMedia("(max-width: 980px)");
    if (narrow.addEventListener) {
      narrow.addEventListener("change", function (e) {
        if (!e.matches) setOpen(false);
      });
    }

    // Referme le menu après un clic sur une ancre de la même page. On remonte
    // jusqu'au lien : les entrées du panneau « Solutions » portent un titre et
    // un sous-titre, donc la cible du clic est souvent un élément imbriqué.
    nav.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) setOpen(false);
    });
  }

  /* Menu déroulant « Solutions » -------------------------------------------
     Le déclencheur est un bouton : le survol ouvre aussi le panneau, mais rien
     ne dépend du survol seul — au clavier, Entrée ouvre, Échap referme et
     rend le focus au bouton, et un focus qui sort du bloc le referme.

     Le délai de 150 ms à l'ouverture évite que le panneau s'ouvre quand la
     souris ne fait que traverser l'en-tête ; les 200 ms à la fermeture laissent
     la diagonale souris → premier lien sans refermer sous le curseur.

     Sous 980 px, le panneau est une sous-liste toujours dépliée (la feuille de
     style masque le déclencheur) : on ne fait alors rien du tout. */
  var DESKTOP = "(min-width: 981px)";

  function setupDropdown(item) {
    var trigger = item.querySelector(".nav-menu__trigger");
    var menu = item.querySelector(".nav-menu");
    if (!trigger || !menu) return;

    var timer = null;

    function clearTimer() {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    }

    function open() {
      clearTimer();
      item.classList.add("nav-item--open");
      trigger.setAttribute("aria-expanded", "true");
    }

    function close() {
      clearTimer();
      item.classList.remove("nav-item--open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function isDesktop() {
      return window.matchMedia(DESKTOP).matches;
    }

    trigger.addEventListener("click", function () {
      if (item.classList.contains("nav-item--open")) close();
      else open();
    });

    item.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;
      clearTimer();
      timer = window.setTimeout(open, 150);
    });

    item.addEventListener("mouseleave", function () {
      if (!isDesktop()) return;
      clearTimer();
      timer = window.setTimeout(close, 200);
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) close();
    });

    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && item.classList.contains("nav-item--open")) {
        close();
        trigger.focus();
      }
    });

    // Un focus qui quitte le bloc referme : c'est la tabulation qui sort du
    // dernier lien, et le pendant clavier du mouseleave.
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) close();
    });

    // Un clic ailleurs dans la page referme aussi, menu ouvert au clic.
    document.addEventListener("click", function (e) {
      if (!item.contains(e.target)) close();
    });

    // Refermer le panneau quand on passe en dessous de 980 px : il y devient
    // une sous-liste, et la classe laissée derrière n'y signifierait plus rien.
    var mq = window.matchMedia(DESKTOP);
    if (mq.addEventListener) {
      mq.addEventListener("change", close);
    }
  }

  var items = document.querySelectorAll(".nav-item");
  for (var i = 0; i < items.length; i++) setupDropdown(items[i]);

  /* Formulaire de contact -------------------------------------------------
     Le site est statique : il n'y a pas de backend pour recevoir le message.
     On compose donc un mailto pré-rempli avec le client de l'utilisateur.
     TODO : basculer sur POST /api/contact du moteur Certimens lorsque la
     route existera (penser à autoriser https://certimens.fr dans le CORS).

     Le libellé du message suit la langue de la page (<html lang>) : la même
     page existe en français et en anglais sous /en/, et le visiteur ne doit
     pas recevoir un brouillon dans l'autre langue. */
  var STRINGS = {
    fr: {
      subject: "[Site Certimens] Message de ",
      visitor: "un visiteur",
      name: "Nom",
      email: "Email",
      separator: " : ",
      signature: "— Envoyé depuis le formulaire de certimens.fr",
    },
    en: {
      subject: "[Certimens website] Message from ",
      visitor: "a visitor",
      name: "Name",
      email: "Email",
      separator: ": ",
      signature: "— Sent from the form on certimens.fr",
    },
  };

  var lang = (document.documentElement.lang || "fr").slice(0, 2).toLowerCase();
  var t = STRINGS[lang] || STRINGS.fr;

  var form = document.querySelector("[data-mailto-form]");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var to = form.getAttribute("data-mailto-form");
      var name = (form.elements.name.value || "").trim();
      var email = (form.elements.email.value || "").trim();
      var message = (form.elements.message.value || "").trim();

      var subject = t.subject + (name || t.visitor);
      var body =
        t.name +
        t.separator +
        name +
        "\n" +
        t.email +
        t.separator +
        email +
        "\n\n" +
        message +
        "\n\n" +
        t.signature;

      window.location.href =
        "mailto:" +
        to +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }
})();
