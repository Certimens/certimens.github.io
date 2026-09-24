# Site vitrine Certimens

Version statique de [certimens.fr](https://certimens.fr/), reconstruite à partir
du site WordPress/Elementor d'origine. Aucun framework, aucune étape de build :
ce sont des fichiers HTML/CSS/JS servis tels quels par GitHub Pages.

La connexion ne se fait plus sur le site vitrine : le bouton **Connexion**
pointe vers <https://monespace.certimens.fr/>.

## Structure

```
.
├── index.html                          Page d'accueil (ancres #certification, #expertise, #faq)
├── contact/index.html                  Formulaire de contact
├── mentions-legales/index.html
├── politique-de-confidentialite/index.html
├── 404.html
├── assets/
│   ├── css/style.css                   Feuille de style unique
│   ├── js/site.js                      Menu mobile + formulaire mailto
│   └── img/                            Images reprises du site d'origine
├── .github/
│   ├── workflows/deploy.yml            CI + publication sur GitHub Pages
│   └── dependabot.yml                  Maintient les actions à jour
├── CNAME                               Domaine personnalisé (certimens.fr)
├── .nojekyll                           Désactive Jekyll sur GitHub Pages
├── robots.txt
└── sitemap.xml
```

### Anciennes URLs WordPress

Les permaliens du site WordPress (`/elementor-487/`, `/elementor-543/`,
`/index.php/contact/`, `/hub-etudiant/`, `/espace-enseignant/`…) ne sont pas
repris : les liens qui les utilisent encore arrivent sur la page `404.html`,
qui renvoie vers l'accueil et le contact.

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

# Liens et ancres
docker run --rm -v "$PWD":/input lycheeverse/lychee \
  --base /input --include-fragments '/input/**/*.html'
```

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
`AAAA` (remplacent ceux qui pointent aujourd'hui vers l'hébergement WordPress) :

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

## Points restés à compléter

Les pages légales ont été rédigées d'après le fonctionnement réel du moteur
(dépôt `engine`). Ne restent que les informations d'identité juridique, qui ne
figurent nulle part dans le code — elles sont surlignées en doré sur les pages :

- **Mentions légales** : statut juridique, adresse du siège, SIRET, téléphone,
  nom du directeur de la publication.
- **Politique de confidentialité** : adresse postale du responsable de
  traitement.

Deux engagements de la politique de confidentialité relèvent d'une décision, pas
du code, et ne sont pas encore appliqués automatiquement par le moteur :

- les **durées de conservation** annoncées (documents et métriques sur l'année
  universitaire en cours et la suivante, journaux techniques à douze mois) —
  aucune tâche de purge n'existe côté `engine` ;
- la qualification de **sous-traitant** vis-à-vis des établissements clients,
  qui suppose un contrat de sous-traitance (article 28 du RGPD).

## Formulaire de contact

Le site étant statique, il n'y a pas de backend pour recevoir les messages. La
soumission ouvre le client mail du visiteur avec un message pré-rempli vers
`contact@certimens.fr` (voir `assets/js/site.js`).

Pour un envoi sans client mail, deux pistes :

- ajouter une route `POST /api/contact` au moteur Certimens — il dispose déjà
  d'un service SMTP OVH (`internal/email/service.go`) — et autoriser
  `https://certimens.fr` dans la configuration CORS (`internal/api/server.go`,
  aujourd'hui restreinte aux origines du plugin Word) ;
- ou brancher un service tiers type Formspree / Web3Forms, sans toucher au
  backend.

## Crédits images

Les photographies proviennent d'Unsplash (Christin Hume, Wes Hicks) et étaient
déjà utilisées sur le site d'origine.
