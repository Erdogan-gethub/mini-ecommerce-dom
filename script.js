const cards = document.querySelectorAll(".card");

cards.forEach(function(card){

  let adet = 0;

  const btn = card.querySelector(".btn");
  const arti = card.querySelector(".arti");
  const eksi = card.querySelector(".eksi");
  const sil = card.querySelector(".sil");
  const count = card.querySelector(".count");

  btn.addEventListener("click", function(){
    if(adet === 0){
      adet = 1;
      count.textContent = adet;
    }
  });

  arti.addEventListener("click", function(){
    adet++;
    count.textContent = adet;
  });

  eksi.addEventListener("click", function(){
    if(adet > 0){
      adet--;
      count.textContent = adet;
    }
  });

  sil.addEventListener("click", function(){
    adet = 0;
    count.textContent = adet;
  });

});
