"""Monta a aula a partir dos fragmentos de cada ato (docs/fragmentos/ato-N.json e ato-N.notas.json).

Gera src/data/parsedPresentation.json (capa + atos, na ordem) e src/data/notas.json.
Uso: python3 scripts/montar-aula.py
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FRAG = ROOT / 'docs' / 'fragmentos'
DATA = ROOT / 'src' / 'data'
PARTES = ['1', '2', '2b', '3', '4', '5', '6']  # o Ato II vem em duas partes (20–25 e 26–33)

CAPA = {
    "id": 0, "sectionName": "Ato I · A Raiz", "number": "Nitrato inorgânico no exercício e no esporte", "layout": "prose",
    "title": "Da Raiz ao Músculo",
    "subtitle": "Como um ânion da beterraba vira óxido nítrico — e o que os ensaios clínicos realmente mostram.",
    "content": "<p class=\"reveal delay-2\" style=\"position: absolute; bottom: var(--slide-padding); right: var(--slide-padding); font-size: var(--small-size);\">Rinaldo Caporal · Nutricionista · CRN6-21717</p>",
    "cards": [],
}
NOTA_CAPA = {"minutos": 1, "mensagem": "Abertura: a aula segue um ânion da beterraba até o músculo e depois pergunta, com os ensaios na mão, para quem e quando isso faz diferença.",
             "pergunta": "Quem aqui já recomendou suco de beterraba antes de uma prova?",
             "transicao": "Começamos com uma votação."}

slides, notas, faltando = [CAPA], {"0": NOTA_CAPA}, []
for n in PARTES:
    frag, nf = FRAG / f'ato-{n}.json', FRAG / f'ato-{n}.notas.json'
    if not frag.exists():
        faltando.append(frag.name)
        continue
    slides += json.loads(frag.read_text())
    if nf.exists():
        notas.update(json.loads(nf.read_text()))
    else:
        faltando.append(nf.name)

ids = [s['id'] for s in slides]
dup = {i for i in ids if ids.count(i) > 1}
if dup:
    sys.exit(f'ids repetidos: {sorted(dup)}')
(DATA / 'parsedPresentation.json').write_text(json.dumps(slides, ensure_ascii=False, indent=2) + '\n')
(DATA / 'notas.json').write_text(json.dumps(notas, ensure_ascii=False, indent=2) + '\n')
total = sum(notas.get(str(i), {}).get('minutos', 0) for i in ids)
print(f'{len(slides)} slides, {total} min; sem nota: {[i for i in ids if str(i) not in notas]}; faltando: {faltando}')
