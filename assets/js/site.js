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
    var LABELS = {
      fr: { open: "Ouvrir le menu", close: "Fermer le menu" },
      en: { open: "Open the menu", close: "Close the menu" },
    };
    var navLang = (document.documentElement.lang || "fr")
      .slice(0, 2)
      .toLowerCase();
    var navLabels = LABELS[navLang] || LABELS.fr;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      // Le burger devient une croix : son nom accessible doit suivre, sans
      // quoi la synthèse vocale annonce « ouvrir le menu » sur un bouton qui
      // le referme.
      toggle.setAttribute(
        "aria-label",
        open ? navLabels.close : navLabels.open
      );
      document.documentElement.classList.toggle("has-nav-open", open);
      if (open) nav.scrollTop = 0;
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    // Échap referme et rend le focus au burger : le tiroir prend tout l'écran,
    // il faut pouvoir en sortir au clavier.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
        return;
      }

      // Tiroir ouvert, la page derrière est couverte par le voile et
      // verrouillée : le focus ne doit pas y partir. Sans ce rappel, la
      // tabulation quittait le dernier lien du menu pour aller se perdre
      // dans une page qu'on ne voit pas et qu'on ne peut pas faire défiler.
      if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
      // La liste suit l'ordre du DOM — liens du tiroir, lien de langue, puis
      // burger — pour que l'anneau se referme aux deux bouts. Avec le burger
      // en tête de liste, Tab depuis le burger (dernier dans le DOM) partait
      // dans <main>, sous le voile.
      var focusable = Array.prototype.slice.call(
        nav.querySelectorAll("a[href], button:not([disabled])")
      );
      var lang = document.querySelector(".site-lang");
      if (lang && lang.offsetParent !== null) focusable.push(lang);
      focusable.push(toggle);
      focusable = focusable.filter(function (el) {
        return el === toggle || el.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Un appui sur le voile referme aussi. Le voile est un pseudo-élément de
    // <body> : on ne peut pas l'écouter directement, mais tout ce qui est
    // dessous est inerte tant que le tiroir est ouvert, donc un clic qui
    // n'atteint ni le tiroir ni le burger est forcément un clic sur le voile.
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
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

    // Le survol ouvre le panneau juste avant que le clic n'arrive : sans ce
    // garde-fou, le clic d'une souris qui vient de survoler le referme
    // aussitôt.
    var hoverOpenedAt = 0;

    trigger.addEventListener("click", function () {
      if (item.classList.contains("nav-item--open")) {
        if (Date.now() - hoverOpenedAt < 400) return;
        close();
      } else open();
    });

    item.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;
      clearTimer();
      timer = window.setTimeout(function () {
        hoverOpenedAt = Date.now();
        open();
      }, 150);
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
     Le message part vers la plateforme : POST /api/contact (dépôt engine,
     internal/contact) le relaie à notre boîte par e-mail, sans rien stocker.
     Le site reste statique — c'est le serveur de l'application qui reçoit.

     La route est gardée par une preuve de travail (ALTCHA) : le widget posé
     dans le formulaire demande un défi à GET /api/pow/contact/challenge, le
     résout dans le navigateur et rend une charge, que la requête porte dans
     l'en-tête X-Proof-Of-Work. Une charge ne sert qu'une fois : après chaque
     envoi, réussi ou non, le widget est remis à zéro.

     Le filet reste le mailto. Tout ce qui empêche l'envoi direct — widget non
     chargé, réseau, serveur injoignable, refus inattendu — y retombe, avec le
     bloc de repli. Et le piège connu du mailto demeure : sur un poste
     d'université sans client mail local (webmail Zimbra, Roundcube, Gmail
     dans le navigateur), il ne se passe rien. D'où ce bloc, révélé juste
     après : l'adresse et le message s'y copient en un clic.

     Le libellé du message suit la langue de la page (<html lang>) : la même
     page existe en français et en anglais sous /en/, et le visiteur ne doit
     pas recevoir un brouillon dans l'autre langue. */
  var STRINGS = {
    fr: {
      subject: "[Site Certimens] Message de ",
      visitor: "un visiteur",
      name: "Nom",
      email: "Email",
      org: "Établissement",
      profile: "Profil",
      separator: " : ",
      signature: "— Envoyé depuis le formulaire de certimens.fr",
      copy: "Copier",
      copied: "Copié ✓",
      copyFail: "Copie impossible",
      sending: "Envoi en cours…",
      proving: "Vérification en cours, un instant…",
      sent: "Message envoyé. Nous répondons sous 24 heures ouvrées.",
      invalid:
        "Le message n'a pas pu être envoyé : vérifiez votre adresse e-mail et la longueur du message.",
      busy: "Trop de messages envoyés en peu de temps. Réessayez dans quelques minutes.",
      failed:
        "L'envoi direct a échoué : nous ouvrons votre logiciel de messagerie à la place.",
      proof: {
        label: "Je ne suis pas un robot",
        verifying: "Vérification…",
        verified: "Vérifié",
        error: "Vérification impossible. Rechargez la page et réessayez.",
        expired: "La vérification a expiré. Rechargez la page.",
        waitAlert: "Vérification en cours, un instant…",
        footer:
          'Preuve de travail par <a href="https://altcha.org/" tabindex="-1" target="_blank" rel="noopener" aria-label="ALTCHA (site officiel)">ALTCHA</a>',
        ariaLinkLabel: "ALTCHA (site officiel)",
      },
    },
    en: {
      subject: "[Certimens website] Message from ",
      visitor: "a visitor",
      name: "Name",
      email: "Email",
      org: "Institution",
      profile: "Profile",
      separator: ": ",
      signature: "— Sent from the form on certimens.fr",
      copy: "Copy",
      copied: "Copied ✓",
      copyFail: "Copy failed",
      sending: "Sending…",
      proving: "Checking, one moment…",
      sent: "Message sent. We reply within 24 working hours.",
      invalid:
        "The message could not be sent: check your email address and the length of the message.",
      busy: "Too many messages in a short time. Try again in a few minutes.",
      failed: "Direct sending failed: we are opening your mail application instead.",
    },
  };

  var lang = (document.documentElement.lang || "fr").slice(0, 2).toLowerCase();
  var t = STRINGS[lang] || STRINGS.fr;

  function field(form, name) {
    var el = form.elements[name];
    return el ? (el.value || "").trim() : "";
  }

  /* Copie dans le presse-papier, avec repli sur un <textarea> hors écran :
     navigator.clipboard n'existe pas sur les navigateurs anciens, et le
     visiteur qu'on cherche à rattraper ici est précisément celui dont le
     poste est mal équipé. */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(ta);
      if (ok) resolve();
      else reject(new Error("copy unsupported"));
    });
  }

  /* Le bouton change son propre libellé pour dire « Copié ». À l'œil c'est
     limpide ; à la synthèse vocale, la mutation d'un bouton déjà lu ne
     remonte pas de façon fiable. Une région live posée à côté énonce le
     résultat, et elle seule. */
  function announcer(form) {
    var el = form.querySelector("[data-announce]");
    if (!el) {
      el = document.createElement("p");
      el.className = "sr-only";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.setAttribute("data-announce", "");
      form.appendChild(el);
    }
    return el;
  }

  function wireCopyButton(btn, getText, say) {
    btn.addEventListener("click", function () {
      var label = btn.getAttribute("data-label") || btn.textContent.trim();
      btn.setAttribute("data-label", label);
      function done(message) {
        btn.textContent = message;
        say(message);
        window.setTimeout(function () {
          btn.textContent = label;
        }, 2200);
      }
      copyText(getText()).then(
        function () {
          done(t.copied);
        },
        function () {
          done(t.copyFail);
        }
      );
    });
  }

  var form = document.querySelector("[data-mailto-form]");

  if (form) {
    var to = form.getAttribute("data-mailto-form");
    var fallback = form.querySelector("[data-fallback]");

    function composeBody() {
      var parts = [t.name + t.separator + field(form, "name")];
      parts.push(t.email + t.separator + field(form, "email"));
      var org = field(form, "organisation");
      if (org) parts.push(t.org + t.separator + org);
      var profile = field(form, "profile");
      if (profile) parts.push(t.profile + t.separator + profile);
      return (
        parts.join("\n") + "\n\n" + field(form, "message") + "\n\n" + t.signature
      );
    }

    /* Le repli : le client mail du visiteur, puis le bloc qui permet de s'en
       sortir à la main. */
    function sendByMail() {
      var subject = t.subject + (field(form, "name") || t.visitor);

      window.location.href =
        "mailto:" +
        to +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(composeBody());

      // Révélé sans condition : il n'existe aucun moyen fiable de savoir si
      // le client mail s'est ouvert. Mieux vaut l'afficher toujours que de
      // laisser le visiteur devant un bouton qui n'a rien fait.
      // Le focus y va : apparaître sous un bouton qu'on vient d'actionner
      // ne se remarque pas à la synthèse vocale.
      if (fallback) {
        fallback.classList.add("is-on");
        fallback.setAttribute("tabindex", "-1");
        fallback.focus();
      }
    }

    /* L'envoi direct ------------------------------------------------------ */
    var api = form.getAttribute("data-contact-api");
    var proof = form.querySelector("altcha-widget");
    var submit = form.querySelector('button[type="submit"]');
    var payload = null; // la charge résolue, valable une fois
    var waiting = null; // l'envoi qui attend la fin de la vérification
    var busy = false;

    // Le widget ne parle français que si on le lui apprend : son paquet
    // n'embarque que l'anglais, et chaque fichier de langue d'ALTCHA est une
    // copie entière du widget. Mêmes libellés que l'application.
    if (t.proof && window.$altcha && window.$altcha.i18n) {
      var english = window.$altcha.i18n.get("en") || {};
      var french = {};
      var key;
      for (key in english) french[key] = english[key];
      for (key in t.proof) french[key] = t.proof[key];
      window.$altcha.i18n.set("fr", french);
    }

    var status = document.createElement("p");
    status.className = "form__status";
    status.setAttribute("role", "status");
    form.insertBefore(status, fallback || null);

    function show(message, kind) {
      status.className =
        "form__status is-on" + (kind ? " form__status--" + kind : "");
      status.textContent = message;
    }

    function setBusy(on) {
      busy = on;
      if (submit) submit.disabled = on;
    }

    // Vrai seulement si le script du widget a tourné : sinon <altcha-widget>
    // est un élément inconnu, qui ne résoudra jamais rien.
    function canSendDirect() {
      return !!(
        api &&
        proof &&
        window.fetch &&
        window.customElements &&
        window.customElements.get("altcha-widget")
      );
    }

    function resetProof() {
      payload = null;
      if (proof && typeof proof.reset === "function") proof.reset();
    }

    function giveUp() {
      waiting = null;
      setBusy(false);
      show(t.failed, "error");
      resetProof();
      sendByMail();
    }

    // Le corps de la requête. La route ne connaît ni « établissement » ni
    // « profil » : ils entrent en tête du message, comme dans le mailto.
    function requestBody() {
      var lines = [];
      var org = field(form, "organisation");
      if (org) lines.push(t.org + t.separator + org);
      var profile = field(form, "profile");
      if (profile) lines.push(t.profile + t.separator + profile);
      var head = lines.length ? lines.join("\n") + "\n\n" : "";
      return JSON.stringify({
        name: field(form, "name"),
        email: field(form, "email"),
        message: head + field(form, "message") + "\n\n" + t.signature,
        kind: "help",
      });
    }

    function post() {
      var spent = payload;
      payload = null;
      show(t.sending);
      window
        .fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Proof-Of-Work": spent,
          },
          body: requestBody(),
        })
        .then(function (res) {
          if (res.status === 204) {
            setBusy(false);
            form.reset();
            resetProof();
            if (fallback) fallback.classList.remove("is-on");
            show(t.sent, "ok");
            return;
          }
          // Deux refus que le visiteur peut corriger lui-même : le mailto
          // n'y changerait rien, on les dit et on rend la main.
          if (res.status === 400 || res.status === 429) {
            setBusy(false);
            resetProof();
            show(res.status === 400 ? t.invalid : t.busy, "error");
            return;
          }
          giveUp();
        })
        .catch(giveUp);
    }

    if (proof) {
      proof.addEventListener("statechange", function (e) {
        var detail = e.detail || {};
        payload =
          detail.state === "verified" && detail.payload ? detail.payload : null;
        // Un défi vaut dix minutes, et un message soigné en prend parfois
        // plus : plutôt que de laisser le widget demander de recharger la
        // page — et de perdre ce qui est écrit —, on relance la vérification.
        if (detail.state === "expired" && !waiting) {
          if (typeof proof.verify === "function") {
            var again = proof.verify();
            if (again && typeof again.catch === "function") {
              again.catch(function () {});
            }
          }
          return;
        }
        if (!waiting) return;
        if (payload) {
          window.clearTimeout(waiting);
          waiting = null;
          post();
        } else if (detail.state === "error" || detail.state === "expired") {
          window.clearTimeout(waiting);
          giveUp();
        }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;

      if (!canSendDirect()) {
        sendByMail();
        return;
      }

      setBusy(true);
      if (payload) {
        post();
        return;
      }

      // La vérification n'est pas finie. En pratique le widget retient
      // lui-même l'envoi tant qu'il n'a pas fini (sa case est « required »,
      // et le navigateur le dit dans une bulle) ; ce chemin couvre le cas où
      // il ne le ferait pas. On lance, on attend, pas indéfiniment : un
      // téléphone fatigué met quelques secondes, pas trente.
      show(t.proving);
      waiting = window.setTimeout(giveUp, 30000);
      var state = typeof proof.getState === "function" ? proof.getState() : "";
      if (state !== "verifying" && typeof proof.verify === "function") {
        var started = proof.verify();
        if (started && typeof started.catch === "function") {
          started.catch(function () {});
        }
      }
    });

    var live = announcer(form);
    function say(message) {
      live.textContent = "";
      window.setTimeout(function () {
        live.textContent = message;
      }, 60);
    }

    // Il y a deux boutons « copier l'adresse » : un à côté de l'envoi, un
    // dans le bloc de repli. Les deux doivent marcher.
    var addressButtons = form.querySelectorAll("[data-copy-address]");
    for (var a = 0; a < addressButtons.length; a++) {
      wireCopyButton(
        addressButtons[a],
        function () {
          return to;
        },
        say
      );
    }

    var messageButtons = form.querySelectorAll("[data-copy-message]");
    for (var m = 0; m < messageButtons.length; m++) {
      wireCopyButton(messageButtons[m], composeBody, say);
    }
  }
})();
