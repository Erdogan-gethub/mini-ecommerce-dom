const cards = document.querySelectorAll(".card");
const toplamSpan = document.getElementById("toplam");

let genelToplam = 0;

cards.forEach(function(card){

    let adet = 0;

    const btn = card.querySelector(".btn");
    const arti = card.querySelector(".arti");
    const eksi = card.querySelector(".eksi");
    const sil = card.querySelector(".sil");
    const count = card.querySelector(".count");
    const priceText = card.querySelector("p").textContent;

    const fiyat = parseInt(priceText.replace("₺","").replace(".",""));

    function toplamGuncelle(){
        toplamSpan.textContent = genelToplam;
    }

    btn.addEventListener("click", function(){
        adet++;
        count.textContent = adet;
        genelToplam += fiyat;
        toplamGuncelle();
    });

    arti.addEventListener("click", function(){
        adet++;
        count.textContent = adet;
        genelToplam += fiyat;
        toplamGuncelle();
    });

    eksi.addEventListener("click", function(){
        if(adet > 0){
            adet--;
            count.textContent = adet;
            genelToplam -= fiyat;
            toplamGuncelle();
        }
    });

    sil.addEventListener("click", function(){
        genelToplam -= adet * fiyat;
        adet = 0;
        count.textContent = adet;
        toplamGuncelle();
    });

});
