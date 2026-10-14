# PDF sources

HTML sources for the PDFs in `/downloads`. Edit the HTML, then rebuild:

```
python3 -m http.server 8765      # from the repo root
node print-src/build.js          # all three, or name one: node print-src/build.js collection-service
```

The four `Sample-*-Statement.pdf` files are printed from Recycled Connect (`connect/`), not from here.
