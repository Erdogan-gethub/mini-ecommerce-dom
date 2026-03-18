document.addEventListener("DOMContentLoaded", function(){

const liste = document.getElementById("panelListe");
const istatistik = document.getElementById("istatistik");
const bosMesaj = document.getElementById("bosMesaj");
const filterSelect = document.getElementById("kuaforFilter"); // 🔥 EKLENDİ


/* STORAGE */
function randevulariAl(){
    return JSON.parse(localStorage.getItem("randevular")) || [];
}

function randevuKaydet(data){
    localStorage.setItem("randevular", JSON.stringify(data));
}


/* TARİH FORMAT */
function tarihFormatla(tarih){
    if(!tarih) return "";
    const [gun, ay, yil] = tarih.split(".");
    return `${gun.padStart(2,"0")}.${ay.padStart(2,"0")}.${yil}`;
}


/* TARİH PARSE */
function parseTarih(tarih, saat){
    const [gun, ay, yil] = tarih.split(".");
    return new Date(`${yil}-${ay}-${gun} ${saat}`);
}


/* KUAFÖR ADI */
function kuaforAdi(k){
    if(!k) return "";
    if(k.includes("Kuaför")) return k;
    return `Kuaför ${k}`;
}


/* İSTATİSTİK */
function istatistikGoster(randevular){

    const bugun = tarihFormatla(new Date().toLocaleDateString("tr-TR"));

    const bugunSayisi = randevular.filter(r => r.tarih === bugun).length;

    const toplam = randevular.length;

    istatistik.innerText = `Bugün: ${bugunSayisi} randevu | Toplam: ${toplam} randevu`;
}


/* GÖSTER */
function randevulariGoster(){

    liste.innerHTML = "";

    let randevular = randevulariAl();

    /* 🔥 FİLTRE */
    const secilenKuafor = filterSelect.value;

    if(secilenKuafor){
        randevular = randevular.filter(r => r.kuafor == secilenKuafor);
    }

    istatistikGoster(randevular);

    if(randevular.length === 0){
        bosMesaj.style.display = "block";
        return;
    } else {
        bosMesaj.style.display = "none";
    }

    /* SIRALAMA */
    randevular.sort((a,b)=>{
        return parseTarih(a.tarih, a.saat) - parseTarih(b.tarih, b.saat);
    });

    const bugun = tarihFormatla(new Date().toLocaleDateString("tr-TR"));

    randevular.forEach((r,index)=>{

        const div = document.createElement("div");
        div.classList.add("randevu-card");

        /* BUGÜN VURGUSU */
        if(r.tarih === bugun){
            div.style.background = "#fff3cd";
        }

        const telefonLink = r.telefon.replace(/\s/g,'');

        div.innerHTML = `
            <strong>${r.tarih} - ${r.saat}</strong>

            <div class="kuafor">👤 ${kuaforAdi(r.kuafor)}</div>

            <div class="isim">${r.adSoyad}</div>

            <div class="hizmet">${r.hizmet}</div>

            <div class="randevu-alt">
                <a href="tel:${telefonLink}" class="telefon">
                    📞 ${r.telefon}
                </a>

                <button onclick="sil(${index})">Sil</button>
            </div>
        `;

        liste.appendChild(div);
    });
}


/* SİL */
window.sil = function(index){
    const randevular = randevulariAl();
    randevular.splice(index,1);
    randevuKaydet(randevular);
    randevulariGoster();
}


/* 🔥 FİLTRE EVENT */
filterSelect.addEventListener("change", randevulariGoster);


/* LOAD */
randevulariGoster();


/* SENKRON */
window.addEventListener("storage", (event)=>{
    if(event.key === "randevular"){
        randevulariGoster();
    }
});

});