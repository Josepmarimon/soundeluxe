#!/usr/bin/env python3
"""
Sound Deluxe - Generador de Vídeos Promocionals per Xarxes Socials
===================================================================
Efecte RULETA VERTICAL - Transició fluida sense talls
"""

import os
import math
import random
import subprocess
from pathlib import Path
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import numpy as np

# ============================================================================
# CONFIGURACIÓ
# ============================================================================

BASE_DIR = Path(__file__).parent.parent
COVERS_DIR = BASE_DIR / "album-covers"
OUTPUT_DIR = BASE_DIR / "promo-videos"
FRAMES_DIR = OUTPUT_DIR / "frames"
LOGO_PATH = Path("/Users/josepmarimon/Documents/Deluxe/imatge corporativa/imatge_generica.png")

VIDEO_WIDTH = 1080
VIDEO_HEIGHT = 1920
FPS = 30

COLORS = {
    "primary": (15, 15, 30),
    "secondary": (25, 25, 50),
    "accent": (233, 69, 96),
    "gold": (255, 215, 0),
    "white": (255, 255, 255),
    "light_gray": (180, 180, 180),
}

ALBUMS_DATA = {
    "GZA8SAwsKh0Q7JjyWiSjNC": {"artist": "Pink Floyd", "title": "The Dark Side of the Moon", "year": 1973},
    "GZA8SAwsKh0Q7JjyWiSjtK": {"artist": "Miles Davis", "title": "Kind of Blue", "year": 1959},
    "GZA8SAwsKh0Q7JjyWiSkPS": {"artist": "Marvin Gaye", "title": "What's Going On", "year": 1971},
    "GZA8SAwsKh0Q7JjyWiSlNh": {"artist": "The Velvet Underground", "title": "The Velvet Underground & Nico", "year": 1967},
    "GZA8SAwsKh0Q7JjyWiSldl": {"artist": "Led Zeppelin", "title": "Led Zeppelin IV", "year": 1971},
    "GZA8SAwsKh0Q7JjyWiSniH": {"artist": "Miles Davis", "title": "Bitches Brew", "year": 1970},
    "GZA8SAwsKh0Q7JjyWiSp0b": {"artist": "Guns N' Roses", "title": "Appetite for Destruction", "year": 1987},
    "GZA8SAwsKh0Q7JjyWiSpup": {"artist": "The Smiths", "title": "The Queen is Dead", "year": 1986},
    "NJZLoMez4714Sf01dGtBMx": {"artist": "Michael Jackson", "title": "Thriller", "year": 1982},
    "NJZLoMez4714Sf01dGtDAF": {"artist": "John Coltrane", "title": "A Love Supreme", "year": 1965},
    "NJZLoMez4714Sf01dGtDwd": {"artist": "Amy Winehouse", "title": "Back to Black", "year": 2006},
    "NJZLoMez4714Sf01dGtEFz": {"artist": "Lauryn Hill", "title": "The Miseducation of Lauryn Hill", "year": 1998},
    "NJZLoMez4714Sf01dGtFC3": {"artist": "Daft Punk", "title": "Random Access Memories", "year": 2013},
    "NJZLoMez4714Sf01dGtFyR": {"artist": "The Clash", "title": "London Calling", "year": 1979},
    "NJZLoMez4714Sf01dGtGHn": {"artist": "Bruce Springsteen", "title": "Born to Run", "year": 1975},
    "g1ucGbtbcNDpm5pEnR5nd1": {"artist": "The Beatles", "title": "Abbey Road", "year": 1969},
    "g1ucGbtbcNDpm5pEnR5ov1": {"artist": "The Beach Boys", "title": "Pet Sounds", "year": 1966},
    "g1ucGbtbcNDpm5pEnR5pF1": {"artist": "Radiohead", "title": "OK Computer", "year": 1997},
    "g1ucGbtbcNDpm5pEnR5pP1": {"artist": "U2", "title": "The Joshua Tree", "year": 1987},
    "g1ucGbtbcNDpm5pEnR5po1": {"artist": "Joni Mitchell", "title": "Blue", "year": 1971},
    "g1ucGbtbcNDpm5pEnR5qm1": {"artist": "Fleetwood Mac", "title": "Rumours", "year": 1977},
}

# ============================================================================
# FUNCIONS AUXILIARS
# ============================================================================

def create_gradient_background(width: int, height: int) -> Image.Image:
    """Crea un fons degradat elegant."""
    img = Image.new('RGB', (width, height), COLORS["primary"])
    draw = ImageDraw.Draw(img)

    for y in range(height):
        ratio = y / height
        r = int(COLORS["primary"][0] + (COLORS["secondary"][0] - COLORS["primary"][0]) * ratio * 0.5)
        g = int(COLORS["primary"][1] + (COLORS["secondary"][1] - COLORS["primary"][1]) * ratio * 0.5)
        b = int(COLORS["primary"][2] + (COLORS["secondary"][2] - COLORS["primary"][2]) * ratio * 0.5)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return img


def load_logo(max_width: int = 300, crop_slogan: bool = True) -> Image.Image:
    """Carrega i redimensiona el logotip."""
    if not LOGO_PATH.exists():
        # Placeholder si no existeix
        img = Image.new('RGBA', (max_width, max_width), (0, 0, 0, 0))
        return img

    logo = Image.open(LOGO_PATH).convert('RGBA')

    # Retallar l'eslògan (part inferior de la imatge)
    if crop_slogan:
        # Mantenir només el 55% superior (icona + "SOUND DELUXE")
        crop_height = int(logo.height * 0.55)
        logo = logo.crop((0, 0, logo.width, crop_height))

    # Redimensionar mantenint proporcions
    ratio = max_width / logo.width
    new_height = int(logo.height * ratio)
    logo = logo.resize((max_width, new_height), Image.Resampling.LANCZOS)

    return logo


def add_top_gradient_and_logo(img: Image.Image, logo: Image.Image) -> Image.Image:
    """Afegeix una franja fosca a la part superior i el logotip."""
    img = img.convert('RGBA')

    # Calcular altura de la franja basada en el logo + marges
    margin_top = 30
    margin_bottom = 30
    band_height = logo.height + margin_top + margin_bottom

    # Crear franja fosca al 75% d'opacitat (de banda a banda)
    alpha_75 = int(255 * 0.75)  # 75% opacitat = 191
    band = Image.new('RGBA', (img.width, band_height), (0, 0, 0, alpha_75))

    img.paste(band, (0, 0), band)

    # Afegir logotip centrat a la part superior
    logo_x = (img.width - logo.width) // 2
    logo_y = margin_top

    img.paste(logo, (logo_x, logo_y), logo)

    return img


def load_cover(album_id: str, size: int = 500) -> Image.Image:
    """Carrega i redimensiona una portada quadrada."""
    cover_path = COVERS_DIR / f"{album_id}.jpg"

    if not cover_path.exists():
        img = Image.new('RGB', (size, size), COLORS["secondary"])
        draw = ImageDraw.Draw(img)
        draw.text((size//2, size//2), "?", fill=COLORS["accent"], anchor="mm")
        return img

    try:
        img = Image.open(cover_path)
        img = img.convert('RGB')
        min_dim = min(img.size)
        left = (img.width - min_dim) // 2
        top = (img.height - min_dim) // 2
        img = img.crop((left, top, left + min_dim, top + min_dim))
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        return img
    except Exception as e:
        return Image.new('RGB', (size, size), COLORS["secondary"])


def create_vinyl_disc(size: int) -> Image.Image:
    """Crea un disc de vinil realista."""
    vinyl = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(vinyl)
    center = size // 2

    # Disc negre
    for r in range(center, 0, -1):
        brightness = 18 + int(12 * (1 - r / center))
        draw.ellipse([center - r, center - r, center + r, center + r],
                    fill=(brightness, brightness, brightness, 255))

    # Solcs
    for radius in range(25, center - 10, 3):
        alpha = 35 + (radius % 6) * 4
        draw.ellipse([center - radius, center - radius, center + radius, center + radius],
                    outline=(55, 55, 55, alpha), width=1)

    # Etiqueta central vermella
    label_r = size // 6
    draw.ellipse([center - label_r, center - label_r, center + label_r, center + label_r],
                fill=COLORS["accent"] + (255,))

    # Forat central
    hole_r = label_r // 5
    draw.ellipse([center - hole_r, center - hole_r, center + hole_r, center + hole_r],
                fill=(15, 15, 15, 255))

    return vinyl


def add_cover_frame(cover: Image.Image, thickness: int = 4) -> Image.Image:
    """Afegeix un marc a la portada."""
    size = cover.size[0]
    framed = Image.new('RGB', (size + thickness * 2, size + thickness * 2), (50, 50, 50))
    framed.paste(cover, (thickness, thickness))
    return framed


def get_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    """Obté una font del sistema."""
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNSDisplay.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                continue
    return ImageFont.load_default()


def ease_out_cubic(t: float) -> float:
    """Easing cúbic - desacceleració suau."""
    return 1 - pow(1 - t, 3)


def ease_out_quint(t: float) -> float:
    """Easing quíntic - desacceleració més pronunciada."""
    return 1 - pow(1 - t, 5)


def ease_in_out_sine(t: float) -> float:
    """Easing suau - velocitat constant al mig, suau al principi i final."""
    return -(math.cos(math.pi * t) - 1) / 2


def ease_slow_start(t: float) -> float:
    """Comença LENT, accelera al mig, frena al final."""
    if t < 0.3:
        # Primer 30%: molt lent (quadràtic)
        return (t / 0.3) ** 2 * 0.15
    elif t < 0.8:
        # 30-80%: velocitat mitjana
        return 0.15 + (t - 0.3) / 0.5 * 0.7
    else:
        # Últim 20%: frena suaument
        remaining = (t - 0.8) / 0.2
        return 0.85 + (1 - pow(1 - remaining, 2)) * 0.15


# ============================================================================
# GENERACIÓ DE FRAMES - TOT EN UN (sense salts)
# ============================================================================

def create_unified_frame(
    frame_num: int,
    total_frames: int,
    album_sequence: list,
    featured_album_id: str,
    session_info: dict,
    cover_size: int = 500,
    slot_height: int = 560
) -> Image.Image:
    """
    Crea un frame unificat - la ruleta i la revelació són el mateix procés.
    Quan la ruleta s'atura, el disc guanyador queda al centre i apareix la info.
    """
    img = create_gradient_background(VIDEO_WIDTH, VIDEO_HEIGHT)
    img = img.convert('RGBA')

    progress = frame_num / (total_frames - 1)

    center_x = VIDEO_WIDTH // 2
    center_y = VIDEO_HEIGHT // 2 - 180  # Més amunt per deixar espai al text amb discos grans

    num_albums = len(album_sequence)

    # =========================================================================
    # FASE 1: RULETA (0% - 55%) - gira i desaccelera
    # FASE 2: PARADA (55% - 65%) - s'atura amb bounce
    # FASE 3: REVELACIÓ (65% - 100%) - apareix vinil i text
    # =========================================================================

    spin_end = 0.70      # 70% del vídeo girant (7 segons)
    settle_end = 0.78    # Més temps per assentar-se

    # Thriller està a la posició 14 de la seqüència (índex 14)
    featured_index = 14

    # SUPER LENT: el carrusel passa per 14 discos fins arribar a Thriller
    # Això vol dir que en 7 segons veiem 14 discos = 2 segons per disc aproximadament

    # L'offset per arribar a Thriller (posició 14)
    target_offset = featured_index * slot_height

    if progress < spin_end:
        # Fase de gir LENT amb easing suau
        spin_progress = progress / spin_end
        # Usar easing que comença LENT
        eased = ease_slow_start(spin_progress)
        y_offset = eased * target_offset

    elif progress < settle_end:
        # Fase d'assentament amb petit bounce
        settle_progress = (progress - spin_end) / (settle_end - spin_end)

        # Bounce suau
        bounce_amplitude = slot_height * 0.06
        bounce = math.sin(settle_progress * math.pi * 2) * bounce_amplitude * (1 - settle_progress)

        y_offset = target_offset + bounce

    else:
        # Fase de revelació - el disc està fix al centre
        y_offset = target_offset

    # =========================================================================
    # DIBUIXAR ELS DISCOS DE LA RULETA
    # =========================================================================

    # Durant la revelació, els altres discos es fan transparents
    if progress > settle_end:
        reveal_progress = (progress - settle_end) / (1 - settle_end)
        other_albums_opacity = max(0, 1 - reveal_progress * 2)  # Desapareixen ràpid
    else:
        other_albums_opacity = 1.0

    # Calcular quin índex d'àlbum està al centre ara
    current_center_index = int(y_offset / slot_height) % num_albums
    offset_within_slot = y_offset % slot_height

    # Dibuixar els discos
    for i in range(-4, 8):
        # L'índex de l'àlbum per aquesta posició
        album_idx = (current_center_index + i) % num_albums
        album_id = album_sequence[album_idx]

        # Posició Y del disc
        # Quan i=0, el disc hauria d'estar centrat (menys l'offset dins del slot)
        base_y = center_y - cover_size // 2
        disc_y = base_y + (i * slot_height) - offset_within_slot

        # Només dibuixar si és visible
        if disc_y < -slot_height or disc_y > VIDEO_HEIGHT:
            continue

        # Distància al centre
        disc_center_y = disc_y + cover_size // 2
        distance_to_center = abs(disc_center_y - center_y)

        # És el disc destacat (Thriller)?
        is_featured = (album_id == featured_album_id)
        is_center = distance_to_center < slot_height * 0.4

        # ESCALA AMPLIADA: els discos al centre són MOLT més grans
        # Escala base per distància
        max_distance = VIDEO_HEIGHT // 2
        base_scale = 1.0 - (distance_to_center / max_distance) * 0.5
        base_scale = max(0.35, min(1.0, base_scale))

        # BONUS d'escala quan està al centre (efecte ZOOM)
        center_zoom = 1.0 - (distance_to_center / (slot_height * 0.6))
        center_zoom = max(0, min(1, center_zoom))
        zoom_bonus = center_zoom * 0.12  # 12% més gran al centre (discos ja són grans)

        scale = base_scale + zoom_bonus
        scale = min(1.12, scale)  # Màxim 112% de la mida original

        # Opacitat: més contrast entre centre i extrems
        base_opacity = 1.0 - (distance_to_center / max_distance) * 0.7
        base_opacity = max(0.1, min(1.0, base_opacity))

        # Durant revelació, només el disc destacat (Thriller) es manté visible
        if not (is_featured and is_center):
            base_opacity *= other_albums_opacity

        if base_opacity < 0.05:
            continue

        # Carregar i escalar portada
        current_size = int(cover_size * scale)
        cover = load_cover(album_id, current_size)
        cover = add_cover_frame(cover, int(4 * scale))

        disc_x = center_x - cover.width // 2
        actual_y = int(disc_y + (cover_size - current_size) // 2)

        # Convertir a RGBA i aplicar opacitat
        cover_rgba = cover.convert('RGBA')
        if base_opacity < 1.0:
            alpha_channel = Image.new('L', cover_rgba.size, int(255 * base_opacity))
            cover_rgba.putalpha(alpha_channel)

        # Ombra (només per discos visibles)
        if base_opacity > 0.3 and scale > 0.6:
            shadow = Image.new('RGBA', cover_rgba.size, (0, 0, 0, int(80 * base_opacity)))
            shadow = shadow.filter(ImageFilter.GaussianBlur(15))
            img.paste(shadow, (disc_x + 8, actual_y + 8), shadow)

        # EFECTE IL·LUMINACIÓ quan passa pel centre
        # Com més a prop del centre, més brillant
        center_proximity = 1.0 - (distance_to_center / (slot_height * 0.8))
        center_proximity = max(0, min(1, center_proximity))

        if center_proximity > 0.3 and progress < settle_end:
            # Glow daurat/blanc quan passa pel centre
            glow_strength = (center_proximity - 0.3) / 0.7  # 0 a 1
            glow_alpha = int(glow_strength * 120)

            # Crear glow al voltant del disc
            glow_size = current_size + 40
            glow = Image.new('RGBA', (glow_size, glow_size), (0, 0, 0, 0))
            glow_draw = ImageDraw.Draw(glow)

            # Glow daurat
            for r in range(glow_size // 2, 0, -3):
                a = int(glow_alpha * (r / (glow_size // 2)) * 0.6)
                glow_draw.ellipse(
                    [glow_size//2 - r, glow_size//2 - r, glow_size//2 + r, glow_size//2 + r],
                    fill=COLORS["gold"][:3] + (a,)
                )

            glow = glow.filter(ImageFilter.GaussianBlur(15))
            glow_x = disc_x - 20 + (cover_rgba.width - glow_size) // 2 + 20
            glow_y = actual_y - 20 + (cover_rgba.height - glow_size) // 2 + 20
            img.paste(glow, (glow_x, glow_y), glow)

            # Augmentar brillantor del disc quan és al centre
            if glow_strength > 0.5:
                enhancer = ImageEnhance.Brightness(cover_rgba.convert('RGB'))
                bright_factor = 1.0 + (glow_strength - 0.5) * 0.4
                cover_bright = enhancer.enhance(bright_factor).convert('RGBA')
                cover_bright.putalpha(cover_rgba.split()[3])
                cover_rgba = cover_bright

        img.paste(cover_rgba, (disc_x, actual_y), cover_rgba)

    # =========================================================================
    # INDICADORS LATERALS (sempre visibles)
    # =========================================================================

    draw = ImageDraw.Draw(img)
    indicator_y = center_y
    ind_width = 70

    # Brillantor dels indicadors augmenta quan s'atura
    if progress > spin_end:
        ind_alpha = min(255, int(200 + 55 * ((progress - spin_end) / (1 - spin_end))))
    else:
        ind_alpha = 180

    ind_color = COLORS["gold"][:3] + (ind_alpha,)

    # Esquerra
    draw.line([(40, indicator_y - cover_size//2 - 10), (40 + ind_width, indicator_y - cover_size//2 - 10)],
              fill=ind_color, width=3)
    draw.line([(40, indicator_y + cover_size//2 + 10), (40 + ind_width, indicator_y + cover_size//2 + 10)],
              fill=ind_color, width=3)

    # Dreta
    draw.line([(VIDEO_WIDTH - 40 - ind_width, indicator_y - cover_size//2 - 10),
               (VIDEO_WIDTH - 40, indicator_y - cover_size//2 - 10)], fill=ind_color, width=3)
    draw.line([(VIDEO_WIDTH - 40 - ind_width, indicator_y + cover_size//2 + 10),
               (VIDEO_WIDTH - 40, indicator_y + cover_size//2 + 10)], fill=ind_color, width=3)

    # =========================================================================
    # VINIL (apareix durant la revelació)
    # =========================================================================

    if progress > settle_end:
        reveal_progress = (progress - settle_end) / (1 - settle_end)

        # El vinil surt gradualment per la dreta
        vinyl_reveal = min(1.0, reveal_progress * 1.5)
        vinyl_size = int(cover_size * 1.1)
        max_vinyl_offset = int(cover_size * 0.35)
        vinyl_offset = int(max_vinyl_offset * vinyl_reveal)

        if vinyl_offset > 5:
            vinyl = create_vinyl_disc(vinyl_size)

            # Glow darrere
            if reveal_progress > 0.2:
                glow_intensity = int((reveal_progress - 0.2) * 100)
                glow = Image.new('RGBA', img.size, (0, 0, 0, 0))
                gdraw = ImageDraw.Draw(glow)
                for r in range(200, 0, -4):
                    alpha = int(glow_intensity * (1 - r/200) * 0.6)
                    gdraw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r],
                                 fill=COLORS["accent"][:3] + (alpha,))
                glow = glow.filter(ImageFilter.GaussianBlur(35))
                img = Image.alpha_composite(img, glow)

            vinyl_x = center_x - vinyl_size // 2 + vinyl_offset
            vinyl_y = center_y - vinyl_size // 2
            img.paste(vinyl, (vinyl_x, vinyl_y), vinyl)

            # Tornar a dibuixar la portada central per sobre del vinil
            center_cover = load_cover(featured_album_id, cover_size)
            center_cover = add_cover_frame(center_cover, 4)
            cover_x = center_x - center_cover.width // 2
            cover_y = center_y - center_cover.height // 2
            img.paste(center_cover.convert('RGBA'), (cover_x, cover_y), center_cover.convert('RGBA'))

    # =========================================================================
    # TEXT (apareix durant la revelació) - 50% més gran
    # =========================================================================

    if progress > settle_end + 0.05:
        text_progress = (progress - settle_end - 0.05) / (1 - settle_end - 0.05)

        album_info = ALBUMS_DATA.get(featured_album_id, {})
        text_y_base = center_y + cover_size // 2 + 80

        draw = ImageDraw.Draw(img)

        # Títol (apareix primer) - 58 * 1.5 = 87
        if text_progress > 0:
            title_alpha = int(min(255, text_progress * 3 * 255))
            font_title = get_font(87, bold=True)
            title = album_info.get("title", "")
            if len(title) > 20:
                title = title[:18] + "..."
            draw.text((center_x, text_y_base), title,
                     fill=COLORS["white"][:3] + (title_alpha,), anchor="mm", font=font_title)

        # Artista - 42 * 1.5 = 63
        if text_progress > 0.1:
            artist_alpha = int(min(255, (text_progress - 0.1) * 3 * 255))
            font_artist = get_font(63)
            draw.text((center_x, text_y_base + 95), album_info.get("artist", ""),
                     fill=COLORS["gold"][:3] + (artist_alpha,), anchor="mm", font=font_artist)

        # Any - 32 * 1.5 = 48
        if text_progress > 0.2:
            year_alpha = int(min(255, (text_progress - 0.2) * 3 * 255))
            font_year = get_font(48)
            draw.text((center_x, text_y_base + 170), str(album_info.get("year", "")),
                     fill=COLORS["light_gray"][:3] + (year_alpha,), anchor="mm", font=font_year)

        # Línia i info sessió - 34 * 1.5 = 51
        if text_progress > 0.35:
            info_alpha = int(min(255, (text_progress - 0.35) * 2.5 * 255))
            font_info = get_font(51)
            info_y = text_y_base + 260

            draw.line([(center_x - 200, info_y - 15), (center_x + 200, info_y - 15)],
                     fill=COLORS["accent"][:3] + (info_alpha,), width=3)

            draw.text((center_x, info_y + 45),
                     session_info.get('date', ''),
                     fill=COLORS["white"][:3] + (info_alpha,), anchor="mm", font=font_info)

            draw.text((center_x, info_y + 110),
                     session_info.get('time', ''),
                     fill=COLORS["white"][:3] + (info_alpha,), anchor="mm", font=font_info)

    return img.convert('RGB')


# ============================================================================
# GENERACIÓ DEL VÍDEO
# ============================================================================

def generate_all_frames(
    featured_album_id: str,
    session_info: dict,
    duration: float = 10.0
) -> Path:
    """Genera tots els frames del vídeo."""
    print(f"🎬 Generant frames per a: {ALBUMS_DATA.get(featured_album_id, {}).get('title', 'Unknown')}")

    FRAMES_DIR.mkdir(parents=True, exist_ok=True)

    for f in FRAMES_DIR.glob("*.png"):
        f.unlink()

    total_frames = int(duration * FPS)

    # Carregar el logotip una sola vegada (el triple de gran: 660px)
    logo = load_logo(max_width=660, crop_slogan=True)
    print(f"   Logotip carregat: {logo.size}")

    # Preparar seqüència d'àlbums
    available_albums = [aid for aid in ALBUMS_DATA.keys() if (COVERS_DIR / f"{aid}.jpg").exists()]

    if featured_album_id in available_albums:
        available_albums.remove(featured_album_id)
    random.seed(42)  # Reproducibilitat
    random.shuffle(available_albums)

    # La seqüència comença amb alguns àlbums i ACABA amb Thriller
    # Thriller serà el disc número 15 (índex 14 si comencem de 0)
    album_sequence = available_albums[:14] + [featured_album_id] + available_albums[14:]

    print(f"   Portades disponibles: {len(album_sequence)}")
    print(f"   Total frames: {total_frames}")

    cover_size = 850      # Quasi tot l'ample (1080px - marges)
    slot_height = cover_size + 60  # Espai entre discos

    for i in range(total_frames):
        frame = create_unified_frame(
            frame_num=i,
            total_frames=total_frames,
            album_sequence=album_sequence,
            featured_album_id=featured_album_id,
            session_info=session_info,
            cover_size=cover_size,
            slot_height=slot_height
        )

        # Afegir logotip amb degradat fosc a la part superior
        frame = add_top_gradient_and_logo(frame, logo)

        frame_path = FRAMES_DIR / f"frame_{i:05d}.png"
        frame.save(frame_path, optimize=True)

        if (i + 1) % FPS == 0 or i == total_frames - 1:
            print(f"   Frame {i+1}/{total_frames} ({int((i+1)/total_frames*100)}%)")

    print(f"✅ Frames guardats a: {FRAMES_DIR}")
    return FRAMES_DIR


def create_video_from_frames(frames_dir: Path, output_name: str) -> Path:
    """Crea vídeo MP4."""
    output_path = OUTPUT_DIR / output_name
    print(f"🎥 Creant vídeo amb ffmpeg...")

    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(frames_dir / "frame_%05d.png"),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(output_path)
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Vídeo creat: {output_path}")
            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"   Mida: {size_mb:.1f} MB")
            return output_path
        else:
            print(f"❌ Error ffmpeg: {result.stderr}")
            return None
    except FileNotFoundError:
        print("❌ ffmpeg no trobat")
        return None


def main():
    print("=" * 60)
    print("🎰 SOUND DELUXE - Generador de Vídeos RULETA v2")
    print("=" * 60)

    OUTPUT_DIR.mkdir(exist_ok=True)

    featured_album = "NJZLoMez4714Sf01dGtBMx"
    session = {
        "date": "Divendres 17 Gener 2025",
        "time": "19:30h"
    }

    album_info = ALBUMS_DATA.get(featured_album, {})
    print(f"\n📀 Àlbum destacat: {album_info.get('artist')} - {album_info.get('title')}")

    cover_path = COVERS_DIR / f"{featured_album}.jpg"
    if not cover_path.exists():
        print(f"❌ No es troba la portada: {cover_path}")
        return

    frames_dir = generate_all_frames(
        featured_album_id=featured_album,
        session_info=session,
        duration=10.0
    )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_name = f"thriller_ruleta_{timestamp}.mp4"
    video_path = create_video_from_frames(frames_dir, output_name)

    if video_path:
        print("\n" + "=" * 60)
        print("🎉 VÍDEO GENERAT!")
        print(f"📁 {video_path}")
        print("=" * 60)


if __name__ == "__main__":
    main()
