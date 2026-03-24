const source = new EventSource(window.location.pathname + '/events');

source.onmessage = (event) => {
  const toast = document.createElement('div');
  toast.textContent = event.data;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #165E55;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 1rem;
    z-index: 999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};