
document.getElementById("login-btn").addEventListener('click', function(){
    // get the user name 
    const nameInput = document.getElementById("input-name");
    const userName = nameInput.value;
    console.log(userName);

    // get the password
    const passInput = document.getElementById("input-pass");
    const passWord = passInput.value;
    console.log(passWord);

    // match username & pass
    if (userName === "admin" && passWord === "admin123"){
        alert("Sign In Successfully");
        window.location.assign("./home.html");
    }
    else{
        alert("Sign In Failed");
        return;
    }

});