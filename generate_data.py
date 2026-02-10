#!/usr/bin/env python3
"""
Data Generator for LVT Calculator Website
Converts Excel data to JavaScript format for web application
"""

import pandas as pd
import json
import numpy as np
import sys
from pathlib import Path

def load_excel_data(filepath):
    """Load the LVT data from Excel file"""
    try:
        df = pd.read_excel(filepath)
        print(f"✓ Loaded {len(df)} properties from {filepath}")
        return df
    except FileNotFoundError:
        print(f"✗ Error: File '{filepath}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Error loading Excel file: {e}")
        sys.exit(1)

def generate_mock_coordinates(df, seed=42):
    """
    Generate mock coordinates for properties.
    
    In production, replace this with actual property coordinates.
    Scotland roughly spans: 54.5°N to 60.5°N, -7.5°W to -0.5°W
    """
    np.random.seed(seed)
    df = df.copy()
    df['latitude'] = np.random.uniform(54.5, 60.5, len(df))
    df['longitude'] = np.random.uniform(-7.5, -0.5, len(df))
    return df

def convert_to_json_format(df):
    """Convert DataFrame to JSON-compatible format"""
    properties = []
    
    for _, row in df.iterrows():
        property_data = {
            'label': str(row['Label']),
            'area': float(row['Area']),
            'landValue': float(row['Land_Value_Combined']),
            'buildingValue': float(row['Building_Value_Combined']),
            'consideration': float(row['Consideration']),
            'councilTax': float(row['Council_Tax_Amount']),
            'lbtt': float(row['LBTT_Amount']),
            'businessRates': float(row['Business_Rates_Amount']),
            'latitude': float(row['latitude']),
            'longitude': float(row['longitude'])
        }
        properties.append(property_data)
    
    return properties

def calculate_statistics(df):
    """Calculate dataset statistics"""
    stats = {
        'totalProperties': len(df),
        'avgLandValue': float(df['Land_Value_Combined'].mean()),
        'avgBuildingValue': float(df['Building_Value_Combined'].mean()),
        'avgCouncilTax': float(df['Council_Tax_Amount'].mean()),
        'avgLBTT': float(df['LBTT_Amount'].mean()),
        'avgBusinessRates': float(df['Business_Rates_Amount'].mean()),
        'minLandValue': float(df['Land_Value_Combined'].min()),
        'maxLandValue': float(df['Land_Value_Combined'].max()),
        'minCouncilTax': float(df['Council_Tax_Amount'].min()),
        'maxCouncilTax': float(df['Council_Tax_Amount'].max())
    }
    return stats

def write_javascript_file(data, output_path):
    """Write data to JavaScript file"""
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('// Property data for LVT Calculator\n')
            f.write('// Generated automatically - do not edit manually\n')
            f.write('// Source: LVT_with_Tax_Calculations.xlsx\n\n')
            f.write('const propertyData = ')
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write(';\n')
        print(f"✓ Successfully wrote data to {output_path}")
        return True
    except Exception as e:
        print(f"✗ Error writing JavaScript file: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("LVT Calculator - Data Generation Script")
    print("=" * 60)
    
    # Configuration
    input_file = 'LVT_with_Tax_Calculations.xlsx'
    output_file = 'data.js'
    
    # Option to use sample or full dataset
    use_sample = True  # Set to False to use full dataset
    sample_size = 1000
    
    print(f"\nConfiguration:")
    print(f"  Input file: {input_file}")
    print(f"  Output file: {output_file}")
    print(f"  Use sample: {use_sample}")
    if use_sample:
        print(f"  Sample size: {sample_size}")
    
    # Load data
    print(f"\nStep 1: Loading data...")
    df_original = load_excel_data(input_file)
    
    # Sample if needed
    if use_sample and len(df_original) > sample_size:
        df = df_original.sample(n=sample_size, random_state=42)
        print(f"✓ Using sample of {len(df)} properties from {len(df_original)} total")
    else:
        df = df_original
        print(f"✓ Using all {len(df)} properties")
    
    # Generate coordinates
    print(f"\nStep 2: Generating coordinates...")
    print("⚠ Note: Using mock coordinates for demonstration")
    print("  For production, replace with actual property coordinates")
    df = generate_mock_coordinates(df)
    
    # Convert to JSON format
    print(f"\nStep 3: Converting to JSON format...")
    properties = convert_to_json_format(df)
    print(f"✓ Converted {len(properties)} properties")
    
    # Calculate statistics (using full dataset)
    print(f"\nStep 4: Calculating statistics...")
    stats = calculate_statistics(df_original)
    print(f"✓ Statistics calculated from {stats['totalProperties']} total properties")
    print(f"  Average land value: £{stats['avgLandValue']:,.2f}")
    print(f"  Average council tax: £{stats['avgCouncilTax']:,.2f}")
    
    # Create final data structure
    data = {
        'properties': properties,
        'statistics': stats
    }
    
    # Write output file
    print(f"\nStep 5: Writing output file...")
    success = write_javascript_file(data, output_file)
    
    # Summary
    print("\n" + "=" * 60)
    if success:
        print("✓ Data generation completed successfully!")
        print(f"\nGenerated files:")
        print(f"  - {output_file} ({len(properties)} properties)")
        print(f"\nNext steps:")
        print(f"  1. Review the generated {output_file} file")
        print(f"  2. Open index.html in a web browser")
        print(f"  3. For production: add real coordinates and use full dataset")
    else:
        print("✗ Data generation failed")
        sys.exit(1)
    print("=" * 60)

if __name__ == '__main__':
    main()
