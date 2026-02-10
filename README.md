# Land Value Tax Calculator - Website

A fully functional website demonstrating Land Value Tax comparison for properties in Aberdeenshire and Aberdeen, Scotland.

## Current Status

✅ **Working with 2,608 properties** (subset of full dataset)  
✅ Interactive map with colour-coded land values  
✅ Property selection and details display  
✅ Tax comparison calculator  
✅ Responsive design for desktop and mobile  

## Files Included

```
lvt-website/
├── index.html           # Main HTML page
├── styles.css          # Stylesheet (soft colour palette)
├── app.js              # JavaScript application logic
└── data/
    └── properties.geojson  # Property data (2,608 properties, 1.9MB)
```

## Features

### 1. Interactive Map
- **Colour-coded polygons** by land value per m² (blue = low, green = high)
- **Click on any property** to select it and view details
- **Hover effects** to highlight properties
- **Popups** showing key property information
- **Legend** explaining the colour scale

### 2. Property Details Panel
- Property ID
- Area (m²)
- Land value and land value per m²
- Building value
- LVT amounts for Council Tax and LBTT

### 3. Tax Comparison Calculator
- **Select which taxes to replace**: Council Tax (annual) and/or LBTT (one-time)
- **Enter your actual tax amounts**
- **Calculate comparison** to see if you'd save or pay more
- **Detailed breakdown** showing current vs LVT for each tax type
- **Clear visual indicators** (green for savings, red for increases)

### 4. Information Panel
- Collapsible "About This Calculator" section
- Explanation of Land Value Tax
- Data coverage information
- Important disclaimers

## How to Deploy

### Option 1: GitHub Pages (Recommended)

1. **Create a new repository** on GitHub
2. **Upload all files**:
   ```
   lvt-website/
   ├── index.html
   ├── styles.css
   ├── app.js
   └── data/
       └── properties.geojson
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from a branch
   - Branch: main / root
   - Click Save

4. **Add custom domain** (optional):
   - In Settings > Pages > Custom domain
   - Enter your domain (e.g., `lvtcalculator.co.uk`)
   - Add CNAME file with your domain

Your site will be live at: `https://yourusername.github.io/repository-name/`

### Option 2: Local Testing

1. **Open directly in browser**:
   - Simply open `index.html` in your web browser
   - Note: Some browsers may block loading the GeoJSON file from local disk
   
2. **Run a local server** (recommended for testing):
   
   **Python:**
   ```bash
   cd lvt-website
   python -m http.server 8000
   ```
   Then visit: `http://localhost:8000`
   
   **Node.js (http-server):**
   ```bash
   npx http-server lvt-website
   ```

### Option 3: Any Web Host

Upload all files to any web hosting service. The site is 100% static (no server-side processing required).

## How to Use

1. **View the map** - Properties are colour-coded by land value
2. **Click on a property** - Details appear in the right sidebar
3. **Select taxes to compare**:
   - Check "Council Tax" and enter your annual amount
   - Check "LBTT" if you want to include your stamp duty payment
4. **Click "Calculate Comparison"** - See if you'd save or pay more under LVT
5. **View detailed breakdown** - See exactly how each tax compares

## Updating Data

When you have the complete GeoJSON file with all 145K properties:

1. **Replace** `data/properties.geojson` with the new file
2. **Update** the data coverage text in `index.html`:
   ```html
   <p>Currently showing: 145,766 properties in Aberdeenshire & Aberdeen area.</p>
   ```
3. **Test** that the map still loads correctly
4. **Deploy** the updated files

No code changes needed - the application automatically handles any number of properties!

## Browser Compatibility

✅ Chrome/Edge (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)  

## Technical Details

### Libraries Used
- **Leaflet.js 1.9.4** - Interactive maps
- **OpenStreetMap** - Map tiles (free, no API key required)

### Data Format
Properties must include:
- `Label` - Property ID
- `Area` - Area in m²
- `Land_Value_Combined` - Total land value (£)
- `Building_Value_Combined` - Total building value (£)
- `Council_Tax_Amount` - LVT amount for Council Tax (£)
- `LBTT_Amount` - LVT amount for LBTT (£)
- `Land_Value_per_m2` - Calculated land value per m² (£)
- `geometry` - Polygon coordinates in WGS84 (EPSG:4326)

### Colour Scale
Land value per m² → Colour:
- £0-100 → Dark blue (#1e3a8a)
- £100-200 → Blue (#2563eb)
- £200-400 → Sky blue (#0ea5e9)
- £400-800 → Cyan (#06b6d4)
- £800-1,600 → Teal (#14b8a6)
- £1,600-3,200 → Emerald (#10b981)
- £3,200+ → Green (#22c55e)

## Performance

Current dataset (2,608 properties, 1.9MB):
- **Load time**: < 2 seconds on good connection
- **Map rendering**: Instant
- **Polygon interactions**: Smooth

Full dataset estimate (145K properties, ~60MB):
- **Load time**: 5-8 seconds on good connection
- **May need optimization** for very large files (see notes below)

## Future Expansion

### Adding More Regions

When expanding to England/Wales, structure like this:

```
data/
├── scotland/
│   └── aberdeenshire.geojson
├── england/
│   └── [regions].geojson
└── wales/
    └── [regions].geojson
```

Update `app.js` to load different regions based on user selection.

### Optimizing Large Files

If the full 145K property file is too large (>50MB):

1. **Use TopoJSON** (40-60% smaller)
2. **Implement vector tiles** (load only visible area)
3. **Split into multiple files** (load on demand)

See included documentation for details.

## Troubleshooting

### Map doesn't display
- Check browser console for errors
- Verify `properties.geojson` is in the correct location
- Ensure you're running from a web server (not opening file directly)

### Properties don't appear
- Check that GeoJSON has valid geometries
- Verify coordinates are in WGS84 format (longitude/latitude)
- Check that polygons are in Scotland bounds

### Slow performance
- For files >50MB, consider optimization techniques
- Check browser's memory usage
- Try simplifying polygon geometries

## Support

For issues or questions about the website implementation, check:
1. Browser console for JavaScript errors
2. Network tab for file loading issues
3. GeoJSON structure matches expected format

## License

This calculator is for demonstration and research purposes only. Not for use in financial or legal decisions.

---

**Ready to deploy!** Upload to GitHub Pages or any web host and start testing.
