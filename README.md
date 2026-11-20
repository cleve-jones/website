# Cleve Jones Foundation — website

The live site is **https://clevejones.org**, hosted on Netlify, built from this
repository. Push to `main` and the site updates itself in about a minute.

Everything here is plain HTML, CSS and JavaScript. No framework, no build step,
no dependencies — `site/index.html` opens in a browser and runs.

> **This repository is public.** Everything in it can be read by anyone. Internal
> notes, contact details and anything not cleared for publication belong in the
> private `cleve-jones/foundation-docs` repository instead.

---

## Making a change (the short version)

1. Ask Claude for the change you want, in plain English.
2. Claude edits the files and opens a **pull request**.
3. Netlify builds a **preview link** from that pull request. Open it and look.
4. Happy? Click **Merge**. The live site updates in about a minute.
5. Not happy? Say so and Claude revises it. Nothing public changes until merge.

Nothing you do in a pull request can break the live site. The site only changes
when someone clicks Merge, and any merge can be undone by reverting it.

### Doing that in a browser, with no software to install

1. Go to **claude.ai/code** and sign in.
2. Connect GitHub the first time it asks, and pick this repository.
3. Type what you want, e.g. *"On the Events page, change the Dec 1 event
   headline to X"*, or *"replace the photo on the About page with the one I'm
   attaching"*.
4. Claude works, then gives you a pull request link. Follow the steps above.

---

## What is where

```
site/                 EVERYTHING IN HERE IS PUBLIC. It is what Netlify serves.
  index.html  about.html  our-work.html  give.html
  media.html  events.html contact.html
  bio-cleve.html      Cleve's full biography; a sub-page of About
  assets/
    css/site.css      one stylesheet, brand tokens at the top
    js/site.js        hero rotator, mobile nav, donate card. ~5 KB, no libraries
    img/              23 processed photographs (22 in use)
    brand/            the mark and favicons

_work/                Not published. The tools that make the site.
  build.js, pages.js  THE GENERATOR — see the warning below
  tools/              checking scripts (screenshots, layout checks)
  studies/            logo and icon comparison sheets

netlify.toml          Hosting config. Holds the launch switch (see below).
```

### ⚠️ The eight HTML pages are generated

`_work/pages.js` writes the eight files in `site/`. **If you hand-edit a page
without editing the generator, the next `node _work/build.js` silently throws
your edit away.** That has already happened once, on 18 November 2026: a round
of Kevin's copy changes went into the HTML only, and a routine rebuild reverted
all of them.

So: change `_work/pages.js`, then run `node _work/build.js`. CSS, JavaScript and
images are edited directly — the generator never touches those.

To check the two are in sync without overwriting anything:

```sh
CJ_OUT=/tmp/check node _work/build.js && diff -r /tmp/check site --exclude=assets
```

Claude knows this. It is written here for whoever reads the repo next.

---

## The launch switch

The site is currently **hidden from Google on purpose**. `netlify.toml` sends a
`X-Robots-Tag: noindex, nofollow` header on every page, because:

- the donation form on `give.html` is a placeholder that **takes no money**, and
- the photograph rights have not been cleared.

The site is still reachable by anyone with the link — this stops search engines
indexing it, nothing more. When both of those are genuinely resolved, delete
that one line from `netlify.toml`. That is the launch.

See `LAUNCH-CHECKLIST.md` in the private `cleve-jones/foundation-docs`
repository for everything else still outstanding.

---

## Deploying

Netlify watches `main`. Merging a pull request deploys it. There is nothing to
run, and no credentials in this repository.

To look at the site on your own machine first:

```sh
node _work/tools/serve.js      # then open http://localhost:8080
```
