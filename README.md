# COOCASE website

Catalogue website for COOCASE keyless motorcycle luggage, built with Next.js 15 (App Router),
Tailwind CSS 4 and Leaflet. No backend: every page is generated statically and can be deployed to
Vercel as-is.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Pages

| Route | What it is |
| --- | --- |
| `/{locale}` | Home: hero, innovations, featured keyless series, case anatomy, categories, distribution map teaser, manufacturing |
| `/{locale}/products` | Full catalogue with category filter + search (`?category=…&q=…`) |
| `/{locale}/products/{slug}` | Product detail: gallery and lightbox, specs, features, sizes, colour chart or rack fitment list, related products |
| `/{locale}/distributors` | Global draggable/zoomable map of distributors with region filter and a location list |
| `/{locale}/about` | Company story, manufacturing, trade shows, offices |
| `/{locale}/contact` | Contact details + inquiry form (opens the visitor's email app; see below) |
| `/admin/map-editor` | **Owner tool** for editing distributor pins (not linked from the site, `noindex`) |

`{locale}` is one of `en`, `zh`, `it`, `fr`, `id`, `ja`. Visiting `/` redirects to the visitor's
browser language (or their last choice, remembered in a cookie).

## Editing distributor locations

All pins on the map come from **`src/data/distributors.json`**. There are two ways to change them.

**A. With the visual editor (no coding)**

1. Open `/admin/map-editor` on the running site (e.g. `https://your-domain/admin/map-editor`).
2. Drag pins to move them, click **Add pin** and then click the map to add one, or select a pin to
   edit its company name, type, address, email, phone and website, or to delete it.
3. Click **Download distributors.json**.
4. Replace `src/data/distributors.json` in the repository with the downloaded file and commit.
   Vercel redeploys automatically.

Drafts are saved only in your browser until you publish them with step 4.

**B. By editing the JSON directly**

```json
{
  "id": "it-milan",                 // unique, no spaces
  "name": "Moto Accessori Srl",     // empty "" shows "Distributor"
  "type": "distributor",            // hq | office | factory | distributor
  "region": "europe",               // europe | americas | middle-east | asia | oceania
  "country": "Italy",
  "city": "Milan",
  "address": "Via Example 1, 20100 Milano",
  "lat": 45.4642,
  "lng": 9.19,
  "email": "", "phone": "", "website": ""
}
```

To find coordinates, right-click a place in Google Maps and copy the numbers it shows.

> The distributor pins shipped now are **placeholders**: one pin per country listed on the
> catalogue's "Distribution Network" page, placed in each country's main city. Replace them with
> the real distributor names and addresses.

## Translations

UI and product text live in `src/i18n/dictionaries/{en,zh,it,fr,id,ja}.ts`. `en.ts` is the
source of truth. The other files are type-checked against it, so a missing key fails the build.

To add a language: add its code to `src/i18n/config.ts`, create a dictionary file, and register it
in `src/i18n/index.ts`.

## Products

Everything about products lives in **`src/data/products.ts`** (a copy-and-paste template is at the
top of that file). Products mirror the supplier photo archives in `catalogue/`: one product per case
style and lock type (keyless / key), with sizes as versions.

- **Product text:** `name`, `kind`, `desc`, `features` and variant `note` accept an existing
  translation key (e.g. `"keyless"`) or inline text such as `{ en: "…", zh: "…" }`. Missing
  languages fall back to English.
- **Extra details:** add rows to `specs`, e.g. `{ label: { en: "Dimensions" }, value: "450 × 380 mm" }`.
- **Colour options:** plastic cases list their colour swatches in `colours`.

### Photos

`catalogue/` holds the supplier's original photo ZIPs (16 GB, not committed to git). Web copies are
generated from them:

```bash
python3 scripts/catalogue-photos.py catalogue public/products
```

The script reads the ZIPs directly, takes the photos chosen in its `PICKS` table and writes WebP
files of max 1600 px to `public/products/<slug>/` (about 40 KB each). To swap a photo, change its
file name in `PICKS`, re-run the script, and commit `public/products/`.

Anything without a photo shows a branded "image coming soon" placeholder.

## Contact form

There is no backend yet, so the form opens the visitor's email client with the message filled
in, addressed to the catalogue emails. To receive submissions server-side, change `submit` in
`src/components/ContactForm.tsx` to POST to a form service (Formspree, Resend, etc.) or a Next.js
route handler.

## Map tiles

The map uses OpenStreetMap tiles, shown in greyscale to match the brand. OSM's public tile servers
are meant for light use only. Before launch, set `NEXT_PUBLIC_MAP_TILE_URL` to a commercial
provider (see `.env.example`).
