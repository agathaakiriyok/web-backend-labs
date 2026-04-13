if (window.location.pathname === '/feedback') {
  const source = new EventSource('/feedback/events');

  const showToast = (message) => {
    const existingToast = document.querySelector('.feedback-toast');

    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'feedback-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('feedback-toast--visible');
    });

    setTimeout(() => {
      toast.classList.remove('feedback-toast--visible');
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  };

  source.onmessage = (event) => {
    showToast(event.data);
  };
}
