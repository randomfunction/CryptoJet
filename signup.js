document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        
        const profilePictureElement = document.getElementById('profile-picture');
        let profilePictureData = '';

        
        if (profilePictureElement.files.length > 0) {
            profilePictureData = getBase64Image(profilePictureElement);
        } else {
            profilePictureData = getBase64Image('default.jpg');
        }

        localStorage.setItem("profilePicture", profilePictureData);

        // Function to convert image to Base64 string
        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = 150; // Set width as needed
            canvas.height = 150; // Set height as needed

            var ctx = canvas.getContext("2d");

            // If img is a file object (uploaded image)
            if (typeof img === 'object') {
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    var imgElement = new Image();
                    imgElement.src = event.target.result;
                    imgElement.onload = function() {
                        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
                        var dataURL = canvas.toDataURL("image/png");
                        localStorage.setItem("profilePicture", dataURL);
                    };
                };
                fileReader.readAsDataURL(img.files[0]);
            } else {
                // If img is a default image file
                var imgElement = new Image();
                imgElement.src = img;
                imgElement.onload = function() {
                    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
                    var dataURL = canvas.toDataURL("image/png");
                    localStorage.setItem("profilePicture", dataURL);
                };
            }
        }

        // Send signup data to the server
        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = 'login.html'; 
            } else {
                console.error('Failed to create account');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
