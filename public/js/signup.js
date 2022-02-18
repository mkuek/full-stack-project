const characterImages = document.querySelectorAll(".image-container img");

characterImages.forEach((character) => {
  character.addEventListener("click", (e) => {
    console.log("clicked");
  });
});
