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

function analyzeFood() {
    if (!selectedImage) {
        showError('Please select an image first.');
        return;
    }

    showSection('loadingSection');
    hideSection('previewSection');

    // Simulate API call delay
    setTimeout(() => {
        const analysisResult = performDummyAnalysis();
        displayResults(analysisResult);
        hideSection('loadingSection');
        showSection('resultsSection');
    }, 2000 + Math.random() * 1000); // 2-3 seconds delay
}

function performDummyAnalysis() {
    // Randomly select a food item from the database
    const randomIndex = Math.floor(Math.random() * foodDatabase.length);
    const selectedFood = foodDatabase[randomIndex];
    
    // Add some randomness to calories (±50)
    const calorieVariation = Math.floor(Math.random() * 100) - 50;
    const adjustedCalories = Math.max(50, selectedFood.calories + calorieVariation);
    
    return {
        name: selectedFood.name,
        calories: adjustedCalories,
        icon: selectedFood.icon,
        activities: selectedFood.activities
    };
}

function displayResults(result) {
    // Update food name and calories
    foodName.textContent = result.name;
    caloriesInfo.textContent = `Approx. ${result.calories} kcal`;
    
    // Update food icon
    const foodIcon = document.querySelector('.food-icon i');
    foodIcon.setAttribute('data-feather', result.icon);
    
    // Clear and populate activities list
    activitiesList.innerHTML = '';
    result.activities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        activitiesList.appendChild(activityElement);
    });
    
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

function resetApp() {
    selectedImage = null;
    previewImage.src = '';
    fileInput.value = '';
    showSection('uploadSection');
    hideSection('previewSection');
    hideSection('resultsSection');
    hideSection('loadingSection');
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
