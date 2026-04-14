const loadBtn = document.getElementById('loadUsersBtn');
const usersList = document.getElementById('usersList');
const loader = document.getElementById('usersLoader');
const errorBlock = document.getElementById('usersError');
const userTemplate = document.getElementById('userTemplate');

function showLoader() {
    loader.classList.remove('users__loader--hidden');
    usersList.classList.add('users__list--hidden');
    errorBlock.classList.add('users__error--hidden');
}

function hideLoader() {
    loader.classList.add('users__loader--hidden');
}

function showError(message) {
    errorBlock.textContent = message;
    errorBlock.classList.remove('users__error--hidden');
}

function clearUsers() {
    usersList.innerHTML = '';
}

function getRandomUserId() {
    return Math.floor(Math.random() * 10) + 1;
}

function renderUser(user) {
    const clone = userTemplate.content.cloneNode(true);
    clone.querySelector('.users__name').textContent = user.name;
    clone.querySelector('.users__email').textContent = `Email: ${user.email}`;
    clone.querySelector('.users__city').textContent = `Город: ${user.address.city}`;
    usersList.appendChild(clone);
}

async function loadUsers() {
    clearUsers();
    showLoader();

    const randomId = getRandomUserId();
    const url = `https://jsonplaceholder.typicode.com/users/${randomId}`; 

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const user = await response.json();

        hideLoader();
        renderUser(user);
        usersList.classList.remove('users__list--hidden');

    } catch (error) {
        hideLoader();
        clearUsers();

        if (!navigator.onLine) {
            showError('Ошибка сети. Проверьте подключение к интернету.');
        } else {
            showError(error.message || 'Не удалось загрузить данные о пользователе.');
        }
    }
}

loadBtn.addEventListener('click', loadUsers);