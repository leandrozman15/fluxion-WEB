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
  demoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = demoForm.querySelector('button[type="submit"]');
    const status = demoForm.querySelector('.form-status');

    if (!(button instanceof HTMLButtonElement) || !(status instanceof HTMLElement)) {
      return;
    }

    const originalText = button.textContent;
    const formData = new FormData(demoForm);

    button.disabled = true;
    button.textContent = 'Enviando...';
    status.textContent = '';
    status.classList.remove('is-success', 'is-error');

    try {
      const response = await fetch(demoForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha no envio');
      }

      demoForm.reset();
      const messageField = demoForm.querySelector('#mensagem');
      if (messageField instanceof HTMLTextAreaElement) {
        messageField.value = 'Olá! Gostaria de conhecer a FluxiON e agendar uma demonstração.';
      }

      status.textContent = 'Solicitacao enviada com sucesso. Em breve entraremos em contato.';
      status.classList.add('is-success');
      button.textContent = 'Solicitacao enviada';
    } catch {
      status.textContent = 'Nao foi possivel enviar agora. Use o WhatsApp para atendimento imediato.';
      status.classList.add('is-error');
      button.disabled = false;
      button.textContent = originalText;
      return;
    }

    setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
    }, 4000);
  });
}
