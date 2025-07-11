# Food Analyzer PWA

## Overview

This is a Progressive Web Application (PWA) that allows users to capture food images and analyze them to get calorie information and exercise recommendations. The application is designed as a client-side-only solution with a focus on mobile usability and offline capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript
- **Progressive Web App**: Implements PWA standards with service worker and web app manifest
- **Mobile-First Design**: Responsive design optimized for mobile devices with portrait orientation
- **Offline-First Approach**: Service worker caches resources for offline functionality

### Key Design Decisions
- **Node.js Backend**: Express server handles OpenAI API integration securely
- **Real AI Analysis**: Uses OpenAI GPT-4 Vision API for actual food recognition
- **Camera Integration**: Leverages HTML5 camera API for photo capture
- **Icon System**: Uses Feather Icons for consistent UI elements
- **Secure API Handling**: API keys managed server-side for security

## Key Components

### Core Files
1. **index.html**: Main application structure and UI components
2. **script.js**: Application logic, image handling, and API communication
3. **styles.css**: Responsive styling with mobile-first approach
4. **server.js**: Node.js backend for OpenAI API integration
5. **service-worker.js**: PWA offline functionality and caching
6. **manifest.json**: PWA configuration and metadata

### UI Components
- **Upload Section**: File input with camera/gallery options
- **Preview Section**: Image preview with remove/analyze actions
- **Loading Section**: Analysis progress indicator
- **Results Section**: Food name, calories, and exercise recommendations
- **Health Impact Section**: Detailed analysis of food's effects on 10 common diseases
- **Toggle Interface**: Expandable health analysis section
- **Install Banner**: PWA installation prompt

### Food Analysis System
- **OpenAI GPT-4 Vision API**: Real-time food recognition using AI vision analysis
- **Intelligent Calorie Estimation**: Accurate calorie calculation based on food recognition
- **Confidence Scoring**: Analysis includes confidence levels for transparency
- **Exercise Recommendations**: Personalized activity suggestions to burn consumed calories
- **Health Impact Analysis**: Detailed analysis of food ingredients' effects on 10 common modern diseases
- **Medical Advisory**: Benefits, risks, and recommendations for each health condition
- **Server-Side Processing**: Secure API key handling through Node.js backend

## Data Flow

1. **Image Capture**: User takes photo or selects from gallery
2. **Image Preview**: Display captured image with analysis option
3. **AI Analysis**: Image sent to OpenAI GPT-4 Vision API for comprehensive food analysis
4. **Health Analysis**: AI analyzes ingredients' impact on 10 common modern diseases
5. **Results Processing**: Server processes AI response and formats data
6. **Results Display**: Show food name, calories, confidence, and exercise recommendations
7. **Health Impact Toggle**: Optional detailed health analysis for each disease condition
8. **Reset Flow**: Allow users to analyze another image

## External Dependencies

### Third-Party Services
- **Feather Icons**: Icon library loaded from CDN
- **OpenAI GPT-4 Vision API**: Real-time food recognition and analysis
- **Express.js**: Web framework for Node.js backend

### Browser APIs
- **Camera API**: For photo capture functionality
- **File System Access**: For image gallery selection
- **Service Worker API**: For offline functionality
- **Cache API**: For resource caching

## Deployment Strategy

### PWA Requirements
- **HTTPS Required**: PWA features require secure context
- **Service Worker**: Handles offline functionality and caching
- **Web App Manifest**: Enables app installation and native-like experience

### Caching Strategy
- **Cache-First**: Essential resources cached for offline use
- **Network Fallback**: Graceful degradation when offline
- **Version Control**: Cache invalidation through version naming

### Installation Features
- **Add to Home Screen**: Native app-like installation
- **Offline Functionality**: Core features work without internet
- **Responsive Design**: Works across different screen sizes

### Browser Support
- **Modern Browsers**: Requires support for PWA features
- **Mobile Optimized**: Primary focus on mobile devices
- **Progressive Enhancement**: Graceful fallback for unsupported features

## Technical Considerations

### Performance
- **Minimal Dependencies**: Only essential external resources
- **Efficient Caching**: Strategic resource caching for fast load times
- **Optimized Images**: SVG icons for scalability

### Security
- **Client-Side Only**: No server-side vulnerabilities
- **No Data Transmission**: All processing happens locally
- **Secure Context**: HTTPS requirement for PWA features

### Scalability
- **Extensible Database**: Easy to add more food entries
- **Modular Code**: Organized for future feature additions
- **API Ready**: Structure allows for future backend integration