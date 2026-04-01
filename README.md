# DevBeez

This is the primary repo of the project DevBeez

---

## 🤖 Project Overview

DevBeez is an AI-powered project that provides platform for coding and quiz applications. The repository uses **Git**, **GitHub**, and **Pull Requests** for collaborative development.

---

### Tech Stack

- **Typsescript** (99.4%)
- **Other** (0.6%)

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [For Contributors (Fork & PR)](#for-contributors-fork--pr)
- [For Admins (Review & Merge)](#for-admins-review--merge)
- [Pull Request Template](#pull-request-template)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- Git configured

### Installation

```bash
npm install
npm run dev
```

---

## 👥 For Contributors (Fork & PR)

### Step 1: Fork the Repository

1. Visit the main repository  
   👉 [Admin Repository](https://github.com/NITHISH0728/pep-project)
2. Click **Fork** (top-right corner)
3. Your fork will be created at:  
   ```
   https://github.com/your-username/pep-project
   ```

---

### Step 2: Clone Your Fork Locally

```bash
git clone https://github.com/your-username/pep-project.git
cd pep-project
```

---

### Step 3: Add Upstream Remote (Main Repository)

```bash
git remote add upstream https://github.com/owner-username/pep-project.git
git fetch upstream
```

Verify remotes:

```bash
git remote -v
```

---

### Step 4: Create a Feature Branch

> **Never work directly on `main`**

```bash
git checkout main
git pull upstream main
git checkout -b your-name-branch
```

**Branch Naming Conventions:**

- `feature/` – new features
- `fix/` – bug fixes
- `docs/` – documentation
- `chore/` – maintenance tasks


---

### Step 5: Make Your Changes

```bash
npm install
npm run dev
```

Make your changes, then stage and commit:

```bash
git add .
git commit -m "feat: add responsive navbar"
```

---

### Step 6: Push Changes and Create a Pull Request

```bash
git push origin yourname-branch
```

Then open a **Pull Request** on GitHub with a clear description of your changes.

---

## 🔍 For Admins (Review & Merge)

### Reviewing Pull Requests (branch-on-parent)

1. Check out the PR branch:

```bash
git checkout main
git pull origin main
```
2. Admin Testing Workflow

```bash
# Get the latest data from the repository
git fetch origin
```
3. Check out the contributor's branch:

```bash
# Switch to their branch
git checkout <branch-name>

# Ensure it's up to date
git pull origin <branch-name>
```
4. Clean Install & Run:

```bash
# Install any new packages they might have added
npm install

# Run the development server
npm run dev
```
5. Verification Checklist:
   
   [ ] Does the app start without console errors?
   [ ] Does the specific feature/fix work as described in the PR?
   [ ] Does it work on different screen sizes (Responsive Check)?
   [ ] Did it break any existing features?

6. Merge via GitHub (Recommended):

   Once testing passes, return to the GitHub PR web interface and select "Squash and merge" to keep the main history clean.
   
7. Cleanup your local environment:

```bash
# Switch back to main
git checkout main

# Update your local main with the new merge
git pull origin main

# Delete the local copy of their feature branch
git branch -d <branch-name>
```

### Reviewing Pull Requests (branch-on-forks)

 Using Github CLI:

 ```bash
   gh pr checkout 123
```

   This automatically creates a local branch for you with all their changes.
   
---

## 📝 Pull Request Template

When creating a PR, include the following information in `.github/pull_request_template.md`:

```markdown
## Changes
- Brief description of changes

## Why
- Reason for changes

## Testing
- How to test the changes

## Screenshots
- Attach relevant screenshots if applicable
```

---

## 📌 Commit Message Guidelines

Follow the conventional commits format:

```text
feat: add login validation
fix: mobile navbar overlap
docs: update README
chore: update dependencies
```

**Format:** `<type>: <description>`

---

## 🆘 Troubleshooting

| Issue | Solution |
|------|----------|
| `npm install` fails | `rm -rf node_modules package-lock.json && npm install` |
| Merge conflict | `git pull upstream main` and resolve conflicts manually |
| Branch is behind main | `git pull upstream main` to sync with latest changes |
| Accidentally committed to main | Create a new branch and cherry-pick commits |

---

## 📧 Need Help?

If you encounter any issues, please:
1. Check the **Troubleshooting** section above
2. Review existing issues on GitHub
3. Create a new issue with a clear description

---

## 🎉 Happy Coding!

Thank you for contributing to Kural Admin Dashboard! 🚀
