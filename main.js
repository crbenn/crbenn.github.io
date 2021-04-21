window.addEventListener('load', function() {

})

// figure out where to add button click events
// use these functions to switch between views
// finish login/signup with firebase functionality by the end of the week
let loginView = function() {
    return `<div class="main">
                <p class="sign" align="center">Sign in</p>
                <form class="form1">
                    <input class="un " type="text" align="center" placeholder="Username">
                    <input class="pass" type="password" align="center" placeholder="Password">
                    <button class="submit" align="center">Sign in</button>
                </form>
            </div>`
}

let mainPageView = function () {
    return `<h1>Welcome to VideoPro!</h1>
            <h2>You must join our community in order to continue.</h2>
            <div class="loginOrSignUp">
                <button class="login">Login</button>
                <button class="signup">Sign Up</button>
            </div>`
}
