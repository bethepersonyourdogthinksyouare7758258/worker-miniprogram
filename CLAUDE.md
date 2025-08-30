# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WeChat Mini Program (微信小程序) called "打工者生存工具包" (Worker's Survival Toolkit) - a comprehensive toolkit for Chinese workers to protect their labor rights, calculate compensation, and understand legal regulations.

## Development Commands

### WeChat Developer Tools
- **Primary Development**: Use WeChat Developer Tools IDE to develop, compile, and debug
- **Compilation**: Click "Compile" button in WeChat Developer Tools
- **Preview**: Use simulator in WeChat Developer Tools
- **Project Import**: Import project directory into WeChat Developer Tools with AppID: `wxa5755d390216ec9a`

### Backend API (FastAPI)
```bash
# Start the legal data API server
cd backend
./start.sh
# or
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python main.py

# API available at: http://localhost:8000
# API docs: http://localhost:8000/docs
```

### Data Management
```bash
# Regenerate legal knowledge data from CSV files
cd data/core-laws
node regenerate-data.js
```

## Architecture Overview

### Core Structure
- **Mini Program Type**: WeChat Mini Program using official WeChat framework
- **Main Entry**: `pages/home/home` - displays 8 functional modules
- **Subpackages**: Organized into 8 functional modules using WeChat's subpackage system
- **Backend**: FastAPI server providing legal data API services
- **Data Layer**: CSV files + JavaScript data modules for legal content

### 8 Functional Modules (Subpackages)

1. **Work Comparator** (`pages/work-comparator`) - Multi-dimensional job offer comparison
2. **Calculator Suite** (`pages/calculator`) - 13 labor law calculators (overtime, compensation, tax, etc.)
3. **Text Library** (`pages/text-library`) - Professional communication templates
4. **Document Generator** (`pages/docgen`) - Auto-generates legal documents (arbitration requests, complaint letters)
5. **City Comparison** (`pages/city-compare`) - Living cost and salary comparison between cities
6. **Core Laws** (`pages/core-laws-pack`) - Legal regulations database (32 laws, 18 scenarios)
7. **Background Check Guide** (`pages/background-check-guide`) - Company background investigation guide
8. **Contact Us** (`pages/contact`) - Developer contact information

### Key Components

#### Legal Data System (`data/core-laws/`)
- **legal-knowledge.js**: 32 labor law regulations with IDs LAW001-LAW032
- **rights-scenarios.js**: 18 rights protection scenarios with IDs SCENE001-SCENE018
- **regenerate-data.js**: Auto-generates JS data files from authoritative CSV sources
- **utils/**: Legal tag extraction and search utilities
- **CSV Sources**: `assets/core-laws/法条知识-最终标准版.csv` and `维权场景-最终标准版.csv`

#### Calculator System (`pages/calculator/`)
- **13 Professional Calculators**: Overtime pay, severance, tax, social insurance, injury compensation, etc.
- **calculator-common.wxss**: Unified styling system
- **utils/calculator.js**: Shared calculation utilities
- **Advanced Features**: Date picker, automatic holiday detection, data persistence

#### Backend API (`backend/`)
- **FastAPI Server**: RESTful API for legal data
- **Endpoints**: `/api/laws`, `/api/laws/search`, `/api/stages`, `/api/tags`
- **Data Processing**: Pandas-based CSV processing and search functionality

## Development Guidelines

### File Structure Conventions
- **Page Components**: Each page requires `.js`, `.wxml`, `.json`, `.wxss` files
- **Naming**: Use camelCase for JavaScript, lowercase with hyphens for directories
- **Subpackages**: Organized by functionality in `app.json` subpackages configuration
- **Shared Styles**: Use `@import` for common styles like `calculator-common.wxss`

### Code Standards
- **ES6+ Syntax**: Use let/const, arrow functions, async/await
- **WeChat APIs**: Use `wx.navigateTo`, `wx.setStorageSync`, `wx.showToast`, etc.
- **Data Binding**: Use `{{}}` syntax in WXML templates
- **Event Handling**: Use `bindtap`, `bindinput` with `data-*` attributes
- **Error Handling**: Implement try-catch for API calls, show user-friendly messages

### Legal Data Management
- **Authoritative Source**: CSV files in `assets/core-laws/` are the single source of truth
- **Data Generation**: Always run `node regenerate-data.js` after CSV updates
- **ID System**: Use structured IDs (LAW001-LAW032, SCENE001-SCENE018)
- **Legal Tags**: Automatically extracted from legal basis text
- **Search Keywords**: Auto-generated for search functionality

### Calculator Development
- **Inheritance**: All calculators inherit from `calculator-common.wxss`
- **Legal Validation**: Include detailed legal basis and calculation formulas
- **User Experience**: Implement data persistence, copy-to-clipboard, date pickers
- **Consistency**: Follow established patterns for input validation and result display

### API Integration
- **WeChat Requests**: Use `wx.request()` for API calls
- **Error Handling**: Handle network failures gracefully
- **Data Caching**: Cache API responses when appropriate
- **CORS**: Backend configured for cross-origin requests

## Important Notes

### WeChat Mini Program Specifics
- **Development Environment**: Requires WeChat Developer Tools (official IDE)
- **Package Limits**: Main package ≤ 2MB, total ≤ 16MB (using subpackages)
- **Platform Differences**: Test on both iOS and Android
- **App Review**: Must comply with WeChat Mini Program guidelines

### Legal Content Accuracy
- **Professional Validation**: All legal calculations based on current Chinese labor laws
- **Regular Updates**: Legal content requires periodic updates as laws change
- **Data Integrity**: LAW028 previously showed "content missing" - now resolved
- **Source Verification**: All legal basis includes specific law article references

### Performance Considerations
- **Lazy Loading**: Subpackages load on-demand
- **Data Optimization**: Use pagination for large datasets
- **Image Optimization**: Use WebP format where possible
- **Memory Management**: Clean up data in page lifecycle hooks

## Testing and Validation

### Manual Testing
- **WeChat Simulator**: Primary testing environment in WeChat Developer Tools
- **Real Device Testing**: Test on actual WeChat app on iOS/Android
- **API Testing**: Use `/api/docs` Swagger interface for backend testing

### Data Validation
- **CSV Integrity**: Verify CSV files maintain proper encoding (UTF-8)
- **ID Uniqueness**: Ensure no duplicate LAW/SCENE IDs
- **Legal Accuracy**: Cross-reference with official legal documents

### Calculator Accuracy
- **Formula Verification**: Validate against official legal calculation methods
- **Edge Cases**: Test boundary conditions (minimum/maximum values)
- **Date Handling**: Verify holiday detection and date calculations

## Deployment Considerations

### WeChat Mini Program
- **Submission Process**: Upload through WeChat Developer Tools
- **Version Management**: Maintain version consistency in `project.config.json`
- **App Store Review**: Allow time for WeChat's approval process

### Backend API
- **Production Environment**: Configure production settings for FastAPI
- **Data Security**: Secure API endpoints and data transmission
- **Monitoring**: Implement logging and error tracking
- **Scalability**: Consider load balancing for high traffic

## Common Development Tasks

### Adding New Legal Content
1. Update CSV files in `assets/core-laws/`
2. Run `cd data/core-laws && node regenerate-data.js`
3. Test data integrity and search functionality
4. Update relevant pages to display new content

### Creating New Calculator
1. Create directory in `pages/calculator/[calculator-name]/`
2. Implement required files: `.js`, `.wxml`, `.wxss`, `.json`
3. Add route to `app.json` subpackages
4. Import common styles: `@import "../calculator-common.wxss"`
5. Add entry point in calculator main page

### Backend API Extension
1. Add new endpoints in `backend/main.py`
2. Update data models and validation
3. Test with Swagger documentation
4. Update frontend integration code

This project serves Chinese workers by providing essential legal tools and information, requiring careful attention to legal accuracy, user experience, and WeChat platform compliance.