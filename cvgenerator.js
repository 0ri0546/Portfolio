function generateCV() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const bgDark = [15, 23, 42];        // #0f172a
    const cardBg = [30, 41, 59];       // #1e293b
    const textMain = [248, 250, 252];   // #f8fafc
    const textMuted = [148, 163, 184]; // #94a3b8
    const accent = [56, 189, 248];     // #38bdf8
    const border = [51, 65, 85];       // #334155

    doc.setFillColor(...bgDark);
    doc.rect(0, 0, 210, 297, "F");

    const leftX = 10;
    const leftWidth = 65;
    const rightX = 85;
    const rightWidth = 115;

    let yLeft = 15;
    let yRight = 45;

    doc.setFillColor(...cardBg);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.3);
    doc.roundedRect(leftX, 10, leftWidth, 277, 4, 4, "FD");

    doc.setFillColor(...cardBg);
    doc.roundedRect(rightX, 10, rightWidth, 25, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...textMain);
    doc.text("LUCAS MARCUCCI", rightX + 8, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...accent);
    doc.text("DÉVELOPPEUR C++ & CONCEPTEUR WEB", rightX + 8, 28);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("PROFIL", leftX + 6, yLeft + 5);
    
    doc.setDrawColor(...border);
    doc.line(leftX + 6, yLeft + 8, leftX + leftWidth - 6, yLeft + 8);
    yLeft += 13;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    
    const profileTxt = "Étudiant en 2e année au Gaming Campus, je me forme au développement de jeux vidéo avec une approche généraliste (gameplay, bas niveau, outils, multi). Passionné par la création de projets concrets et fonctionnels — du moteur OpenGL aux Game Jams — je développe une polyvalence technique indispensable pour comprendre un pipeline de production dans sa globalité.";
    const profileLines = doc.splitTextToSize(profileTxt, leftWidth - 12);
    doc.text(profileLines, leftX + 6, yLeft, { align: "left" });
    yLeft += (profileLines.length * 4) + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("CONTACT & LIENS", leftX + 6, yLeft);
    doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
    yLeft += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...textMain);
    
    const contactInfo = [
        "Localisation: Île-de-France, France",
        "Email: lucas.marcucci@email.com",
        "Portfolio: 0ri0546.github.io/Portfolio/",
        "GitHub: github.com/0ri0546"
    ];

    contactInfo.forEach(info => {
        doc.text(info, leftX + 6, yLeft);
        yLeft += 5;
    });
    yLeft += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("COMPÉTENCES", leftX + 6, yLeft);
    doc.line(leftX + 6, yLeft + 3, leftX + leftWidth - 6, yLeft + 3);
    yLeft += 8;

    const technicalSkills = [
        { name: "C++ (SFML / ImGui)", lvl: 1.0 },
        { name: "Web Design (HTML/CSS/JS)", lvl: 0.95 },
        { name: "Canva (Graphisme)", lvl: 0.90 },
        { name: "IDE & Git (Debugging)", lvl: 0.78 },
        { name: "Python (Algorithmes)", lvl: 0.50 },
        { name: "Unreal Engine (BPs)", lvl: 0.50 },
        { name: "Blender & OpenGL", lvl: 0.25 }
    ];

    technicalSkills.forEach(skill => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...textMain);
        doc.text(skill.name, leftX + 6, yLeft);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textMuted);
        doc.text(`${Math.round(skill.lvl * 100)}%`, leftX + leftWidth - 12, yLeft);
        yLeft += 2.5;

        doc.setFillColor(...bgDark);
        doc.rect(leftX + 6, yLeft, leftWidth - 12, 1.5, "F");
        
        doc.setFillColor(...accent);
        doc.rect(leftX + 6, yLeft, (leftWidth - 12) * skill.lvl, 1.5, "F");
        
        yLeft += 5.5;
    });

    const targetProjects = Array.from(document.querySelectorAll(".project-card")).map(card => {
        const btn = card.querySelector(".open-modal-btn");
        const titleContainer = card.querySelector(".project-title");
        
        let cleanTitle = "Projet";
        if (titleContainer) {
            if (titleContainer.childNodes && titleContainer.childNodes.length > 0) {
                cleanTitle = titleContainer.childNodes[0].textContent.replace(/\|/g, "").trim();
            } else {
                cleanTitle = titleContainer.innerText.split("|")[0].trim();
            }
        }

        if ((!cleanTitle || cleanTitle.toLowerCase() === "projet") && btn && btn.getAttribute("data-title")) {
            cleanTitle = btn.getAttribute("data-title");
        }

        let fullDesc = btn ? btn.getAttribute("data-desc").replace(/<br\s*\/?>/gi, ' ') : card.querySelector(".project-desc")?.textContent?.trim() || "";
        
        let firstSentence = fullDesc;
        const firstDotIndex = fullDesc.indexOf('.');
        if (firstDotIndex !== -1) {
            firstSentence = fullDesc.substring(0, firstDotIndex + 1).trim();
        }

        return {
            title: cleanTitle,
            subtitle: card.querySelector(".project-title span")?.textContent?.replace(/\|/g, "")?.trim() || "",
            date: card.querySelector(".project-date")?.textContent?.trim() || "",
            desc: firstSentence
        };
    }).slice(0, 5);

    let totalProjectsHeight = 15; 
    targetProjects.forEach(p => {
        const lines = doc.splitTextToSize(p.desc, rightWidth - 16);
        totalProjectsHeight += 4 + 4 + (lines.length * 3.8) + 3;
    });

    doc.setFillColor(...cardBg);
    doc.roundedRect(rightX, yRight, rightWidth, totalProjectsHeight, 4, 4, "FD");
    
    let boxY = yRight + 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...accent);
    doc.text("PROJETS CLÉS", rightX + 8, boxY);
    doc.line(rightX + 8, boxY + 3, rightX + rightWidth - 8, boxY + 3);
    boxY += 10;

    targetProjects.forEach((p) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...textMain);
        doc.text(p.title, rightX + 8, boxY);

        if (p.date) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(...accent);
            doc.text(p.date, rightX + rightWidth - 22, boxY);
        }
        boxY += 4;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...textMuted);
        doc.text(p.subtitle, rightX + 8, boxY);
        boxY += 4;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...textMuted);
        const descLines = doc.splitTextToSize(p.desc, rightWidth - 16);
        doc.text(descLines, rightX + 8, boxY, { align: "left" });
        
        boxY += (descLines.length * 3.8) + 3;
    });

    yRight += totalProjectsHeight + 5;

    doc.setFillColor(...cardBg);
    doc.roundedRect(rightX, yRight, rightWidth, 32, 4, 4, "FD");

    let formY = yRight + 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("FORMATION", rightX + 8, formY);
    doc.line(rightX + 8, formY + 2, rightX + rightWidth - 8, formY + 2);
    formY += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...textMain);
    doc.text("Bachelor Développeur de Jeux Vidéo (2ème année)", rightX + 8, formY);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...accent);
    doc.text("Gaming Campus | En cours", rightX + 8, formY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text("Prog gameplay, mathématiques appliquées, architecture moteur et gestion de projet.", rightX + 8, formY + 9);

    yRight += 37;

    doc.setFillColor(...cardBg);
    doc.roundedRect(rightX, yRight, rightWidth, 38, 4, 4, "FD");

    let bottomY = yRight + 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("SOFT SKILLS", rightX + 8, bottomY);
    doc.text("CENTRES D'INTÉRÊT", rightX + (rightWidth / 2) + 4, bottomY);
    doc.line(rightX + 8, bottomY + 2, rightX + rightWidth - 8, bottomY + 2);
    bottomY += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...textMain);
    const softs = ["Pragmatisme & Solutions", "Créativité & Innovation", "Efficacité sous contrainte", "Esprit d'équipe"];
    softs.forEach((s, idx) => {
        doc.text(`• ${s}`, rightX + 8, bottomY + (idx * 5));
    });

    const interests = ["Informatique & Veille", "Jeux vidéo (Analyse)", "Esport & Compétition", "Culture & Industrie Japon"];
    interests.forEach((i, idx) => {
        doc.text(`• ${i}`, rightX + (rightWidth / 2) + 4, bottomY + (idx * 5));
    });

    doc.save("CV-Lucas-Marcucci.pdf");
}
document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = document.querySelector('.social-links');
    if (!socialLinks) return;

    const cvButton = document.createElement('a');
    cvButton.href = "#";
    cvButton.className = "cv-download-btn";
    cvButton.innerText = "Télécharger CV";

    cvButton.onclick = (e) => {
        e.preventDefault();
        generateCV();
    };

    socialLinks.appendChild(cvButton);
});