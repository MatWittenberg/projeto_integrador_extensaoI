const input = document.querySelector(".login_input");
const button = document.querySelector(".login_button");
const form = document.querySelector(".login_form");


const validateInput = ({ target }) => {
 if(target.value.length > 2) {
    button.removeAttribute("disabled");
 } else {
    button.setAttribute("disabled", "");
 }
}
const handleSubmit = (event) => {
    event.preventDefault();

    const jumpSound = document.getElementById("jumpSound");
    jumpSound.currentTime = 0;
    jumpSound.play();

    localStorage.setItem("player", input.value);

    setTimeout(() => { // Aqui espera o som pra ir pra próxima página, assim como no difficulty
        window.location.href = '../html/difficulty.html';
    }, 500);
};

input.addEventListener("input", validateInput);
form.addEventListener("submit", handleSubmit);

