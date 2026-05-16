if (window.location.pathname === '/feedback') {
  const currentUserId = Number(document.getElementById('current-user-id')?.value) || null;
  const isAdmin = document.getElementById('is-admin')?.value === 'true';

  /* ── SSE ─────────────────────────────────────────────── */
  const source = new EventSource('/feedback/events');

  const showToast = (message) => {
    const existing = document.querySelector('.feedback-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'feedback-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('feedback-toast--visible'));
    setTimeout(() => {
      toast.classList.remove('feedback-toast--visible');
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  };

  const esc = (text) => {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(text)));
    return d.innerHTML;
  };

  const fmtDate = (dateStr) =>
    new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'create') {
        const fb = data.feedback;
        const canEdit = currentUserId && currentUserId === fb.userId;
        const canDelete = isAdmin || canEdit;

        const div = document.createElement('div');
        div.className = 'feedback__item';
        div.dataset.feedbackId = fb.id;
        div.innerHTML = `
          <p class="feedback__text">${esc(fb.text)}</p>
          <p class="feedback__author">${esc(fb.userName)} — ${fmtDate(fb.createdAt)}</p>
          <div class="feedback__actions">
            ${canEdit ? `<a href="/feedback/${fb.id}/edit" class="feedback__edit-btn">Редактировать</a>` : ''}
            ${canDelete ? `<form action="/feedback/${fb.id}/delete" method="POST" style="display:inline">
              <button class="feedback__edit-btn feedback__edit-btn--danger">Удалить</button>
            </form>` : ''}
          </div>`;

        document.querySelector('.feedback__list').prepend(div);
        showToast(`Новый отзыв от ${fb.userName}`);

      } else if (data.type === 'update') {
        const item = document.querySelector(`[data-feedback-id="${data.feedback.id}"]`);
        if (item) {
          const el = item.querySelector('.feedback__text');
          if (el) el.textContent = data.feedback.text;
        }
        showToast('Отзыв обновлён');

      } else if (data.type === 'delete') {
        const item = document.querySelector(`[data-feedback-id="${data.id}"]`);
        if (item) item.remove();
        showToast('Отзыв удалён');
      }
    } catch (_) {}
  };

  /* ── AJAX create (no page reload) ───────────────────── */
  const addForm = document.querySelector('.feedback__form');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const textarea = addForm.querySelector('textarea');
      const text = textarea.value.trim();
      if (!text) return;

      const btn = addForm.querySelector('button[type="submit"]');
      btn.disabled = true;

      await fetch('/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ message: text }),
      });

      textarea.value = '';
      btn.disabled = false;
    });
  }

  /* ── AJAX delete via event delegation (no page reload) ─ */
  document.querySelector('.feedback__list').addEventListener('submit', async (e) => {
    const form = e.target.closest('form');
    if (!form || !form.action.includes('/delete')) return;
    e.preventDefault();
    await fetch(form.action, { method: 'POST' });
  });
}
