// Global variables
let selectedImage = null;
let deferredPrompt = null;

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const galleryBtn = document.getElementById('galleryBtn');
const cameraBtn = document.getElementById('cameraBtn');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const analyzeAgainBtn = document.getElementById('analyzeAgainBtn');
const foodName = document.getElementById('foodName');
const caloriesInfo = document.getElementById('caloriesInfo');
const activitiesList = document.getElementById('activitiesList');
const healthToggle = document.getElementById('healthToggle');
const healthImpactsSection = document.getElementById('healthImpactsSection');
const ingredientsInfo = document.getElementById('ingredientsInfo');
const healthImpactsList = document.getElementById('healthImpactsList');
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
const dismissBtn = document.getElementById('dismissBtn');

// Food database for realistic dummy analysis
const foodDatabase = [
    {
        name: "Bibimbap",
        calories: 600,
        icon: "coffee",
        activities: [
            { name: "Walking", duration: "45 minutes", icon: "walk" },
            { name: "Cycling", duration: "25 minutes", icon: "bike" },
            { name: "Running", duration: "20 minutes", icon: "zap" }
        ]
    },
    {
        name: "Caesar Salad",
        calories: 350,
        icon: "leaf",
        activities: [
            { name: "Walking", duration: "25 minutes", icon: "walk" },
            { name: "Swimming", duration: "15 minutes", icon: "droplet" },
            { name: "Yoga", duration: "35 minutes", icon: "heart" }
        ]
    },
    {
        name: "Cheeseburger",
        calories: 750,
        icon: "coffee",
        activities: [
            { name: "Running", duration: "30 minutes", icon: "zap" },
            { name: "Cycling", duration: "35 minutes", icon: "bike" },
            { name: "Dancing", duration: "40 minutes", icon: "music" }
        ]
    },
    {
        name: "Sushi Roll",
        calories: 300,
        icon: "coffee",
        activities: [
            { name: "Walking", duration: "20 minutes", icon: "walk" },
            { name: "Stairs Climbing", duration: "12 minutes", icon: "trending-up" },
            { name: "Stretching", duration: "30 minutes", icon: "heart" }
        ]
    },
    {
        name: "Pizza Slice",
        calories: 450,
        icon: "coffee",
        activities: [
            { name: "Jogging", duration: "18 minutes", icon: "zap" },
            { name: "Basketball", duration: "20 minutes", icon: "circle" },
            { name: "Hiking", duration: "25 minutes", icon: "mountain" }
        ]
    },
    {
        name: "Pasta Carbonara",
        calories: 650,
        icon: "coffee",
        activities: [
            { name: "Running", duration: "25 minutes", icon: "zap" },
            { name: "Cycling", duration: "30 minutes", icon: "bike" },
            { name: "Weight Training", duration: "35 minutes", icon: "activity" }
        ]
    },
    {
        name: "Chicken Wrap",
        calories: 420,
        icon: "coffee",
        activities: [
            { name: "Walking", duration: "30 minutes", icon: "walk" },
            { name: "Tennis", duration: "18 minutes", icon: "circle" },
            { name: "Pilates", duration: "25 minutes", icon: "heart" }
        ]
    },
    {
        name: "Smoothie Bowl",
        calories: 280,
        icon: "coffee",
        activities: [
            { name: "Walking", duration: "18 minutes", icon: "walk" },
            { name: "Light Yoga", duration: "25 minutes", icon: "heart" },
            { name: "Cleaning", duration: "20 minutes", icon: "home" }
        ]
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkInstallPrompt();
});

function initializeEventListeners() {
    // Upload area click
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Gallery button
    galleryBtn.addEventListener('click', () => {
        fileInput.removeAttribute('capture');
        fileInput.click();
    });

    // Camera button
    cameraBtn.addEventListener('click', () => {
        fileInput.setAttribute('capture', 'environment');
        fileInput.click();
    });

    // Remove image button
    removeImageBtn.addEventListener('click', removeImage);

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeFood);

    // Analyze again button
    analyzeAgainBtn.addEventListener('click', resetApp);

    // Health toggle button
    healthToggle.addEventListener('click', toggleHealthSection);
    
    // Install banner buttons
    installBtn.addEventListener('click', installApp);
    dismissBtn.addEventListener('click', dismissInstallBanner);

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragOver(e) {
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select an image file.');
        return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB.');
        return;
    }

    selectedImage = file;
    displayImagePreview(file);
}

function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        showSection('previewSection');
        hideSection('resultsSection');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    selectedImage = null;
    previewImage.src = '';
    fileInput.value = '';
    showSection('uploadSection');
    hideSection('previewSection');
    hideSection('resultsSection');
}

async function analyzeFood() {
    if (!selectedImage) {
        showError('Please select an image first.');
        return;
    }

    showSection('loadingSection');
    hideSection('previewSection');

    try {
        // Convert image to base64
        const base64Image = await convertImageToBase64(selectedImage);
        
        // Call OpenAI Vision API
        const analysisResult = await analyzeWithOpenAI(base64Image);
        
        displayResults(analysisResult);
        hideSection('loadingSection');
        showSection('resultsSection');
    } catch (error) {
        console.error('Analysis failed:', error);
        hideSection('loadingSection');
        showError('Failed to analyze the image. Please try again.');
        showSection('previewSection');
    }
}

// Convert image file to base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Analyze food using OpenAI GPT-4 Vision API via server endpoint
async function analyzeWithOpenAI(base64Image) {
    try {
        const response = await fetch('/api/analyze-food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const analysisResult = await response.json();
        
        return {
            name: analysisResult.name || 'Unknown Food',
            calories: analysisResult.calories || 300,
            icon: 'coffee', // Default icon
            activities: analysisResult.activities || getDefaultActivities(analysisResult.calories || 300),
            confidence: analysisResult.confidence || 0.7,
            description: analysisResult.description || ''
        };
        
    } catch (error) {
        console.error('Food analysis error:', error);
        throw error;
    }
}



// Fallback activities based on calories
function getDefaultActivities(calories) {
    const walkingMinutes = Math.round(calories / 4); // ~4 calories per minute walking
    const runningMinutes = Math.round(calories / 10); // ~10 calories per minute running
    const cyclingMinutes = Math.round(calories / 8); // ~8 calories per minute cycling
    
    return [
        { name: "Walking", duration: `${walkingMinutes} minutes`, icon: "walk" },
        { name: "Running", duration: `${runningMinutes} minutes`, icon: "zap" },
        { name: "Cycling", duration: `${cyclingMinutes} minutes`, icon: "bike" }
    ];
}

function displayResults(result) {
    // Update food name and calories
    foodName.textContent = result.name;
    let caloriesText = `Approx. ${result.calories} kcal`;
    if (result.confidence) {
        const confidencePercent = Math.round(result.confidence * 100);
        caloriesText += ` (${confidencePercent}% confidence)`;
    }
    caloriesInfo.textContent = caloriesText;
    
    // Update food icon
    const foodIcon = document.querySelector('.food-icon i');
    if (foodIcon) {
        foodIcon.setAttribute('data-feather', result.icon);
    }
    
    // Clear and populate activities list
    activitiesList.innerHTML = '';
    
    // Add description if available
    if (result.description) {
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'food-description';
        descriptionElement.textContent = result.description;
        descriptionElement.style.cssText = 'margin-bottom: 1rem; color: #666; font-size: 0.9rem; line-height: 1.4;';
        activitiesList.appendChild(descriptionElement);
    }
    
    result.activities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        activitiesList.appendChild(activityElement);
    });
    
    // Display health impacts if available
    if (result.health_impacts && result.health_impacts.length > 0) {
        displayHealthImpacts(result);
        healthToggle.style.display = 'block';
    } else {
        healthToggle.style.display = 'none';
        healthImpactsSection.style.display = 'none';
    }
    
    // Re-initialize Feather icons
    feather.replace();
}

function createActivityElement(activity) {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    activityItem.innerHTML = `
        <i data-feather="${activity.icon}" class="activity-icon"></i>
        <div class="activity-details">
            <p class="activity-name">${activity.name}</p>
            <p class="activity-duration">${activity.duration}</p>
        </div>
    `;
    
    return activityItem;
}

function displayHealthImpacts(result) {
    // Display ingredients
    if (result.ingredients && result.ingredients.length > 0) {
        ingredientsInfo.innerHTML = `
            <div class="ingredients-title">Main Ingredients:</div>
            <div class="ingredients-list">${result.ingredients.join(', ')}</div>
        `;
    } else {
        ingredientsInfo.innerHTML = '';
    }
    
    // Clear and populate health impacts list
    healthImpactsList.innerHTML = '';
    
    if (result.health_impacts && result.health_impacts.length > 0) {
        result.health_impacts.forEach(impact => {
            const impactElement = createHealthImpactElement(impact);
            healthImpactsList.appendChild(impactElement);
        });
    }
}

function createHealthImpactElement(impact) {
    const impactItem = document.createElement('div');
    impactItem.className = 'health-impact-item';
    
    let detailsHTML = '';
    
    if (impact.benefit && impact.benefit !== 'null') {
        detailsHTML += `
            <div class="health-detail">
                <span class="health-label health-benefit">Benefits:</span>
                <span class="health-content benefit">${impact.benefit}</span>
            </div>
        `;
    }
    
    if (impact.risk && impact.risk !== 'null') {
        detailsHTML += `
            <div class="health-detail">
                <span class="health-label health-risk">Risks:</span>
                <span class="health-content risk">${impact.risk}</span>
            </div>
        `;
    }
    
    if (impact.recommendation && impact.recommendation !== 'null') {
        detailsHTML += `
            <div class="health-detail">
                <span class="health-label health-recommendation">Advice:</span>
                <span class="health-content recommendation">${impact.recommendation}</span>
            </div>
        `;
    }
    
    impactItem.innerHTML = `
        <div class="health-condition">${impact.condition}</div>
        ${detailsHTML}
    `;
    
    return impactItem;
}

function toggleHealthSection() {
    const isVisible = healthImpactsSection.style.display === 'block';
    
    if (isVisible) {
        healthImpactsSection.style.display = 'none';
        healthToggle.innerHTML = '<i data-feather="chevron-down"></i> View Health Impact Analysis';
    } else {
        healthImpactsSection.style.display = 'block';
        healthToggle.innerHTML = '<i data-feather="chevron-up"></i> Hide Health Impact Analysis';
    }
    
    // Re-initialize Feather icons
    feather.replace();
}

function resetApp() {
    selectedImage = null;
    previewImage.src = '';
    fileInput.value = '';
    showSection('uploadSection');
    hideSection('previewSection');
    hideSection('resultsSection');
    hideSection('loadingSection');
    hideSection('healthImpactsSection');
    healthToggle.style.display = 'none';
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
}

function showError(message) {
    // Simple error display - could be enhanced with a proper modal
    alert(message);
}

// PWA Installation
function checkInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
        hideInstallBanner();
        deferredPrompt = null;
    });
}

function showInstallBanner() {
    installBanner.style.display = 'flex';
}

function hideInstallBanner() {
    installBanner.style.display = 'none';
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            hideInstallBanner();
        });
    }
}

function dismissInstallBanner() {
    hideInstallBanner();
    // Don't show again for this session
    deferredPrompt = null;
}

// Utility functions
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
}

// Initialize upload section visibility
document.addEventListener('DOMContentLoaded', function() {
    showSection('uploadSection');
});
