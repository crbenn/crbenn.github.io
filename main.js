window.addEventListener('load', function() {
    document.getElementById("body").append(mainPageView());
})

// figure out where to add button click events
// use these functions to switch between views
// finish login/signup with firebase functionality by the end of the week

let mainPageView = function () {
    let view = document.createElement("div");
    let welcome = document.createElement("h1");
    welcome.innerHTML = "Welcome to VideoPro!";
    let joinComm = document.createElement("h2");
    joinComm.innerHTML = "You must join our community in order to continue.";
    let loginButton = document.createElement("button");
    loginButton.innerHTML = "Log in";
    let signUpButton = document.createElement("button");
    signUpButton.innerHTML = "Sign up";

    view.append(welcome);
    view.append(joinComm);
    view.append(loginButton);
    view.append(signUpButton);

    loginButton.addEventListener("click", function() {
        view.replaceWith(loginView()); //changing screen to login form
    })

    signUpButton.addEventListener("click", function() {
        view.replaceWith(signupView()); //changing screen to login form
    })

    return view;

    // button clicks
}

let loginView = function() {
    // button clicks
    let view = document.createElement("div");
    let title = document.createElement("h1");
    title.innerHTML = "Sign in";
    let userProfileForm = document.createElement("form");
    let emailInput = document.createElement("input");
    emailInput.setAttribute("placeholder", "Email");
    emailInput.setAttribute("type", "email");
    let passwordInput = document.createElement("input");
    passwordInput.setAttribute("placeholder", "Password");
    passwordInput.setAttribute("type", "password");
    let submit = document.createElement("button");
    submit.innerHTML = "Submit";
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";

    userProfileForm.append(emailInput);
    userProfileForm.append(passwordInput);
    userProfileForm.append(submit);

    view.append(title);
    view.append(userProfileForm);
    view.append(cancel);

    submit.addEventListener("click", function (){
        let userEmail = emailInput.value;
        let userPass = passwordInput.value;

        // try firebase login stuff
        if (1 === 1) { // if successful login
            // do firebase stuff w/ login and such
            view.replaceWith(gameView());
        } else {
            // give error and let user retry
        }

    });

    cancel.addEventListener("click", function(){
        view.replaceWith(mainPageView());
        // make sure no user gets logged in and everything
    })

    return view;
}

let signupView = function() {
    // need to randomly get username using an API
    // can tell user where it is from with a tooltip maybe? (bootstrap)

    let view = document.createElement("div");
    let title = document.createElement("h1");
    title.innerHTML = "Sign up";
    let username = document.createElement("h3");
    username.innerHTML = "Your given username is: username randomly assigned"
    let userProfileForm = document.createElement("form");
    let emailInput = document.createElement("input");
    emailInput.setAttribute("placeholder", "Email");
    emailInput.setAttribute("type", "email");
    let passwordInput = document.createElement("input");
    passwordInput.setAttribute("placeholder", "Password");
    let submit = document.createElement("button");
    submit.innerHTML = "Submit";
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";

    userProfileForm.append(emailInput);
    userProfileForm.append(passwordInput);
    userProfileForm.append(submit);

    view.append(title);
    view.append(username);
    view.append(userProfileForm);
    view.append(cancel);

    submit.addEventListener("click", function (){
        // try firebase add user addition stuff

        let userEmail = emailInput.value;
        let userPass = passwordInput.value;

        if (1 === 1) { // if adding the user is successful
            // do firebase stuff w/ login and such
            view.replaceWith(gameView());
        } else {
            // give error and let user retry
        }

    });

    cancel.addEventListener("click", function(){
        view.replaceWith(mainPageView());
        // make sure no user gets logged in and everything
    })

    return view;

    // button clicks to collect info to later be used by firebase once i figure that ish out aahaha
}

let gameView = function () {

}
