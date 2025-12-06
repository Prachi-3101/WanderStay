document.addEventListener('DOMContentLoaded', () => {
  // keyboard support + optional AJAX hook
  document.querySelectorAll('.star-widget').forEach(widget => {
    // allow arrow keys to move selection
    widget.addEventListener('keydown', (e) => {
      const key = e.key;
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)) return;
      e.preventDefault();
      const radios = Array.from(widget.querySelectorAll('input[type="radio"]'));
      const checkedIndex = radios.findIndex(r => r.checked);
      let nextIndex = checkedIndex;
      if (key === 'ArrowLeft' || key === 'ArrowDown') nextIndex = Math.min(radios.length - 1, (checkedIndex === -1 ? radios.length - 1 : checkedIndex + 1));
      if (key === 'ArrowRight' || key === 'ArrowUp') nextIndex = Math.max(0, (checkedIndex <= 0 ? 0 : checkedIndex - 1));
      radios[nextIndex].checked = true;
      radios[nextIndex].dispatchEvent(new Event('change', { bubbles: true }));
    });

    // optional: handle change (AJAX disabled by default)
    widget.addEventListener('change', (e) => {
      const input = e.target;
      if (input.tagName !== 'INPUT') return;
      const rating = input.value;
      const itemId = widget.dataset.itemId;
    });
  });
});
