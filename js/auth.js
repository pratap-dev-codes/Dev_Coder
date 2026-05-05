
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Signup function
async function signUp(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create Firestore record if doesn't exist
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name,
        email,
        balance: 0,
        completedTasks: [],
        createdAt: new Date()
      });
    }

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Signup error:", error.message);
    alert(error.message);
  }
}

// Login function
async function logIn(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login error:", error.message);
    alert(error.message);
  }
}

// Protect dashboard.html from unauthenticated access
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  if (!user && path.includes("dashboard")) {
    window.location.href = "auth.html";
  }
});

// Hook buttons
document.getElementById("signup-btn")?.addEventListener("click", () => {
  const email = document.getElementById("signup-email").value;
  const pass = document.getElementById("signup-password").value;
  const name = document.getElementById("signup-name").value;
  signUp(email, pass, name);
});

document.getElementById("login-btn")?.addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;
  logIn(email, pass);
});
