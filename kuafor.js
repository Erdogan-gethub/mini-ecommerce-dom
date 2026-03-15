const liste = document.getElementById("panelListe");

function randevulariGoster(){

liste.innerHTML = "";

let randevular = JSON.parse(localStorage.getItem("randevular")) || [];

/* RANDEVULARI TARİH VE SAATE GÖRE SIRALA */

randevular.sort(function(a,b){

const aZaman = new Date(a.tarih + "T" + a.saat);
const bZaman = new Date(b.tarih + "T" + b.saat);

return aZaman - bZaman;

});

/* RANDEVULARI EKRANA YAZDIR */

randevular.forEach(function(r,index){

const div = document.createElement("div");

div.classList.add("randevu-card");

div.innerHTML = `
<strong>${r.tarih} - ${r.saat}</strong><br>

${r.adSoyad}<br>

📞 ${r.telefon}

<button onclick="sil(${index})">Sil</button>

<hr>
`;

liste.appendChild(div);

});

}

/* RANDEVU SİL */

function sil(index){

let randevular = JSON.parse(localStorage.getItem("randevular")) || [];

randevular.splice(index,1);

localStorage.setItem("randevular", JSON.stringify(randevular));

randevulariGoster();

}

/* SAYFA AÇILINCA */

randevulariGoster();

/* BAŞKA SEKMEDEN RANDEVU EKLENİRSE OTOMATİK GÜNCELLE */

window.addEventListener("storage", function(event){

if(event.key === "randevular"){

randevulariGoster();

}

});