document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#orderButton');

    button.addEventListener('click', () => {
        window.location.href = './orders/index.html';
    });
});
