import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, ListFlowable, ListItem
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def build_pdf(filename="Dhika_Satria_Khrisna_CV_Tech_ATS.pdf"):
    # Page setup
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=32,
        rightMargin=32,
        topMargin=26,
        bottomMargin=26
    )

    story = []
    
    # Custom styles
    styles = getSampleStyleSheet()
    
    primary_color = colors.HexColor("#0f172a") # Dark Slate Navy
    accent_color = colors.HexColor("#0284c7")  # Bright Tech Blue
    text_color = colors.HexColor("#334155")    # Slate 700
    subtext_color = colors.HexColor("#475569") # Slate 600
    border_color = colors.HexColor("#cbd5e1")  # Slate 300

    name_style = ParagraphStyle(
        'NameStyle',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=21,
        textColor=primary_color,
        alignment=TA_CENTER,
        spaceAfter=2
    )

    title_style = ParagraphStyle(
        'TitleStyle',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=accent_color,
        alignment=TA_CENTER,
        spaceAfter=4
    )

    contact_style = ParagraphStyle(
        'ContactStyle',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=subtext_color,
        alignment=TA_CENTER,
        spaceAfter=6
    )

    section_header_style = ParagraphStyle(
        'SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=primary_color,
        spaceBefore=5,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=8.8,
        leading=11.8,
        textColor=text_color,
        alignment=TA_JUSTIFY,
        spaceAfter=3
    )

    bold_body_style = ParagraphStyle(
        'BoldBody',
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=11.8,
        textColor=primary_color
    )

    item_title_style = ParagraphStyle(
        'ItemTitle',
        fontName='Helvetica-Bold',
        fontSize=9.3,
        leading=12,
        textColor=primary_color
    )

    item_right_style = ParagraphStyle(
        'ItemRight',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=subtext_color,
        alignment=2 # Right aligned
    )

    tech_style = ParagraphStyle(
        'TechStyle',
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=10.5,
        textColor=accent_color,
        spaceAfter=2
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.2,
        textColor=text_color,
        alignment=TA_JUSTIFY,
        leftIndent=10,
        firstLineIndent=-10,
        spaceAfter=2
    )

    # 1. HEADER
    story.append(Paragraph("DHIKA SATRIA KHRISNA", name_style))
    story.append(Paragraph("FULL-STACK DEVELOPER & AUTOMATION ENGINEER", title_style))
    
    contact_text = (
        "📍 Tangerang, Banten &nbsp;|&nbsp; "
        "📞 (+62) 896-5449-9818 &nbsp;|&nbsp; "
        "✉️ <a href='mailto:dhikasatria40@gmail.com' color='#0284c7'>dhikasatria40@gmail.com</a> &nbsp;|&nbsp; "
        "🌐 <a href='https://riellybooth.my.id' color='#0284c7'>Portfolio (riellybooth.my.id)</a> &nbsp;|&nbsp; "
        "🐙 <a href='https://github.com/dhikasatria' color='#0284c7'>GitHub</a>"
    )
    story.append(Paragraph(contact_text, contact_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=1, spaceAfter=5))

    # 2. PROFESSIONAL SUMMARY
    story.append(Paragraph("PROFESSIONAL SUMMARY", section_header_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=border_color, spaceBefore=1, spaceAfter=4))
    summary_text = (
        "<b>Software Engineer & Automation Specialist</b> dengan rekam jejak membangun web app interaktif, arsitektur offline-first, "
        "bot otomatisasi berkecepatan tinggi, dan reverse engineering mobile API. Sukses merilis 3+ produk web live ke publik, "
        "memproses <b>15,000+ photo strip</b> via client-side Canvas rendering, serta mengotomatisasi <b>50,000+ akun & transaksi</b> "
        "dengan success rate 99.98%. Berpengalaman dalam integrasi hardware (printer thermal/kamera) dan mitigasi anti-bot bypass."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 3))

    # 3. TECHNICAL SKILLS
    story.append(Paragraph("TECHNICAL SKILLS", section_header_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=border_color, spaceBefore=1, spaceAfter=4))
    
    skills = [
        ("Languages", "TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3"),
        ("Frontend & UI", "React.js, Next.js, Tailwind CSS, HTML5 Canvas API, Web Camera API, Responsive UI"),
        ("Backend & APIs", "Node.js (Express), Python (FastAPI, httpx, curl_cffi), RESTful API, WhatsApp Cloud API, WebSockets"),
        ("Databases", "PostgreSQL, MySQL, Redis, SQLite, IndexedDB (Offline-First Storage)"),
        ("Automation & RE", "mitmproxy, Burp Suite, Frida, TLS/JA3 Fingerprinting, SOCKS5 Proxy Mesh, CAPTCHA Solver"),
        ("Hardware & DevOps", "ESC-POS Thermal Printer Integration, Dynamic QRIS Engine, Git/GitHub, Linux/Bash")
    ]
    for cat, items in skills:
        p = Paragraph(f"<b>• {cat}:</b> {items}", bullet_style)
        story.append(p)
    story.append(Spacer(1, 3))

    # 4. FEATURED TECHNICAL PROJECTS
    story.append(Paragraph("FEATURED TECHNICAL PROJECTS", section_header_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=border_color, spaceBefore=1, spaceAfter=4))

    # Project 1: RiellyBooth
    t1 = Table([
        [Paragraph("<b>RiellyBooth — Live Instant Web Photobooth Platform</b> (<a href='https://riellybooth.my.id' color='#0284c7'>riellybooth.my.id</a>)", item_title_style), 
         Paragraph("2024 – Sekarang", item_right_style)]
    ], colWidths=[420, 110])
    t1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 0)]))
    story.append(t1)
    story.append(Paragraph("<i>Tech: React, TypeScript, HTML5 Canvas API, Web Camera API, Tailwind CSS</i>", tech_style))
    story.append(Paragraph("• Merancang dan meluncurkan aplikasi web photobooth instan tanpa instalasi dengan dukungan kamera real-time dan live frame overlay kustom.", bullet_style))
    story.append(Paragraph("• Mengoptimalkan engine rendering Canvas untuk menghasilkan output photo strip beresolusi tinggi (HD) secara instan di sisi klien (client-side) tanpa beban latency server.", bullet_style))
    story.append(Paragraph("• Memproses lebih dari <b>15,000+ photo strip</b> siap unduh dengan user engagement dan retensi tinggi.", bullet_style))
    story.append(Spacer(1, 2))

    # Project 2: Rinci.in
    t2 = Table([
        [Paragraph("<b>Rinci.in — WhatsApp Bot Financial OS & Cashflow Management</b> (<a href='https://rinciin.my.id' color='#0284c7'>rinciin.my.id</a>)", item_title_style), 
         Paragraph("2024 – Sekarang", item_right_style)]
    ], colWidths=[420, 110])
    t2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 0)]))
    story.append(t2)
    story.append(Paragraph("<i>Tech: Next.js, TypeScript, Python, WhatsApp Cloud API, OCR Engine, PostgreSQL</i>", tech_style))
    story.append(Paragraph("• Membangun platform pencatatan keuangan otomatis berbasis bot WhatsApp dengan fitur parsing pesan teks natural, voice note, dan scan struk belanja via OCR.", bullet_style))
    story.append(Paragraph("• Mengembangkan dashboard analitik keuangan multi-dompet (BCA, GoPay, Tunai) dengan visualisasi grafik arus kas mingguan dan rekap P&L otomatis.", bullet_style))
    story.append(Spacer(1, 2))

    # Project 3: WarkopPOS
    t3 = Table([
        [Paragraph("<b>WarkopPOS V2.0 — Modern F&B Cashier & Table Management System</b>", item_title_style), 
         Paragraph("2024 – Sekarang", item_right_style)]
    ], colWidths=[420, 110])
    t3.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 0)]))
    story.append(t3)
    story.append(Paragraph("<i>Tech: React, TypeScript, Tailwind CSS, IndexedDB, ESC-POS Protocol, Dynamic QRIS</i>", tech_style))
    story.append(Paragraph("• Mengembangkan sistem kasir retail F&B dengan kapabilitas <b>offline-first</b> menggunakan IndexedDB, memastikan transaksi tetap lancar saat jaringan terputus.", bullet_style))
    story.append(Paragraph("• Mengintegrasikan protokol printer thermal ESC-POS untuk mencetak struk kasir dan tiket pesanan dapur secara simultan.", bullet_style))
    story.append(Paragraph("• Mengimplementasikan manajemen meja (0/9 table layout) dan QRIS dinamis, memangkas durasi antrean kasir hingga 40%.", bullet_style))
    story.append(Spacer(1, 2))

    # Project 4: High-Concurrency Bot
    t4 = Table([
        [Paragraph("<b>High-Concurrency Mobile APK & API Automation Engine</b>", item_title_style), 
         Paragraph("2024 – Sekarang", item_right_style)]
    ], colWidths=[420, 110])
    t4.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 0)]))
    story.append(t4)
    story.append(Paragraph("<i>Tech: Python, curl_cffi, mitmproxy, Frida, AsyncIO, SOCKS5 Proxy Mesh, TLS Spoofing</i>", tech_style))
    story.append(Paragraph("• Melakukan reverse engineering REST API internal aplikasi mobile Android dengan mem-bypass SSL Pinning (Frida) dan menganalisis payload traffic (mitmproxy).", bullet_style))
    story.append(Paragraph("• Membangun bot multi-threading berkecepatan tinggi dengan spoofing TLS/JA3 fingerprint (curl_cffi) dan rotasi IP residensial.", bullet_style))
    story.append(Paragraph("• Memproses <b>50,000+ akun terotomatisasi</b> dengan tingkat keberhasilan (success rate) <b>99.98%</b>.", bullet_style))
    story.append(Spacer(1, 3))

    # 5. PROFESSIONAL EXPERIENCE
    story.append(Paragraph("PROFESSIONAL EXPERIENCE", section_header_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=border_color, spaceBefore=1, spaceAfter=4))

    exp1 = Table([
        [Paragraph("<b>Lead Developer & Operations Automator</b> | <i>Riell Pedia</i>", item_title_style),
         Paragraph("2024 – Sekarang", item_right_style)]
    ], colWidths=[420, 110])
    exp1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 0)]))
    story.append(exp1)
    story.append(Paragraph("• Mengembangkan skrip Python untuk pemantauan inventaris real-time, sinkronisasi stok lintas marketplace, dan scraping harga supplier.", bullet_style))
    story.append(Paragraph("• Mengotomatisasi pencatatan transaksi harian dan laporan keuangan, memangkas waktu kerja manual operasional hingga 60%.", bullet_style))
    story.append(Spacer(1, 2))

    exp2 = Table([
        [Paragraph("<b>Operations & Digital Systems Specialist</b> | <i>Satria Music Studio</i>", item_title_style),
         Paragraph("2019 – 2024", item_right_style)]
    ], colWidths=[420, 110])
    exp2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 0)]))
    story.append(exp2)
    story.append(Paragraph("• Merancang alur reservasi dan pencatatan kas digital untuk operasional studio harian.", bullet_style))
    story.append(Paragraph("• Mengelola operasional harian dan inventaris instrumen, meningkatkan retensi dan kepuasan pelanggan hingga 30%.", bullet_style))
    story.append(Spacer(1, 3))

    # 6. EDUCATION
    story.append(Paragraph("EDUCATION", section_header_style))
    story.append(HRFlowable(width="100%", thickness=0.6, color=border_color, spaceBefore=1, spaceAfter=4))
    
    edu = Table([
        [Paragraph("<b>SMA Negeri 31 Kabupaten Tangerang</b> — Jurusan Ilmu Pengetahuan Sosial (IPS)", item_title_style),
         Paragraph("2022 – 2025", item_right_style)]
    ], colWidths=[420, 110])
    edu.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 1), ('TOPPADDING', (0,0), (-1,-1), 0)]))
    story.append(edu)

    doc.build(story)
    print(f"PDF built successfully: {os.path.abspath(filename)}")

if __name__ == "__main__":
    build_pdf()
