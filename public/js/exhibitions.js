document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal');
  const closeButton = document.querySelector('.modal__close');
  const buttons = document.querySelectorAll('.exhibitions__btn--modal');
  const modalTitle = document.querySelector('.modal__title');
  const modalImage = document.querySelector('.modal__image img');
  const hiddenExhibitionId = document.querySelector('input[name="exhibitionId"]');

  if (!modal || !closeButton || !buttons.length || !hiddenExhibitionId) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const exhibitionId = button.dataset.exhibitionId;
      const exhibitionName = button.dataset.exhibitionName;
      const exhibitionImg = button.dataset.exhibitionImg;

      hiddenExhibitionId.value = exhibitionId;
      modalTitle.textContent = `Оформление билетов: ${exhibitionName}`;
      if (exhibitionImg) {
        modalImage.src = exhibitionImg;
        modalImage.alt = exhibitionName;
      }
      modal.classList.remove('modal--hidden');
    });
  });

  closeButton.addEventListener('click', () => {
    modal.classList.add('modal--hidden');
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('modal--hidden');
    }
  });
});