# Site vitrine Certimens

Le site vitrine de [certimens.fr](https://certimens.fr/). Aucun framework,
aucune étape de build : ce sont des fichiers HTML/CSS/JS servis tels quels par
GitHub Pages, depuis le dépôt public
[`Certimens/certimens.github.io`](https://github.com/Certimens/certimens.github.io).

Le site existe en deux langues : le **français à la racine**, l'**anglais sous
`/en/`**. `certimens.com` doit rediriger vers la version anglaise — la
redirection n'est pas encore en place (voir
« [Deux langues, deux domaines](#deux-langues-deux-domaines) »).

La connexion se fait sur l'espace client, pas ici : le bouton **Connexion**
pointe vers <https://monespace.certimens.fr/>.

Une partie du site n'est **pas** dans ce dépôt : les pages **`/plugins/`**, qui
expliquent comment installer les quatre agents de mesure, sont publiées par
[`Certimens/plugins`](https://github.com/Certimens/plugins) et servies par
GitHub Pages sous le même domaine, <https://certimens.fr/plugins/>. Voir
« [Les pages des agents](#les-pages-des-agents-plugins) ».

## Structure

```
.
├── index.html                          Accueil FR (ancres #certification, #etapes,
│                                       #comparatif, #securite, #cas-usage, #expertise, #faq)
├── enseignants/index.html              Page de destination « Enseignants & correcteurs »
├── etudiants/index.html                Page de destination « Étudiants »
├── programme-pilote/index.html         Le programme pilote : périmètre, calendrier, engagements
├── contact/index.html                  Formulaire de contact FR
├── mentions-legales/index.html
├── politique-de-confidentialite/index.html
├── en/                                 Version anglaise, même arborescence
│   ├── index.html                      Accueil EN (ancres traduites : #steps,
│   │                                   #comparison, #security, #use-cases…)
│   ├── teachers/index.html             Jumelle anglaise de /enseignants/
│   ├── students/index.html             Jumelle anglaise de /etudiants/
│   ├── pilot-programme/index.html      Jumelle anglaise de /programme-pilote/
│   ├── contact/index.html
│   ├── legal-notice/index.html
│   └── privacy-policy/index.html
├── 404.html                            Bilingue : servie pour toute URL manquante
├── docs/
│   └── charte-graphique.md             La charte, dont les autres dépôts descendent
├── assets/
│   ├── css/style.css                   Feuille de style unique
│   ├── js/site.js                      Menu mobile + formulaire de contact
│   ├── vendor/altcha/                  Widget de preuve de travail (MIT), auto-hébergé
│   ├── fonts/                          Plus Jakarta Sans (500/700/800), auto-hébergée
│   └── img/                            Photographies et marque. `logo.png`
│                                       (300×300) ne sert plus qu'à Open Graph et
│                                       aux données structurées ; les pages chargent
│                                       `logo-128.png`, jamais affiché au-delà de 46 px.
├── .github/
│   ├── workflows/deploy.yml            CI + publication sur GitHub Pages
│   └── dependabot.yml                  Maintient les actions à jour
├── CNAME                               Domaine personnalisé (certimens.fr)
├── .nojekyll                           Désactive Jekyll sur GitHub Pages
├── favicon.ico                         Repli pour les clients qui ignorent <link rel="icon">
├── LICENSE                             Licence propriétaire, bilingue (voir « Licence »)
├── robots.txt
└── sitemap.xml
```

Toute URL qui ne correspond à aucun de ces fichiers tombe sur `404.html`, que
GitHub Pages sert à la place : elle est bilingue, faute de pouvoir connaître la
langue demandée, et renvoie vers l'accueil et le contact.

## Deux langues, deux domaines

Le français est la langue par défaut et vit à la racine ; l'anglais occupe
`/en/`, avec la même arborescence. Les ancres de l'accueil sont, elles,
**traduites** — `#etapes` / `#steps`, `#securite` / `#security` — à l'exception
des trois historiques (`#certification`, `#expertise`, `#faq`), gardées
identiques des deux côtés parce qu'elles circulent déjà :

| Français | Anglais |
| --- | --- |
| `/` | `/en/` |
| `/enseignants/` | `/en/teachers/` |
| `/etudiants/` | `/en/students/` |
| `/programme-pilote/` | `/en/pilot-programme/` |
| `/contact/` | `/en/contact/` |
| `/mentions-legales/` | `/en/legal-notice/` |
| `/politique-de-confidentialite/` | `/en/privacy-policy/` |
| `/plugins/` (autre dépôt) | `/plugins/en/` |

Il n'y a **pas de détection automatique de la langue** : ni redirection sur
`Accept-Language`, ni bascule en JavaScript. Un robot d'indexation n'envoie pas
d'en-tête de langue et se verrait toujours servir la même version ; une
redirection le priverait purement et simplement de l'autre. Le choix est donc
explicite, par le lien `FR`/`EN` de la barre de navigation, présent sur toutes
les pages.

### Ce qui tient le référencement

- **`<html lang>`** vaut `fr` ou `en` selon la page.
- **`<link rel="canonical">`** pointe sur la page elle-même, jamais sur sa
  traduction : les deux versions sont indexables, ce ne sont pas des doublons.
- **`<link rel="alternate" hreflang>`** déclare, sur chaque page, le trio
  complet `fr` / `en` / `x-default` — y compris l'auto-référence, qu'exige la
  spécification. `x-default` désigne le français, langue par défaut du site.
  Les liens sont **réciproques** : une déclaration non rendue par la page cible
  est ignorée par Google.
- **`sitemap.xml`** répète ces alternances en `xhtml:link` pour toutes les URLs,
  ce qui est le second canal accepté par Google pour hreflang.
- **Les données structurées** (`<script type="application/ld+json">`, en fin de
  `<body>`) décrivent le site en schema.org : un `Organization` et un `WebSite`
  identiques sur toutes les pages, rattachés par `@id`, puis un nœud propre à la
  page. Les pages internes portent en plus un `BreadcrumbList`, qui remplace
  l'URL nue par un fil d'Ariane dans les résultats de recherche. Les deux
  accueils sont typés `FAQPage` : **les questions et réponses y sont reprises
  mot pour mot de la FAQ visible**, parce que Google rejette un balisage qui ne
  correspond pas au contenu affiché — modifier l'un sans l'autre est une erreur
  signalée dans la Search Console.
- **Open Graph et `twitter:card`** sont présents sur toutes les pages, y compris
  les quatre pages légales. Le visuel partagé est l'écu, carré : d'où
  `twitter:card` à `summary` et non `summary_large_image`, qui le rognerait en
  bandeau. Un visuel dédié 1200×630 permettrait de rebasculer.
- **`404.html`** est servie par GitHub Pages pour toute URL manquante, `/en/…`
  comprise, sans qu'on puisse en connaître la langue : elle affiche donc les
  deux versions l'une sous l'autre.

### certimens.com

Le `.com` ne sert aucun contenu propre : le faire servirait le même site à deux
adresses, ce qui dilue le référencement et forcerait à choisir un canonique.
Il doit **rediriger en 301 vers `https://certimens.fr/en/`**.

> **À faire** (état constaté le 26 novembre 2026). `http://certimens.com/`
> redirige bien en 301, mais vers `https://certimens.fr` — la racine française,
> pas `/en/` — et `https://certimens.com/` ne répond pas, faute de certificat.
> Restent donc : corriger la cible, et activer le SSL de la redirection.

GitHub Pages n'accepte qu'un seul domaine personnalisé par dépôt — c'est tout
l'objet du fichier `CNAME`, qui porte `certimens.fr`. La redirection se
configure donc chez OVH, dans l'espace client du domaine `certimens.com` :

1. **Domaines → certimens.com → Redirection → Ajouter une redirection.**
2. Cible `https://certimens.fr/en/`, type **redirection permanente (301)** —
   surtout pas « visible » (cadre HTML) ni 302 : la première empêche
   l'indexation, la seconde ne transmet pas l'autorité du domaine.
3. Répéter pour `www.certimens.com`.
4. Activer le certificat SSL proposé pour la redirection, sinon
   `https://certimens.com` renvoie une erreur de certificat avant même de
   rediriger.

Rien à faire côté dépôt : aucun fichier ne mentionne `certimens.com`, et le
`hreflang` anglais désigne bien `certimens.fr/en/`, pas le `.com`.

### Modifier le contenu

Il n'y a pas de gabarit ni d'étape de build : les pages sont dupliquées. Toute
modification d'un contenu partagé (en-tête, pied de page, texte commercial) doit
donc être **reportée dans les deux langues**, sous peine de voir les deux
versions diverger. Les chaînes du formulaire de contact, elles, sont dans
`assets/js/site.js` et suivent le `lang` de la page.

La barre de navigation porte un **menu déroulant « Solutions »**, qui mène aux
trois publics : l'accueil pour un établissement, `/enseignants/` et
`/etudiants/`. Son déclencheur est un `<button aria-expanded>` et non un lien,
parce qu'il n'ouvre pas une page mais un panneau ; le survol l'ouvre aussi, avec
un délai de 150 ms, mais rien ne dépend du survol seul — Entrée ouvre, Échap
referme, et un focus qui sort du bloc referme. Sous 980 px, la feuille de style
masque le déclencheur et le panneau redevient une sous-liste toujours dépliée.
Le comportement est dans `assets/js/site.js`.

Les deux pages légales anglaises sont des **traductions de courtoisie** : elles
portent en tête un encart rappelant que seule la version française fait foi.
Toute correction juridique se fait d'abord en français.

## Les pages des agents (`/plugins/`)

Les quatre agents de mesure — extension de navigateur, complément Word,
extension LibreOffice, extension Visual Studio Code — vivent dans
[`Certimens/plugins`](https://github.com/Certimens/plugins), sous licence
**AGPL-3.0**, et ce dépôt publie avec eux leurs **pages d'installation**. Elles
sont bilingues (`/plugins/`, `/plugins/en/`), reprennent la charte en liant
`/assets/css/style.css` et `/assets/js/site.js` **de ce site-ci** — même hôte,
feuille unique, aucun doublon — et portent la même barre de navigation.

Trois conséquences ici :

- la navigation et le pied de page de **toutes les pages** portent une entrée
  « Plugins » vers `/plugins/` ou `/plugins/en/` — le même libellé, à la même
  place, que la barre des pages d'en face, qui est copiée de celle-ci. Les liens
  sont **relatifs à la racine**, comme tout le reste du site, et pointent donc
  vers `certimens.fr/plugins/` ;
- `sitemap.xml` déclare les deux URLs avec leurs alternances `hreflang`, parce
  qu'elles font partie du site même si elles ne sont pas dans cette
  arborescence ;
- la CI **écarte `/plugins` de la vérification des liens** : lychee résout les
  chemins absolus contre ce dépôt, où ces pages n'existent pas. Le motif
  (`^file:.*/plugins(/|$)`) est ancré sur `file:`, pour que les liens vers
  `github.com/Certimens/plugins` — même chemin, autre schéma — restent vérifiés,
  et il ne réclame pas de barre finale, parce que `--root-dir` résout
  « /plugins/ » en « …/plugins ».

> Une modification de la barre de navigation est donc à **reporter dans les deux
> dépôts** : ici dans toutes les pages, là-bas dans `scripts/build-site.py`.

## Charte graphique

**La charte est tenue ici : [`docs/charte-graphique.md`](docs/charte-graphique.md).**
Ce dépôt est l'implémentation de référence, et les autres supports en
descendent — l'espace client, les gabarits d'e-mail et le certificat PDF
(dépôt `engine`, privé), les agents installés chez l'étudiant
([`Certimens/plugins`](https://github.com/Certimens/plugins), `browser/src/ui.css`,
dont `word/` et `vscode/` sont des liens symboliques).
Une couleur qui change, change d'abord dans ce document et dans
`assets/css/style.css`.

En trois lignes, pour ne pas avoir à ouvrir le document :

- **L'or n'est jamais du texte sur blanc** (2,46:1). Sur fond clair, c'est l'or
  sombre `#705E3A` (6,27:1) ; sur l'ardoise, l'or franc `#C5A059` (5,96:1) ;
  comme surface, il porte de l'encre `#1A202C` (6,64:1).
- **Un seul bouton plein par vue, et il est or.** Tout ce qui est de contour ou
  de texte reste ardoise (`.btn--ghost`, le lien « Connexion » de la barre de
  navigation).
- **Surfaces plates**, rayon 12 px, filet `#E5E5E5`, pas d'ombre — sauf ce qui
  flotte réellement, comme le menu replié en mobile.

Toutes les paires du site passent le niveau AA ; le tableau des contrastes
mesurés est dans le document.

L'icône du site est déclarée sur toutes les pages (`favicon-32.png` en 32×32,
`apple-touch-icon.png` en 180×180) et doublée par un `favicon.ico` à la racine,
que réclament les clients ignorant `<link rel="icon">`.

La police est auto-hébergée depuis `assets/fonts/` — les mêmes fichiers que
ceux embarqués par l'application via `@fontsource`, pour un rendu identique et
zéro appel à Google Fonts.

## Développement local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Les contrôles tournent en CI (voir ci-dessous). Pour les rejouer en local,
il faut Docker :

```bash
# Validation HTML (Nu Html Checker, le validateur du W3C)
docker run --rm -v "$PWD":/data ghcr.io/validator/validator \
  vnu --skip-non-html /data
```

Pour les liens, le binaire autonome de lychee évite Docker. Reprendre les
mêmes arguments que la CI, faute de quoi les résultats diffèrent :

```bash
lychee --root-dir "$PWD" --index-files index.html --include-fragments \
       --accept 200..=299,403,429 \
       --exclude '^file:.*/plugins(/|$)' --exclude '^https://certimens\.fr' \
       './**/*.html'
```

`--root-dir` résout les liens en `/…` et `--index-files` fait pointer un lien
vers un dossier sur son `index.html` : sans ces deux options, toutes les ancres
`/#faq` sont signalées à tort.

## Déploiement

Le workflow `.github/workflows/deploy.yml` s'exécute à chaque push :

1. **Vérifications** — ce job tourne aussi sur les pull requests :
   - [`html5validator-action`](https://github.com/Cyb3r-Jak3/html5validator-action)
     fait passer le **Nu Html Checker** (le validateur du W3C) sur les pages et
     la CSS : conformité HTML, hiérarchie des titres, attributs ARIA ;
   - [`lychee-action`](https://github.com/lycheeverse/lychee-action) vérifie les
     liens **internes et externes** ainsi que les ancres `#…`.
2. **Déploiement** — uniquement sur `main`, publie le dépôt sur GitHub Pages.

Les actions sont épinglées à une version exacte ; `dependabot.yml` ouvre une PR
mensuelle quand une mise à jour sort.

### Mise en route

Tout est en place — source *GitHub Actions*, domaine personnalisé
`certimens.fr`, et chez OVH les enregistrements `A`/`AAAA` de l'apex et le
`CNAME www`. `www` redirige vers l'apex, `certimens.github.io` renvoie un
301 vers `certimens.fr`, et *Enforce HTTPS* est actif : `http://certimens.fr/`
répond 301 vers `https` (constaté le 26 novembre 2026).

> `monespace.certimens.fr` est un sous-domaine distinct : il n'a pas été touché
> par la bascule et continue de pointer vers l'application. `certimens.com`,
> lui, ne se règle pas par un enregistrement mais par une redirection 301,
> décrite dans
> « [Deux langues, deux domaines](#deux-langues-deux-domaines) ».

## Points restés à compléter

Les pages légales ont été rédigées d'après le fonctionnement réel du moteur
(dépôt `engine`). L'identité juridique est renseignée (SAS au capital de
2 000 €, siège à Gahard (35490), directeur de la publication). Restent :

- **Téléphone** (mentions légales, FR et EN) — encore surligné en doré. La LCEN
  (art. 6-III) l'exige pour une personne morale : la ligne ne peut pas
  simplement être retirée.
- **SIRET / RCS** — la mention « en cours d'immatriculation au RCS de Rennes »
  est à remplacer par le numéro dès réception du KBIS (mentions légales et
  politique de confidentialité). L'adresse complète du siège, elle, y figure
  désormais : la LCEN (art. 6-III) l'exige.

Un point d'infrastructure reste ouvert, hors dépôt : **la redirection 301 de
`certimens.com`**, qui vise la mauvaise page et n'a pas de certificat — voir
« [certimens.com](#certimenscom) ».

### Ce que la politique de confidentialité tient du moteur

Le contenu du point « Données collectées » et des suivants est repris de deux
dépôts : `engine` (`docs/rgpd.md` en premier lieu, puis `docs/modele-donnees.md`,
`docs/scoring.md`, `docs/integrite-mesures.md`, `docs/auth-sso.md`, `docs/api.md`,
`docs/backend.md`) et `plugins` (`docs/mesures.md`, `docs/moteur.md`,
`docs/extension-navigateur.md`) pour tout ce qui se passe sur le poste de
l'étudiant. Chaque affirmation correspond à du code existant, jamais à une
intention. À vérifier à chaque évolution du moteur, les points les plus
susceptibles de bouger étant la rétention, les seuils de l'IFC et la liste des
signaux d'ingestion.

`engine/docs/rgpd.md` est la vue technique du même traitement, et il désigne la
page `Confidentialité` de l'application (`ui/src/pages/Privacy.tsx`) comme la
version opposable. **Les trois doivent dire la même chose** — elles le disent à la revue du 26 novembre 2026 (voir plus bas), la page de l'application étant délibérément la plus courte des
trois. Une évolution du moteur se répercute donc en trois endroits, et c'est
`rgpd.md` qui mène : il tient le détail des tables et des durées dont les deux
autres ne gardent que ce qui se lit.

Le point 6 (« Score automatisé ») suit `engine/docs/scoring.md` : sept
dimensions — remaniements 30, pauses 18, provenance 15, alternance 13,
navigation 10, irrégularité de la frappe 9, hésitations 5 — dont le total est
multiplié par la part réellement tapée ; un dépôt produit toujours un score (le
plancher de 200 frappes a été supprimé), et la bande « Authentique » est
suspendue dans quatre cas où la mesure est incomplète. C'est la partie la plus
mouvante du moteur, et le vocabulaire y compte autant que les chiffres : le site
nomme les dimensions comme l'application les affiche sur le certificat.

Une chose reste en dehors du code :

- la qualification de **sous-traitant** vis-à-vis des établissements clients,
  qui suppose un contrat de sous-traitance (article 28 du RGPD).

Ce qui a changé le 13 octobre 2026, et qui vient de ces deux dépôts :

- le **SSO est implémenté** (`engine/docs/auth-sso.md`, `internal/identity/`) :
  OpenID Connect et OAuth2 (fournisseur d'un établissement, Google, Microsoft,
  Facebook, Moodle), et le lancement **LTI 1.3**. Le point 3.2 le décrit — ce qui
  est conservé est l'identifiant opaque `(issuer, sub)`, le reste ne sert qu'une
  fois —, le point 3.1 en fait la troisième façon dont un compte naît, et le
  point 11 nomme le transfert que déclenche le choix de Google, Microsoft ou
  Facebook. Depuis, Deep Linking et la synchronisation des inscrits (LTI Advantage) sont
  en place ; le proxy RENATER existe mais n'est pas en service tant que
  l'inscription à la fédération n'est pas faite ;
- l'agent ne demande **plus de mot de passe ni de jeton collé à la main** : il
  s'apparie par un code court (*device authorization grant*, RFC 8628 —
  `plugins/docs/moteur.md`, `engine/docs/api.md`). Le point 3.2 remplace donc
  l'ancienne description des jetons créés depuis l'espace ;
- l'extension de navigateur couvre **Overleaf**, et mesure les **sites que
  l'étudiant désigne lui-même** — parmi ceux que son établissement propose
  (`writing_sites`) ou à la main. Le point 3.4 le dit, avec la règle qui compte :
  le moteur propose, seul le navigateur de l'étudiant accorde ;
- les agents gardent **une mémoire locale**, et une seule : des empreintes de
  quatre mots des vingt derniers extraits copiés (une heure au plus), pour reconnaître le texte de
  l'étudiant qui revient dans son document (`plugins/docs/mesures.md`). Elle ne
  part jamais ; le point 3.4 la déclare quand même, parce qu'une mémoire non
  déclarée est une surprise ;
- les **durées manquantes** sont posées : journal des consultations **trois
  ans**, notifications **un an**, échecs de connexion et quotas quelques heures
  (`engine/docs/rgpd.md`). Les points 3.6 et 7 les portent ;
- l'application embarque désormais un **éditeur** (`engine/ui/src/pages/Write.tsx`,
  `ui/src/writing/sensor.ts`) : on peut écrire sans rien installer, et c'est un
  cinquième capteur, portage des mêmes constantes que les agents. L'accueil et la
  FAQ l'annoncent, le point 3.4 le décrit — avec la nuance qui compte et qu'il
  serait malhonnête de taire : « vous n'avez pas à nous croire sur parole » ne
  vaut **que pour les agents**, dont le code est public. L'éditeur s'exécute dans
  une page servie par le moteur et son code ne l'est pas, ce que le point 3.4 et
  la page `Confidentialité` de l'application disent tous deux en ces termes.

Ce qui a changé le 26 novembre 2026, à la revue contre `engine/docs/rgpd.md` :

- les **journaux techniques** sont gardés **trente jours** (Loki, sur le serveur
  de la plateforme) : l'ancien mécanisme — anneau en mémoire, fichiers bornés
  par la taille, « douze mois au plus » — n'existe plus. Points 3.7 et 7 ;
- l'application pose **un cookie**, strictement nécessaire, de onze minutes, le
  temps d'une connexion par un fournisseur externe (`__Host-certimens-sso`,
  `__Host-certimens-lti`). Le point 10 ne dit plus « aucun cookie » que du site
  vitrine ;
- le **jeton d'un agent expire à 180 jours** (points 3.2 et 7) ;
- la **mémoire locale** des agents passe à vingt extraits et une heure ;
- le point 3.4 décrit **ce que porte une fenêtre de mesure** (suites de gestes,
  répartitions du rythme, longueurs), et plus seulement les compteurs que le
  serveur en tire, ainsi que les **compteurs de fonctionnement des agents** ;
- les **signaux d'ingestion sont lisibles par l'auteur** (point 3.5), les
  **étiquettes d'établissement** sont déclarées (point 3.1), un **compte
  auto-inscrit jamais confirmé est supprimé**, et le contenu de l'**export**
  (point 13) est décrit en entier ;
- sur les pages marketing : cinq profils de rédaction et non quatre, « chiffré
  en transit » et non « de bout en bout », « plateforme et données hébergées en
  France » au pied de page (le site, lui, est servi par GitHub Pages), et la
  maquette du certificat enseignant affiche Google Docs — Word est noté sur 86,
  pas sur 100.

## Programme pilote

`/programme-pilote/` (et `/en/pilot-programme/`) reçoit les entrées « Programme
pilote universitaire » du menu et du pied de page, qui menaient jusque-là au
formulaire de contact. Son contenu vient de `docs/commercial/plaquette.md` :
périmètre, calendrier en sept jours, conditions, engagements. **Elle n'affiche
aucun prix**, comme le reste du site : c'est la règle du référentiel commercial
(chapitre 1), la grille part après la démonstration.

## Formulaire de contact

Le site est statique, mais le message ne passe plus par le client mail du
visiteur : il part vers la plateforme. `POST /api/contact`
(`engine/internal/contact`) le relaie à la boîte support par e-mail, **sans rien
stocker**, limité à 5 requêtes par minute et par IP. L'adresse est portée par
le formulaire (`data-contact-api`), la logique par `assets/js/site.js`.

**La preuve de travail.** La route refuse une requête sans défi résolu
(ALTCHA) : c'est ce qui tient lieu de captcha, sans rien à voir ni à résoudre.
Le widget `<altcha-widget>` posé dans le formulaire demande un défi à
`GET /api/pow/contact/challenge` dès qu'un champ prend le focus, le résout
dans le navigateur (une seconde environ) et rend une charge, que la requête
porte dans l'en-tête `X-Proof-Of-Work`. Une charge ne sert qu'une fois ; un
défi vaut dix minutes, et `site.js` relance la vérification s'il expire
pendant la rédaction.

Le widget est **servi par ce site** — `assets/vendor/altcha/altcha.min.js`,
122 ko, chargé sur les deux pages de contact seulement, sous licence MIT
(`assets/vendor/altcha/LICENSE.txt`). C'est la copie exacte de
`altcha/dist/main/altcha.min.js` du paquet npm que l'application embarque
(`engine/ui`, version 3.7.0) : **à remettre à niveau quand le moteur monte sa
bibliothèque ALTCHA**, faute de quoi le site résout un défi dont le format a
changé. Ses libellés français sont dans `site.js`, repris de l'application.

**Ce qu'il faut côté moteur**, et qui y est :

- l'origine `https://certimens.fr` dans `crossOriginSites`
  (`engine/internal/api/server.go`) ;
- `X-Proof-Of-Work` dans `AllowHeaders` du CORS — ajouté le 26 novembre 2026,
  avec son test (`TestThePublicWebsiteMaySendItsProofOfWork`). **Le formulaire
  ne marche donc en production qu'une fois cette version du moteur déployée** ;
  d'ici là il retombe sur le mailto, comme avant.

Le contrat : JSON `{email, message, name?, kind?}` — `email` 254 octets au
plus, `message` 5 000, `name` 120, `kind` valant `help` ou `problem`. Il n'y a
pas de champ « établissement » ni « profil » : `site.js` les met en tête du
message. Réponses : 204 ; 400 `contact_invalid` et 429, que le formulaire
explique au visiteur ; tout le reste (403 `proof_required`, 5xx, réseau)
déclenche le repli.

**Le repli reste le mailto.** Widget non chargé, JavaScript coupé, serveur
injoignable : la soumission ouvre le client mail avec le message pré-rempli,
et le bloc « Copier l'adresse / Copier le message » apparaît pour les postes
qui n'ont qu'un webmail.

Le point 2 de la politique de confidentialité et le point 6 des mentions
légales décrivent ce fonctionnement, dans les deux langues. La durée de
conservation des échanges qui y figure (trois ans après le dernier contact,
l'usage pour des prospects) est **à confirmer par les fondateurs**.

Pour tester sans la production : servir le site en local et faire pointer
`data-contact-api` et l'attribut `challenge` du widget vers un moteur lancé
avec `docker compose up` — en ajoutant l'origine locale à `crossOriginSites`.

## Licence

Le dépôt porte une **licence propriétaire bilingue** ([`LICENSE`](LICENSE)),
calquée sur celle du dépôt `engine` et adaptée à un site public : lire, citer,
imprimer, indexer et faire un lien sont permis sans rien demander ; republier,
dériver ou aspirer le site pour entraîner un modèle ne le sont pas, l'exception
d'exploration de textes et de données étant expressément écartée.

Quatre ensembles ont leur propre licence et sont exclus du périmètre : la police
Plus Jakarta Sans (SIL OFL 1.1, `assets/fonts/LICENSE.txt`), le widget ALTCHA
(MIT, `assets/vendor/altcha/LICENSE.txt`), les photographies
Unsplash (voir « Crédits images ») et les Agents publiés dans
[`Certimens/plugins`](https://github.com/Certimens/plugins).

Comme les mentions légales, le fichier attend l'**identité juridique exacte**
du titulaire des droits — raison sociale, forme, RCS/SIREN, siège — et une
relecture par un conseil avant d'être opposé à qui que ce soit.

## Crédits images

Les photographies proviennent d'Unsplash (Christin Hume, Wes Hicks) et étaient
déjà utilisées auparavant.
