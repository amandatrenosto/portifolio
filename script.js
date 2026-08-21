document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Slider de Certificações ---------- */
    const certSlider = document.getElementById('certSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (certSlider && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => certSlider.scrollBy({ left: 340, behavior: 'smooth' }));
        prevBtn.addEventListener('click', () => certSlider.scrollBy({ left: -340, behavior: 'smooth' }));
    }

    /* ---------- Modal de Projeto ---------- */
    const modal = document.getElementById('projectModal');
    const closeModalBtn = document.getElementById('closeModal');
    const track = document.getElementById('modalCarouselTrack');
    const description = document.getElementById('modalDescription');
    const prevBtnModal = document.getElementById('modalPrevBtn');
    const nextBtnModal = document.getElementById('modalNextBtn');
    const dotsContainer = document.getElementById('modalDots');

    let currentIndex = 0;
    let totalSlides = 0;
    let isDragging = false;
    let startX = 0;
    let startTranslatePercent = 0;

    function updateDots() {
        if (!dotsContainer) return;
        [...dotsContainer.children].forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
        if (totalSlides === 0) return;
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    function openModal(button) {
        description.textContent = button.getAttribute('data-description') || '';

        let mediaList = [];
        try {
            mediaList = JSON.parse(button.getAttribute('data-media'));
        } catch (err) {
            mediaList = [];
        }

        // Monta o carrossel (imagens e vídeos)
        track.innerHTML = '';
        mediaList.forEach((src) => {
            const item = document.createElement('div');
            item.classList.add('carousel-item');
            item.innerHTML = src.endsWith('.mp4')
                ? `<video controls draggable="false"><source src="${src}" type="video/mp4"></video>`
                : `<img src="${src}" alt="Mídia do projeto" draggable="false">`;
            track.appendChild(item);
        });

        // Monta os indicadores (dots)
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            mediaList.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        currentIndex = 0;
        totalSlides = mediaList.length;
        track.style.transition = 'none';
        track.style.transform = 'translateX(0%)';

        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    document.querySelectorAll('.btn-open-modal').forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(button);
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    if (nextBtnModal) nextBtnModal.addEventListener('click', () => goToSlide(currentIndex + 1));
    if (prevBtnModal) prevBtnModal.addEventListener('click', () => goToSlide(currentIndex - 1));

    /* ---------- Arrastar o carrossel do modal (mouse e toque) ---------- */
    function getPositionX(e) {
        return e.type.startsWith('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function dragStart(e) {
        if (totalSlides === 0) return;
        isDragging = true;
        startX = getPositionX(e);
        startTranslatePercent = -currentIndex * 100;
        track.style.transition = 'none';
    }

    function dragMove(e) {
        if (!isDragging) return;
        const deltaPercent = ((getPositionX(e) - startX) / track.parentElement.offsetWidth) * 100;
        track.style.transform = `translateX(${startTranslatePercent + deltaPercent}%)`;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.type.startsWith('mouse')
            ? e.pageX
            : (e.changedTouches ? e.changedTouches[0].clientX : startX);
        const movedBy = endX - startX;

        if (movedBy < -60 && currentIndex < totalSlides - 1) {
            currentIndex++;
        } else if (movedBy > 60 && currentIndex > 0) {
            currentIndex--;
        }
        goToSlide(currentIndex);
    }

    if (track) {
        track.addEventListener('mousedown', dragStart);
        track.addEventListener('touchstart', dragStart, { passive: true });

        track.addEventListener('mousemove', dragMove);
        track.addEventListener('touchmove', dragMove, { passive: true });

        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('mouseleave', (e) => { if (isDragging) dragEnd(e); });
        track.addEventListener('touchend', dragEnd);
    }

    /* ---------- Formulário de contato -> abre o e-mail já preenchido ---------- */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const subject = contactForm.subject.value.trim() || 'Contato via portfólio';
            const message = contactForm.message.value.trim();

            const body = `Nome: ${name}\nE-mail: ${email}\n\n${message}`;
            const mailtoLink = `mailto:amandatrenosto290@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;
        });
    }
});
