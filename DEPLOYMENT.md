# Deployment Guide

## Quick Start (Development)

1. **Navigate to the website directory**:
   ```bash
   cd lvt-website
   ```

2. **Start a local web server**:
   
   Option A - Python (recommended):
   ```bash
   python3 -m http.server 8000
   ```
   
   Option B - PHP:
   ```bash
   php -S localhost:8000
   ```
   
   Option C - Node.js:
   ```bash
   npx http-server -p 8000
   ```

3. **Open in your browser**:
   Navigate to `http://localhost:8000`

## Production Deployment

### Option 1: Static Web Hosting

The application is entirely client-side and can be hosted on any static web hosting service:

**GitHub Pages**:
1. Create a GitHub repository
2. Push all files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://yourusername.github.io/repository-name`

**Netlify**:
1. Sign up at netlify.com
2. Drag and drop the `lvt-website` folder
3. Your site will be deployed instantly with a custom URL

**Vercel**:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

**AWS S3 + CloudFront**:
1. Create an S3 bucket with static website hosting enabled
2. Upload all files
3. Configure CloudFront for CDN distribution
4. Set up custom domain (optional)

### Option 2: Traditional Web Server

**Apache**:
```apache
<VirtualHost *:80>
    ServerName lvt-calculator.yourdomain.com
    DocumentRoot /var/www/lvt-website
    
    <Directory /var/www/lvt-website>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Nginx**:
```nginx
server {
    listen 80;
    server_name lvt-calculator.yourdomain.com;
    
    root /var/www/lvt-website;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Compress responses
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Production Optimisations

### 1. Full Dataset Integration

To use the complete dataset (145,766 properties):

**Edit `generate_data.py`**:
```python
# Change this line:
use_sample = True  # Set to False

# To:
use_sample = False
```

Then regenerate:
```bash
python3 generate_data.py
```

**Warning**: The full dataset will create a large JavaScript file (~20-30MB). Consider implementing:
- Server-side API for data loading
- Marker clustering
- Lazy loading of properties

### 2. Add Real Coordinates

Replace the mock coordinate generation in `generate_data.py`:

```python
def load_real_coordinates(df, coordinates_file):
    """
    Load actual property coordinates from a CSV file
    Expected format: Label, Latitude, Longitude
    """
    coords_df = pd.read_csv(coordinates_file)
    df = df.merge(coords_df, on='Label', how='left')
    return df
```

### 3. Implement Marker Clustering

Add to `index.html` after Leaflet script:
```html
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
```

Modify `loadAllProperties()` in `app.js`:
```javascript
const markerCluster = L.markerClusterGroup();
properties.forEach(property => {
    const marker = L.marker([property.latitude, property.longitude])
        .bindPopup(createPopupContent(property))
        .on('click', function() {
            selectProperty(property);
        });
    markerCluster.addLayer(marker);
});
map.addLayer(markerCluster);
```

### 4. Add Server-Side API (Optional)

For very large datasets, implement a backend API:

**Example using Node.js/Express**:
```javascript
const express = require('express');
const app = express();

// Load data into database
// Implement spatial queries

app.get('/api/properties/bounds', (req, res) => {
    const { north, south, east, west } = req.query;
    // Query properties within bounds
    // Return only properties in viewport
});

app.get('/api/property/:id', (req, res) => {
    // Return single property details
});

app.listen(3000);
```

### 5. Performance Monitoring

Add analytics and performance monitoring:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

### 6. Security Headers

Add security headers in your web server config:

**Nginx**:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 7. CDN Integration

For better performance, use a CDN for static assets:
- Cloudflare (free tier available)
- AWS CloudFront
- Google Cloud CDN
- Azure CDN

### 8. HTTPS Setup

Always use HTTPS in production:
- **Let's Encrypt**: Free SSL certificates
- **Cloudflare**: Free SSL with CDN
- Most hosting providers include free SSL

## Maintenance

### Updating Data

1. Replace `LVT_with_Tax_Calculations.xlsx` with new data
2. Run `python3 generate_data.py`
3. Deploy the updated `data.js` file

### Monitoring

Set up monitoring for:
- Page load times
- Error rates
- User interactions
- Search queries (for improving UX)

### Backup

Regularly backup:
- Source data files
- Configuration files
- User-submitted feedback (if implemented)

## Cost Estimates

**Static Hosting (Small Scale)**:
- GitHub Pages: Free
- Netlify: Free tier available
- Vercel: Free tier available

**Static Hosting (Production)**:
- AWS S3 + CloudFront: ~£5-20/month
- Netlify Pro: ~£15/month
- Vercel Pro: ~£15/month

**With Backend API**:
- VPS (DigitalOcean, Linode): £5-20/month
- AWS EC2 + RDS: £20-100/month
- Google Cloud Run: Pay-per-use

## Support

For issues or questions:
1. Check the README.md file
2. Review browser console for errors
3. Verify data.js was generated correctly
4. Check web server logs
