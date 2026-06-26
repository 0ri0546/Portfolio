function generateCV() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // Couleurs
    const bgDark = [15, 23, 42];
    const cardBg = [30, 41, 59];
    const textMain = [248, 250, 252];
    const textMuted = [148, 163, 184];
    const accent = [56, 189, 248];
    const border = [51, 65, 85];

    // Scraper les données du portfolio
    const name = 'Lucas Marcucci';
    const email = document.querySelector('a[href^="mailto:"]')?.href.replace('mailto:', '') || 'contact@example.com';
    const github = 'github.com/0ri0546';
    const portfolio = '0ri0546.github.io/Portfolio';

    const profile = 'Étudiant en 2ème année au Gaming Campus, je me forme au développement de jeux vidéo avec une approche généraliste. Passionné par la création de projets concrets et fonctionnels, je développe une polyvalence technique indispensable pour comprendre un pipeline de production dans sa globalité.';

    // Soft skills et langues
    const softSkills = ['Travail d\'équipe', 'Créativité', 'Autonomie', 'Adaptabilité'];
    const languages = [
        { name: 'Français', level: 'C2' },
        { name: 'Anglais', level: 'B1' }
    ];

    // Scraper les compétences dynamiquement
    const skillsData = [];
    document.querySelectorAll('.skill-card').forEach(card => {
        const name = card.querySelector('h3')?.textContent?.trim() || '';
        if (name) {
            const levelMap = {
                'C++': 1.0,
                'Web Design': 0.95,
                'Git': 0.78,
                'Canva': 0.90,
                'Python': 0.50,
                'Unreal Engine': 0.50,
                'Blender': 0.25,
                'VS': 0.78,
                'OpenGL': 0.25
            };
            const level = levelMap[name] || 0.6;
            skillsData.push({ name, level });
        }
    });

    // Scraper les projets
    const projects = [];
    document.querySelectorAll('.project-card').forEach((card, index) => {
        if (index < 5) {
            const title = card.querySelector('h3')?.textContent?.trim() || '';
            const button = card.querySelector('.open-modal-btn');
            let description = button?.getAttribute('data-desc') || '';
            const firstDot = description.indexOf('.');
            if (firstDot !== -1) {
                description = description.substring(0, firstDot + 1);
            }

            const date = card.querySelector('.date-tag')?.textContent?.trim() || '';
            const tags = Array.from(card.querySelectorAll('.tech-tag'))
                .slice(0, 2)
                .map(t => t.textContent?.trim())
                .filter(t => t)
                .join(' • ');

            if (title) {
                projects.push({ title, description, date, tags });
            }
        }
    });

    // Scraper les expériences
    const experiences = [];
    document.querySelectorAll('.timeline-item').forEach(item => {
        const title = item.querySelector('h3')?.textContent?.trim() || '';
        const dateText = item.querySelector('.timeline-date')?.textContent?.trim() || '';
        if (title) {
            experiences.push({ title, date: dateText });
        }
    });

    // Fond du PDF
    doc.setFillColor(...bgDark);
    doc.rect(0, 0, 210, 297, "F");

    // Colonnes
    const leftX = 10;
    const leftWidth = 65;
    const rightX = 85;
    const rightWidth = 115;

    let yLeft = 15;
    let yRight = 15;

    yLeft += 8;

    // ============ COLONNE GAUCHE ============

    // Boîte de contenu gauche
    doc.setFillColor(...cardBg);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.3);
    doc.roundedRect(leftX, 10, leftWidth, 277, 4, 4, "FD");

    // Section Profil
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("PROFIL", leftX + 6, yLeft);
    doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
    yLeft += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    const profileLines = doc.splitTextToSize(profile, leftWidth - 12);
    doc.text(profileLines, leftX + 6, yLeft, { align: "left" });
    yLeft += (profileLines.length * 3.5) + 10;

    // Section Contact
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("CONTACT", leftX + 6, yLeft);
    doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
    yLeft += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMain);
    const contactInfo = [
        `Email: ${email}`,
        `Portfolio: ${portfolio}`,
        `GitHub: ${github}`
    ];
    contactInfo.forEach(info => {
        const lines = doc.splitTextToSize(info, leftWidth - 12);
        doc.text(lines, leftX + 6, yLeft);
        yLeft += lines.length * 3.5 + 2;
    });
    yLeft += 10;

    // Section Langues
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("LANGUES", leftX + 6, yLeft);
    doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
    yLeft += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMain);
    languages.forEach(lang => {
        doc.text(`${lang.name}`, leftX + 6, yLeft);
        doc.setTextColor(...accent);
        doc.text(lang.level, leftX + leftWidth - 12, yLeft);
        doc.setTextColor(...textMain);
        yLeft += 5;
    });
    yLeft += 10;

    // Section Soft Skills
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("SOFT SKILLS", leftX + 6, yLeft);
    doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
    yLeft += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMain);
    softSkills.forEach(skill => {
        doc.text(`• ${skill}`, leftX + 6, yLeft);
        yLeft += 4.5;
    });
    yLeft += 10;

    // Section Compétences
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("COMPÉTENCES", leftX + 6, yLeft);
    doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
    yLeft += 10;

    skillsData.slice(0, 6).forEach(skill => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(...textMain);
        doc.text(skill.name, leftX + 6, yLeft);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(...textMuted);
        doc.text(`${Math.round(skill.level * 100)}%`, leftX + leftWidth - 12, yLeft);
        yLeft += 2;

        doc.setFillColor(...bgDark);
        doc.rect(leftX + 6, yLeft + 0.5, leftWidth - 12, 1.2, "F");
        doc.setFillColor(...accent);
        doc.rect(leftX + 6, yLeft + 0.5, (leftWidth - 12) * skill.level, 1.2, "F");

        yLeft += 5;
    });

    yLeft += 10;

    // Section Expériences
    if (yLeft < 260) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...accent);
        doc.text("EXPÉRIENCES", leftX + 6, yLeft);
        doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
        yLeft += 9;

        experiences.slice(0, 3).forEach(exp => {
            if (yLeft > 270) return;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(...textMain);
            const titleLines = doc.splitTextToSize(`• ${exp.title}`, leftWidth - 12);
            doc.text(titleLines, leftX + 6, yLeft);
            yLeft += titleLines.length * 3 + 1;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(6.5);
            doc.setTextColor(...accent);
            doc.text(exp.date, leftX + 12, yLeft);
            yLeft += 4.5;
        });
    }

    // ============ COLONNE DROITE ============

    // Header droite
    doc.setFillColor(...cardBg);
    doc.roundedRect(rightX, yRight, rightWidth, 25, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...textMain);
    doc.text("LUCAS MARCUCCI", rightX + 8, yRight + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...accent);
    doc.text("DÉVELOPPEUR DE JEUX VIDÉO", rightX + 8, yRight + 17);

    yRight += 32;

    // Section Projets
    doc.setFillColor(...cardBg);
    doc.roundedRect(rightX, yRight, rightWidth, 95, 4, 4, "FD");

    let projectY = yRight + 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("PROJETS CLÉS", rightX + 8, projectY);
    doc.line(rightX + 8, projectY + 3, rightX + rightWidth - 8, projectY + 3);
    projectY += 10;

    projects.slice(0, 4).forEach((p, idx) => {
        if (projectY > 200) return;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...textMain);
        doc.text(p.title, rightX + 8, projectY);

        if (p.date) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(...accent);
            doc.text(p.date, rightX + rightWidth - 18, projectY);
        }
        projectY += 4;

        if (p.tags) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(6.5);
            doc.setTextColor(...textMuted);
            doc.text(p.tags, rightX + 8, projectY);
            projectY += 3;
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...textMuted);
        const descLines = doc.splitTextToSize(p.description, rightWidth - 16);
        doc.text(descLines.slice(0, 2), rightX + 8, projectY);
        projectY += (Math.min(descLines.length, 2) * 3.2) + 5;
    });

    yRight += 100;

    // Section Formation
    doc.setFillColor(...cardBg);
    doc.roundedRect(rightX, yRight, rightWidth, 55, 4, 4, "FD");

    let formY = yRight + 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("FORMATION", rightX + 8, formY);
    doc.line(rightX + 8, formY + 3, rightX + rightWidth - 8, formY + 3);
    formY += 9;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...textMain);
    doc.text("Bachelor Développeur de Jeux Vidéo", rightX + 8, formY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...accent);
    doc.text("Gaming Campus | 2ème année en cours", rightX + 8, formY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...textMuted);
    const formLines = doc.splitTextToSize("Gameplay programming • Moteurs 3D • Web dev • Architecture logicielle", rightWidth - 16);
    doc.text(formLines, rightX + 8, formY + 11);

    formY += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...textMain);
    doc.text("Baccalauréat", rightX + 8, formY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...accent);
    doc.text("Mention Assez Bien | Spé NSI & SI", rightX + 8, formY + 5);

    doc.save("CV-Lucas-Marcucci.pdf");
}

// Charger jsPDF et ajouter le bouton
document.addEventListener('DOMContentLoaded', () => {
    if (!window.jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(script);
    }

    const socialLinks = document.querySelector('.social-links');
    if (!socialLinks) return;

    const cvButton = document.createElement('a');
    cvButton.href = "#";
    cvButton.innerHTML = '<i class="bi bi-file-pdf"></i> Télécharger CV';
    cvButton.style.cssText = `
        color: #00ffff;
        font-size: 1.2rem;
        text-decoration: none;
        padding: 1rem 2rem;
        border: 2px solid #00ffff;
        border-radius: 10px;
        transition: all 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    `;

    cvButton.onclick = (e) => {
        e.preventDefault();
        generateCV();
    };

    cvButton.onmouseenter = () => {
        cvButton.style.background = '#00ffff';
        cvButton.style.color = '#0a0e27';
        cvButton.style.transform = 'scale(1.1)';
    };

    cvButton.onmouseleave = () => {
        cvButton.style.background = '';
        cvButton.style.color = '#00ffff';
        cvButton.style.transform = 'scale(1)';
    };

    socialLinks.appendChild(cvButton);
});