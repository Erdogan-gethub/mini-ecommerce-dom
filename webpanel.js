document.addEventListener("DOMContentLoaded", function(){
    const liste = document.getElementById("panelListe");
    const istatistik = document.getElementById("istatistik");
    const bosMesaj = document.getElementById("bosMesaj");
    const filterSelect = document.getElementById("kuaforFilter");

    function randevulariAl(){
        return JSON.parse(localStorage.getItem("tumRandevular")) || [];
    }

    // 🔥 TELEFON FORMAT
    function formatTel(tel) {
        tel = tel.replace(/\D/g, "");
        if (tel.length === 11) {
            return `${tel.slice(0,4)} ${tel.slice(4,7)} ${tel.slice(7,9)} ${tel.slice(9,11)}`;
        }
        return tel;
    }

    // 🔥 İSİM FORMAT
    function formatIsim(isim) {
        return isim
            .toLowerCase()
            .split(" ")
            .map(kelime => kelime.charAt(0).toUpperCase() + kelime.slice(1))
            .join(" ");
    }

    function istatistikGoster(randevular){
        const bugunStr = new Date().toLocaleDateString('tr-TR'); 
        const bugunSayisi = randevular.filter(r => r.tarih === bugunStr).length;
        const toplam = randevular.length;
        istatistik.innerText = `Bugün: ${bugunSayisi} randevu | Toplam: ${toplam} randevu`;
    }

    function randevulariGoster(){
        liste.innerHTML = "";
        let tumRandevular = randevulariAl(); 

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
            tumRandevular = guncelRandevular;
        }

        istatistikGoster(tumRandevular);

        let filtrelenmis = tumRandevular;
        const secilenKuafor = filterSelect.value;

        if(secilenKuafor) {
            filtrelenmis = filtrelenmis.filter(r => r.kuafor == secilenKuafor);
        }

        filtrelenmis.sort((a,b) => a.saat.localeCompare(b.saat));

        if(filtrelenmis.length === 0){
            bosMesaj.style.display = "block";
            return;
        } else {
            bosMesaj.style.display = "none";
        }

        filtrelenmis.forEach((r, index) => {
            const div = document.createElement("div");
            div.classList.add("randevu-card");

            div.innerHTML = `
                <div class="kuafor">💺 Kuaför ${r.kuafor}</div>
                <strong>⏰ ${r.saat}</strong>
                <div class="isim">👤 ${formatIsim(r.ad)}</div>
                <div class="hizmet">✂ ${r.hizmet}</div>
                <div class="randevu-alt">
                    <a href="tel:${r.tel}" class="telefon">📞 ${formatTel(r.tel)}</a>
                    <button onclick="tamamenSil(${index})">Sil</button>
                </div>
            `;
            liste.appendChild(div);
        });
    }

    window.tamamenSil = function(index) {
        let randevular = randevulariAl();
        randevular.splice(index, 1);
        localStorage.setItem("tumRandevular", JSON.stringify(randevular));
        randevulariGoster();
    };

    filterSelect.addEventListener("change", randevulariGoster);
    randevulariGoster();

    window.addEventListener("storage", (e) => {
        if(e.key === "tumRandevular") randevulariGoster();
    });
});