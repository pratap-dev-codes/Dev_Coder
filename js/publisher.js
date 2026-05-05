
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, updateDoc, getDoc, increment } from "firebase/firestore";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  document.getElementById("publish-task").addEventListener("click", async () => {
    const title = document.getElementById("task-title").value;
    const reward = 5;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().balance >= reward) {
      await addDoc(collection(db, "tasks"), {
        title,
        reward,
        publisher: user.uid,
        status: "pending",
        assignedTo: [],
        completedBy: [],
        createdAt: new Date()
      });

      await updateDoc(userRef, {
        balance: increment(-reward)
      });

      alert("Task published. ₹5 deducted.");
    } else {
      alert("Not enough balance to publish task.");
    }
  });
});
