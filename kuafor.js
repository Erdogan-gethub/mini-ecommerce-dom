const liste = document.getElementById("panelListe");


/* LOCALSTORAGE'DAN RANDEVULARI AL */

function randevulariAl(){
return JSON.parse(localStorage.getItem("randevular")) || [];
}


/* RANDEVULARI GÖSTER */

function randevulariGoster(){

liste.innerHTML="";

let randevular=randevulariAl();


/* TARİH VE SAATE GÖRE SIRALA */

randevular.sort((a,b)=>{

let aZaman=new Date(a.tarih+" "+a.saat);
let bZaman=new Date(b.tarih+" "+b.saat);

return aZaman-bZaman;

});


/* EKRANA YAZ */

randevular.forEach((r,index)=>{

const div=document.createElement("div");

div.classList.add("randevu-card");

const telefon=r.telefon.replace(/\s/g,'');

div.innerHTML=`

<strong>${r.tarih} - ${r.saat}</strong>

<div style="margin-top:5px">

${r.adSoyad}<br>

${r.hizmet}<br>

📞 <a href="tel:${telefon}" class="telefon">${r.telefon}</a>

</div>

<button onclick="sil(${index})">Sil</button>

<hr>

`;

liste.appendChild(div);

});

}


/* RANDEVU SİL */

function sil(index){

let randevular=randevulariAl();

randevular.splice(index,1);

localStorage.setItem("randevular",JSON.stringify(randevular));

randevulariGoster();

}


/* SAYFA AÇILINCA */

document.addEventListener("DOMContentLoaded",()=>{

randevulariGoster();

});


/* BAŞKA SEKMEDEN RANDEVU EKLENİRSE GÜNCELLE */

window.addEventListener("storage",(event)=>{

if(event.key==="randevular"){
randevulariGoster();
}

});