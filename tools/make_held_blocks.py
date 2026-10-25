#!/usr/bin/env python3
"""Generate 16x16 isometric held-block sprites from top/front face textures."""
from __future__ import annotations

import collections
import math
import os
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path("/Users/boys/Projects/Farm Sim/sprites")
TOP_DIR = ROOT / "blocks" / "top"
FRONT_DIR = ROOT / "blocks" / "front"
OUT_DIR = ROOT / "blocks" / "held"
MIRROR_DIR = Path("/Users/boys/Documents/Sprites/blocks/held")

OUTLINE = (58, 42, 26, 255)
SKIP_SUFFIXES = ("_slope", "_stairs")
SLAB_SUFFIX = "_slab"

SPECIAL = {
    "glass_block": {
        "top": (170, 215, 235),
        "left": (70, 130, 165),
        "right": (110, 175, 205),
        "alpha": 165,
        "highlight": (235, 250, 255),
    },
    "water": {
        "top": (80, 155, 215),
        "left": (35, 90, 155),
        "right": (55, 125, 190),
        "alpha": 220,
        "highlight": (190, 225, 245),
    },
}


def clamp(v, lo=0, hi=255):
    return max(lo, min(hi, int(round(v))))


def shade(rgb, factor):
    return tuple(clamp(c * factor) for c in rgb[:3])


def lighten(rgb, amt):
    return tuple(clamp(c + amt) for c in rgb[:3])


def darken(rgb, amt):
    return tuple(clamp(c - amt) for c in rgb[:3])


def sample_dominant(path: Path, n=8, quant=16):
    im = Image.open(path).convert("RGBA")
    pixels = [p for p in im.getdata() if p[3] > 180]
    if not pixels:
        return [(128, 128, 128)]
    rounded = [
        ((r // quant) * quant, (g // quant) * quant, (b // quant) * quant)
        for r, g, b, a in pixels
    ]
    counts = collections.Counter(rounded)
    ranked = []
    for col, c in counts.most_common(25):
        bri = sum(col)
        if bri < 40 or bri > 700:
            continue
        ranked.append((c, col))
    if not ranked:
        ranked = [(c, col) for col, c in counts.most_common(n)]
    ranked.sort(key=lambda x: -x[0])
    return [col for _, col in ranked[:n]]


def avg_color(path: Path):
    cols = sample_dominant(path, n=4)
    r = sum(c[0] for c in cols) // len(cols)
    g = sum(c[1] for c in cols) // len(cols)
    b = sum(c[2] for c in cols) // len(cols)
    return (r, g, b)


def pick_colors(name: str):
    if name in SPECIAL:
        s = SPECIAL[name]
        return s["top"], s["left"], s["right"], s.get("alpha", 255), s.get("highlight")

    top_path = TOP_DIR / f"{name}_top.png"
    front_path = FRONT_DIR / f"{name}_front.png"
    base = name[:-5] if name.endswith("_slab") else name
    if name.endswith("_slab"):
        bt = TOP_DIR / f"{base}_top.png"
        bf = FRONT_DIR / f"{base}_front.png"
        if bt.exists():
            top_path = bt
        if bf.exists():
            front_path = bf

    if name == "grass" or name.startswith("grass_"):
        top_cols = sample_dominant(TOP_DIR / "grass_top.png", n=10)
        greens = [c for c in top_cols if c[1] > c[0] + 20 and c[1] > c[2]]
        top = greens[0] if greens else (96, 176, 64)
        front_cols = sample_dominant(FRONT_DIR / "grass_front.png", n=10)
        browns = [
            c for c in front_cols
            if c[0] > c[2] and c[1] < c[0] + 20 and c[1] > 40
        ]
        side = browns[0] if browns else (112, 64, 32)
        return top, shade(side, 0.82), side, 255, lighten(top, 35)

    if name in ("farmland", "wet_farmland"):
        top = avg_color(top_path)
        side = avg_color(front_path) if front_path.exists() else darken(top, 40)
        if name == "wet_farmland":
            top = (clamp(top[0] - 20), clamp(top[1] - 10), clamp(top[2] + 15))
        return top, shade(side, 0.78), shade(side, 0.92), 255, lighten(top, 28)

    top = avg_color(top_path)
    side = avg_color(front_path) if front_path.exists() else shade(top, 0.75)
    if sum(abs(top[i] - side[i]) for i in range(3)) < 25:
        top = lighten(top, 20)
        side = darken(side, 15)
    left = shade(side, 0.75)
    right = shade(side, 0.98)
    top = lighten(top, 6)
    return top, left, right, 255, lighten(top, 30)


def in_diamond(x, y, cx, cy, hw, hh):
    return abs((x + 0.5 - cx) / hw) + abs((y + 0.5 - cy) / hh) <= 1.0


def detail_for(name):
    if name in ("farmland", "wet_farmland"):
        return "furrows"
    if name == "grass" or name.startswith("grass_"):
        return "grass_dots"
    if "plank" in name or name in ("wood", "wood_wall", "crate", "fence_block", "wood_slab"):
        return "planks"
    if "brick" in name:
        return "bricks"
    return None


def draw_cube(top, left, right, alpha=255, highlight=None, slab=False, detail=None, name=""):
    size = 16
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    if slab:
        tcx, tcy = 7.5, 5.5
        thw, thh = 6.0, 3.0
        side_h = 3.6
    else:
        tcx, tcy = 7.5, 4.0
        thw, thh = 6.0, 3.0
        side_h = 7.0

    top_bottom_y = tcy + thh
    bot_y = top_bottom_y + side_h

    left_pts = [
        (tcx - thw, tcy),
        (tcx + 0.3, tcy + thh),
        (tcx + 0.3, bot_y),
        (tcx - thw, bot_y - thh),
    ]
    right_pts = [
        (tcx + thw, tcy),
        (tcx - 0.3, tcy + thh),
        (tcx - 0.3, bot_y),
        (tcx + thw, bot_y - thh),
    ]
    top_pts = [
        (tcx, tcy - thh - 0.15),
        (tcx + thw + 0.15, tcy),
        (tcx, tcy + thh + 0.25),
        (tcx - thw - 0.15, tcy),
    ]

    def rgb(c):
        return (c[0], c[1], c[2], 255)

    draw.polygon(left_pts, fill=rgb(left))
    draw.polygon(right_pts, fill=rgb(right))
    draw.polygon(top_pts, fill=rgb(top))

    data = im.load()

    def face_at(x, y):
        if data[x, y][3] == 0:
            return None
        if in_diamond(x, y, tcx, tcy, thw + 0.4, thh + 0.4):
            return "top"
        if x + 0.5 < tcx:
            return "left"
        return "right"

    # Close 1px holes
    for _ in range(2):
        for y in range(size):
            for x in range(size):
                if data[x, y][3] != 0:
                    continue
                neigh = []
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < size and 0 <= ny < size and data[nx, ny][3] > 0:
                        neigh.append(data[nx, ny])
                if len(neigh) >= 3:
                    r = sum(p[0] for p in neigh) // len(neigh)
                    g = sum(p[1] for p in neigh) // len(neigh)
                    b = sum(p[2] for p in neigh) // len(neigh)
                    data[x, y] = (r, g, b, 255)

    for y in range(size):
        for x in range(size):
            if data[x, y][3] == 0:
                continue
            face = face_at(x, y)
            if face == "top":
                col = top
                if highlight and y <= (tcy - thh) + 2.0 and abs(x + 0.5 - tcx) <= 2.0:
                    col = highlight
                elif detail == "furrows":
                    if int(x - y) % 3 == 0:
                        col = darken(top, 28)
                    elif int(x - y) % 3 == 1:
                        col = lighten(top, 8)
                elif detail == "grass_dots":
                    if (x * 5 + y * 7) % 6 == 0:
                        col = lighten(top, 28)
                    elif (x * 3 + y) % 7 == 0:
                        col = darken(top, 18)
                elif detail == "planks":
                    if int(y + x * 0.3) % 2 == 0:
                        col = darken(top, 14)
                elif detail == "bricks":
                    row = int(y - (tcy - thh))
                    col_i = int(x + (row % 2) * 1.5)
                    if row % 2 == 0:
                        col = darken(top, 20) if col_i % 3 == 0 else top
                    else:
                        col = darken(top, 12) if col_i % 3 == 1 else lighten(top, 5)
                data[x, y] = rgb(col)
            elif face == "left":
                t = max(0.0, (y - top_bottom_y) / max(0.1, side_h))
                col = shade(left, 1.0 - 0.18 * t)
                if detail == "planks" and int(x + y) % 3 == 0:
                    col = darken(col, 12)
                if detail == "bricks" and int(y) % 3 == 0:
                    col = darken(col, 18)
                data[x, y] = rgb(col)
            elif face == "right":
                t = max(0.0, (y - top_bottom_y) / max(0.1, side_h))
                col = shade(right, 1.0 - 0.14 * t)
                if detail == "planks" and int(x * 2 + y) % 3 == 0:
                    col = darken(col, 10)
                if detail == "bricks" and int(y) % 3 == 0:
                    col = darken(col, 15)
                data[x, y] = rgb(col)

    if name in ("coal_ore", "iron_ore", "gold_ore"):
        cols = {
            "coal_ore": [(22, 22, 24), (50, 50, 55)],
            "iron_ore": [(205, 180, 150), (155, 135, 115)],
            "gold_ore": [(235, 200, 55), (190, 150, 35)],
        }[name]
        spots = [
            (5, 4), (8, 3), (10, 5), (6, 6), (7, 5),
            (4, 9), (5, 11), (9, 10), (11, 8), (7, 12), (10, 12), (6, 10),
        ]
        for i, (sx, sy) in enumerate(spots):
            if 0 <= sx < size and 0 <= sy < size and data[sx, sy][3] > 0:
                if data[sx, sy][:3] != OUTLINE[:3]:
                    c = cols[i % 2]
                    data[sx, sy] = (c[0], c[1], c[2], 255)

    for y in range(size):
        for x in range(size):
            if data[x, y][3] == 0:
                continue
            f = face_at(x, y)
            for dx, dy in ((1, 0), (0, 1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < size and 0 <= ny < size and data[nx, ny][3] > 0:
                    nf = face_at(nx, ny)
                    if f and nf and f != nf:
                        p = data[x, y]
                        data[x, y] = (
                            clamp(p[0] * 0.62),
                            clamp(p[1] * 0.62),
                            clamp(p[2] * 0.62),
                            255,
                        )

    opaque = {(x, y) for y in range(size) for x in range(size) if data[x, y][3] > 0}
    for x, y in opaque:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if (x + dx, y + dy) not in opaque:
                data[x, y] = OUTLINE
                break

    if alpha < 255:
        for y in range(size):
            for x in range(size):
                p = data[x, y]
                if p[3] == 0:
                    continue
                if p[:3] == OUTLINE[:3]:
                    data[x, y] = OUTLINE
                else:
                    data[x, y] = (p[0], p[1], p[2], alpha)

    return im


def list_blocks():
    tops = {f[:-8] for f in os.listdir(TOP_DIR) if f.endswith("_top.png")}
    tops = {t for t in tops if not t.startswith("water_top")}
    fronts = {f[:-10] for f in os.listdir(FRONT_DIR) if f.endswith("_front.png")}
    both = sorted(tops & fronts)
    extra = ["water"] if (TOP_DIR / "water_top.png").exists() else []
    return both, extra


def should_skip(name):
    return any(name.endswith(s) for s in SKIP_SUFFIXES)


def contact_sheet(images, cols=8, scale=2, label=False):
    pad = 2 if not label else 4
    label_h = 12 if label else 0
    cell = 16 * scale
    rows = math.ceil(len(images) / cols) if images else 1
    sheet = Image.new(
        "RGBA",
        (cols * (cell + pad) + pad, rows * (cell + pad + label_h) + pad),
        (40, 32, 28, 255),
    )
    d = ImageDraw.Draw(sheet)
    for i, (name, im) in enumerate(images):
        r, c = divmod(i, cols)
        x = pad + c * (cell + pad)
        y = pad + r * (cell + pad + label_h)
        big = im.resize((cell, cell), Image.NEAREST)
        sheet.paste(big, (x, y), big)
        if label:
            d.text((x, y + cell), name[:14], fill=(220, 200, 170, 255))
    return sheet


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    MIRROR_DIR.mkdir(parents=True, exist_ok=True)

    both, extra = list_blocks()
    generated, skipped = [], []

    for name in both:
        if should_skip(name):
            skipped.append(name)
            continue
        top, left, right, alpha, highlight = pick_colors(name)
        im = draw_cube(
            top, left, right, alpha, highlight,
            name.endswith(SLAB_SUFFIX), detail_for(name), name,
        )
        im.save(OUT_DIR / f"{name}_held.png")
        im.save(MIRROR_DIR / f"{name}_held.png")
        generated.append((name, im))

    for name in extra:
        top, left, right, alpha, highlight = pick_colors(name)
        im = draw_cube(top, left, right, alpha, highlight, False, None, name)
        im.save(OUT_DIR / f"{name}_held.png")
        im.save(MIRROR_DIR / f"{name}_held.png")
        generated.append((name, im))

    generated.sort(key=lambda x: x[0])
    sheet = contact_sheet(generated, cols=8, scale=2)
    sheet.save(OUT_DIR / "_preview.png")
    sheet.save(MIRROR_DIR / "_preview.png")
    large = contact_sheet(generated, cols=8, scale=4, label=True)
    large.save(OUT_DIR / "_preview_large.png")
    large.save(MIRROR_DIR / "_preview_large.png")

    print("GENERATED", len(generated))
    for n, _ in generated:
        print(" ", n)
    print("SKIPPED", len(skipped))
    for n in skipped:
        print(" ", n)
    print("OUT", OUT_DIR)
    print("MIRROR", MIRROR_DIR)
    print("PREVIEW", OUT_DIR / "_preview.png")


if __name__ == "__main__":
    main()
