document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://192.168.137.238:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        alert("Sign up successful!");
        window.location.href = "login.html"; // Redirect to login page
      } else if (response.status === 400) {
        alert("Sign up failed: " + responseData.message);
      } else {
        alert("Unexpected error: " + response.status);
      }
    } catch (error) {
      console.error("Error occurred during sign up:", error);
      alert("An error occurred: " + error);
    }
  });
