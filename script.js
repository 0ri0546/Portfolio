const sfxKonami = new Audio('assets/konamiSound.mp3');
sfxKonami.preload = 'auto';
sfxKonami.volume = 0.4;

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return; // Sécurité si l'élément n'existe pas

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * -20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeInObserver.observe(el);
});

function initSearchBar() {
    const searchBarContainer = document.getElementById('search-bar');

    searchBarContainer.innerHTML = `
        <div class="search-container">
            <i class="bi bi-search search-icon"></i>
            <input type="text" id="search-input" placeholder="Rechercher un projet par titre ou tag...">
            <button id="clear-search"><i class="bi bi-x-circle"></i> Effacer</button>
        </div>
    `;

    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-search');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.projects-grid');

    function searchProjects() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();

            const tags = Array.from(card.querySelectorAll('.tech-tag'))
                .map(tag => tag.textContent.toLowerCase());

            const matchesTitle = title.includes(searchTerm);
            const matchesTags = tags.some(tag => tag.includes(searchTerm));

            if (searchTerm === '' || matchesTitle || matchesTags) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        let noResultsMessage = projectsGrid.querySelector('.no-results');
        if (visibleCount === 0 && searchTerm !== '') {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results';
                noResultsMessage.innerHTML = '<i class="bi bi-search"></i> Aucun projet trouvé';
                projectsGrid.appendChild(noResultsMessage);
            }
        } else {
            if (noResultsMessage) {
                noResultsMessage.remove();
            }
        }
    }

    function clearSearch() {
        searchInput.value = '';
        searchProjects();
        searchInput.focus();
    }

    searchInput.addEventListener('input', searchProjects);
    clearButton.addEventListener('click', clearSearch);

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });
}

const fullText = `Étudiant en 2ème année au Gaming Campus, je me forme au développement de jeux vidéo avec une approche volontairement généraliste : gameplay programming, moteurs custom, multijoueur, outils, 3D... Je crois qu'un bon développeur doit comprendre l'ensemble d'un projet, pas seulement sa petite brique. Ce qui me motive, c'est de construire des choses qui fonctionnent vraiment, que ce soit un moteur 3D en OpenGL, un jeu bouclé en 39h lors d'une Game Jam, ou un petit outil utilitaire que j'utilise moi-même au quotidien. Chaque projet est une occasion d'apprendre quelque chose de nouveau et de me pousser un peu plus loin. Curieux par nature, j'aime autant plonger dans les bas niveaux du code que collaborer avec des artistes pour livrer une expérience de jeu complète. Mon objectif : devenir un développeur polyvalent, capable de s'adapter à n'importe quel contexte et de contribuer à chaque étape de la création d'un jeu. `;

const displayElement = document.getElementById('typing-paragraph');
let index = 0;

function typeFullParagraph() {
    if (index < fullText.length) {
        displayElement.textContent = fullText.substring(0, index + 1);

        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.textContent = '|';
        displayElement.appendChild(cursor);

        index++;
        setTimeout(typeFullParagraph, 30);
    }
}

window.addEventListener('load', typeFullParagraph);

const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let currentPosition = 0;

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    const key = e.key.toLowerCase();
    const target = konamiCode[currentPosition];

    if (key === target) {
        currentPosition++;

        if (key.includes('arrow')) e.preventDefault();

        if (currentPosition === konamiCode.length) {
            activateKonami();
            currentPosition = 0;
            return;
        }
    } else {
        currentPosition = (key === konamiCode[0]) ? 1 : 0;
    }

});

function activateKonami() {
    document.body.classList.toggle('konami-active');

    if (sfxKonami) {
        sfxKonami.currentTime = 0;
        sfxKonami.play().catch(err => console.log("L'audio attend une interaction :", err));
    }
}

function initProjectModal() {
    const modal = document.getElementById("project-modal");
    const closeModal = document.querySelector(".close-modal");
    const openModalBtns = document.querySelectorAll(".open-modal-btn");

    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-description");
    const modalImg = document.getElementById("modal-img");
    const modalLink = document.getElementById("modal-link");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    let currentImages = [];
    let currentImgIndex = 0;
    let activeProjectLink = "";

    function updateCarousel() {
        if (currentImages.length > 0) {
            modalImg.src = currentImages[currentImgIndex];
            modalImg.alt = `Capture d'écran de ${modalTitle.textContent}`;
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const title = btn.getAttribute("data-title");
            const desc = btn.getAttribute("data-desc");
            activeProjectLink = btn.getAttribute("data-link");

            currentImages = btn.getAttribute("data-images").split(",");
            currentImgIndex = 0;

            modalTitle.textContent = title;
            modalDesc.textContent = desc;

            if (activeProjectLink && activeProjectLink.trim() !== "") {
                modalLink.style.display = "inline-block";
            } else {
                modalLink.style.display = "none";
            }

            updateCarousel();
            modal.classList.add("active");
        });
    });

    modalLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activeProjectLink && activeProjectLink.trim() !== "") {
            window.open(activeProjectLink, '_blank', 'noopener,noreferrer');
        }
    });

    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex + 1) % currentImages.length;
        updateCarousel();
    });

    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length;
        updateCarousel();
    });

    closeModal.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
}

const setupBalatroEffect = () => {
    const draggableElements = document.querySelectorAll('header img, .skill-card, .project-card');

    draggableElements.forEach(el => {
        el.classList.add('grab-target');

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        el.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('a')) return;

            isDragging = true;
            el.classList.remove('grab-returning');

            startX = e.clientX - currentX;
            startY = e.clientY - currentY;

            el.style.zIndex = "1000";
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            const rotateX = -currentY * 0.05;
            const rotateY = currentX * 0.05;

            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;

            currentX = 0;
            currentY = 0;

            el.classList.add('grab-returning');

            el.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)`;

            setTimeout(() => {
                if (!isDragging) el.style.zIndex = "";
            }, 500);
        };

        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('blur', stopDragging);
    });
};

setupBalatroEffect();

const avatar = document.getElementById("avatar");

let lastShake = 0;
const SHAKE_THRESHOLD = 12;

function triggerShake() {
    if (!avatar) return;

    avatar.classList.remove("shake-avatar");

    void avatar.offsetWidth;

    avatar.classList.add("shake-avatar");
}

function handleMotion(event) {
    const acc = event.accelerationIncludingGravity;

    if (!acc) return;

    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;

    const magnitude = Math.sqrt(x * x + y * y + z * z);

    const now = Date.now();

    if (magnitude > SHAKE_THRESHOLD && now - lastShake > 1000) {
        lastShake = now;
        triggerShake();
    }
}

if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
) {
    document.addEventListener(
        "click",
        async () => {
            try {
                const permission =
                    await DeviceMotionEvent.requestPermission();

                if (permission === "granted") {
                    window.addEventListener(
                        "devicemotion",
                        handleMotion
                    );
                }
            } catch (error) {
                console.error(error);
            }
        },
        { once: true }
    );
} else {
    window.addEventListener("devicemotion", handleMotion);
}

function toggleExperiences() {
    const inner = document.getElementById('exp-timeline');
    const fade = document.getElementById('exp-fade');
    const btn = document.getElementById('exp-btn');
    const label = document.getElementById('exp-label');
    const isOpen = inner.classList.toggle('expanded');
    fade.classList.toggle('hidden', isOpen);
    btn.classList.toggle('open', isOpen);
    label.textContent = isOpen ? 'Voir moins' : 'Voir plus';
}

function toggleProjects() {
    const inner = document.getElementById('proj-timeline');
    const fade = document.getElementById('proj-fade');
    const btn = document.getElementById('proj-btn');
    const label = document.getElementById('proj-label');
    const isOpen = inner.classList.toggle('expanded');
    fade.classList.toggle('hidden', isOpen);
    btn.classList.toggle('open', isOpen);
    label.textContent = isOpen ? 'Voir moins' : 'Voir plus';
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.progress-fill');
                const level = entry.target.getAttribute('data-level');

                setTimeout(() => {
                    fill.style.width = level + '%';
                    fill.classList.add('animated');
                }, 100);

                progressObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(bar => progressObserver.observe(bar));
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initSearchBar();
    initProjectModal();
    initProgressBars();
});