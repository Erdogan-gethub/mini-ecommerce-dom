document.addEventListener("DOMContentLoaded", function(){

/* ================= DOM ================= */
const form = document.getElementById("randevuForm");
const liste = document.getElementById("randevuListesi");
const telefonInput = document.getElementById("telefon");
const hizmetSelect = document.getElementById("hizmet");
const saatSelect = document.getElementById("saat");
const kuaforSelect = document.getElementById("kuafor");
const tarihInput = document.getElementById("tarih");
const btn = document.getElementById("randevuBtn");


/* ================= TOAST ================= */
function toastMesaj(mesaj){
    const toast = document.getElementById("toast");
    toast.innerText = mesaj;
    toast.classList.add("show");
    setTimeout(()=> toast.classList.remove("show"),3000);
}


/* ================= TELEFON FORMAT ================= */
telefonInput.addEventListener("input", () => {

    let numara = telefonInput.value.replace(/\D/g,"").slice(0,11);

    let format="";
    if(numara.length>0) format=numara.slice(0,4);
    if(numara.length>=5) format+=" "+numara.slice(4,7);
    if(numara.length>=8) format+=" "+numara.slice(7,9);
    if(numara.length>=10) format+=" "+numara.slice(9,11);

    telefonInput.value=format;

    formKontrol();
});


function telefonMaskele(tel){
    return tel.substring(0,4)+" **** **";
}


/* ================= STORAGE ================= */
function randevuGetir(){
    return JSON.parse(localStorage.getItem("randevular")) || [];
}

function randevuKaydet(data){
    localStorage.setItem("randevular",JSON.stringify(data));
}


/* ================= SAAT HESAP ================= */
function saatDakika(saat){
    let [h,m]=saat.split(":");
    return parseInt(h)*60 + parseInt(m);
}

function hizmetSuresi(text){
    let sonuc=text.match(/\d+/);
    return parseInt(sonuc[0]);
}


/* ================= FORM KONTROL ================= */
function formKontrol(){

    const adSoyad = document.getElementById("adsoyad").value.trim();
    const telefon = telefonInput.value;
    const tarih = tarihInput.value;
    const saat = saatSelect.value;
    const kuafor = kuaforSelect.value;

    if(adSoyad && telefon && tarih && saat && kuafor){
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}


/* ================= SAAT OLUŞTUR ================= */
function saatleriOlustur(){

    if(!tarihInput.value || !kuaforSelect.value){
        saatSelect.innerHTML="<option value=''>Önce tarih ve kuaför seç</option>";
        formKontrol();
        return;
    }

    saatSelect.innerHTML="<option value=''>Saat Seçiniz</option>";

    let randevular=randevuGetir();
    let secilenTarih=tarihInput.value;
    let secilenKuafor=kuaforSelect.value;
    let hizmetSure = parseInt(hizmetSelect.value || 15);

    let baslangic=9*60;
    let bitis=18*60;

    while(baslangic < bitis){

        let saat=Math.floor(baslangic/60).toString().padStart(2,"0");
        let dk=(baslangic%60).toString().padStart(2,"0");

        let zaman=`${saat}:${dk}`;

        let doluMu = randevular.some(r => {

            if(r.tarih !== secilenTarih) return false;
            if(r.kuafor !== secilenKuafor) return false;

            let bas = saatDakika(r.saat);
            let sure = hizmetSuresi(r.hizmet);
            let bit = bas + sure;

            let yeniBas = saatDakika(zaman);
            let yeniBit = yeniBas + hizmetSure;

            return yeniBas < bit && yeniBit > bas;
        });

        if(!doluMu){
            let option=document.createElement("option");
            option.value=zaman;
            option.textContent=zaman;
            saatSelect.appendChild(option);
        }

        baslangic += hizmetSure;
    }

    if(saatSelect.options.length > 1){
        saatSelect.selectedIndex = 1;
    }

    formKontrol();
}


/* ================= RANDEVU GÖSTER ================= */
function randevulariGoster(){

    liste.innerHTML="";
    let randevular=randevuGetir();

    if(randevular.length===0){
        liste.innerHTML="<p style='text-align:center;color:#666;'>Henüz randevu yok</p>";
        return;
    }

    randevular.forEach((r,i)=>{

        const div=document.createElement("div");
        div.classList.add("randevu-item");

        div.innerHTML=`
        <span class="randevu-tarih">${r.tarih} - ${r.saat}</span>
        <span class="randevu-kuafor">👤 Kuaför ${r.kuafor}</span>

        <div class="randevu-satir">
            <div class="randevu-bilgi">
                <span class="randevu-isim">${r.adSoyad}</span>
                <span>${r.hizmet}</span>
                <span class="randevu-telefon">${telefonMaskele(r.telefon)}</span>
            </div>

            <button class="sil-btn" data-id="${i}">Sil</button>
        </div>
        `;

        liste.appendChild(div);
    });
}


/* ================= SİL ================= */
liste.addEventListener("click",(e)=>{
    if(e.target.classList.contains("sil-btn")){
        let i = e.target.getAttribute("data-id");

        let r=randevuGetir();
        r.splice(i,1);
        randevuKaydet(r);

        toastMesaj("Randevu silindi");

        randevulariGoster();
        saatleriOlustur();
    }
});


/* ================= FORM SUBMIT ================= */
form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const adSoyad=document.getElementById("adsoyad").value.trim();
    const telefon=telefonInput.value;
    const tarih=tarihInput.value;
    const saat=saatSelect.value;
    const kuafor=kuaforSelect.value;

    const hizmetText=hizmetSelect.options[hizmetSelect.selectedIndex].text;

    if(!adSoyad || !telefon || !tarih || !saat || !kuafor){
        toastMesaj("Tüm alanları doldurun");
        return;
    }

    let randevular=randevuGetir();

    let yeniBas=saatDakika(saat);
    let yeniSure=parseInt(hizmetSelect.value);
    let yeniBit=yeniBas+yeniSure;

    let cakisma=randevular.some(r=>{

        if(r.tarih!==tarih) return false;
        if(r.kuafor !== kuafor) return false;

        let bas=saatDakika(r.saat);
        let sure=hizmetSuresi(r.hizmet);
        let bit=bas+sure;

        return yeniBas<bit && yeniBit>bas;
    });

    if(cakisma){
        toastMesaj("Bu saat dolu");
        return;
    }

    randevular.push({
        adSoyad,
        telefon,
        tarih,
        saat,
        hizmet:hizmetText,
        kuafor
    });

    randevuKaydet(randevular);

    toastMesaj("Randevu oluşturuldu");

    form.reset();
    btn.disabled = true;
    saatSelect.innerHTML="<option value=''>Saat Seçiniz</option>";

    randevulariGoster();
});


/* ================= EVENTLER ================= */
form.addEventListener("input", formKontrol);
saatSelect.addEventListener("change", formKontrol);
hizmetSelect.addEventListener("change", saatleriOlustur);
kuaforSelect.addEventListener("change", saatleriOlustur);
tarihInput.addEventListener("change", saatleriOlustur);


/* ================= TAKVİM ================= */
flatpickr("#tarih",{
    locale:"tr",
    dateFormat:"d.m.Y",
    minDate:"today"
});


/* ================= BAŞLANGIÇ ================= */
randevulariGoster();

});