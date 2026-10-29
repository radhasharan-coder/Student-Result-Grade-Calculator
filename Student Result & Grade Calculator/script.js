const form = document.getElementById("resultForm");
const resultCard = document.getElementById("resultCard");
const subjects = [
  ["maths", "Mathematics"], ["physics", "Physics"], ["chemistry", "Chemistry"],
  ["english", "English"], ["computer", "Computer Science"]
];

function clearErrors() {
  document.querySelectorAll(".error").forEach(error => error.textContent = "");
  document.querySelectorAll("input.invalid").forEach(input => input.classList.remove("invalid"));
}

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  if (percentage >= 40) return "E";
  return "F";
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  clearErrors();
  let valid = true;
  let total = 0;
  const marks = [];

  const nameInput = document.getElementById("name");
  if (nameInput.value.trim() === "") {
    document.getElementById("nameError").textContent = "Candidate name is required.";
    nameInput.classList.add("invalid");
    valid = false;
  }

  subjects.forEach(subject => {
    const input = document.getElementById(subject[0]);
    const value = input.value.trim() === "" ? NaN : Number(input.value);

    if (Number.isNaN(value) || value < 0 || value > 100) {
      document.getElementById(subject[0] + "Error").textContent = subject[1] + ": enter 0–100.";
      input.classList.add("invalid");
      valid = false;
    } else {
      marks.push(value);
      total += value;
    }
  });

  if (!valid) {
    resultCard.hidden = true;
    return;
  }

  const percentage = total / 5;
  const average = total / 5;
  const grade = getGrade(percentage);
  const passed = marks.every(mark => mark >= 35);

  document.getElementById("studentName").textContent = nameInput.value.trim();
  document.getElementById("totalMarks").textContent = total + " / 500";
  document.getElementById("percentage").textContent = percentage.toFixed(2) + "%";
  document.getElementById("average").textContent = average.toFixed(2);
  document.getElementById("grade").textContent = grade;

  const status = document.getElementById("statusBadge");
  status.textContent = passed ? "PASSED" : "NOT PASSED";
  status.className = passed ? "pass" : "fail";
  document.getElementById("progressBar").style.width = percentage + "%";
  document.getElementById("progressText").textContent = percentage.toFixed(2) + "%";

  let message = "Needs improvement. Review all weak subjects carefully.";
  if (percentage >= 90) message = "Exceptional performance across the examination.";
  else if (percentage >= 75) message = "A strong result with scope for further improvement.";
  else if (percentage >= 50) message = "Satisfactory result; consistent revision is advised.";
  document.getElementById("performance").textContent = message;

  const tableBody = document.getElementById("subjectTable");
  tableBody.textContent = "";
  subjects.forEach((subject, index) => {
    const row = document.createElement("tr");
    const passSubject = marks[index] >= 35;
    row.innerHTML = "<td>" + subject[1] + "</td><td>" + marks[index] + " / 100</td>";
    const resultCell = document.createElement("td");
    resultCell.textContent = passSubject ? "Pass" : "Fail";
    resultCell.className = passSubject ? "pass" : "fail";
    row.appendChild(resultCell);
    tableBody.appendChild(row);
  });

  resultCard.hidden = false;
  resultCard.scrollIntoView({behavior: "smooth", block: "start"});
});

form.addEventListener("reset", function() {
  setTimeout(function() {
    clearErrors();
    resultCard.hidden = true;
    document.getElementById("progressBar").style.width = "0%";
  }, 0);
});

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", function() {
    this.classList.remove("invalid");
    const error = document.getElementById(this.id + "Error");
    if (error) error.textContent = "";
  });
});

const collegeName = document.getElementById("collegeName");
const savedCollegeName = localStorage.getItem("collegeName");
if (savedCollegeName) collegeName.value = savedCollegeName;
collegeName.addEventListener("input", function() {
  localStorage.setItem("collegeName", this.value);
});

const themeButton = document.getElementById("themeToggle");
if (localStorage.getItem("resultTheme") === "dark") {
  document.body.classList.add("dark");
  themeButton.textContent = "Light page";
}

themeButton.addEventListener("click", function() {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  this.textContent = dark ? "Light page" : "Dark page";
  localStorage.setItem("resultTheme", dark ? "dark" : "light");
});

document.getElementById("printBtn").addEventListener("click", function() {
  window.print();
});
