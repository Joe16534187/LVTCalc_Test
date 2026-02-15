// LVT Calculator Application
let map;
let propertiesData = null;
let selectedProperty = null;
let polygonLayer = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
    loadProperties();
});

// Initialize Leaflet map
function initializeMap() {
    // Center on Aberdeenshire/Aberdeen
    // UPDATED: Enable Canvas rendering for better performance with large datasets
    map = L.map('map', {
        preferCanvas: true,
        renderer: L.canvas()
    }).setView([57.3655, -2.5205], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 8
    }).addTo(map);
}

// Load property data
async function loadProperties() {
    try {
        console.log('Fetching properties from data/properties.geojson...');
        const response = await fetch('data/properties.geojson');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        console.log('Parsing GeoJSON...');
        propertiesData = await response.json();
        
        console.log(`✓ Loaded ${propertiesData.features.length} properties`);
        
        // Display polygons on map
        displayPolygons();
        
        // Hide loading indicator and invalidate map size
        setTimeout(() => {
            document.getElementById('loadingOverlay').classList.add('hidden');
            // Force Leaflet to recalculate map size and redraw tiles
            map.invalidateSize();
        }, 100);
        
    } catch (error) {
        console.error('Error loading properties:', error);
        console.error('Error details:', error.message);
        
        // Hide loading indicator on error
        document.getElementById('loadingOverlay').classList.add('hidden');
        
        // More helpful error message
        const errorMsg = error.message.includes('Failed to fetch') 
            ? 'Cannot load property data. Please run this website from a web server (e.g., "python -m http.server 8000") rather than opening the HTML file directly.'
            : 'Error loading property data: ' + error.message;
        
        alert(errorMsg);
    }
}

// Display polygons on map with colour coding
function displayPolygons() {
    if (!propertiesData) return;
    
    polygonLayer = L.geoJSON(propertiesData, {
        style: function(feature) {
            const landValuePerM2 = feature.properties.Land_Value_per_m2 || 0;
            
            return {
                fillColor: getColourByLandValue(landValuePerM2),
                fillOpacity: 0.6,
                color: '#ffffff',
                weight: 1,
                opacity: 0.8
            };
        },
        onEachFeature: function(feature, layer) {
            // Bind popup
            layer.bindPopup(createPopupContent(feature.properties));
            
            // Click handler
            layer.on('click', function() {
                selectProperty(feature.properties);
            });
            
            // Hover effects
            layer.on('mouseover', function(e) {
                const layer = e.target;
                layer.setStyle({
                    weight: 2,
                    fillOpacity: 0.8
                });
            });
            
            layer.on('mouseout', function(e) {
                const layer = e.target;
                layer.setStyle({
                    weight: 1,
                    fillOpacity: 0.6
                });
            });
        }
    }).addTo(map);
    
    // Fit map to show all properties
    map.fitBounds(polygonLayer.getBounds(), { padding: [50, 50] });
}

// Get colour based on land value per m²
function getColourByLandValue(valuePerM2) {
    if (valuePerM2 < 100) return '#1e3a8a';      // Deep blue
    if (valuePerM2 < 200) return '#2563eb';      // Blue
    if (valuePerM2 < 400) return '#0ea5e9';      // Sky blue
    if (valuePerM2 < 800) return '#06b6d4';      // Cyan
    if (valuePerM2 < 1600) return '#14b8a6';     // Teal
    if (valuePerM2 < 3200) return '#10b981';     // Emerald
    return '#22c55e';                             // Green
}

// Create popup content
function createPopupContent(props) {
    return `
        <div class="popup-title">${props.Label}</div>
        <div class="popup-info">
            <div>
                <span class="popup-label">Land Value/m²:</span>
                <span class="popup-value">${formatCurrency(props.Land_Value_per_m2)}</span>
            </div>
            <div>
                <span class="popup-label">Area:</span>
                <span class="popup-value">${formatArea(props.Area)}</span>
            </div>
            <div>
                <span class="popup-label">Total Land Value:</span>
                <span class="popup-value">${formatCurrency(props.Land_Value_Combined)}</span>
            </div>
        </div>
    `;
}

// Select property and show details
function selectProperty(props) {
    selectedProperty = props;
    
    // Build property details HTML
    const detailsHTML = `
        <div class="property-info">
            <div class="info-row">
                <span class="info-label">Property ID</span>
                <span class="info-value">${props.Label}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Area</span>
                <span class="info-value">${formatArea(props.Area)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Land Value</span>
                <span class="info-value">${formatCurrency(props.Land_Value_Combined)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Land Value per m²</span>
                <span class="info-value">${formatCurrency(props.Land_Value_per_m2)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Building Value</span>
                <span class="info-value">${formatCurrency(props.Building_Value_Combined)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">LVT (Council Tax)</span>
                <span class="info-value">${formatCurrency(props.Council_Tax_Amount)}/year</span>
            </div>
            <div class="info-row">
                <span class="info-label">LVT (LBTT)</span>
                <span class="info-value">${formatCurrency(props.LBTT_Amount)}</span>
            </div>
        </div>
    `;
    
    document.getElementById('propertyDetails').innerHTML = detailsHTML;
    
    // Show calculator form
    document.querySelector('.info-text').style.display = 'none';
    document.getElementById('calculatorForm').style.display = 'flex';
    document.getElementById('comparisonResults').style.display = 'none';
    
    // Enable/disable inputs based on checkboxes
    updateInputStates();
}

// Update input enabled/disabled states based on checkboxes
function updateInputStates() {
    const councilTaxChecked = document.getElementById('includeCouncilTax').checked;
    const lbttChecked = document.getElementById('includeLBTT').checked;
    
    document.getElementById('actualCouncilTax').disabled = !councilTaxChecked;
    document.getElementById('actualLBTT').disabled = !lbttChecked;
}

// Calculate tax comparison
function calculateComparison() {
    if (!selectedProperty) return;
    
    const includeCouncilTax = document.getElementById('includeCouncilTax').checked;
    const includeLBTT = document.getElementById('includeLBTT').checked;
    
    if (!includeCouncilTax && !includeLBTT) {
        alert('Please select at least one tax type to compare');
        return;
    }
    
    // Get user inputs
    const actualCouncilTax = includeCouncilTax ? 
        parseFloat(document.getElementById('actualCouncilTax').value) || 0 : 0;
    const actualLBTT = includeLBTT ? 
        parseFloat(document.getElementById('actualLBTT').value) || 0 : 0;
    
    // Get LVT amounts for this property
    const lvtCouncilTax = includeCouncilTax ? selectedProperty.Council_Tax_Amount : 0;
    const lvtLBTT = includeLBTT ? selectedProperty.LBTT_Amount : 0;
    
    // Calculate totals
    const totalCurrent = actualCouncilTax + actualLBTT;
    const totalLVT = lvtCouncilTax + lvtLBTT;
    const difference = totalCurrent - totalLVT;
    
    // Update results display
    document.getElementById('totalCurrent').textContent = formatCurrency(totalCurrent);
    document.getElementById('totalLVT').textContent = formatCurrency(totalLVT);
    document.getElementById('totalDifference').textContent = formatCurrency(Math.abs(difference));
    
    // Update difference label and styling
    const differenceLabel = document.getElementById('differenceLabel');
    const differenceValue = document.getElementById('totalDifference');
    
    if (difference > 0) {
        differenceLabel.textContent = 'You would SAVE:';
        differenceValue.classList.add('positive');
        differenceValue.classList.remove('negative');
    } else if (difference < 0) {
        differenceLabel.textContent = 'You would PAY MORE:';
        differenceValue.classList.add('negative');
        differenceValue.classList.remove('positive');
    } else {
        differenceLabel.textContent = 'Difference:';
        differenceValue.classList.remove('positive', 'negative');
    }
    
    // Build breakdown table
    let breakdownHTML = '';
    
    if (includeCouncilTax) {
        breakdownHTML += `
            <tr>
                <td>Council Tax</td>
                <td>${formatCurrency(actualCouncilTax)}</td>
                <td>${formatCurrency(lvtCouncilTax)}</td>
            </tr>
        `;
    }
    
    if (includeLBTT) {
        breakdownHTML += `
            <tr>
                <td>LBTT</td>
                <td>${formatCurrency(actualLBTT)}</td>
                <td>${formatCurrency(lvtLBTT)}</td>
            </tr>
        `;
    }
    
    document.getElementById('breakdownTableBody').innerHTML = breakdownHTML;
    
    // Show results, hide form
    document.getElementById('calculatorForm').style.display = 'none';
    document.getElementById('comparisonResults').style.display = 'block';
}

// Reset calculator
function resetCalculator() {
    // Clear inputs
    document.getElementById('actualCouncilTax').value = '';
    document.getElementById('actualLBTT').value = '';
    
    // Reset checkboxes
    document.getElementById('includeCouncilTax').checked = true;
    document.getElementById('includeLBTT').checked = false;
    
    // Show form, hide results
    document.getElementById('calculatorForm').style.display = 'flex';
    document.getElementById('comparisonResults').style.display = 'none';
    
    updateInputStates();
}

// Setup event listeners
function setupEventListeners() {
    // Calculate button
    document.getElementById('calculateBtn').addEventListener('click', calculateComparison);
    
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetCalculator);
    
    // Checkbox change listeners
    document.getElementById('includeCouncilTax').addEventListener('change', updateInputStates);
    document.getElementById('includeLBTT').addEventListener('change', updateInputStates);
    
    // Info toggle
    const infoToggle = document.getElementById('infoToggle');
    const infoContent = document.getElementById('infoContent');
    
    infoToggle.addEventListener('click', () => {
        infoContent.classList.toggle('open');
        infoToggle.classList.toggle('open');
    });
}

// Utility: Format currency
function formatCurrency(value) {
    if (value === null || value === undefined) return '£0.00';
    
    const absValue = Math.abs(value);
    return absValue.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Utility: Format area
function formatArea(value) {
    if (value === null || value === undefined) return '0 m²';
    
    return value.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' m²';
}
