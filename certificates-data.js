// ============================================================
// DATA SERTIFIKAT
// Untuk menambah/edit sertifikat, ubah array di bawah ini
// ============================================================
const CERTIFICATES = [
    {
        id: "cybersec",
        title: "Cybersecurity Essentials",
        issuer: "Cisco NetAcad",
        issuerIcon: "fa-solid fa-building",
        category: "Cybersecurity",
        year: "2024",
        color: "linear-gradient(135deg,#ef4444,#b91c1c)",
        icon: "fa-solid fa-shield-halved",
        image: "https://lh3.googleusercontent.com/d/1iE3vzILIxIVo7MfHCG-skgCvacW9oY1A",
        desc: "Sertifikat yang mencakup dasar-dasar keamanan siber, jenis ancaman dan serangan siber, enkripsi, keamanan jaringan, serta cara melindungi sistem dan data dari ancaman digital.",
        skills: ["Cybersecurity", "Network Security", "Encryption", "Threat Analysis", "Firewall", "IDS/IPS"],
        link: "https://drive.google.com/file/d/1iE3vzILIxIVo7MfHCG-skgCvacW9oY1A/view"
    },
    {
        id: "linux",
        title: "Linux Fundamental",
        issuer: "NDG / Cisco NetAcad",
        issuerIcon: "fa-brands fa-linux",
        category: "Linux",
        year: "2024",
        color: "linear-gradient(135deg,#f59e0b,#d97706)",
        icon: "fa-brands fa-linux",
        image: "https://lh3.googleusercontent.com/d/1OKLti7ubRaxzNpd4pZEmp7Gfk36OFsjA",
        desc: "Sertifikat yang membahas fondasi sistem operasi Linux, penggunaan command line interface, manajemen file dan direktori, permission, user management, dan proses sistem.",
        skills: ["Linux CLI", "File Management", "User & Group", "Permissions", "Shell Scripting", "Process Management"],
        link: "https://drive.google.com/file/d/1OKLti7ubRaxzNpd4pZEmp7Gfk36OFsjA/view"
    },
    {
        id: "introcybersec",
        title: "Introduction to Cybersecurity",
        issuer: "Cisco NetAcad",
        issuerIcon: "fa-solid fa-building",
        category: "Cybersecurity",
        year: "2024",
        color: "linear-gradient(135deg,#6366f1,#4f46e5)",
        icon: "fa-solid fa-lock",
        image: "https://lh3.googleusercontent.com/d/1s83qL_nULUrz8d7LTuZ3vsq-v30G5CTE",
        desc: "Pengenalan dunia keamanan siber, tren ancaman global, jenis serangan siber, pentingnya data privacy, serta gambaran karir dan peluang di bidang keamanan digital.",
        skills: ["Cybersecurity Basics", "Data Privacy", "Cyber Threats", "Digital Safety", "Career in Security"],
        link: "https://drive.google.com/file/d/1s83qL_nULUrz8d7LTuZ3vsq-v30G5CTE/view"
    },
    {
        id: "vm",
        title: "Virtual Machine Fundamental",
        issuer: "VMware / NetAcad",
        issuerIcon: "fa-solid fa-building",
        category: "Virtualisasi",
        year: "2024",
        color: "linear-gradient(135deg,#22c55e,#15803d)",
        icon: "fa-solid fa-server",
        image: "https://lh3.googleusercontent.com/d/1P_C5pXAZzqlPVCFl_quM3coysfPBfzs7",
        desc: "Sertifikat dasar virtualisasi yang mencakup konsep virtual machine, instalasi dan konfigurasi VirtualBox/VMware, manajemen snapshot, jaringan virtual, dan penggunaan VM untuk lab praktik.",
        skills: ["VirtualBox", "VMware", "Virtualization", "Snapshot", "Virtual Networking", "VM Management"],
        link: "https://drive.google.com/file/d/1P_C5pXAZzqlPVCFl_quM3coysfPBfzs7/view"
    }
];

// ============================================================
// RENDER DETAIL PAGE
// ============================================================
(function renderDetail() {
    const wrap = document.getElementById("certDetailWrap");
    if (!wrap) return;

    // Get id from URL query string
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const cert = CERTIFICATES.find(function(c) { return c.id === id; });

    if (!cert) {
        document.getElementById("certTitle").textContent = "Sertifikat tidak ditemukan";
        return;
    }

    // Update page title
    document.title = "Rajib | " + cert.title;

    // Badge
    document.getElementById("certBadge").innerHTML =
        '<span class="cert-detail-cat" style="background:' + cert.color + '">' +
        '<i class="' + cert.icon + '"></i> ' + cert.category + '</span>';

    // Issuer
    document.getElementById("certIssuer").innerHTML =
        '<i class="' + cert.issuerIcon + '"></i> ' + cert.issuer;

    // Title & desc
    document.getElementById("certTitle").textContent = cert.title;
    document.getElementById("certDesc").textContent = cert.desc;

    // Image
    const img = document.getElementById("certImg");
    img.src = cert.image;
    img.alt = cert.title;

    // Image background color
    document.getElementById("certImgBg").style.background = cert.color;

    // Download / view button
    document.getElementById("certDownloadBtn").href = cert.image;
    document.getElementById("certViewBtn").href = cert.link;

    // Meta
    document.getElementById("certMeta").innerHTML =
        '<span><i class="fa-regular fa-calendar"></i> ' + cert.year + '</span>' +
        '<span><i class="fa-solid fa-building"></i> ' + cert.issuer + '</span>' +
        '<span><i class="fa-solid fa-tag"></i> ' + cert.category + '</span>';

    // Skills tags
    var skillsHtml = '<div class="cert-skills-label">Materi yang Dipelajari</div><div class="cert-skills-tags">';
    cert.skills.forEach(function(s) {
        skillsHtml += '<span class="cert-skill-tag">' + s + '</span>';
    });
    skillsHtml += '</div>';
    document.getElementById("certSkills").innerHTML = skillsHtml;

    // Other certs
    var others = CERTIFICATES.filter(function(c) { return c.id !== id; });
    var otherHtml = '';
    others.forEach(function(c) {
        otherHtml +=
            '<a href="certificate-detail.html?id=' + c.id + '" class="cert-other-card" data-page>' +
            '  <div class="cert-other-icon" style="background:' + c.color + '">' +
            '    <i class="' + c.icon + '"></i>' +
            '  </div>' +
            '  <div>' +
            '    <div class="cert-other-name">' + c.title + '</div>' +
            '    <div class="cert-other-issuer">' + c.issuer + ' · ' + c.year + '</div>' +
            '  </div>' +
            '  <i class="fa-solid fa-arrow-right cert-other-arrow"></i>' +
            '</a>';
    });
    document.getElementById("certOtherGrid").innerHTML = otherHtml;

    // Re-attach data-page listeners for dynamically added links
    document.querySelectorAll("[data-page]").forEach(function(link) {
        if (link.dataset.pageAttached) return;
        link.dataset.pageAttached = "1";
        link.addEventListener("click", function(e) {
            var href = this.getAttribute("href");
            if (!href || href === "#" || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
            e.preventDefault();
            var ov = document.getElementById("pageOverlay");
            if (ov) {
                ov.classList.add("show");
                setTimeout(function() { window.location.href = href; }, 380);
            } else {
                window.location.href = href;
            }
        });
    });
})();
