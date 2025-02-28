async function translateText() {
    const text = document.getElementById("transcript").value;
    const targetLang = document.getElementById("output-lang").value.toLowerCase(); // Convert to lowercase


    if (!text) {
        alert("Please enter text to translate.");
        return;
    }

    console.log("📢 Sending translation request:", { text, targetLang }); // Debugging log

    try {
        const response = await fetch("https://healthcare-translation-app-backe-production.up.railway.app/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, targetLang })
        });

        const data = await response.json();
        console.log("🔹 Translation API Response:", data); // Debugging log

        if (data.translatedText) {
            document.getElementById("translated-text").value = data.translatedText;
        } else {
            alert("Translation failed. Server response: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("❌ Translation error:", error);
        alert("Translation failed. Check the console.");
    }
}

function speakText() {
    const text = document.getElementById("translated-text").value;
    if (!text) {
        alert("No translated text available to play.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = document.getElementById("output-lang").value;
    window.speechSynthesis.speak(utterance);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("translator-section").style.display = "none";
});

function toggleAuthForms() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
    registerForm.style.display = registerForm.style.display === "none" ? "block" : "none";
}

async function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("https://healthcare-translation-app-backe-production.up.railway.app//login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        alert(data.message);
        if (data.message === "Login successful!") {
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("translator-section").style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Login failed. Please check the console.");
    }
}

async function registerUser() {
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    if (!name || !email || !password) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch("https://healthcare-translation-app-backe-production.up.railway.app//register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error:", error);
        alert("Registration failed. Please check the console.");
    }
}

function logoutUser() {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("translator-section").style.display = "none";
}

function startSpeechToText() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = document.getElementById("input-lang").value; // Use selected language
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = function () {
        console.log("🎤 Speech recognition started...");
    };

    recognition.onresult = function (event) {
        const recognizedText = event.results[0][0].transcript;
        console.log("✅ Recognized speech:", recognizedText);
        document.getElementById("transcript").value = recognizedText; // Display captured text
    };

    recognition.onerror = function (event) {
        console.error("❌ Speech recognition error:", event.error);
        alert("Speech recognition error: " + event.error);
    };

    recognition.onend = function () {
        console.log("🎤 Speech recognition ended.");
    };

    recognition.start();
}