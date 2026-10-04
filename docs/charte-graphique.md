# Charte graphique Certimens

**C'est ici que la direction artistique est tenue.** Le site vitrine n'est pas
un support parmi d'autres : c'est l'implémentation de référence, et les trois
autres — l'espace client, les gabarits d'e-mail et le certificat PDF, les agents
installés chez l'étudiant — en descendent. Une couleur qui change, change
d'abord dans ce document et dans `assets/css/style.css`, puis dans les fichiers
listés à la fin.

Ce sens de lecture n'est pas arbitraire. Le site est la **vitrine** : c'est lui
que voit un établissement avant de signer, et c'est à lui que l'espace client
doit ressembler pour qu'on le reconnaisse une fois connecté. C'est aussi le seul
des trois dépôts auquel les deux autres peuvent se référer par un lien qu'un
lecteur ouvrira toujours — le moteur, lui, est privé.

## Palette

| Rôle | Valeur | Usage |
| --- | --- | --- |
| **Ardoise** (dominante) | `#1E293B` | Titres, chrome, sections sombres, boutons de contour. Variantes `#334155` (clair) et `#0F172A` (foncé). |
| **Or laiton** (accent) | `#C5A059` | L'accent unique de la marque : le mot-marque, les liserés, les états actifs, **et toute action principale**. Variantes `#D4AC5F` (survol) et `#705E3A` (or sombre, pour le texte sur fond clair). |
| Texte | `#1A202C` | Corps de texte, et l'encre que porte l'or quand il est une surface. |
| Texte secondaire | `#54595F` | Libellés, légendes, en-têtes de tableau, mentions. |
| Fond | `#F8FAFC` | Fond de page et sections douces ; les surfaces (cartes) restent blanches. |
| Filet | `#E5E5E5` | Bordures de cartes et séparateurs. |
| Or très clair | `#F3EAD9` | Surface d'un encart d'accent, où l'or sombre sert de texte. |

Les couleurs de **verdict** portent du sens et non de la marque : vert `#137333`,
orange `#B06000`, rouge `#C5221F`. Elles ne s'harmonisent pas et ne se
remplacent pas par de l'or — c'est précisément ce qui les rend lisibles. Le
rouge sert aussi aux messages d'erreur, aux marqueurs de champ obligatoire et
aux croix d'un comparatif.

## La règle de l'or

**L'or n'est jamais du texte sur blanc.** `#C5A059` y donne 2,46:1, très en
dessous du seuil WCAG AA de 4,5:1. Il n'a que deux emplois sûrs :

- **comme surface**, portant du texte encre `#1A202C` (6,64:1) — les boutons
  pleins, les puces, les encarts ;
- **foncé en or sombre `#705E3A`** là où il doit se lire comme du texte sur fond
  clair (6,27:1) — les liens, les surtitres, les icônes de liste.

Cette seconde moitié de la règle ne vaut cependant **que sur fond clair**. Sur
l'ardoise, `#705E3A` retombe à 2,33:1 ; c'est l'or franc `#C5A059` qui s'y lit
(5,96:1). Donc : or sombre sur blanc, or franc sur ardoise. C'est la même
intention — que l'accent reste lisible — appliquée à deux fonds.

### Contrastes mesurés

| Paire | Ratio | Verdict |
| --- | --- | --- |
| `#1A202C` sur blanc | 16,3:1 | AAA |
| `#1E293B` sur blanc | 14,6:1 | AAA |
| `#54595F` sur blanc | 7,1:1 | AAA |
| `#1A202C` sur or `#C5A059` | 6,6:1 | AA |
| `#705E3A` sur blanc | 6,3:1 | AA |
| `#C5A059` sur ardoise `#1E293B` | 6,0:1 | AA |
| `#C5221F` sur blanc | 5,8:1 | AA |
| `#705E3A` sur or clair `#F3EAD9` | 5,3:1 | AA |
| ~~`#705E3A` sur ardoise~~ | 2,3:1 | **à proscrire** |
| ~~`#C5A059` sur blanc~~ | 2,5:1 | **à proscrire** |

## Boutons

**Un bouton plein est un appel à l'action, et l'appel à l'action de la marque
est une surface or portant du texte encre.** Pas d'ardoise pleine : l'ardoise
est la couleur dominante du chrome, et un bouton qui en est fait se confond avec
tout ce qui l'entoure au lieu de s'en détacher.

**Un seul bouton plein par vue**, et c'est l'action pour laquelle la vue existe.
Tout le reste — une action auxiliaire, un « Ajouter » posé à côté d'un
sélecteur, un lien de connexion dans une barre de navigation — s'écrit en
**contour ardoise**. L'or ne hiérarchise plus rien s'il est partout, et une page
qui empile trois boutons pleins ne dit plus lequel on est venu presser. Deux
assouplissements : une boîte de dialogue est une vue à elle seule et a droit à
son propre bouton plein ; une même action répétée à l'identique dans une liste
reste pleine, puisque c'est la même action et non une action secondaire.

Deux exceptions, et seulement deux :

- une action **destructrice** reste **rouge** `#C5221F`, boutons-icônes
  compris — un bouton plein ne doit jamais faire ressembler « Supprimer » à
  « Enregistrer » ;
- un bouton **de contour ou de texte** reste **ardoise**, parce que l'or n'y
  serait plus une surface mais du texte. Si une vue demande quand même l'accent,
  c'est l'or sombre `#705E3A` — libellé et contour ensemble, pour que le bord du
  contrôle passe aussi les 3:1 attendus d'un élément non textuel.

## Typographie

**Plus Jakarta Sans** partout. Le trait le plus reconnaissable de la direction
artistique est le contraste de graisses :

- titres **800**, interlettrage resserré (`-0.02em` sur le `h1`) ;
- corps de texte **500**, et non 400 ;
- boutons et libellés **700**, sans majuscules forcées.

La police est **auto-hébergée** sur chaque support : `assets/fonts/` pour le
site, `@fontsource` pour l'espace client — les mêmes fichiers `.woff2`, pour un
rendu identique et zéro appel à Google Fonts à l'exécution.

## Formes

Rayon de **12 px** sur les surfaces. Les cartes sont **plates** : un filet
`#E5E5E5`, pas d'ombre. La seule ombre admise est celle d'un élément qui flotte
réellement au-dessus du contenu — un menu déroulant, une boîte de dialogue. Les
barres d'application et de navigation sont blanches avec un filet en bas.

## Le mot-marque

« Certi**mens** », la seconde moitié en or. L'écu doré du site sert de marque à
tous les supports ; il n'est pas redessiné par support mais repris tel quel.

## Où c'est appliqué

| Support | Dépôt | Fichier |
| --- | --- | --- |
| **Site vitrine** *(référence)* | [`certimens.github.io`](https://github.com/Certimens/certimens.github.io) (public) | `assets/css/style.css` — les jetons de `:root` en tête, rien en dur ailleurs |
| Espace client (SPA React) | `engine` (privé) | `ui/src/theme.ts` — thème MUI, aucune couleur codée en dur dans un composant |
| E-mails transactionnels | `engine` (privé) | `internal/platform/email/templates/email.html` — gabarit unique, styles en ligne (obligatoire en e-mail) |
| Certificat PDF | `engine` (privé) | `internal/document/adapters/outbound/pdf/renderer.go` — bloc de constantes en tête |
| Agents (extensions, complément Word) | [`plugins`](https://github.com/Certimens/plugins) (public) | `extension/ui.css` — les variables de `:root` |
| Marque | `engine`, `plugins` | `ui/public/logo.png`, `store/brand-mark.png` |

## La règle de travail

Toute nouvelle couleur passe par le jeton du support, jamais en dur dans un
composant. C'est ce qui a permis de basculer l'espace client de l'indigo initial
vers cette charte en ne touchant qu'à `theme.ts` — et c'est ce qui rend
vérifiable le fait que les quatre supports disent bien la même chose.

Les dérives connues ont toutes eu la même forme : **deux orthographes du même
bouton**. L'espace client a longtemps mis de l'ardoise sur deux écrans et de
l'or sur deux autres pour le même bouton « Nouveau… » ; le site mettait de
l'ardoise dans son hero et de l'or dans son bandeau de fin, pour le même
« Demander une démo ». C'est ce que la règle « un seul bouton plein, et il est
or » existe pour empêcher.
