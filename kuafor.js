const liste = document.getElementById("panelListe");
const istatistik = document.getElementById("istatistik");
const bosMesaj = document.getElementById("bosMesaj");


/* RANDEVULARI LOCALSTORAGE'DAN AL */

function randevulariAl(){
    return JSON.parse(localStorage.getItem("randevular")) || [];
}


/* İSTATİSTİK GÖSTER */

function istatistikGoster(randevular){

    const bugun = new Date().toLocaleDateString("tr-TR");

    const bugunSayisi = randevular.filter(r => r.tarih === bugun).length;

    const toplam = randevular.length;

    istatistik.innerText = `Bugün: ${bugunSayisi} randevu | Toplam: ${toplam} randevu`;

}


/* RANDEVULARI EKRANA YAZ */

function randevulariGoster(){

    liste.innerHTML = "";

    const randevular = randevulariAl();

    istatistikGoster(randevular);


    /* RANDEVU YOKSA */

    if(randevular.length === 0){
        bosMesaj.style.display = "block";
        return;
    } else {
        bosMesaj.style.display = "none";
    }


    /* TARİH + SAATE GÖRE SIRALA */

    randevular.sort((a,b)=>{

        const aZaman = new Date(a.tarih + " " + a.saat);
        const bZaman = new Date(b.tarih + " " + b.saat);

        return aZaman - bZaman;

    });


    const bugun = new Date().toLocaleDateString("tr-TR");


    /* RANDEVULARI OLUŞTUR */

    randevular.forEach((r,index)=>{

        const div = document.createElement("div");

        div.classList.add("randevu-card");


        /* BUGÜNKÜ RANDEVU VURGUSU */

        if(r.tarih === bugun){
            div.style.background = "#fff3cd";
        }


        const telefonLink = r.telefon.replace(/\s/g,'');


        div.innerHTML = `

        <strong>${r.tarih} - ${r.saat}</strong>

        <div class="isim">${r.adSoyad}</div>

        <div class="hizmet">${r.hizmet}</div>

        <div class="randevu-alt">
            📞 <a href="tel:${telefonLink}" class="telefon">${r.telefon}</a>
            <button onclick="sil(${index})">Sil</button>
        </div>

        `;

        liste.appendChild(div);

    });

}


/* RANDEVU SİL */

function sil(index){

    const randevular = randevulariAl();

    randevular.splice(index,1);

    localStorage.setItem("randevular", JSON.stringify(randevular));

    randevulariGoster();

}


/* SAYFA YÜKLENİNCE */

document.addEventListener("DOMContentLoaded", ()=>{

    randevulariGoster();

});


/* BAŞKA SEKMEDEN EKLENİRSE GÜNCELLE */

window.addEventListener("storage", (event)=>{

    if(event.key === "randevular"){
        randevulariGoster();
    }

});