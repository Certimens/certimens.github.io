#!/usr/bin/env python3
"""Vérifie les liens internes du site statique avant publication.

Contrôle, pour chaque page HTML :
  - que les href/src internes pointent vers un fichier réellement présent ;
  - que les ancres (#section) existent dans la page visée ;
  - que les images référencées existent.

Les liens externes (http, mailto, tel) ne sont pas suivis : le but est
d'attraper les régressions de chemin, pas de tester le réseau.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTERNAL = re.compile(r"^(https?:|mailto:|tel:|data:|//)", re.I)
ATTR = re.compile(r"""(?:href|src)\s*=\s*["']([^"']+)["']""", re.I)
ID = re.compile(r"""\bid\s*=\s*["']([^"']+)["']""", re.I)


def pages() -> list[Path]:
    return sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)


def resolve(target: str) -> Path | None:
    """Traduit une URL du site en chemin de fichier, ou None si absent."""
    path = ROOT / target.lstrip("/")
    if path.is_dir():
        path = path / "index.html"
    elif target.endswith("/"):
        path = path / "index.html"
    return path if path.exists() else None


def anchors(path: Path) -> set[str]:
    return set(ID.findall(path.read_text(encoding="utf-8")))


def main() -> int:
    errors: list[str] = []
    files = pages()
    if not files:
        print("Aucune page HTML trouvée.", file=sys.stderr)
        return 1

    for page in files:
        rel = page.relative_to(ROOT)
        html = page.read_text(encoding="utf-8")

        for raw in ATTR.findall(html):
            link = raw.strip()
            if not link or EXTERNAL.match(link) or link.startswith("#"):
                # Une ancre pure est vérifiée contre la page courante.
                if link.startswith("#") and len(link) > 1:
                    if link[1:] not in anchors(page):
                        errors.append(f"{rel}: ancre inconnue « {link} »")
                continue

            # Chemin relatif : on le résout depuis le dossier de la page.
            target, _, frag = link.partition("#")
            if not target.startswith("/"):
                candidate = (page.parent / target).resolve()
                try:
                    target = "/" + str(candidate.relative_to(ROOT))
                except ValueError:
                    errors.append(f"{rel}: lien hors du site « {link} »")
                    continue

            dest = resolve(target)
            if dest is None:
                errors.append(f"{rel}: cible introuvable « {link} »")
                continue

            if frag and dest.suffix == ".html" and frag not in anchors(dest):
                errors.append(f"{rel}: ancre « #{frag} » absente de {target}")

    print(f"{len(files)} pages analysées.")
    if errors:
        print(f"\n{len(errors)} problème(s) :", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    print("Tous les liens internes sont valides.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
