const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signUpForm = document.querySelector(".sign-up-form");
const signInForm = document.querySelector(".sign-in-form");

// Switch between sign up and sign in forms
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Handle Sign-Up Form submission
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = signUpForm.querySelector('input[placeholder="Username"]').value;
  const email = signUpForm.querySelector('input[placeholder="Email"]').value;
  const password = signUpForm.querySelector('input[placeholder="Password"]').value;

  const response = await fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();

  if (response.status === 201) {
    alert(data.message);  // Sign up successful
    signUpForm.reset();   // Clear the form
    container.classList.remove("sign-up-mode"); // Switch to sign-in form
  } else {
    alert(data.message);  // Error during sign up
  }
});

// Handle Sign-In Form submission
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const username = signInForm.querySelector('input[placeholder="Username"]').value;
  const password = signInForm.querySelector('input[placeholder="Password"]').value;
  
  const response = await fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  
  if (response.ok) {
      alert(data.message);  // Sign in successful
      window.location.href = 'Main/index_main.html';  // Redirect to protected route
  } else {
      alert(data.message || 'Sign in failed.');  // Error during sign in
  }
});
