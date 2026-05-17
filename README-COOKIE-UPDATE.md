# Manual Cookie Update Guide

## When to Update
- Session expired (getting login redirects)
- 401/403 errors from Workday API
- After password change or security settings update

## How to Update

### Option 1: Using the helper script
```bash
./scripts/update-cookie.sh
```

### Option 2: Manual update
1. Open Chrome and navigate to https://wd10.myworkday.com/ubc
2. Complete login + Duo MFA
3. Open DevTools (F12) → Network tab
4. Find any request to `wd10.myworkday.com`
5. Right-click → Copy → Copy as cURL (bash)
6. Extract the cookie string (after `-b` or `--cookie`)
7. Update `.env` file:
   ```
   WORKDAY_COOKIE=paste_cookie_here
   ```

## Verifying the Update
```bash
npm run test:live
```

## Security Notes
- Never commit `.env` to git
- Cookie contains session tokens - keep it secure
- Sessions typically last 8-24 hours
