const form = document.getElementById("feedbackForm");
const list = document.getElementById("feedbackList");
const template = document.getElementById("feedbackTemplate");

let feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");

function render() {
    list.innerHTML = "";

    feedbacks.forEach((item, index) => {
        const node = template.content.cloneNode(true);

        node.querySelector(".feedback__name").textContent = item.name;
        node.querySelector(".feedback__email").textContent = item.email;
        node.querySelector(".feedback__text").textContent = item.message;

        node.querySelector(".feedback__edit-btn").addEventListener("click", () => editItem(index));

        list.appendChild(node);
    });
}

render();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (name.length < 2) return alert("Имя слишком короткое");
    if (message.length < 5) return alert("Отзыв слишком короткий");

    feedbacks.push({ name, email, message });
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    render();
    form.reset();
});

function editItem(index) {
    const newText = prompt("Измените текст отзыва:", feedbacks[index].message);

    if (newText && newText.trim().length >= 5) {
        feedbacks[index].message = newText.trim();
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        render();
    } else {
        alert("Минимум 5 символов");
    }
}
