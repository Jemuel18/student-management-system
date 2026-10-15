// API Endpoint
const API_URL = "https://jsonplaceholder.typicode.com/users";

// DOM Elements
const tableBody = document.getElementById("studentTableBody");
const studentForm = document.getElementById("studentForm");
const searchInput = document.getElementById("search");

// Local array to hold state for filtering
let students = [];

// 1. GET - Load Students from REST API
async function loadStudents() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    students = await response.json();
    displayStudents(students);
  } catch (error) {
    console.error(error);
    alert("Unable to load student records.");
  }
}

// Render Students to Table DOM
function displayStudents(studentList) {
  tableBody.innerHTML = "";

  studentList.forEach((student) => {
    const row = document.createElement("tr");

    // Mapping API's 'company.name' as the 'course' field
    const courseName = student.company ? student.company.name : "N/A";

    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${courseName}</td>
      <td>
        <button class="btn-delete" onclick="deleteStudent(${student.id})">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// 2. POST - Add New Student
studentForm.addEventListener("submit", addStudent);

async function addStudent(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const course = document.getElementById("course").value;

  const student = {
    name: name,
    email: email,
    company: {
      name: course,
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const newStudent = await response.json();
    console.log("Created Student:", newStudent);

    // Optimistically update local array (JSONPlaceholder mock API assigns ID 11)
    students.push(newStudent);
    displayStudents(students);

    alert("Student added successfully!");
    studentForm.reset();
  } catch (error) {
    console.error(error);
    alert("Unable to add student.");
  }
}

// 3. DELETE - Remove Student
async function deleteStudent(id) {
  const confirmed = confirm("Delete this student?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // Filter out deleted record locally to reflect change instantly in UI
    students = students.filter((student) => student.id !== id);
    displayStudents(students);

    alert("Student deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Unable to delete student.");
  }
}

// 4. SEARCH - Filter Students
searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase();

  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(keyword)
  );

  displayStudents(filtered);
});

// Initialize App
loadStudents();