function generateCV() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const bgDark = [15, 23, 42];
    const cardBg = [30, 41, 59];
    const textMain = [248, 250, 252];
    const textMuted = [148, 163, 184];
    const accent = [56, 189, 248];
    const border = [51, 65, 85];

    const name = 'Lucas Marcucci';
    const email = document.querySelector('a[href^="mailto:"]')?.href.replace('mailto:', '') || 'contact@example.com';
    const github = 'github.com/0ri0546';
    const portfolio = '0ri0546.github.io/Portfolio';

    const profile = 'Étudiant en 2ème année au Gaming Campus, je me forme au développement de jeux vidéo avec une approche généraliste. Passionné par la création de projets concrets et fonctionnels, je développe une polyvalence technique indispensable pour comprendre un pipeline de production dans sa globalité.';

    const softSkills = ['Travail d\'équipe', 'Créativité', 'Autonomie', 'Adaptabilité'];
    const languages = [
        { name: 'Français', level: 'C2' },
        { name: 'Anglais', level: 'B1' }
    ];

    const skillsData = [];
    document.querySelectorAll('.skill-item').forEach(item => {
        const name = item.querySelector('h3')?.textContent?.trim() || '';
        const progressBar = item.querySelector('.progress-bar');
        const level = progressBar ? parseFloat(progressBar.getAttribute('data-level')) / 100 : 0;

        if (name) {
            skillsData.push({ name, level });
        }
    });

    const allProjects = [];
    document.querySelectorAll('.project-card').forEach((card) => {
        const title = card.querySelector('h3')?.textContent?.trim() || '';
        const button = card.querySelector('.open-modal-btn');
        
        const priority = parseInt(card.getAttribute('data-priority')) || 0;

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
            allProjects.push({ title, description, date, tags, priority });
        }
    });
    const projects = allProjects.sort((a, b) => b.priority - a.priority);

    const experiences = [];
    document.querySelectorAll('.timeline-item').forEach(item => {
        const title = item.querySelector('h3')?.textContent?.trim() || '';
        const dateText = item.querySelector('.timeline-date')?.textContent?.trim() || '';
        if (title) {
            experiences.push({ title, date: dateText });
        }
    });

    doc.setFillColor(...bgDark);
    doc.rect(0, 0, 210, 297, "F");

    const leftX = 10;
    const leftWidth = 65;
    const rightX = 85;
    const rightWidth = 115;

    let yLeft = 15;
    let yRight = 15;

    yLeft += 8;

    // ============ COLONNE GAUCHE ============
    doc.setFillColor(...cardBg);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.3);
    doc.roundedRect(leftX, 10, leftWidth, 277, 4, 4, "FD");

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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("COMPÉTENCES", leftX + 6, yLeft);
    doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
    yLeft += 10;

    skillsData.forEach(skill => {
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

    // ============ COLONNE DROITE ============
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

    let neededProjectsHeight = 16; 
    projects.slice(0, 4).forEach(p => {
        const descLines = doc.splitTextToSize(p.description, rightWidth - 16);
        neededProjectsHeight += 4 + (p.tags ? 3 : 0) + (Math.min(descLines.length, 2) * 3.2) + 5;
    });

    doc.setFillColor(...cardBg);
    doc.roundedRect(rightX, yRight, rightWidth, neededProjectsHeight, 4, 4, "FD");

    let projectY = yRight + 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("PROJETS CLÉS", rightX + 8, projectY);
    doc.line(rightX + 8, projectY + 3, rightX + rightWidth - 8, projectY + 3);
    projectY += 10;

    projects.slice(0, 4).forEach((p) => {
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

    yRight += neededProjectsHeight + 6;

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

    yRight += 61; 

    const pageMaxY = 282;
    const remainingSpace = pageMaxY - yRight;

    if (remainingSpace > 20 && experiences.length > 0) {
        doc.setFillColor(...cardBg);
        doc.roundedRect(rightX, yRight, rightWidth, remainingSpace, 4, 4, "FD");

        let expY = yRight + 6;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...accent);
        doc.text("EXPÉRIENCES", rightX + 8, expY);
        doc.line(rightX + 8, expY + 3, rightX + rightWidth - 8, expY + 3);
        expY += 9;

        let i = 0;
        while (i < experiences.length) {
            const exp = experiences[i];
            
            const itemHeight = 9; 

            if (expY + itemHeight > pageMaxY - 4) {
                break;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(...textMain);
            doc.text(`• ${exp.title}`, rightX + 8, expY);
            expY += 4;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(...accent);
            doc.text(exp.date, rightX + 12, expY);
            expY += 5;

            i++;
        }
    }

    doc.save("CV-Lucas-Marcucci.pdf");
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(script);
    }

    const socialLinks = document.querySelector('.social-links');
    if (!socialLinks) {
        console.log('social-links introuvable');
        return;
    }

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