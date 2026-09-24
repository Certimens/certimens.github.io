#!/usr/bin/env python3
"""Contrôles de base sur les pages HTML du site.

Volontairement sans dépendance : la CI doit pouvoir tourner sur un runner nu.
On vérifie l'équilibrage des balises et une poignée de règles qui, si elles
sautent, cassent le référencement ou l'accessibilité sans qu'on le remarque.
"""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

VOID = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}


class Balance(HTMLParser):
    """Signale les balises non fermées ou fermées dans le désordre."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append(f"</{tag}> sans balise ouvrante")
        elif self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            while self.stack[-1] != tag:
                self.errors.append(f"<{self.stack.pop()}> non fermée avant </{tag}>")
            self.stack.pop()
        else:
            self.errors.append(f"</{tag}> inattendue")


def check(page: Path) -> list[str]:
    html = page.read_text(encoding="utf-8")
    rel = page.relative_to(ROOT)
    errors: list[str] = []

    parser = Balance()
    parser.feed(html)
    parser.close()
    errors += parser.errors
    errors += [f"<{tag}> jamais fermée" for tag in parser.stack]

    if not re.search(r"<!DOCTYPE html>", html, re.I):
        errors.append("<!DOCTYPE html> manquant")
    if not re.search(r"<html[^>]+lang=", html, re.I):
        errors.append("attribut lang absent sur <html>")
    if not re.search(r"<meta[^>]+name=[\"']viewport[\"']", html, re.I):
        errors.append("<meta viewport> manquant")

    title = re.search(r"<title>(.*?)</title>", html, re.I | re.S)
    if not title or not title.group(1).strip():
        errors.append("<title> vide ou absent")

    for img in re.findall(r"<img\b[^>]*>", html, re.I):
        if not re.search(r"\balt\s*=", img, re.I):
            src = re.search(r"src=[\"']([^\"']+)", img, re.I)
            errors.append(f"<img> sans alt : {src.group(1) if src else img[:50]}")

    # Les pages de redirection sont minimales : pas de <h1> attendu.
    is_redirect = 'http-equiv="refresh"' in html
    if not is_redirect and not re.search(r"<h1[\s>]", html, re.I):
        errors.append("aucun <h1> sur la page")

    return [f"{rel}: {e}" for e in errors]


def main() -> int:
    pages = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
    if not pages:
        print("Aucune page HTML trouvée.", file=sys.stderr)
        return 1

    errors: list[str] = []
    for page in pages:
        errors += check(page)

    print(f"{len(pages)} pages analysées.")
    if errors:
        print(f"\n{len(errors)} problème(s) :", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    print("Toutes les pages passent les contrôles HTML.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
