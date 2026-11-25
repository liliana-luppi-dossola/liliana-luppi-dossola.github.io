# Liliana Luppi Dossola — Fine Art

Gallery website for the original paintings of Liliana Luppi Dossola. Each painting has its own viewing room and an original piece of music composed for it.

## Put it online with GitHub Pages (free)

1. Sign in at github.com and click **New repository**.
   - Name it `yourusername.github.io` to get the address `https://yourusername.github.io`,
   - or give it any name (for example `liliana-dossola`) to get `https://yourusername.github.io/liliana-dossola`.
   - Set it to **Public**, then click **Create repository**.
2. On the new repository page, click **uploading an existing file**.
   Drag in **everything inside this folder** (`index.html`, `.nojekyll`, `css`, `js`, `images`, `music`), then click **Commit changes**.
   Tip: in a Mac Finder window, press Cmd+Shift+. to show the hidden `.nojekyll` file.
3. Go to **Settings → Pages**. Under "Build and deployment" choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Wait a minute or two and the site will be live at the address shown on that page.

### Use your own domain (optional)
In **Settings → Pages → Custom domain**, enter your domain (for example `lilianadossola.com`), then add the DNS records GitHub shows you at your domain registrar.

## Editing

- **Sizes, descriptions, order:** edit `js/paintings.js`. The paintings appear in the order they are listed.
- **Add a painting:** put a large image `images/new-slug.jpg` (about 1200 px on the long side) and a smaller `images/new-slug-thumb.jpg` (about 720 px) in `images/`, add an MP3 at `music/new-slug.mp3`, then add an entry to `js/paintings.js` with the same `slug`.
- **Contact email:** search for `lilianawings@yahoo.com` in `index.html` and `js/app.js`.
- **Share a single painting:** add `#slug` to the address, for example `.../#california-sunset`.

## Music
All 12 tracks were composed for this site and synthesized from scratch, with no samples or existing recordings, so they are free to use here.
