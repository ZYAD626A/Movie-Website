function aside() {
  let asidePart = document.getElementById("asidePart");
  let btnNav = document.getElementById("btnNav");
  let items = document.querySelectorAll("#asidePart div");

  btnNav.onclick = () => {
    asidePart.classList.toggle("hide");
    document.querySelector(".content").classList.toggle("fullScreen");
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((e) => e.classList.remove("active"));
      item.classList.add("active");
    });
  });
}
aside();

function selectContent() {
  let itemSelect = document.querySelectorAll(".item-select");
  let links = [
    "https://api.tvmaze.com/shows",
    "https://api.jikan.moe/v4/seasons/2018/spring?sfw",
  ];
  // movies
  // anime
  itemSelect.forEach((btn, index) => {
    btn.onclick = () => {
      content(links[index], btn.dataset.selcet);
    };
  });
}
selectContent();
async function content(url, type, defaultUrl) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error in taking the data");
    }
    const data = await response.json();

    let result = [];

    if (type === "anime") {
      result = data.data.map((ele) => {
        return {
          img: ele.images.jpg.large_image_url,
          year: ele.year,
          title: ele.title_english,
          url: ele.url,
          score: Math.floor(ele.score),
        };
      });

      sliderMovies(result);
    } else if (type === "movies") {
      result = data.map((ele) => {
        return {
          img: ele.image.original,
          year: ele.ended,
          title: ele.name,
          url: ele.url,
          genres: data.genres,
          score: Math.floor(ele.rating.average),
        };
      });

      sliderMovies(result);
    }
  } catch (error) {
    console.log(error);
  }
}

// default value
window.addEventListener("load", () => {
  content("https://api.jikan.moe/v4/seasons/2018/spring?sfw", "anime");
});
// print data
function sliderMovies(data) {
  let sliderCard = "";
  for (let i = 0; i < 15; i++) {
    sliderCard += `
<div class="card-movie d-flex align-items-end justify-content-center">
<div class="image-frame">
<img src="${data[i].img}" alt="${data[i].img}">
</div>
 
 <div class="content-card w-100 d-flex justify-content-between align-items-center p-3">
<div class="title">
<h3>${data[i].title}</h3>
<h3>${data[i].year}</h3>
<div class="div-stars">

 ${'<button class="active"><i class="fa-solid fa-star"></i></button>'.repeat(
   data[i].score,
 )}

 


</div>
</div>
<button class=" watch-btn" onclick = "window.location.href =' ${data[i].url}'">Watch</button>
</div>                   
</div>  
    `;
  }

  let contentResleaseSec = document.querySelector(".content-reslease-sec");
  contentResleaseSec.innerHTML = sliderCard;

  //   default scroll
  let step = 700;

  setInterval(function () {
    const maxScroll =
      contentResleaseSec.scrollWidth - contentResleaseSec.clientWidth;

    if (contentResleaseSec.scrollLeft >= maxScroll) {
      step = -700;
    } else if (contentResleaseSec.scrollLeft <= 0) {
      step = 700;
    }

    contentResleaseSec.scrollBy({
      left: step,
      behavior: "smooth",
    });
  }, 3000);
}
