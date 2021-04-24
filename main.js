import {User} from "/User.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDfXqOuGQ1Ivl-BnTVopK5-mcJH1BVwZKg",
    authDomain: "videopro-fdd92.firebaseapp.com",
    projectId: "videopro-fdd92",
    storageBucket: "videopro-fdd92.appspot.com",
    messagingSenderId: "781197336087",
    appId: "1:781197336087:web:19c393ac97a95abc814652",
    measurementId: "G-XSPDFXGCE5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.database();

let user;

window.addEventListener('load', async function() {
    // this works!
    // await firebase.database().ref('users/' + 1).set({
    //     username: "hiya",
    //     email: "helo@gmail.com"
    // });

    await firebase.auth().onAuthStateChanged(async function(curruser) {
        if (curruser) {

            await firebase.database().ref().child("users").child(curruser.uid).get().then((snapshot) => {
                let userInfo = snapshot.val();
                user = new User(userInfo.username, userInfo.email, userInfo.modePreferred, userInfo.highScore, curruser.uid);
            });

            console.log(user);

            document.getElementById("view").replaceWith(startGameView());
            // possibly make it so game won't restart in case of accidental refresh
            // this is not necessary, just if there is time
        } else {
            document.getElementById("view").replaceWith(mainPageView());
        }
    });


})

// use these functions to switch between views
// finish login/signup with firebase functionality by the end of the week

let mainPageView = function () {
    let view = document.createElement("div");
    view.setAttribute("id", "view");
    let welcome = document.createElement("h1");
    welcome.innerHTML = "Welcome to VideoPro!";
    let joinComm = document.createElement("h2");
    joinComm.innerHTML = "You must connect to a profile in order to play.";
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
}

let loginView = function() {
    let view = document.createElement("div");
    view.setAttribute("id", "view");
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

    view.append(title);
    view.append(userProfileForm);
    view.append(submit);
    view.append(cancel);

    submit.addEventListener("click", async function (){
        let userEmail = emailInput.value;
        let userPass = passwordInput.value;

        try {
            await firebase.auth().signInWithEmailAndPassword(userEmail, userPass);
            user = firebase.auth().currentUser;
        } catch(error) {
            if (error.code === "auth/invalid-email") {
                alert("There is no account associated with this email.");
            } else if (error.code === "auth/wrong-password") {
                alert("Incorrect password.");
            }
        }

        if (user) { // if signup was a success
            view.replaceWith(startGameView());
        } else {
            console.log(user)
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
    view.setAttribute("id", "view");
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
    passwordInput.setAttribute("type", "password");
    let submit = document.createElement("button");
    submit.innerHTML = "Submit";
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";

    userProfileForm.append(emailInput);
    userProfileForm.append(passwordInput);

    view.append(title);
    view.append(username);
    view.append(userProfileForm);
    view.append(submit);
    view.append(cancel);

    submit.addEventListener("click", async function (){
        // try firebase add user addition stuff

        let userEmail = emailInput.value;
        let userPass = passwordInput.value;

        try {
            await firebase.auth().createUserWithEmailAndPassword(userEmail, userPass);
            user = firebase.auth().currentUser;

        } catch(error) {
            if (error.code === 'auth/email-already-in-use') {
                alert("This email is already in use. Please use another.");
            } else if (error.code === "auth/invalid-email") {
                alert("This email is invalid. Please try again.");
            } else if (error.code === "auth/weak-password") {
                alert("Your password must be at least 6 characters long.");
            } else {
                console.log(error.code);
                alert("Error. Please try again.");
            }
        }

        if (user) { // if signup was a success

            let url = "https://en.wikipedia.org/w/api.php";
            let params = {
                action: "query",
                list: "recentchanges",
                rcprop: "title|ids|sizes|flags|user",
                rclimit: "5",
                format: "json"
            };
            url = url + "?origin=*";
            Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

            let userName = "fjdls;afjdkl;safjdklaj;fdjska;fdjlas;fjdklafjkdlasfjdkls;afjdkl;";
            await fetch(url)
                .then(function(response){return response.json();})
                .then(function(response) {
                    let recentChanges = response.query.recentchanges;
                    for (let rc in recentChanges) {
                        console.log(recentChanges[rc].title.length)
                        if (recentChanges[rc].title.length < userName.length && !recentChanges[rc].title.includes("User")
                            && !recentChanges[rc].title.includes("Talk")) {

                            userName = recentChanges[rc].title;
                        }
                    }
                })
                .catch(function(error){console.log(error);});

            console.log("userName: " + userName);

            // adds user to firebase database w its ID as the index
            await firebase.database().ref('users/' + user.uid).set({
                username: userName,
                email: userEmail,
                modePreferred: "light",
                highScore: 0
            });

            user = new User(userName, userEmail, "light", 0, user.uid);
            console.log(user.userName)


            // add username as a user property, plus add all other user properties!
            // will have to use database!

            view.replaceWith(startGameView());
        }
    });

    cancel.addEventListener("click", function(){
        view.replaceWith(mainPageView());
    })

    return view;
}

// user gets sent here after logging in
// maybe "see high scores" and "play!" could be options
// also could have "profile" name and section on top?
let startGameView = function() {
    let view = document.createElement("div");
    view.setAttribute("id", "view");
    let welcome = document.createElement("h1");
    welcome.innerHTML = "Welcome, " + user.userName;
    let play = document.createElement("button");
    play.innerHTML = "Let's play";
    let logout = document.createElement("button");
    logout.innerHTML = "Logout";

    view.append(welcome);
    view.append(play);
    view.append(logout);

    logout.addEventListener("click", async function() {
        await firebase.auth().signOut();
    });

    return view;
}

let gameView = function () {

}
