
import { auth, uploadProfilePicture } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  document.getElementById("upload-dp").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadProfilePicture(user.uid, file);
      document.getElementById("dp-preview").src = url;
      alert("Profile picture uploaded successfully!");
    } catch (err) {
      console.error("DP upload failed:", err);
      alert("Failed to upload profile picture.");
    }
  });
});
