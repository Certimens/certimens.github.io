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
     route existera (penser à autoriser https://certimens.fr dans le CORS). */
  var form = document.querySelector("[data-mailto-form]");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var to = form.getAttribute("data-mailto-form");
      var name = (form.elements.name.value || "").trim();
      var email = (form.elements.email.value || "").trim();
      var message = (form.elements.message.value || "").trim();

      var subject = "[Site Certimens] Message de " + (name || "un visiteur");
      var body =
        "Nom : " +
        name +
        "\nEmail : " +
        email +
        "\n\n" +
        message +
        "\n\n— Envoyé depuis le formulaire de certimens.fr";

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
