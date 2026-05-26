const sfxKonami = new Audio('assets/konamiSound.mp3');
sfxKonami.preload = 'auto';
sfxKonami.volume = 0.4;

const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.bottom = Math.random() * 20 + '%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.opacity = '0';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    particlesContainer.appendChild(particle);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
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
    // FIX PERFORMANCE & CONFLITS : On anime uniquement l'opacité et le transform, pas "all"
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Search Bar
document.addEventListener('DOMContentLoaded', function () {
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
});

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

/* Konami easter egg */
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

    console.log(`Progression Konami : ${currentPosition}/${konamiCode.length}`);
});

function activateKonami() {
    console.log("🎯 CODE KONAMI VALIDÉ !");
    document.body.classList.toggle('konami-active');

    if (sfxKonami) {
        sfxKonami.currentTime = 0;
        sfxKonami.play().catch(err => console.log("L'audio attend une interaction :", err));
    }
}

// --- modale ---
document.addEventListener("DOMContentLoaded", () => {
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
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const title = btn.getAttribute("data-title");
            const desc = btn.getAttribute("data-desc");
            activeProjectLink = btn.getAttribute("data-link"); // Sauvegarde du lien

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
        e.stopPropagation(); // Empêche la modale de se fermer
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
});

// --- EFFET DRAG & SPRING FIN DE SÉANCE (STYLE BALATRO) ---
const setupBalatroEffect = () => {
    // Sélection de la photo de profil, des skill cards et des project cards
    const draggableElements = document.querySelectorAll('header img, .skill-card, .project-card');

    draggableElements.forEach(el => {
        el.classList.add('grab-target');

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        el.addEventListener('mousedown', (e) => {
            // Empêche le drag d'ouvrir la modale si on clique sur le bouton "Lire plus"
            if (e.target.closest('button') || e.target.closest('a')) return;

            isDragging = true;
            el.classList.remove('grab-returning');
            
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;

            el.style.zIndex = "1000"; // Passe l'élément au-dessus des autres
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            currentX = e.clientX - startX;
            currentY = e.clientY - startY;

            // Calcul d'une légère rotation basée sur la vitesse/direction du mouvement
            const rotateX = -currentY * 0.05; 
            const rotateY = currentX * 0.05;

            // Application de la translation + la rotation dynamique (effet Balatro)
            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;

            // On réinitialise les positions
            currentX = 0;
            currentY = 0;

            // On ajoute la classe de transition élastique
            el.classList.add('grab-returning');
            
            // Remise à zéro de la transformation
            el.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)`;

            // On nettoie le z-index après l'animation de retour
            setTimeout(() => {
                if (!isDragging) el.style.zIndex = "";
            }, 500);
        };

        window.addEventListener('mouseup', stopDragging);
        // Au cas où la souris sort de la fenêtre du navigateur
        window.addEventListener('blur', stopDragging); 
    });
};

// Initialisation de l'effet une fois le script chargé
setupBalatroEffect();