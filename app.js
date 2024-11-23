// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClSfhUgX2MfL4wd4x0aCT7G3tAyuzJlcQ",
    authDomain: "fa-ain-chatbot.firebaseapp.com",
    projectId: "fa-ain-chatbot",
    storageBucket: "fa-ain-chatbot.firebasestorage.app",
    messagingSenderId: "97241230590",
    appId: "1:97241230590:web:82df89b16d0248cfcd89af",
    measurementId: "G-ZJM5P3CYY1",
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test Firestore Connectivity
async function testFirestore() {
    try {
        console.log("Testing Firestore...");
        const docRef = await addDoc(collection(db, "testCollection"), {
            testField: "Hello, Firestore!",
            timestamp: new Date(),
        });
        console.log("Test document added with ID:", docRef.id);
        alert("Firestore is working! Document added.");
    } catch (error) {
        console.error("Error testing Firestore:", error);
        alert("Firestore test failed. Check the console for details.");
    }
}

// Trigger Firestore test on page load
window.addEventListener("load", () => {
    testFirestore();
});
