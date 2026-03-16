document.addEventListener("DOMContentLoaded", function(){

/* DOM */

const form = document.getElementById("randevuForm");
const liste = document.getElementById("randevuListesi");
const telefonInput = document.getElementById("telefon");
const hizmetSelect = document.getElementById("hizmet");
const saatSelect = document.getElementById("saat");


/* TOAST */

function toastMesaj(mesaj){

const toast = document.getElementById("toast");

toast.innerText = mesaj;
toast.classList.add("show");

setTimeout(()=>{
toast.classList.remove("show");
},3000);

}


/* TELEFON FORMAT */

telefonInput.addEventListener("input", () => {

let numara = telefonInput.value.replace(/\D/g,"").slice(0,11);

let format="";

if(numara.length>0) format=numara.slice(0,4);
if(numara.length>=5) format+=" "+numara.slice(4,7);
if(numara.length>=8) format+=" "+numara.slice(7,9);
if(numara.length>=10) format+=" "+numara.slice(9,11);

telefonInput.value=format;

});


function telefonMaskele(tel){
return tel.substring(0,4)+" **** **";
}


/* STORAGE */

function randevuGetir(){
return JSON.parse(localStorage.getItem("randevular")) || [];
}

function randevuKaydet(data){
localStorage.setItem("randevular",JSON.stringify(data));
}


/* SAAT -> DAKİKA */

function saatDakika(saat){

let p=saat.split(":");

return parseInt(p[0])*60+parseInt(p[1]);

}


/* HİZMET SÜRESİ */

function hizmetSuresi(text){

let sonuc=text.match(/\d+/);

return parseInt(sonuc[0]);

}


/* SAAT OLUŞTUR */

function saatleriOlustur(){

saatSelect.innerHTML="<option value=''>Saat Seçiniz</option>";

let baslangic=9*60;
let bitis=18*60;

while(baslangic<bitis){

let saat=Math.floor(baslangic/60).toString().padStart(2,"0");
let dk=(baslangic%60).toString().padStart(2,"0");

let zaman=`${saat}:${dk}`;

let option=document.createElement("option");

option.value=zaman;
option.textContent=zaman;

saatSelect.appendChild(option);

baslangic+=15;

}

}


/* HİZMET DEĞİŞİNCE */

hizmetSelect.addEventListener("change", saatleriOlustur);


/* RANDEVU GÖSTER */

function randevulariGoster(){

liste.innerHTML="";

let randevular=randevuGetir();

if(randevular.length===0){

liste.innerHTML="<p style='text-align:center;color:#666;'>Henüz randevu yok</p>";
return;

}

randevular.forEach((r,i)=>{

const div=document.createElement("div");

div.innerHTML=`
<span class="randevu-tarih">${r.tarih} - ${r.saat}</span>

<div class="randevu-satir">

<div class="randevu-bilgi">
<span class="randevu-isim">${r.adSoyad}</span>
<span>${r.hizmet}</span>
<span class="randevu-telefon">${telefonMaskele(r.telefon)}</span>
</div>

<button class="sil-btn" onclick="silRandevu(${i})">Sil</button>

</div>

<hr>
`;

liste.appendChild(div);

});

}


/* RANDEVU SİL */

window.silRandevu = function(i){

let r=randevuGetir();

r.splice(i,1);

randevuKaydet(r);

toastMesaj("Randevu silindi");

randevulariGoster();

}


/* FORM */

form.addEventListener("submit",(e)=>{

e.preventDefault();

const adSoyad=document.getElementById("adsoyad").value.trim();
const telefon=document.getElementById("telefon").value;
const tarih=document.getElementById("tarih").value;
const saat=saatSelect.value;

const hizmetText=hizmetSelect.options[hizmetSelect.selectedIndex].text;

if(!adSoyad || !telefon || !tarih || !saat){

toastMesaj("Tüm alanları doldurun");
return;

}

let randevular=randevuGetir();


/* ÇAKIŞMA KONTROLÜ */

let yeniBas=saatDakika(saat);
let yeniSure=parseInt(hizmetSelect.value);
let yeniBit=yeniBas+yeniSure;

let cakisma=randevular.some(r=>{

if(r.tarih!==tarih) return false;

let bas=saatDakika(r.saat);
let sure=hizmetSuresi(r.hizmet);
let bit=bas+sure;

return yeniBas<bit && yeniBit>bas;

});

if(cakisma){

toastMesaj("Bu saat aralığı dolu");
return;

}


/* EKLE */

randevular.push({

adSoyad,
telefon,
tarih,
saat,
hizmet:hizmetText

});

randevuKaydet(randevular);

toastMesaj("Randevu oluşturuldu");

form.reset();

saatleriOlustur();

randevulariGoster();

});


/* TAKVİM */

flatpickr("#tarih",{

locale:"tr",
dateFormat:"d.m.Y",
minDate:"today"

});


/* SAYFA */

saatleriOlustur();
randevulariGoster();

});
