
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc, increment, arrayUnion } from "firebase/firestore";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  const tasksRef = collection(db, "tasks");
  const q = query(tasksRef, where("status", "==", "pending"));
  const querySnapshot = await getDocs(q);

  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.title}</strong>
      <button data-id="${docSnap.id}">Complete</button>
    `;
    taskList.appendChild(li);
  });

  taskList.addEventListener("click", async (e) => {
    if (e.target.tagName === "BUTTON") {
      const taskId = e.target.dataset.id;

      await updateDoc(doc(db, "tasks", taskId), {
        completedBy: arrayUnion(user.uid)
      });

      await updateDoc(doc(db, "users", user.uid), {
        balance: increment(5),
        completedTasks: arrayUnion(taskId)
      });

      alert("Task completed. ₹5 added.");
      e.target.disabled = true;
    }
  });
});
