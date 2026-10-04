/* Certimens — interactions minimales (aucune dépendance externe). */
(function () {
  "use strict";

  /* Menu mobile ----------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Referme le menu après un clic sur une ancre de la même page.
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

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
