function toastMesaj(mesaj){

const toast = document.getElementById("toast");

toast.innerText = mesaj;
toast.classList.add("show");

setTimeout(()=>{
toast.classList.remove("show");
},3000);

}

const form = document.getElementById("randevuForm");
const liste = document.getElementById("randevuListesi");
const telefonInput = document.getElementById("telefon");


/* TELEFON FORMATLAMA */

telefonInput.addEventListener("input", () => {

let numara = telefonInput.value.replace(/\D/g,"").slice(0,11);

let formatli = "";

if(numara.length > 0) formatli = numara.slice(0,4);
if(numara.length >= 5) formatli += " " + numara.slice(4,7);
if(numara.length >= 8) formatli += " " + numara.slice(7,9);
if(numara.length >= 10) formatli += " " + numara.slice(9,11);

telefonInput.value = formatli;

});


/* TELEFON MASKELEME */

function telefonMaskele(telefon){
return telefon.substring(0,4) + " **** **";
}


/* LOCALSTORAGE'DAN RANDEVU AL */

function randevuGetir(){
return JSON.parse(localStorage.getItem("randevular")) || [];
}


/* LOCALSTORAGE'A KAYDET */

function randevuKaydet(randevular){
localStorage.setItem("randevular", JSON.stringify(randevular));
}


/* GEÇMİŞ RANDEVULARI TEMİZLE */

function eskiRandevulariTemizle(){

let randevular = randevuGetir();

let bugun = new Date();
bugun.setHours(0,0,0,0);

let temiz = randevular.filter(r => {

let parca = r.tarih.split(".");
let randevuTarih = new Date(parca[2], parca[1]-1, parca[0]);

return randevuTarih >= bugun;

});

randevuKaydet(temiz);

}


/* RANDEVULARI GÖSTER */

function randevulariGoster(){

liste.innerHTML = "";

let randevular = randevuGetir();

randevular.forEach((r,index) => {

const div = document.createElement("div");

div.innerHTML = `
<span class="randevu-tarih">${r.tarih} - ${r.saat}</span>

<div class="randevu-satir">
<div class="randevu-bilgi">
<span class="randevu-isim">${r.adSoyad}</span>
<span class="randevu-telefon">${telefonMaskele(r.telefon)}</span>
</div>

<button class="sil-btn" onclick="silRandevu(${index})">Sil</button>
</div>

<hr>
`;

liste.appendChild(div);

});

}


/* RANDEVU SİL */

function silRandevu(index){

let randevular = randevuGetir();

randevular.splice(index,1);

randevuKaydet(randevular);

randevulariGoster();

}


/* FORM GÖNDERME */

form.addEventListener("submit", (e) => {

e.preventDefault();

const adSoyad = document.getElementById("adsoyad").value.trim();
const telefon = document.getElementById("telefon").value;
const tarih = document.getElementById("tarih").value;
const saat = document.getElementById("saat").value;

if(!adSoyad || !telefon || !tarih || !saat){

alert("Lütfen tüm alanları doldurunuz");
return;

}

let randevular = randevuGetir();


/* AYNI SAAT DOLU MU */

let doluMu = randevular.find(r => r.tarih === tarih && r.saat === saat);

if(doluMu){

toastMesaj("Bu saat dolu, başka saat seçiniz");
return;

}


/* YENİ RANDEVU */

randevular.push({
adSoyad,
telefon,
tarih,
saat
});

randevuKaydet(randevular);

form.reset();

randevulariGoster();

});


/* SAYFA AÇILINCA */

eskiRandevulariTemizle();
randevulariGoster();


/* OTOMATİK KONTROL */

setInterval(() => {

eskiRandevulariTemizle();
randevulariGoster();

},60000);
