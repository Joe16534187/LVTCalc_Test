// Configuration file for LVT Calculator
// Copy this to config.js and customize as needed

const CONFIG = {
    // Map settings
    map: {
        // Initial view (Scotland)
        center: [57.0, -4.0],
        zoom: 6,
        minZoom: 5,
        maxZoom: 18,
        
        // Tile layer
        tileLayer: {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        
        // Alternative tile layers (uncomment to use)
        // CartoDB Positron (light theme)
        // tileLayer: {
        //     url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        //     attribution: '&copy; OpenStreetMap &copy; CartoDB'
        // },
        
        // CartoDB Dark Matter (dark theme)
        // tileLayer: {
        //     url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        //     attribution: '&copy; OpenStreetMap &copy; CartoDB'
        // }
    },
    
    // Data settings
    data: {
        // Use sample data (for development)
        useSample: true,
        sampleSize: 1000,
        
        // Data file location
        dataFile: 'data.js',
        
        // Enable marker clustering (recommended for large datasets)
        useMarkerClustering: false,
        
        // Maximum markers to display without clustering
        maxMarkersWithoutClustering: 1000
    },
    
    // Display settings
    display: {
        // Currency format
        currency: {
            symbol: '£',
            locale: 'en-GB',
            decimals: 2
        },
        
        // Area format
        area: {
            unit: 'm²',
            decimals: 2
        },
        
        // Date format (if needed)
        dateFormat: 'DD/MM/YYYY'
    },
    
    // Feature toggles
    features: {
        // Enable/disable features
        enableSearch: true,
        enableComparison: true,
        enableStatistics: true,
        enableExport: false,  // Future feature
        enablePrintView: false,  // Future feature
        
        // Chart settings
        charts: {
            enabled: true,
            type: 'bar',  // bar, line, pie
            animation: true
        }
    },
    
    // UI settings
    ui: {
        // Theme
        theme: 'light',  // light or dark
        
        // Show loading indicators
        showLoadingIndicators: true,
        
        // Animation duration (ms)
        animationDuration: 300,
        
        // Number of items per page (if pagination implemented)
        itemsPerPage: 20
    },
    
    // Analytics (optional)
    analytics: {
        enabled: false,
        googleAnalyticsId: '',  // Your GA4 measurement ID
        trackPageViews: true,
        trackSearches: true,
        trackComparisons: true
    },
    
    // API settings (for future backend integration)
    api: {
        enabled: false,
        baseUrl: '',
        endpoints: {
            properties: '/api/properties',
            search: '/api/search',
            statistics: '/api/statistics'
        },
        timeout: 5000
    },
    
    // Validation rules
    validation: {
        // Property search
        minSearchLength: 3,
        maxSearchLength: 50,
        
        // Tax inputs
        minTaxAmount: 0,
        maxTaxAmount: 1000000
    },
    
    // Text content (for easy customization)
    content: {
        siteTitle: 'Land Value Tax Calculator',
        siteSubtitle: 'Explore land values and compare taxes across Scotland',
        
        // Placeholder texts
        noPropertySelected: 'Please select a property on the map or search to see its details here.',
        searchPlaceholder: 'Search by property label (e.g., SCT0007216800)...',
        
        // Info section
        infoTitle: 'About This Calculator',
        infoContent: `This site provides estimates of land values and tax calculations for properties across Scotland.`,
        
        // Disclaimers
        disclaimer: 'These values are estimates based on statistical models and open data. They are intended for research and planning purposes only and should not be used for official valuations or financial decisions.'
    },
    
    // Error messages
    errors: {
        propertyNotFound: 'Property not found. Please check the label and try again.',
        invalidInput: 'Please enter a valid value.',
        loadingFailed: 'Failed to load data. Please refresh the page.',
        searchTooShort: 'Please enter at least 3 characters to search.'
    },
    
    // Debug mode
    debug: {
        enabled: false,  // Set to true for development
        logLevel: 'info',  // error, warn, info, debug
        showCoordinates: false,
        showDataStructure: false
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
