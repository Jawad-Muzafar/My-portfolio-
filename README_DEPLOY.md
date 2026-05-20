Deploying this portfolio to GitHub Pages (quick guide)

1) Create a new GitHub repository (your GitHub account).
   - Repo name: e.g., `My-portfolio-` (same as local folder)

2) Add remote and push your code:

```bash
git init
git add .
git commit -m "Prepare site for GitHub Pages"
# replace <your-github-url> with the repository SSH or HTTPS URL
git remote add origin <your-github-url>
git branch -M main
git push -u origin main
```

3) The workflow `.github/workflows/pages.yml` will run on push and publish the site to GitHub Pages. Wait a few minutes and then view:

https://<your-github-username>.github.io/<repo-name>/

Notes
- If you use a custom domain, add a `CNAME` file at the repository root.
- For contact email delivery, you can either:
  - Use the included server (see `server/`), host it on Render/Railway and set the form `fetch` endpoint to your deployed server URL; or
  - Use EmailJS (client-only) — add keys into `script.js` per `EMAILJS_INSTRUCTIONS.md`.

If you want, I can prepare a pull request with these changes, or help you push and enable Pages (you'll need to provide the repo URL or give me permission to push).