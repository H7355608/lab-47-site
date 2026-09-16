# lab-47.com

Source for the Lab-47 studio site. Plain static HTML, no build step.

## How it deploys

The site is linked to Netlify. Every push to `main` deploys to https://lab-47.com
automatically (about a minute). Nothing else is needed.

- `app-ads.txt` — authorised ad sellers for every Lab-47 app that lists lab-47.com
  as its developer website. Add a line per ad network, a comment per app.
- `netlify.toml` — tells Netlify to publish the repository root.

## Editing

Commits must be authored as `contact@lab-47.com` (the Netlify team email). This
folder's git config is already set to it. Netlify blocks builds from a private
repo when the commit author is not a verified team member.

Edit the files, commit, push:

    git add -A
    git commit -m "Describe the change"
    git push

Preview locally with `python -m http.server 8347` from this folder.
