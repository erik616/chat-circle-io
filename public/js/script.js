// LOGIN

const socket = io()

const login = document.querySelector(".login")
const loginForm = login.querySelector(".login-form")
const loginInput = login.querySelector(".login-input")



const colors = [
    "aqua",
    "aquamarine",
    "blueviolet",
    "brown",
    "cadetblue",
    "crimson",
    "darkcyan",
    "salmon",
    "seagreen",
]

const randonColor = () => {
    const randonInd = Math.floor(Math.random() * (colors.length - 1) + 1)
    return colors[randonInd]
}

const getUser = () => localStorage.getItem("@circle_app")
const onUser = JSON.parse(getUser())
const user = { id: "", name: "", color: "" }

function app() {
    if (!onUser) return

    // login.style.display = "none"
    window.location = window.location.origin + window.location.pathname + `chat.html`
}
app()

loginForm.addEventListener("submit", handleSubmit)

function handleSubmit(event) {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = randonColor()


    console.log(user);
    localStorage.setItem("@circle_app", JSON.stringify(user))
    window.location.reload()
}
//localStorage.removeItem("@circle_app")