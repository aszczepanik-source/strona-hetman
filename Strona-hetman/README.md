# Strona internetowa KS Hetman Włoszczowa

Podstawowa wersja strony klubu (statyczny HTML/CSS/JS — bez CMS, można później podłączyć WordPress lub inny system, jeśli będzie taka potrzeba).

## Struktura projektu

```
index.html          – cała treść strony (sekcje: start, aktualności, o klubie, zespół, terminarz, sponsorzy, kontakt)
css/style.css        – wygląd strony, kolory klubowe jako zmienne CSS na górze pliku
js/script.js          – menu mobilne, rok w stopce
assets/img/logo/      – logo klubu i przeciwników
assets/img/sponsors/   – loga sponsorów i partnerów
assets/img/gallery/    – zdjęcia z meczów/wydarzeń (na przyszłość)
```

## Gdzie wgrać logo klubu

1. Zapisz plik z logo (najlepiej PNG z przezroczystym tłem, min. 400×400 px) jako:
   `assets/img/logo/logo-klubu.png`
2. Strona automatycznie go podłączy w nagłówku i na karcie meczu. Dopóki pliku nie ma, wyświetla się placeholder.

## Gdzie wgrać loga sponsorów/partnerów

Sponsorzy są podzieleni na trzy poziomy (tak jak np. u Widzewa Łódź) — sekcja `<section id="sponsorzy">` w `index.html`:

1. **Sponsor główny** — plik `assets/img/sponsors/sponsor-glowny.png` (większe logo, ok. 600×250 px).
2. **Sponsorzy** — pliki `assets/img/sponsors/sponsor-01.png`, `sponsor-02.png` itd.
3. **Partnerzy** — pliki `assets/img/sponsors/partner-01.png`, `partner-02.png` itd.

Wszystkie loga najlepiej jako PNG z przezroczystym tłem, ok. 300×150 px. Po wgraniu plików w `index.html`:
   - podmień nazwy plików w atrybutach `src` na Twoje,
   - podmień `alt="Nazwa sponsora..."` na prawdziwą nazwę firmy,
   - podmień `href="#"` na link do strony sponsora,
   - dodaj kolejne bloki `<a class="sponsor-logo">...</a>` w odpowiedniej grupie, jeśli masz więcej sponsorów/partnerów niż przygotowane miejsca.

## Kolory klubowe

Na razie ustawione są kolory orientacyjne (zielony + złoty) w pliku `css/style.css`, na samym początku (`:root { --color-primary: ... }`). Po wgraniu prawdziwego herbu klubu podmień te wartości na kolory zgodne z logo.

## Podgląd strony lokalnie

Wystarczy otworzyć plik `index.html` w przeglądarce, albo w folderze projektu wpisać:

```
python3 -m http.server 8000
```

i wejść na `http://localhost:8000`.

## Inspiracje

Struktura i "duży klubowy" styl (ciemny hero, pasek osiągnięć, tagi w aktualnościach, sponsorzy w trzech poziomach) inspirowane układem strony Widzewa Łódź (widzew.com.pl), przeskalowanym do potrzeb klubu IV ligi. Wcześniejsza, prostsza wersja bazowała na obecnej stronie hetmanwloszczowa.pl oraz stal.brzeg.pl.
