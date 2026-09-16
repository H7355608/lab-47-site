# lab-47.com

Source for the Lab-47 studio site. Plain static HTML, no build step.

## How it deploys

The site is linked to Netlify. Every push to `main` deploys to https://lab-47.com
automatically (about a minute). Nothing else is needed.

- `app-ads.txt` — authorised ad sellers for every Lab-47 app that lists lab-47.com
  as its developer website. Add a line per ad network, a comment per app.
- `netlify.toml` — tells Netlify to publish the repository root.

## Editing

This repository is public on purpose. Netlify's Starter plan blocks builds from a
private repository unless every commit author is a verified team member, and it
treats a repo linked by deploy key as private regardless. Public sidesteps all of
that. Nothing here is secret: every file is served as-is at lab-47.com.

This folder's git config authors commits as `contact@lab-47.com`, the Netlify
team email, which keeps the Netlify contributor list tidy.

Edit the files, commit, push:

    git add -A
    git commit -m "Describe the change"
    git push

Preview locally with `python -m http.server 8347` from this folder.
