// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const studentTableBody = document.getElementById('studentTableBody');
const noRecordsMessage = document.getElementById('noRecordsMessage');
const searchInput = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');

// Modal Elements
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editForm = document.getElementById('editForm');
const confirmModal = document.getElementById('confirmModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Form Input Fields
const studentName = document.getElementById('studentName');
const studentId = document.getElementById('studentId');
const studentClass = document.getElementById('studentClass');
const studentEmail = document.getElementById('studentEmail');
const contactNo = document.getElementById('contactNo');
const studentAddress = document.getElementById('studentAddress');

// Edit Form Fields
const editStudentName = document.getElementById('editStudentName');
const editStudentId = document.getElementById('editStudentId');
const editStudentClass = document.getElementById('editStudentClass');
const editStudentEmail = document.getElementById('editStudentEmail');
const editContactNo = document.getElementById('editContactNo');
const editStudentAddress = document.getElementById('editStudentAddress');
const editRecordId = document.getElementById('editRecordId');

// Error Messages
const nameError = document.getElementById('nameError');
const idError = document.getElementById('idError');
const emailError = document.getElementById('emailError');
const contactError = document.getElementById('contactError');
const editNameError = document.getElementById('editNameError');
const editIdError = document.getElementById('editIdError');
const editEmailError = document.getElementById('editEmailError');
const editContactError = document.getElementById('editContactError');

// Variables
let students = JSON.parse(localStorage.getItem('students')) || [];
let currentRecordId = null;

// Initialize the application
function init() {
    renderStudentTable();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Form submission
    registrationForm.addEventListener('submit', handleFormSubmit);
    
    // Reset form
    resetBtn.addEventListener('click', resetForm);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Modal controls
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    cancelDeleteBtn.addEventListener('click', closeConfirmModal);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    
    // Input validation
    studentName.addEventListener('input', () => validateName(studentName, nameError));
    studentId.addEventListener('input', () => validateNumber(studentId, idError));
    contactNo.addEventListener('input', () => validateNumber(contactNo, contactError));
    studentEmail.addEventListener('input', () => validateEmail(studentEmail, emailError));
    
    editStudentName.addEventListener('input', () => validateName(editStudentName, editNameError));
    editStudentId.addEventListener('input', () => validateNumber(editStudentId, editIdError));
    editContactNo.addEventListener('input', () => validateNumber(editContactNo, editContactError));
    editStudentEmail.addEventListener('input', () => validateEmail(editStudentEmail, editEmailError));
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName(studentName, nameError);
    const isIdValid = validateNumber(studentId, idError);
    const isEmailValid = validateEmail(studentEmail, emailError);
    const isContactValid = validateNumber(contactNo, contactError);
    
    if (!isNameValid || !isIdValid || !isEmailValid || !isContactValid) {
        return;
    }
    
    // Check if student ID already exists
    const idExists = students.some(student => student.id === studentId.value);
    if (idExists) {
        idError.textContent = 'Student ID already exists';
        idError.classList.remove('hidden');
        return;
    }
    
    // Create new student object
    const newStudent = {
        id: studentId.value,
        name: studentName.value,
        class: studentClass.value,
        email: studentEmail.value,
        contact: contactNo.value,
        address: studentAddress.value
    };
    
    // Add to students array
    students.push(newStudent);
    
    // Save to local storage
    saveToLocalStorage();
    
    // Reset form
    resetForm();
    
    // Update table
    renderStudentTable();
}

// Render student table
function renderStudentTable(filteredStudents = null) {
    const studentsToRender = filteredStudents || students;
    
    if (studentsToRender.length === 0) {
        studentTableBody.innerHTML = '';
        noRecordsMessage.classList.remove('hidden');
        return;
    }
    
    noRecordsMessage.classList.add('hidden');
    
    studentTableBody.innerHTML = studentsToRender.map(student => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
            <td class="px-6 py-4 whitespace-nowrap">${student.id}</td>
            <td class="px-6 py-4 whitespace-nowrap">${student.class}</td>
            <td class="px-6 py-4 whitespace-nowrap">${student.email}</td>
            <td class="px-6 py-4 whitespace-nowrap">${student.contact}</td>
            <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
                <button onclick="openEditModal('${student.id}')" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="openConfirmModal('${student.id}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Reset form
function resetForm() {
    registrationForm.reset();
    nameError.classList.add('hidden');
    idError.classList.add('hidden');
    emailError.classList.add('hidden');
    contactError.classList.add('hidden');
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        renderStudentTable();
        return;
    }
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) || 
        student.id.toLowerCase().includes(searchTerm) ||
        student.class.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.contact.toLowerCase().includes(searchTerm)
    );
    
    renderStudentTable(filteredStudents);
}

// Save to local storage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Open edit modal
function openEditModal(studentId) {
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    editRecordId.value = student.id;
    editStudentName.value = student.name;
    editStudentId.value = student.id;
    editStudentClass.value = student.class;
    editStudentEmail.value = student.email;
    editContactNo.value = student.contact;
    editStudentAddress.value = student.address || '';
    
    currentRecordId = studentId;
    editModal.classList.remove('hidden');
    
    // Reset error messages
    editNameError.classList.add('hidden');
    editIdError.classList.add('hidden');
    editEmailError.classList.add('hidden');
    editContactError.classList.add('hidden');
}

// Close edit modal
function closeEditModal() {
    editModal.classList.add('hidden');
    currentRecordId = null;
}

// Handle edit form submission
editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName(editStudentName, editNameError);
    const isIdValid = validateNumber(editStudentId, editIdError);
    const isEmailValid = validateEmail(editStudentEmail, editEmailError);
    const isContactValid = validateNumber(editContactNo, editContactError);
    
    if (!isNameValid || !isIdValid || !isEmailValid || !isContactValid) {
        return;
    }
    
    // Check if student ID is changed and already exists
    if (editStudentId.value !== currentRecordId) {
        const idExists = students.some(student => student.id === editStudentId.value && student.id !== currentRecordId);
        if (idExists) {
            editIdError.textContent = 'Student ID already exists';
            editIdError.classList.remove('hidden');
            return;
        }
    }
    
    // Update student record
    const studentIndex = students.findIndex(s => s.id === currentRecordId);
    
    if (studentIndex !== -1) {
        students[studentIndex] = {
            id: editStudentId.value,
            name: editStudentName.value,
            class: editStudentClass.value,
            email: editStudentEmail.value,
            contact: editContactNo.value,
            address: editStudentAddress.value
        };
        
        // Save to local storage
        saveToLocalStorage();
        
        // Update table
        renderStudentTable();
        
        // Close modal
        closeEditModal();
    }
});

// Open confirmation modal
function openConfirmModal(studentId) {
    currentRecordId = studentId;
    confirmModal.classList.remove('hidden');
}

// Close confirmation modal
function closeConfirmModal() {
    confirmModal.classList.add('hidden');
    currentRecordId = null;
}

// Confirm deletion
function confirmDelete() {
    students = students.filter(student => student.id !== currentRecordId);
    saveToLocalStorage();
    renderStudentTable();
    closeConfirmModal();
}

// Validation functions
function validateName(inputElement, errorElement) {
    const value = inputElement.value.trim();
    const isValid = /^[a-zA-Z\s]+$/.test(value);
    
    if (!isValid) {
        errorElement.textContent = 'Name should contain only letters';
        errorElement.classList.remove('hidden');
        return false;
    }
    
    errorElement.classList.add('hidden');
    return true;
}

function validateNumber(inputElement, errorElement) {
    const value = inputElement.value.trim();
    const isValid = /^\d+$/.test(value);
    
    if (!isValid) {
        errorElement.textContent = 'Should contain only numbers';
        errorElement.classList.remove('hidden');
        return false;
    }
    
    errorElement.classList.add('hidden');
    return true;
}

function validateEmail(inputElement, errorElement) {
    const value = inputElement.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    
    if (!isValid) {
        errorElement.textContent = 'Please enter a valid email address';
        errorElement.classList.remove('hidden');
        return false;
    }
    
    errorElement.classList.add('hidden');
    return true;
}

// Initialize the application
init();