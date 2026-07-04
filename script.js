const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('in-view');
      currentObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -60px 0px'
  }
);

revealElements.forEach((element) => observer.observe(element));

const demoForm = document.querySelector('.demo-form');

if (demoForm) {
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const button = demoForm.querySelector('button[type="submit"]');
    if (button instanceof HTMLButtonElement) {
      button.textContent = 'Pedido enviado';
      button.disabled = true;
    }
  });
}
