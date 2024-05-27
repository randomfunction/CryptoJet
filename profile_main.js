document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = form.querySelector(".email input").value;
        const username = form.querySelector(".username input").value;
        const password = form.querySelector(".password input").value;

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
                // Handle error
                console.error('Failed to create account');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

window.addEventListener("load",function(){
    data=window.localStorage.getItem("user");
    console.log(data);
    if(data){
        data=JSON.parse(data);
        document.getElementById("username").innerText=data.username;
    }
})

document.addEventListener("DOMContentLoaded", function() {
    const profilePictureData = localStorage.getItem('profilePicture');

    const profilePictureElement = document.getElementById('profile-picture');

    if (profilePictureData) {
        profilePictureElement.src = profilePictureData;
    } else {
        profilePictureElement.src = 'default.jpg';
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const socialLinksContainer = document.getElementById('social-links');
    const addSocialLinkButton = document.getElementById('add-social-link');
    const saveSocialLinksButton = document.getElementById('save-social-links');

    let socialLinks = [];

    const platformIcons = {
        'facebook.com': 'fa-facebook-square',
        'twitter.com': 'fa-twitter-square',
        'linkedin.com': 'fa-linkedin',
        'instagram.com': 'fa-instagram-square',
        'github.com': 'fa-github-square'
     
    };

    function addSocialLinkInput() {
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('social-link-input');

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'Enter social media URL';
        inputContainer.appendChild(urlInput);

        socialLinksContainer.appendChild(inputContainer);
    }

   
    addSocialLinkButton.addEventListener('click', function() {
        addSocialLinkInput();
    });

    
    saveSocialLinksButton.addEventListener('click', function() {
        socialLinks = []; 
      
        const inputContainers = document.querySelectorAll('.social-link-input');
        inputContainers.forEach(container => {
            const urlInput = container.querySelector('input[type="text"]:nth-child(1)');
            const url = urlInput.value.trim();
            if (url) {
                const icon = getIconClass(url);
                socialLinks.push({ url, icon });
            }
        });

        // Save social links to localStorage
        localStorage.setItem('socialLinks', JSON.stringify(socialLinks));

        // Clear input fields after saving
        socialLinksContainer.innerHTML = '';

        // Display social media icons
        displaySocialMediaIcons();
    });


    function displaySocialMediaIcons() {
        socialLinksContainer.innerHTML = ''; 
        socialLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.className = 'media-link';
            const iconElement = document.createElement('i');
            iconElement.className = `fab ${link.icon}`;
            linkElement.appendChild(iconElement);
            socialLinksContainer.appendChild(linkElement);
        });
    }


    const savedSocialLinks = JSON.parse(localStorage.getItem('socialLinks'));
    if (savedSocialLinks) {
        socialLinks = savedSocialLinks;
        displaySocialMediaIcons();
    }

   
    function getIconClass(url) {
        for (const platform in platformIcons) {
            if (url.includes(platform)) {
                return platformIcons[platform];
            }
        }
       
        return 'fa-question';
    }
});



document.addEventListener("DOMContentLoaded", function() {
    const editBioButton = document.querySelector('.edit-bio');
    const uploadImageButton = document.querySelector('.upload-image');
    const bioText = document.querySelector('.bio-text');
    const profilePictureElement = document.getElementById('profile-picture');

  
    editBioButton.addEventListener('click', function() {
        const newBio = prompt('Enter your new bio:');
        if (newBio !== null) {
            
            bioText.textContent = newBio;
      
            updateBio(newBio);
        }
    });

 
    uploadImageButton.addEventListener('click', function() {
   
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

   
        fileInput.click();

     
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                L
                const reader = new FileReader();
                reader.onload = function() {
                    const newProfilePicture = reader.result;
               
                    profilePictureElement.src = newProfilePicture;
              
                    updateProfilePicture(newProfilePicture);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Function to update the bio in the database
    function updateBio(newBio) {
        fetch('http://localhost:3000/updateBio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newBio })
        })
        .then(response => {
            if (response.ok) {
                console.log('Bio updated successfully');
            } else {
                console.error('Failed to update bio');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function updateProfilePicture(newProfilePicture) {
        fetch('http://localhost:3000/updateProfilePicture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newProfilePicture })
        })
        .then(response => {
            if (response.ok) {
                console.log('Profile picture updated successfully');
            } else {
                console.error('Failed to update profile picture');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});