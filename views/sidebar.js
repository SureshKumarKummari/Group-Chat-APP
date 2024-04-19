 function addUsersandGroups(data,isgroup){
        let ul=document.getElementById('usersandgroups');

            let li = document.createElement('li');
            li.classList.add('list-group-item');

            // Create the button element
            let button = document.createElement('button');
            button.classList.add('btn', 'd-flex', 'align-items-center');
            button.setAttribute('onclick', 'handlechat(this)');

            // Create the div elements for avatar and user details
            let avatarDiv = document.createElement('div');
            avatarDiv.classList.add('col-2');
            avatarDiv.style.paddingRight="30px";
            let userDiv = document.createElement('div');
            userDiv.classList.add('col');//col

            // Create the avatar image
            let avatarImg = document.createElement('img');
            if(isgroup){
                avatarImg.setAttribute('src', './group.jpg');
            }else{
            avatarImg.setAttribute('src', './user.jpg');
            }
            avatarImg.setAttribute('alt', 'avatar');
            avatarDiv.appendChild(avatarImg);

            // Create the user name element
            let userName = document.createElement('h6');
            userName.textContent = data.username;
            userDiv.appendChild(userName);

            // Create the hidden input field for user ID
            let hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'hiddenid');
            hiddenInput.setAttribute('value', data.user_id);

            // Append the div elements to the button
            button.appendChild(avatarDiv);
            button.appendChild(document.createElement('div')); // Placeholder for col-2
            button.appendChild(userDiv);
            button.appendChild(hiddenInput); // Append the hidden input field

            // Append the button to the li element
            li.appendChild(button);

            // Append the li element to the ul
            ul.appendChild(li);
    }