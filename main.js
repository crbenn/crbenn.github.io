import {User} from "/User.js";
import {Video} from "/Video.js";

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

// make sure that these values are reset on sign out and game over and such!!!
let user;
let currVideo;
let wordArray;
let playCount = 1;
let currentScore = 0;

window.addEventListener('load', async function() {

    await firebase.auth().onAuthStateChanged(async function(curruser) {
        if (curruser) {

            if (!user) {
                await firebase.database().ref().child("users").child(curruser.uid).get().then(async function(snapshot){
                    let userInfo = await snapshot.val();
                    user = new User(userInfo.username, userInfo.email, userInfo.modePreferred, userInfo.highScore, curruser.uid);
                });

                document.getElementById("view").replaceWith(startGameView());
            }







            // possibly make it so game won't restart in case of accidental refresh
            // this is not necessary, just if there is time
        } else {
            currentScore = 0;
            playCount = 1;
            user = null;
            document.getElementById("view").replaceWith(mainPageView());
        }
    });


})

// use these functions to switch between views

let mainPageView = function () {
    let view = document.createElement("div");
    view.setAttribute("id", "view");
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("mainBtnContainer");
    let loginButton = document.createElement("button");
    loginButton.classList.add("mainBtn");
    loginButton.innerHTML = "Log in";
    let signUpButton = document.createElement("button");
    signUpButton.classList.add("mainBtn");
    signUpButton.innerHTML = "Sign up";


    let logo = document.createElement("img");
    logo.setAttribute("src", "./VideoPro_TitlePage.svg");
    logo.classList.add("center");


    buttonDiv.append(loginButton);
    buttonDiv.append(signUpButton);

    view.append(logo);
    view.append(buttonDiv);

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
    title.innerHTML = "Welcome Back!";

    let loginHolder = document.createElement("div");
    loginHolder.classList.add("loginHolder");
    let loginSection = document.createElement("div");
    loginSection.classList.add("loginSection");

    let userProfileForm = document.createElement("form");
    userProfileForm.classList.add("loginForm");
    let emailInput = document.createElement("input");
    emailInput.setAttribute("placeholder", "Email");
    emailInput.setAttribute("type", "email");
    emailInput.classList.add("loginInputs");
    let passwordInput = document.createElement("input");
    passwordInput.setAttribute("placeholder", "Password");
    passwordInput.setAttribute("type", "password");
    passwordInput.classList.add("loginInputs");

    let errorDisplay = document.createElement("p");
    errorDisplay.style.display = "none";
    errorDisplay.style.color = "red";
    errorDisplay.style.fontWeight = "bold";

    let loginBtnHolder = document.createElement("div");
    loginBtnHolder.classList.add("loginButtonHolder");
    let submit = document.createElement("button");
    submit.innerHTML = "Sign In";
    submit.classList.add("loginButtons");
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.classList.add("loginButtons");

    userProfileForm.append(emailInput);
    userProfileForm.append(passwordInput);
    userProfileForm.append(errorDisplay);

    loginBtnHolder.append(submit);
    loginBtnHolder.append(cancel);

    loginSection.append(userProfileForm);
    loginSection.append(loginBtnHolder);

    loginHolder.append(title);
    loginHolder.append(loginSection);

    view.append(loginHolder);

    submit.addEventListener("click", async function (){
        let userEmail = emailInput.value;
        let userPass = passwordInput.value;

        if (userEmail === "") {
            errorDisplay.style.display = "block";
            errorDisplay.innerHTML = "Please enter your email.";

            emailInput.style.borderBottom = "1px solid red";
            passwordInput.style.borderBottom = "1px solid #3a3a3a";
        } else if (userPass === "") {
            errorDisplay.style.display = "block";
            errorDisplay.innerHTML = "Please enter your password.";

            emailInput.style.borderBottom = "1px solid #3a3a3a";
            passwordInput.style.borderBottom = "1px solid red";
        } else {
            try {
                await firebase.auth().signInWithEmailAndPassword(userEmail, userPass);
                user = firebase.auth().currentUser;
            } catch(error) {
                console.log(error);
                if (error.code === "auth/user-not-found") {
                    errorDisplay.style.display = "block";
                    errorDisplay.innerHTML = "There is no account associated with this email.";

                    passwordInput.style.borderBottom = "1px solid #3a3a3a";
                    emailInput.style.borderBottom = "1px solid red";
                } else if (error.code === "auth/wrong-password") {
                    errorDisplay.style.display = "block";
                    errorDisplay.innerHTML = "Incorrect password.";

                    emailInput.style.borderBottom = "1px solid #3a3a3a";
                    passwordInput.style.borderBottom = "1px solid red";
                } else if (error.code === "auth/invalid-email") {
                    errorDisplay.style.display = "block";
                    errorDisplay.innerHTML = "This email is invalid.";

                    passwordInput.style.borderBottom = "1px solid #3a3a3a";
                    emailInput.style.borderBottom = "1px solid red";
                }
            }
        }



        // user auth change will set right view screen if login is successful!

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

    let loginHolder = document.createElement("div");
    loginHolder.classList.add("loginHolder");
    let loginSection = document.createElement("div");
    loginSection.classList.add("loginSection");

    let usernameInfo = document.createElement("button");
    usernameInfo.classList.add("tooltipInfoBtn");
    usernameInfo.innerHTML = "?";
    $(usernameInfo).tooltip({title: "Your username will be the title of a wikipedia page that is being edited right now! Cool, right?", animation: true, placement: "right"});

    let title = document.createElement("h1");
    title.innerHTML = "Sign up";
    let username = document.createElement("h3");
    username.innerHTML = "Your username will be assigned to you after your account is created.";



    let userProfileForm = document.createElement("form");
    userProfileForm.classList.add("loginForm");
    let emailInput = document.createElement("input");
    emailInput.setAttribute("placeholder", "Email");
    emailInput.setAttribute("type", "email");
    emailInput.classList.add("loginInputs");
    let passwordInput = document.createElement("input");
    passwordInput.setAttribute("placeholder", "Password");
    passwordInput.setAttribute("type", "password");
    passwordInput.classList.add("loginInputs");

    let submit = document.createElement("button");
    submit.innerHTML = "Create Account";
    submit.classList.add("loginButtons");
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.classList.add("loginButtons");

    let errorDisplay = document.createElement("p");
    errorDisplay.style.display = "none";
    errorDisplay.style.color = "red";
    errorDisplay.style.fontWeight = "bold";

    let loginBtnHolder = document.createElement("div");
    loginBtnHolder.classList.add("loginButtonHolder");

    userProfileForm.append(emailInput);
    userProfileForm.append(passwordInput);
    userProfileForm.append(errorDisplay);

    loginBtnHolder.append(submit);
    loginBtnHolder.append(cancel);

    loginSection.append(userProfileForm);
    loginSection.append(loginBtnHolder);

    username.append(usernameInfo);

    loginHolder.append(title);
    loginHolder.append(username);
    // loginHolder.append(usernameInfo);
    loginHolder.append(loginSection);

    view.append(loginHolder);

    submit.addEventListener("click", async function (){
        // try firebase add user addition stuff

        let userEmail = emailInput.value;
        let userPass = passwordInput.value;

        if (userEmail === "") {
            errorDisplay.style.display = "block";
            errorDisplay.innerHTML = "Please enter your email.";

            emailInput.style.borderBottom = "1px solid red";
            passwordInput.style.borderBottom = "1px solid #3a3a3a";
        } else if (userPass === "") {
            errorDisplay.style.display = "block";
            errorDisplay.innerHTML = "Please enter your password.";

            emailInput.style.borderBottom = "1px solid #3a3a3a";
            passwordInput.style.borderBottom = "1px solid red";
        } else {
            try {
                await firebase.auth().createUserWithEmailAndPassword(userEmail, userPass);
                user = firebase.auth().currentUser;

            } catch(error) {
                if (error.code === 'auth/email-already-in-use') {
                    errorDisplay.style.display = "block";
                    errorDisplay.innerHTML = "This email is already in use. Please use another.";

                    emailInput.style.borderBottom = "1px solid #3a3a3a";
                    passwordInput.style.borderBottom = "1px solid red";
                } else if (error.code === "auth/invalid-email") {
                    errorDisplay.style.display = "block";
                    errorDisplay.innerHTML = "This email is invalid. Please try again.";

                    emailInput.style.borderBottom = "1px solid #3a3a3a";
                    passwordInput.style.borderBottom = "1px solid red";
                } else if (error.code === "auth/weak-password") {
                    errorDisplay.style.display = "block";
                    errorDisplay.innerHTML = "Your password must be at least 6 characters long.";

                    emailInput.style.borderBottom = "1px solid #3a3a3a";
                    passwordInput.style.borderBottom = "1px solid red";
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

                view.replaceWith(startGameView());
            }
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
    console.log(user.userName);

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

    //takes user to game!
    play.addEventListener("click", async function() {
        const wordResult = await axios({
            method:"get",
            url:"https://random-word-api.herokuapp.com/word?number=10"
        })
        wordArray = wordResult.data; // holds 10 randomly generated words to use for youtube video retrieval

        view.replaceWith(await gamePlayView());
    })

    return view;
}

let gamePlayView = async function () {

    let view = document.createElement("div");
    view.setAttribute("id", "view");

    let gameSection = document.createElement("div");

    let menuSection = document.createElement("div");
    menuSection.classList.add("menuSection");

    let leftMenu = document.createElement("div");
    leftMenu.classList.add("leftMenu");

    let instructions = document.createElement("button");
    instructions.innerHTML = "How to play";
    instructions.classList.add("menuButton");

    let logout = document.createElement("button");
    logout.innerHTML = "Logout"
    logout.classList.add("menuButton");
    let lightOrDark = document.createElement("button");
    lightOrDark.classList.add("menuButton");

    if (user.modePreference === "light") {
        lightOrDark.innerHTML = "Go dark mode";
    } else {
        lightOrDark.innerHTML = "Go light mode";
    }

    lightOrDark.addEventListener("click", async function() {
        if (user.modePreference === "light") {
            user.modePreference = "dark";
            await firebase.database().ref('users/' + user.uid).update({
                modePreferred: "dark"
            });
            lightOrDark.innerHTML = "Go light mode";
        } else {
            user.modePreference = "light";
            await firebase.database().ref('users/' + user.uid).update({
                modePreferred: "light"
            });
            lightOrDark.innerHTML = "Go dark mode";
        }
    });

    logout.addEventListener("click", async function() {
        await firebase.auth().signOut();
    });

    leftMenu.append(instructions);
    leftMenu.append(lightOrDark);

    menuSection.append(leftMenu);
    menuSection.append(logout);

    view.append(menuSection);
    view.append(gameSection);

    let vidUrl; //to be used with iframe

    if (playCount <= 10) {
        let randUrl = "https://www.googleapis.com/youtube/v3/search?regionCode=US&part=snippet&order=viewCount&q=" + wordArray[playCount - 1] + "&type=video&maxResults=3&videoEmbeddable=true&safeSearch=strict&key=AIzaSyAAkIpG47eXVFhmC0rcwBMpXjDGjnUf1mA";

        let vidResult = await axios({
            method:"get",
            url: randUrl
        })

        // makes sure that there is a video actually returned
        while (vidResult.data.items[0] === null || vidResult.data.items[0] === undefined) {
            await generateNewWords();

            randUrl = "https://www.googleapis.com/youtube/v3/search?regionCode=US&part=snippet&order=viewCount&q=" + wordArray[playCount - 1] + "&type=video&maxResults=3&videoEmbeddable=true&safeSearch=strict&key=AIzaSyAAkIpG47eXVFhmC0rcwBMpXjDGjnUf1mA";

            vidResult = await axios({
                method:"get",
                url: randUrl
            })
        }

        console.log(vidResult);
        // this works
        let vidID;
        if (vidResult.data.items[0] != null) {
            vidID = vidResult.data.items[0].id.videoId;
        } else if (vidResult.data.items[1] != null) {
            vidID = vidResult.data.items[1].id.videoId;
        } else {
            vidID = vidResult.data.items[2].id.videoId;
        }


        vidUrl = "https://www.youtube.com/embed/" + vidID + "?modestbranding=1&showinfo=0&autohide=0&fs=0&autoplay=1";

        const infoURL = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + vidID + "&key=AIzaSyAAkIpG47eXVFhmC0rcwBMpXjDGjnUf1mA";
        const vidInfo = await axios({
            method:"get",
            url: infoURL
        })



        const views = parseInt(vidInfo.data.items[0].statistics.viewCount);
        const dislikes = parseInt(vidInfo.data.items[0].statistics.dislikeCount);
        const likes = parseInt(vidInfo.data.items[0].statistics.likeCount);

        //try to figure out year?? might be in original result in snippet, published at
        //but this works other than the year!!!
        currVideo = new Video(vidUrl, views, likes, dislikes);
        console.log(currVideo);
        //
        // let instructions = document.createElement("button");
        // instructions.innerHTML = "How to play";
        // let logout = document.createElement("button");
        // logout.innerHTML = "Logout"
        let gamesOutOfTen = document.createElement("h1");
        gamesOutOfTen.innerHTML = "Round <strong>" + playCount + "</strong>/10";
        // let currentScoreDisplay = document.createElement("h2");
        // currentScoreDisplay.innerHTML = "Score: " + currentScore;

        let videoDisplay = document.createElement("iframe");
        videoDisplay.classList.add("video");
        videoDisplay.setAttribute("src", vidUrl);
        videoDisplay.setAttribute("sandbox", "allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-presentation allow-top-navigation");

        let playerGuessForm = document.createElement("form");

        let viewsLabel = document.createElement("label");
        viewsLabel.innerHTML = "How many views?";
        viewsLabel.setAttribute("for", "views");
        let viewsInput = document.createElement("input");
        viewsInput.setAttribute("type", "number");
        viewsInput.setAttribute("id", "views");

        let likesLabel = document.createElement("label");
        likesLabel.innerHTML = "How many likes?";
        likesLabel.setAttribute("for", "likes");
        let likesInput = document.createElement("input");
        likesInput.setAttribute("type", "number");
        likesInput.setAttribute("id", "likes");

        let dislikesLabel = document.createElement("label");
        dislikesLabel.innerHTML = "How many dislikes?";
        dislikesLabel.setAttribute("for", "dislikes");
        let dislikesInput = document.createElement("input");
        dislikesInput.setAttribute("type", "number");
        dislikesInput.setAttribute("id", "dislikes");

        let submit = document.createElement("button");
        submit.innerHTML = "Guess!";

        let scoreDiv = document.createElement("div");
        scoreDiv.classList.add("scoreDiv");

        let totalScore = document.createElement("h2");
        totalScore.setAttribute("id", "score");
        totalScore.innerHTML = "Score: " + currentScore;

        scoreDiv.append(totalScore);

        gameSection.append(gamesOutOfTen);
        gameSection.append(videoDisplay);
        gameSection.append(playerGuessForm);
        gameSection.append(submit)

        playerGuessForm.append(viewsLabel);
        playerGuessForm.append(viewsInput);
        playerGuessForm.append(likesLabel);
        playerGuessForm.append(likesInput);
        playerGuessForm.append(dislikesLabel);
        playerGuessForm.append(dislikesInput);

        view.append(scoreDiv);

        submit.addEventListener("click", function() {

            let viewersGuess = parseInt(viewsInput.value);
            let likesGuess = parseInt(likesInput.value);
            let dislikesGuess = parseInt(dislikesInput.value);

            if (Number.isInteger(viewersGuess) && Number.isInteger(likesGuess) && Number.isInteger(dislikesGuess)) {
                if (viewersGuess >=0 && likesGuess >=0 && dislikesGuess >=0) {
                    let total = 0;
                    //calculate point gains
                    if (viewersGuess > currVideo.viewCount) {
                        total += ((currVideo.viewCount + .01) / (viewersGuess + .01)) * 33.3333333;
                    } else {
                        total += ((viewersGuess + .01) / (currVideo.viewCount + .01)) * 33.3333333;
                    }

                    console.log(total);

                    if (likesGuess > currVideo.likeCount) {
                        total += ((currVideo.likeCount + .01) / (likesGuess + .01)) * 33.3333333;
                    } else {
                        total += ((likesGuess + .01) / (currVideo.likeCount + .01)) * 33.3333333;
                    }

                    console.log(total);

                    if (dislikesGuess > currVideo.dislikeCount) {
                        total += ((currVideo.dislikeCount + .01) / (dislikesGuess + .01)) * 33.3333333;
                    } else {
                        total += ((dislikesGuess + .01) / (currVideo.dislikeCount + .01)) * 33.3333333;
                    }

                    console.log(total);
                    currentScore += Math.round(total);

                    gameSection.replaceWith(gameResultView(Math.round(total), viewersGuess, likesGuess, dislikesGuess));

                } else {
                    alert("Please enter a positive number for each section.");
                }
            } else {
                alert("Please enter a whole number for each section.");
            }
        });
    } else {
        gameSection.replaceWith(await gameOverView());
    }

    return view;

}

let gameResultView = function(pointsEarned, viewersGuess, likesGuess, dislikesGuess) {
    //doesn't have to replace the game's view, just the part that had the video+input form
    //show how many points the user earned
    //show their total score
    //show the actual values ie "your guess" vs "actual value"
    //next video button
    //increase play count
    playCount++;

    let resultView = document.createElement("div");

    let earnedPoints = document.createElement("h1");
    earnedPoints.innerHTML = "This round, you earned <strong>" + pointsEarned + "</strong> points!";

    let viewers = document.createElement("h3");
    viewers.innerHTML = "You guessed there were " + viewersGuess.toLocaleString() + " viewers. There were actually " + currVideo.viewCount.toLocaleString() + ".";

    let likes = document.createElement("h3");
    likes.innerHTML = "You guessed there were " + likesGuess.toLocaleString() + " likes. There were actually " + currVideo.likeCount.toLocaleString() + ".";

    let dislikes = document.createElement("h3");
    dislikes.innerHTML = "You guessed there were " + dislikesGuess.toLocaleString() + " dislikes. There were actually " + currVideo.dislikeCount.toLocaleString() + ".";

    document.getElementById("score").innerHTML = "Score: " + currentScore;

    let next = document.createElement("button");
    if (playCount > 10) {
        next.innerHTML = "Game over! See your results"
    }
    next.innerHTML = "Next round";

    next.addEventListener("click", async function() {
        document.getElementById("view").replaceWith(await gamePlayView());
    })

    resultView.append(earnedPoints);
    resultView.append(viewers);
    resultView.append(likes);
    resultView.append(dislikes);
    resultView.append(next);

    return resultView;
}

let gameOverView = async function() {
    //shows final score
    //shows your high score and if it is a new high score
    //gives option to log out or play again
    let overSection = document.createElement("div");

    let finalScoreDisplay = document.createElement("h1");
    finalScoreDisplay.innerHTML = "Final score: " + currentScore;

    let playAgain = document.createElement("button");
    playAgain.innerHTML = "Play again";

    playAgain.addEventListener("click", async function() {
        playCount = 1;
        currentScore = 0;

        document.getElementById("view").replaceWith(await gamePlayView());
    });

    let highScore = document.createElement("h3");
    if (currentScore > user.highScore) {
        highScore.innerHTML = "New high score!"
        user.highScore = currentScore;
    } else {
        highScore.innerHTML = "No new high score. Are you a VideoPro or no?!"
    }

    overSection.append(finalScoreDisplay);
    overSection.append(highScore);
    overSection.append(playAgain);

    return overSection;
}

let generateNewWords = async function() {
    const wordResult = await axios({
        method:"get",
        url:"https://random-word-api.herokuapp.com/word?number=10"
    })
    wordArray = wordResult.data;
}