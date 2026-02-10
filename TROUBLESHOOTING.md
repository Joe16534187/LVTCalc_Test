# Troubleshooting: "Error loading property data"

## The Problem

You're seeing: **"Error loading property data. Please refresh the page."**

This happens because modern browsers block local file access for security reasons when you open HTML files directly (using `file://` protocol).

## The Solution

You need to run the website from a **web server** (even locally). Here are your options:

---

## ✅ Option 1: Python Web Server (Easiest)

### If you have Python 3:
```bash
cd lvt-website
python -m http.server 8000
```

### If you have Python 2:
```bash
cd lvt-website
python -m SimpleHTTPServer 8000
```

Then open your browser and visit:
```
http://localhost:8000
```

**The website should now work perfectly!**

---

## ✅ Option 2: Use the Diagnostic Tool

I've included `diagnostic.html` in the website folder.

1. Run a web server (see Option 1 above)
2. Visit: `http://localhost:8000/diagnostic.html`
3. This will test your setup and show exactly what's wrong

---

## ✅ Option 3: Deploy to GitHub Pages

This is the **permanent solution** - your website will work for everyone:

1. Create a new GitHub repository
2. Upload the contents of `lvt-website/` folder:
   - index.html
   - styles.css  
   - app.js
   - data/properties.geojson

3. Enable GitHub Pages:
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Save

4. Your site is live at: `https://yourusername.github.io/repo-name/`

**Works everywhere, no server needed!**

---

## ✅ Option 4: Other Web Servers

### Node.js (if you have it installed):
```bash
npx http-server lvt-website
```

### VS Code Live Server:
- Install "Live Server" extension
- Right-click `index.html`
- Select "Open with Live Server"

### PHP (if installed):
```bash
cd lvt-website
php -S localhost:8000
```

---

## Why This Happens

When you double-click `index.html`, it opens as:
```
file:///C:/Users/You/lvt-website/index.html
```

The browser sees this `file://` protocol and **blocks** JavaScript from loading other files (like `data/properties.geojson`) for security.

When you run a web server, the URL becomes:
```
http://localhost:8000/index.html
```

Now the browser sees `http://` protocol and **allows** the files to load!

---

## Quick Test

Run this command and see if it works:

### Windows (PowerShell):
```powershell
cd lvt-website
python -m http.server 8000
```

### Mac/Linux (Terminal):
```bash
cd lvt-website
python3 -m http.server 8000
```

Then visit: http://localhost:8000

---

## What You Should See

When working correctly:

✅ Map loads and shows Scotland  
✅ Properties visible as coloured polygons  
✅ Click a property → details appear in sidebar  
✅ Calculator form appears  
✅ Can enter tax amounts and calculate  

---

## Still Having Issues?

1. **Open `diagnostic.html`** (via web server at `http://localhost:8000/diagnostic.html`)
2. Check what it reports
3. Look at browser console:
   - Press F12
   - Go to "Console" tab
   - Look for red error messages

Common issues:
- **File not found**: Check that `data/properties.geojson` exists
- **Permission denied**: Make sure files aren't read-only
- **CORS error**: You're not running a web server (use Option 1)

---

## Need More Help?

The diagnostic tool (`diagnostic.html`) will identify the exact issue and show you how to fix it.

**Remember**: The website works perfectly once you run it from a web server! 🚀
