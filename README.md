# Family Secret Santa

A tiny static site: each person gets a unique code, enters it, and sees only who they drew. Nobody can pick another family member’s name.

GitHub Pages is enough. There is no database.

## 1. Put names in `family.json`

```json
{
  "family": ["Mom", "Dad", "Sean"]
}
```

Use at least two names. Duplicates are ignored.

## 2. Draw names

```bash
node draw.mjs
```

This will:

- shuffle everyone into a circle (nobody gets themselves, nobody is drawn twice)
- write one file per person in `draws/` (this is what the site loads)
- print a private **name + code** table and save it to `admin-results.txt` (gitignored)

Text each person **the site URL and their own code**. The organizer file does not include who anyone drew. Do not open files in `draws/` if you want to stay blind to the matches.

If you run the draw again, old codes stop working.

## 3. Try it locally

Codes only load over HTTP, not from `file://`.

```bash
npx --yes serve .
```

Open the URL it prints, enter a code from `admin-results.txt`.

## 4. Host on GitHub Pages

1. Create a GitHub repo and push this folder.
2. Do **not** commit `admin-results.txt`.
3. Settings → Pages → Deploy from the `main` branch, folder `/` (root).
4. Share `https://<you>.github.io/<repo>/` plus each person’s code.

`family.json` and `draw.mjs` can stay in the repo; they do not include the assignments. The match for a person lives only in `draws/<THEIR-CODE>.json`. Guessing a code like `MAPLE-04` is unlikely. This is still a family honor-system app, not bank-grade login.

The page background is a Country Club Plaza holiday photo by Hngrange, used under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Credit appears on the site.

## 5. After the party

Unpublish Pages or delete the repo when you are done.
