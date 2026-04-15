document.addEventListener("DOMContentLoaded", function () {
    const panel = document.querySelector(".randevu-panel");
    // Seçiciyi hem ID hem class kontrolü yapacak şekilde sağlama alıyoruz
    const panelAcBtn = document.getElementById("panelAcBtn") || document.querySelector(".cta");
    const form = document.getElementById("randevuForm");
    const saatSelect = document.getElementById("saat");
    const hizmetSelect = document.getElementById("hizmet");
    const kuaforSelect = document.getElementById("kuafor");
    const tarihInput = document.getElementById("tarih");
    const randevuListesi = document.getElementById("randevuListesi");

    // --- 1. PANEL AÇMA/KAPAMA MANTIĞI ---
    const panelDurumu = localStorage.getItem("panelDurumu");
    if (panel && panelDurumu === "acik") {
        panel.classList.add("active");
        panel.style.display = "block";
        const reklam = document.getElementById("reklamAlani");
        if (reklam) reklam.style.display = "none";
    }

    if (panelAcBtn && panel) {
        panelAcBtn.addEventListener("click", function (e) {
            e.preventDefault(); // Sayfa atlamasını engelle
            
            panel.classList.toggle("active");
            const isOpen = panel.classList.contains("active");
            
            // Paneli göster/gizle
            panel.style.display = isOpen ? "block" : "none";
            
            // Reklam alanını gizle/göster
            const reklam = document.getElementById("reklamAlani");
            if (reklam) {
                reklam.style.display = isOpen ? "none" : "block";
            }

            // Durumu hafızaya al ve sayfayı forma kaydır
            localStorage.setItem("panelDurumu", isOpen ? "acik" : "kapali");
            if (isOpen) {
                panel.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 2. SAATLERİ ÜRET ---
    function saatleriGuncelle() {
        if (!saatSelect || !hizmetSelect.value || !kuaforSelect.value || !tarihInput.value) {
            saatSelect.disabled = true;
            saatSelect.innerHTML = '<option value="">Lütfen seçimleri tamamlayın</option>';
            return;
        }

        saatSelect.disabled = false;
        const secilenSure = parseInt(hizmetSelect.value); 
        const secilenKuafor = kuaforSelect.value;
        const secilenTarih = tarihInput.value;

        saatSelect.innerHTML = '<option value="">Saat Seçiniz</option>';

        const tumRandevular = JSON.parse(localStorage.getItem("tumRandevular")) || [];
        const doluOlanlar = tumRandevular.filter(r => r.kuafor === secilenKuafor && r.tarih === secilenTarih);

        for (let i = 9 * 60; i <= 18 * 60 - secilenSure; i += 15) {
            let baslangicDk = i;
            let bitisDk = i + secilenSure;

            const cakismaVar = doluOlanlar.some(r => {
                let rBas = saateDonustur(r.saat);
                let rBit = rBas + parseInt(r.sure);
                return (baslangicDk < rBit && bitisDk > rBas);
            });

            if (!cakismaVar) {
                let s = Math.floor(i / 60);
                let d = i % 60;
                let formatliSaat = `${String(s).padStart(2, '0')}:${String(d).padStart(2, '0')}`;
                
                const option = document.createElement("option");
                option.value = formatliSaat;
                option.textContent = formatliSaat;
                saatSelect.appendChild(option);
            }
        }
    }

    // --- 3. PROGRAMI GÜNCELLE ---
    function programiGuncelle() {
        if (!randevuListesi) return;
        let tumRandevular = JSON.parse(localStorage.getItem("tumRandevular")) || [];
        
        const bugun = new Date();
        bugun.setHours(0, 0, 0, 0);

        const guncelRandevular = tumRandevular.filter(r => {
            const parcalar = r.tarih.split('.');
            const randevuTarihi = new Date(parcalar[2], parcalar[1] - 1, parcalar[0]);
            randevuTarihi.setHours(0, 0, 0, 0);
            return randevuTarihi >= bugun;
        });

        if (guncelRandevular.length !== tumRandevular.length) {
            localStorage.setItem("tumRandevular", JSON.stringify(guncelRandevular));
        }
        
        tumRandevular = guncelRandevular;
        randevuListesi.innerHTML = "";
        
        if (tumRandevular.length === 0) {
            randevuListesi.innerHTML = "<p style='padding:10px; color:#666; font-size:12px; width:100%; text-align:center;'>Henüz randevu yok.</p>";
            return;
        }

        tumRandevular.sort((a, b) => a.saat.localeCompare(b.saat));

        tumRandevular.forEach(r => {
            const div = document.createElement("div");
            div.style.cssText = `background:#fff; padding:6px 2px; border-radius:8px; border-left:4px solid #d9534f; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center; width: calc(50% - 5px); box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; margin-bottom:5px;`;
            
            div.innerHTML = `
                <div style="font-weight: 700; color: #777; font-size: 9px; text-transform: uppercase;">Kuaför ${r.kuafor}</div>
                <div style="color: #888; font-size: 10px; margin: 2px 0;">📅 ${r.tarih}</div>
                <div style="font-size: 15px; font-weight: 800; color: #111; margin: 1px 0;">${r.saat}</div>
                <div style="color: #d9534f; font-weight: 900; font-size: 10px; letter-spacing: 1px; border-top: 1px solid #f5f5f5; padding-top: 2px;">DOLU</div>
            `;
            randevuListesi.appendChild(div);
        });
    }

    // --- 4. ETKİLEŞİMLER ---
[hizmetSelect, kuaforSelect, tarihInput].forEach(el => {
    if(el) el.addEventListener("change", saatleriGuncelle);
});

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const secilenSaat = saatSelect.value;
        if (!secilenSaat) {
            alert("Lütfen bir saat seçin!");
            return;
        }

        // 🔥 INPUT AL
        let adInput = document.getElementById("adsoyad").value.trim();
        let telInput = document.getElementById("telefon").value;

        // 🔥 TELEFON TEMİZLE
        let temizTel = telInput.replace(/\D/g, "");

        // ❌ TELEFON KONTROL (10 veya 11 haneli)
        if (
            !(temizTel.length === 11 && temizTel.startsWith("05")) &&
            !(temizTel.length === 10 && temizTel.startsWith("5"))
        ) {
            alert("Telefon numarası geçersiz! (05xx xxx xx xx şeklinde olmalı)");
            return;
        }

        // 🔥 10 haneliyse başına 0 ekle
        if (temizTel.length === 10) {
            temizTel = "0" + temizTel;
        }

        // ❌ İSİM KONTROL
        if (adInput.length < 2) {
            alert("Lütfen geçerli bir isim girin!");
            return;
        }

        // 🔥 İSİM FORMATLA
        adInput = adInput
            .toLowerCase()
            .split(" ")
            .map(k => k.charAt(0).toUpperCase() + k.slice(1))
            .join(" ");

        // ✅ YENİ OBJE
        const yeniRandevu = {
            ad: adInput,
            tel: temizTel,
            tarih: tarihInput.value,
            kuafor: kuaforSelect.value,
            hizmet: hizmetSelect.options[hizmetSelect.selectedIndex].text,
            sure: hizmetSelect.value,
            saat: secilenSaat
        };

        // 💾 KAYDET
        const tumRandevular = JSON.parse(localStorage.getItem("tumRandevular")) || [];
        tumRandevular.push(yeniRandevu);
        localStorage.setItem("tumRandevular", JSON.stringify(tumRandevular));

        // 🔄 GÜNCELLE
        programiGuncelle();
        form.reset();
        saatleriGuncelle();
    });
}

    function saateDonustur(saatStr) {
        const [h, m] = saatStr.split(":").map(Number);
        return h * 60 + m;
    }

    // Flatpickr Kurulumu
    if (document.getElementById("tarih")) {
        flatpickr("#tarih", {
            locale: "tr",
            dateFormat: "d.m.Y",
            minDate: "today",
            onChange: function() { saatleriGuncelle(); }
        });
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'tumRandevular') {
            programiGuncelle();
        }
    });

    programiGuncelle();
   // --- SLIDER ---
const sliders = document.querySelectorAll(".slider");

sliders.forEach(slider => {
    const images = slider.querySelectorAll("img");
    let index = 0;

    images[0].classList.add("active");

    setInterval(() => {
        images[index].classList.remove("active");
        index = (index + 1) % images.length;
        images[index].classList.add("active");
    }, 2500);
});
// URL'de #randevu-formu varsa paneli aç
if (window.location.hash === "#randevu-formu") {
    const panel = document.getElementById("randevu-formu");
    const reklam = document.getElementById("reklamAlani");

    if (panel) {
        panel.style.display = "block";
        panel.classList.add("active");
        panel.scrollIntoView({ behavior: "smooth" });
    }

    if (reklam) {
        reklam.style.display = "none";
    }
} 
    
});
