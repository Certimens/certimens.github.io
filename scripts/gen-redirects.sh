#!/usr/bin/env bash
# Régénère les pages de redirection des anciennes URLs WordPress.
# GitHub Pages ne sait pas faire de redirection serveur : on publie donc une
# page HTML minimale qui redirige (meta refresh + canonical pour le SEO).
set -euo pipefail

cd "$(dirname "$0")/.."

# ancienne_url -> nouvelle_url
REDIRECTS=(
  "elementor-543|https://monespace.certimens.fr/"
  "connexion|https://monespace.certimens.fr/"
  "hub-etudiant|https://monespace.certimens.fr/"
  "espace-enseignant|https://monespace.certimens.fr/"
  "elementor-487|/mentions-legales/"
  "elementor-515|/politique-de-confidentialite/"
  "index.php/contact|/contact/"
  "index.php/elementor-487|/mentions-legales/"
  "index.php/elementor-515|/politique-de-confidentialite/"
)

for entry in "${REDIRECTS[@]}"; do
  src="${entry%%|*}"
  dst="${entry#*|}"
  mkdir -p "$src"
  cat > "$src/index.html" <<HTML
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Redirection — Certimens</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="$dst" />
    <meta http-equiv="refresh" content="0; url=$dst" />
  </head>
  <body>
    <p>Cette page a déménagé. <a href="$dst">Continuer vers la nouvelle adresse</a>.</p>
    <script>
      window.location.replace("$dst");
    </script>
  </body>
</html>
HTML
  echo "redirect: /$src/ -> $dst"
done
