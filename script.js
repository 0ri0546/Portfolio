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
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Search Bar
document.addEventListener('DOMContentLoaded', function() {
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

    // Event listeners
    searchInput.addEventListener('input', searchProjects);
    clearButton.addEventListener('click', clearSearch);

    // Recherche avec Enter
    searchInput.addEventListener('keydown', function(e) {
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