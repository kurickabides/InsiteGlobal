# Workers

Use this folder for browser worker assets that need to be served from a stable public URL.

PDF viewers often need a PDF.js worker file here, for example:

```txt
/workers/pdf.worker.min.js
```

If a future PDF module requires a worker, document the exact source package and copy process in this folder.
