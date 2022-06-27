window.addEventListener("load", function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((res) => console.log("SW register"))
      .catch((err) => console.error("SW No registrado", err));
  }

  // Instalacion de la app

  let eventInstall;
  const sectionInstall = document.querySelector('.instalar-app-container');

  let installApp = () => {
    if (eventInstall) {
      eventInstall.prompt();
      eventInstall.userChoice
        .then(res => {
          if (res.outcome == 'accepted') {
            console.log('El usuario instaló la app');
            sectionInstall.style.display = 'none';
          } else {
            console.log('El usuario no instaló la app')
          }
        })

    }
  }


  let showInstallButton = () => {
    if (sectionInstall != 'undefined') {
      sectionInstall.style.display = 'block';
      sectionInstall.addEventListener('click', installApp);
    }
  }


  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    eventInstall = e;
    showInstallButton();
  })

//Configuramos y pedimos permiso para las notificaciones

if (window.Notification && window.Notification.permission != 'denied') {
  this.setTimeout(() => {
    Notification.requestPermission()
    .then(res => console.log(res))
  }, 10000);
  
}

// Agregamos la opcion de compartir

  let shareApp = document.querySelector('.share-app-container');

  if(shareApp != undefined) {
    shareApp.addEventListener('click', e => {
      let shareInfo = {
        title: 'Pelis.com',
        text: 'Las mejores peliculas las encontras en nuestra app y gratis.',
        url: 'http://localhost/pwa-parcial-2-dwt3ah-ughetto-eliana/?version=29/'
      }
      console.log(shareInfo);

      navigator.share(shareInfo)
        .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err)
      })

    })
  }

});

//Agregamos y configuramos la API

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com",
    "X-RapidAPI-Key": "7f0d24d225mshaa26018bcd3e0dfp192af6jsn4943756234c3",
  },
};

fetch(
  "https://online-movie-database.p.rapidapi.com/auto-complete?q=game",
  options
)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const movieList = data.d;

    movieList.map((item) => {
      const title = item.l;
      const img = item.i.imageUrl;
      const id = item.id;
      const button = `<button onclick="showDetails()" class="detail-a">Ver detalle</button>`;
      const movie = `<div class='movies-container'><div class='movie'><img src="${img}"> <h2>${title}</h2> ${button}</div></div>`;
      document.querySelector(".movies-section").innerHTML += movie;
    });
  })

  .then((response) => console.log(response))

  .catch((err) => console.error(err));

function showDetails(id, img, title) {
  location.href = "/detail.html";
}

function sendComment() {
  const input = document.getElementById("comment-input").value;
  const inputValue = input;
  const commentP = `<p>${inputValue}</p>`;
  document.querySelector(".show-comment-input").innerHTML += commentP;
  console.log(inputValue);
}

let OnLineStatus = () => {
  let divAppStatus = document.querySelector('.online-app-status');
  if(navigator.onLine){
    this.setTimeout(() => {
      let navOnline = document.querySelector('.navbar');
      navOnline.style.backgroundColor = '#A00000';
      divAppStatus.classList.add('online-status');
      divAppStatus.innerHTML = 'Peliz.com tiene conexion a internet'
    }, 1000);
  } else {
    divAppStatus.classList.remove('online-status');
    divAppStatus.classList.add('offline-status');
    let navOffline = document.querySelector('.navbar');
    navOffline.style.backgroundColor = '#B16C6A';
    divAppStatus.innerHTML = 'Peliz.com no tiene conexion a internet'
  }
}

OnLineStatus();




window.addEventListener('online', OnLineStatus)
window.addEventListener('offline', OnLineStatus)