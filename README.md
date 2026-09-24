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
├── scripts/
│   ├── check-links.py                  Vérifie liens internes et ancres
│   └── check-html.py                   Contrôles HTML (balises, title, alt, lang…)
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

Avant de pousser, les deux contrôles que la CI rejouera :

```bash
python3 scripts/check-links.py
python3 scripts/check-html.py
```

Ils n'ont aucune dépendance : Python 3 suffit.

## Déploiement

Le workflow `.github/workflows/deploy.yml` s'exécute à chaque push :

1. **Vérifications** — liens internes et ancres, contrôles HTML. Ce job tourne
   aussi sur les pull requests.
2. **Déploiement** — uniquement sur `main`, publie le dépôt sur GitHub Pages.

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

Ces éléments étaient déjà des placeholders sur le site WordPress ; ils sont
surlignés en doré sur les pages légales pour être repérables.

- **Mentions légales** : statut juridique, adresse, email, téléphone, SIRET,
  nom du directeur de la publication.
- **Politique de confidentialité** : email et adresse postale du responsable de
  traitement.
- **Page contact** : le numéro `06.00.00.00.00` est un placeholder.

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
