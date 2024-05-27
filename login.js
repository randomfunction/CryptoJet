
const form = document.querySelector("form");
const eField = form.querySelector(".email");
const eInput = eField.querySelector("input");
const pField = form.querySelector(".password");
const pInput = pField.querySelector("input");

form.onsubmit = async (e) => {
    e.preventDefault();

    if (eInput.value.trim() === "" || pInput.value.trim() === "") {
        console.error('Email and password are required.');
        return;
    }

    try {
        const loginDetails = {
            email: eInput.value,
            password: pInput.value
        };

        let response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDetails)
        });

        if (response.ok) {
            response = await response.json();
            let storedProfile = window.localStorage.getItem("newProfile");
            if (!storedProfile) {
                window.location.href = 'profile.html'; 
            } else {
                window.localStorage.setItem("user", JSON.stringify(response.user));
                window.location.href = 'profiletest.html';
            }
        } else if (response.status === 404) {
            const errorMessage = document.getElementById('error-message');
            errorMessage.innerText = 'User does not have an account.';
            errorMessage.style.display = 'block'; 
        } else {

            console.error('Failed to login:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


