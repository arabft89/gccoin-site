# GCCoin — Web App & CI/CD Bootstrap

This repository contains the **operational scaffolding** (CI/CD, templates, configs) for the GCCoin website and app.
Drop these files into your existing project and push to GitHub to enable **branch protections**, **PR previews on Vercel**, and **automated quality checks**.

## Quick Start

1. **Create a new GitHub repo** (e.g., `gccoin-app`) — empty, no README.
2. In your local GCCoin project folder:
   ```bash
   git init
   git add .
   git commit -m "chore: initial import"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
3. **Create a `dev` branch** for staging:
   ```bash
   git checkout -b dev
   git push -u origin dev
   ```
4. **Vercel** → Import this repo.
   - Production = `main`
   - Staging = `dev`
   - Enable PR previews.
5. **Set environment variables** in Vercel (prod + staging):
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_I18N_ENABLED=true`
   - `NEXT_PUBLIC_TOKEN_SYMBOL=GCC`
   - `NEXT_PUBLIC_SUPPLY=750000000`
   - `NEXT_PUBLIC_CHAIN_ID` (placeholder until chain picked)
   - `FORMSPREE_ENDPOINT=https://formspree.io/f/xwpqqnov`
   - (Later) `NEXT_PUBLIC_GCC_CONTRACT_ADDRESS`
6. Enable **branch protection** rules in GitHub for `main`:
   - Require PR review
   - Require status checks: lint, typecheck, build
   - Disallow force pushes

## Scripts expected by CI
These should exist in your `package.json` (adjust as needed):
```json
{
  "scripts": {
    "lint": "eslint .",
    "type-check": "tsc --noEmit",
    "build": "next build"
  }
}
```
If your project differs (e.g., not Next.js), update the workflow commands accordingly.

## Husky (optional)
To add pre-commit hooks later:
```bash
npm i -D husky lint-staged
npx husky init
# then configure .husky/pre-commit to run: npm run lint && npm run type-check
```

---

© 2025 GCCoin.
