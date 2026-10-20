# Site vitrine Certimens

Le site vitrine de [certimens.fr](https://certimens.fr/). Aucun framework,
aucune étape de build : ce sont des fichiers HTML/CSS/JS servis tels quels par
GitHub Pages, depuis le dépôt public
[`Certimens/certimens.github.io`](https://github.com/Certimens/certimens.github.io).

Le site existe en deux langues : le **français à la racine**, l'**anglais sous
`/en/`**. `certimens.com` redirige vers la version anglaise (voir
« [Deux langues, deux domaines](#deux-langues-deux-domaines) »).

La connexion se fait sur l'espace client, pas ici : le bouton **Connexion**
pointe vers <https://monespace.certimens.fr/>.

Une partie du site n'est **pas** dans ce dépôt : les pages **`/plugins/`**, qui
expliquent comment installer les quatre agents de mesure, sont publiées par
[`Certimens/plugins`](https://github.com/Certimens/plugins) et servies par
GitHub Pages sous le même domaine (aujourd'hui
<https://certimens.github.io/plugins/>, et `certimens.fr/plugins/` une fois le
DNS basculé). Voir
« [Les pages des agents](#les-pages-des-agents-plugins) ».

## Structure

```
.
├── index.html                          Accueil FR (ancres #certification, #etapes,
│                                       #comparatif, #securite, #cas-usage, #expertise, #faq)
├── enseignants/index.html              Page de destination « Enseignants & correcteurs »
├── etudiants/index.html                Page de destination « Étudiants »
├── contact/index.html                  Formulaire de contact FR
├── mentions-legales/index.html
├── politique-de-confidentialite/index.html
├── en/                                 Version anglaise, même arborescence
│   ├── index.html                      Accueil EN (ancres traduites : #steps,
│   │                                   #comparison, #security, #use-cases…)
│   ├── teachers/index.html             Jumelle anglaise de /enseignants/
│   ├── students/index.html             Jumelle anglaise de /etudiants/
│   ├── contact/index.html
│   ├── legal-notice/index.html
│   └── privacy-policy/index.html
├── 404.html                            Bilingue : servie pour toute URL manquante
├── docs/
│   └── charte-graphique.md             La charte, dont les autres dépôts descendent
├── assets/
│   ├── css/style.css                   Feuille de style unique
│   ├── js/site.js                      Menu mobile + formulaire mailto
│   ├── fonts/                          Plus Jakarta Sans (500/700/800), auto-hébergée
│   └── img/                            Photographies et marque
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
| `/contact/` | `/en/contact/` |
| `/mentions-legales/` | `/en/legal-notice/` |
| `/politique-de-confidentialite/` | `/en/privacy-policy/` |
| `/plugins/` (autre dépôt) | `/plugins/en/` |

Il n'y a **pas de détection automatique de la langue** : ni redirection sur
`Accept-Language`, ni bascule en JavaScript. Un robot d'indexation n'envoie pas
d'en-tête de langue et se verrait toujours servir la même version ; une
redirection le priverait purement et simplement de l'autre. Le choix est donc
explicite, par le lien `FR`/`EN` de la barre de navigation, présent sur les
douze pages.

### Ce qui tient le référencement

- **`<html lang>`** vaut `fr` ou `en` selon la page.
- **`<link rel="canonical">`** pointe sur la page elle-même, jamais sur sa
  traduction : les deux versions sont indexables, ce ne sont pas des doublons.
- **`<link rel="alternate" hreflang>`** déclare, sur chaque page, le trio
  complet `fr` / `en` / `x-default` — y compris l'auto-référence, qu'exige la
  spécification. `x-default` désigne le français, langue par défaut du site.
  Les liens sont **réciproques** : une déclaration non rendue par la page cible
  est ignorée par Google.
- **`sitemap.xml`** répète ces alternances en `xhtml:link` pour les douze URLs,
  ce qui est le second canal accepté par Google pour hreflang.
- **`404.html`** est servie par GitHub Pages pour toute URL manquante, `/en/…`
  comprise, sans qu'on puisse en connaître la langue : elle affiche donc les
  deux versions l'une sous l'autre.

### certimens.com

Le `.com` ne sert aucun contenu propre : le faire servirait le même site à deux
adresses, ce qui dilue le référencement et forcerait à choisir un canonique.
Il **redirige en 301 vers `https://certimens.fr/en/`**.

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

- la navigation et le pied de page des **treize pages** portent une entrée
  « Plugins » vers `/plugins/` ou `/plugins/en/` — le même libellé, à la même
  place, que la barre des pages d'en face, qui est copiée de celle-ci. Les liens
  sont **relatifs à la racine**, comme tout le reste du site : ils marchent sur
  `certimens.github.io` aujourd'hui et sur `certimens.fr` après la bascule DNS ;
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
> dépôts** : ici dans les neuf pages, là-bas dans `scripts/build-site.py`.

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

L'icône du site est déclarée sur les neuf pages (`favicon-32.png` en 32×32,
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

### Mise en route (une seule fois)

1. Pousser le dépôt sur GitHub.
2. **Settings → Pages → Build and deployment → Source : GitHub Actions.**
3. **Settings → Pages → Custom domain : `certimens.fr`**, puis cocher
   *Enforce HTTPS* une fois le certificat émis (compter quelques minutes).

### DNS à créer chez OVH

Pour le domaine racine `certimens.fr`, quatre enregistrements `A` et quatre
`AAAA` (qui remplacent les enregistrements actuels du domaine) :

| Type   | Cible                 |
| ------ | --------------------- |
| `A`    | `185.199.108.153`     |
| `A`    | `185.199.109.153`     |
| `A`    | `185.199.110.153`     |
| `A`    | `185.199.111.153`     |
| `AAAA` | `2606:50c0:8000::153` |
| `AAAA` | `2606:50c0:8001::153` |
| `AAAA` | `2606:50c0:8002::153` |
| `AAAA` | `2606:50c0:8003::153` |

Et, pour le `www` :

| Type    | Sous-domaine | Cible                       |
| ------- | ------------ | --------------------------- |
| `CNAME` | `www`        | `<compte-github>.github.io.` |

> L'enregistrement de `monespace.certimens.fr` n'est **pas** touché : c'est un
> sous-domaine distinct, il continue de pointer vers l'application.

> `certimens.com` ne fait pas partie de ces enregistrements : il se règle par
> une redirection 301, décrite dans
> « [Deux langues, deux domaines](#deux-langues-deux-domaines) ».

## Points restés à compléter

Les pages légales ont été rédigées d'après le fonctionnement réel du moteur
(dépôt `engine`). Ne restent que les informations d'identité juridique, qui ne
figurent nulle part dans le code — elles sont surlignées en doré sur les pages :

- **Mentions légales** : statut juridique, adresse du siège, SIRET, téléphone,
  nom du directeur de la publication.
- **Politique de confidentialité** : adresse postale du responsable de
  traitement.

Les mêmes champs sont à compléter sur les traductions anglaises
(`en/legal-notice/`, `en/privacy-policy/`), où ils portent la même surbrillance.

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
version opposable. **Les trois doivent dire la même chose** — elles le disent
aujourd'hui, la page de l'application étant délibérément la plus courte des
trois. Une évolution du moteur se répercute donc en trois endroits, et c'est
`rgpd.md` qui mène : il tient le détail des tables et des durées dont les deux
autres ne gardent que ce qui se lit.

Le point 6 (« Score automatisé ») suit `engine/docs/scoring.md` : quatre
sous-scores continus — pauses 30, remaniements 30, rythme de frappe 25,
navigation 15 — dont le total est multiplié par la part réellement tapée, et
aucun verdict en dessous de 200 frappes. C'est la partie la plus mouvante du
moteur, et le vocabulaire y compte autant que les chiffres : le site nomme les
dimensions comme l'application les affiche sur le certificat.

Deux choses restent en dehors du code :

- la **rétention des journaux techniques**. Le point 7 décrit désormais le
  mécanisme réel plutôt qu'une durée : anneau en mémoire perdu au redémarrage,
  copie sur disque bornée par la taille (256 Mio × 2 générations par réplica
  dans `engine/internal/logging/file.go`, purge d'une instance éteinte 12 h
  après sa dernière ligne) et rotation Docker elle aussi bornée par la taille
  (10 Mo × 3 dans `deploy/docker-compose.yml`). Aucune de ces bornes n'est une
  purge datée : les douze mois restent un plafond tenu en pratique, pas une
  échéance ;
- la qualification de **sous-traitant** vis-à-vis des établissements clients,
  qui suppose un contrat de sous-traitance (article 28 du RGPD).

Ce qui a changé le 13 octobre 2026, et qui vient de ces deux dépôts :

- le **SSO est implémenté** (`engine/docs/auth-sso.md`, `internal/identity/`) :
  OpenID Connect et OAuth2 (fournisseur d'un établissement, Google, Microsoft,
  Facebook, Moodle), et le lancement **LTI 1.3**. Le point 3.2 le décrit — ce qui
  est conservé est l'identifiant opaque `(issuer, sub)`, le reste ne sert qu'une
  fois —, le point 3.1 en fait la troisième façon dont un compte naît, et le
  point 11 nomme le transfert que déclenche le choix de Google, Microsoft ou
  Facebook. Restent hors de la politique, faute d'exister : la fédération RENATER
  et les services LTI Advantage ;
- l'agent ne demande **plus de mot de passe ni de jeton collé à la main** : il
  s'apparie par un code court (*device authorization grant*, RFC 8628 —
  `plugins/docs/moteur.md`, `engine/docs/api.md`). Le point 3.2 remplace donc
  l'ancienne description des jetons créés depuis l'espace ;
- l'extension de navigateur couvre **Overleaf**, et mesure les **sites que
  l'étudiant désigne lui-même** — parmi ceux que son établissement propose
  (`writing_sites`) ou à la main. Le point 3.4 le dit, avec la règle qui compte :
  le moteur propose, seul le navigateur de l'étudiant accorde ;
- les agents gardent **une mémoire locale**, et une seule : des empreintes de
  quatre mots des cinq derniers extraits copiés, pour reconnaître le texte de
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

## Formulaire de contact

Le site étant statique, il n'y a pas de backend pour recevoir les messages. La
soumission ouvre le client mail du visiteur avec un message pré-rempli vers
`contact@certimens.fr` (voir `assets/js/site.js`).

Pour un envoi sans client mail, la route existe désormais côté moteur :
`POST /api/contact` (`internal/contact/adapters/inbound/http/handler.go`)
transfère le message à la boîte support par e-mail, sans rien stocker, et est
limitée à 5 requêtes par minute et par IP. Il reste **une seule chose à faire**
pour que le site puisse l'appeler : ajouter `https://certimens.fr` à
`wordAddinOrigins` dans `engine/internal/api/server.go`, aujourd'hui restreinte
à `https://certimens.github.io` et `https://localhost:3000`.

Ce basculement modifie deux textes qui affirment aujourd'hui le contraire : le
point 2 de la politique de confidentialité (« Son formulaire de contact ouvre
votre logiciel de messagerie, sans rien enregistrer ») et le point 6 des
mentions légales. Les deux sont à reprendre en même temps que le code, dans les
deux langues.

L'alternative reste un service tiers type Formspree / Web3Forms, sans toucher au
backend.

## Licence

Le dépôt porte une **licence propriétaire bilingue** ([`LICENSE`](LICENSE)),
calquée sur celle du dépôt `engine` et adaptée à un site public : lire, citer,
imprimer, indexer et faire un lien sont permis sans rien demander ; republier,
dériver ou aspirer le site pour entraîner un modèle ne le sont pas, l'exception
d'exploration de textes et de données étant expressément écartée.

Trois ensembles ont leur propre licence et sont exclus du périmètre : la police
Plus Jakarta Sans (SIL OFL 1.1, `assets/fonts/LICENSE.txt`), les photographies
Unsplash (voir « Crédits images ») et les Agents publiés dans
[`Certimens/plugins`](https://github.com/Certimens/plugins).

Comme les mentions légales, le fichier attend l'**identité juridique exacte**
du titulaire des droits — raison sociale, forme, RCS/SIREN, siège — et une
relecture par un conseil avant d'être opposé à qui que ce soit.

## Crédits images

Les photographies proviennent d'Unsplash (Christin Hume, Wes Hicks) et étaient
déjà utilisées auparavant.
