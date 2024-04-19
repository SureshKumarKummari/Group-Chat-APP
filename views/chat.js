function saveuserinfo(){
        let d=document.getElementById('hidden');
            let usernameP = document.createElement('p');
            let emailP = document.createElement('p');
            let phoneP = document.createElement('p');
        
            // Set the text content of each p element to the corresponding data field
            usernameP.textContent = "Username: " + localStorage.getItem('username');
            emailP.textContent = "Email: " + localStorage.getItem('email');
            phoneP.textContent = "Phone: " + localStorage.getItem('phone');
            // Append the p elements to the d element
            d.appendChild(usernameP);
            d.appendChild(emailP);
            d.appendChild(phoneP);

    }

    saveuserinfo();

      function showuserinfo(event){
            let parentLi = event.target.closest('li');

            let hiddenWindow = parentLi.querySelector('.hidden-window');
            // Toggle the active class of the hidden window
            hiddenWindow.classList.toggle('active');
    }

function showuserform(event){
        let div = event.target.closest('div');
        let hiddenWindow = div.querySelector('.hidden-window-form');
        // Toggle the active class of the hidden window
        hiddenWindow.classList.toggle('active');
    }


    function showlinkstojoingroup(event){
        let div = event.target.closest('div');
        let hiddenWindow = div.querySelector('.hidden-window-join');
       // console.log(hiddenWindow);
        // Toggle the active class of the hidden window
        hiddenWindow.classList.toggle('active');
    }



//module.exports={saveuserinfo,showuserinfo};