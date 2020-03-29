console.log('hola mundo!');
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

const get = new Promise(function (todoBien, todoMal) {
  //setInterval se ejecuta cada cierto tiempo
  //setTimeout se ejecuta en determinado tiempo 
  setTimeout(function () {
    //luego de 3 segundos
    todoBien('Se acabo');
  }, 3000)

})

const getUsers = new Promise(function (todoBien, todoMal) {
  //setInterval se ejecuta cada cierto tiempo
  //setTimeout se ejecuta en determinado tiempo 
  setTimeout(function () {
    //luego de 3 segundos
    todoBien('Se acabo 5');
  }, 5000)

})

//getUser
//.then(function(){
//console.log('todo esta bien')
//})
//.catch(function(message){
//console.log(message)
//})

Promise.all([
  get,
  getUsers
])
  .then(function (message) {
    console.log(message)
  })
  .catch(function (message) {
    console.log(message)
  });

/*$.ajax('https://randomuser.me/api/', {
  method: 'GET',
  success: function(data){
    console.log(data)
  },
  error: function(error){
    console.log(error)

  }
})*/

/*fetch('https://randomuser.me/api/  ')
.then(function(response){
  //console.log(response)
  return response.json()
})
.then(function(user){
  console.log('user', user.results[0].name.first)
})
.catch(function(){
  console.log('algo fallo')
});*/






(async function load() {

  async function getDataU(url){
    const res = await fetch(url)
    const users = await res.json()
    return users
  }
  
  const { results: user } = await getDataU(`https://randomuser.me/api/?results=10`);
  

  const $listaUsuarios = document.getElementById('listUsers');  

function createUser(listUser){

  listUser.forEach((element) => {    
  const li = document.createElement('li');
  li.className = "playlistFriends-item"
  li.innerHTML = (`<a href="#">
  <img src=${element.picture.thumbnail} alt="echame la culpa" />
  <span>
    ${element.name.first}  ${element.name.last}
  </span>
</a>`)
  $listaUsuarios.appendChild(li); 
}) 

}
 
createUser(user);




  console.log($listaUsuarios)

 

  async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
   // console.log(data)
   if(data.data.movie_count > 0){
      return data;
   }
    throw new Error('No se encontro')
    
  }



  
  const $home = document.getElementById('home');
  const $form = document.getElementById('form');
  const $featuringContainer = document.getElementById('featuring');
 
 function setAttributes($element, attributes){
    for(const key in attributes){
    
      
        $element.setAttribute(key, attributes[key]);
    }
 }
 

 function featuringTemplate(peli){
   return(`<div class="featuring">
   <div class="featuring-image">
     <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
   </div>
   <div class="featuring-content">
     <p class="featuring-title">Pelicula encontrada</p>
     <p class="featuring-album">"${peli.title}"</p>
   </div>
   `)
 }
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active');

    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50
    })
    $featuringContainer.append($loader);

    const peli = new FormData($form);
   try{
    const {
      data: {
        movies 
      }
    } = await getData(`https://yts.mx/api/v2/list_movies.json?limit=1&query_term=${peli.get('name')}`);
    
   
    const HTMLString = featuringTemplate(movies[0]);
    
    
    $featuringContainer.innerHTML = HTMLString;
   }catch(error){
     alert(error.message);
     $loader.remove();
     $home.classList.remove('search-active');
   }
    
  })

  async function cacheExist(category){
    const listName = `${category}List`
    const cacheList = localStorage.getItem(listName);

    if(cacheList){
      return JSON.parse(cacheList);
    }
   const {data: {movies: data}} =  await getData(`https://yts.mx/api/v2/list_movies.json?genre=${category}`)
   localStorage.setItem(listName, JSON.stringify(data))
   return data;
  }

  //const {data: {movies:actionList}} = await getData('https://yts.mx/api/v2/list_movies.json?genre=action');
  const actionList = await cacheExist('action');
  const $actionContainer = document.getElementById('action');
  renderMovieList(actionList, $actionContainer, 'action');
  
  //const {data: {movies:dramaList}} = await getData('https://yts.mx/api/v2/list_movies.json?genre=drama');
  const dramaList = await cacheExist('drama');
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

  //const {data: {movies:animationList}} = await getData('https://yts.mx/api/v2/list_movies.json?genre=animation');
  const animationList = await cacheExist('animation');
  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

  function videoItemTemplate(movie, category){
    return(`<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}> 
    <div class="primaryPlaylistItem-image"> 
    
      <img src="${movie.medium_cover_image}"> 
    </div> 
      <h4 class="primaryPlaylistItem-title">
        ${movie.title}
      </h4>
    </div>`
  )
  }

  function createTemplate(HTMLString){
    const html = document.implementation.createHTMLDocument();
html.body.innerHTML = HTMLString;
return html.body.children[0];
  }

function renderMovieList(lista, container, category){
  //actionList.data.movies
  container.children[0].remove();
  lista.forEach((movie) => {
    const HTMLString = videoItemTemplate(movie, category);
    
    const movieElement = createTemplate(HTMLString);
    
    
   // $actionContainer
    container.append(movieElement);
    const image = movieElement.querySelector('img');
    image.addEventListener('load', (event)=>{
      event.srcElement.classList.add('fadeIn');
    })

    
    addEventClick(movieElement);
  })
}

function addEventClick($element){
  $element.addEventListener('click', ()=>{
    showModal($element);
  })
}


//$actionContainer.addEventListener('click', ()=>{
 // showModal();
//})

  const $overlay = document.getElementById('overlay');

  const $hideModal = document.getElementById('hide-modal');

  const $modal = document.getElementById('modal');

  const $modalImage = $modal.querySelector('img');
  const $modalTitle = $modal.querySelector('h1');
  const $modalDescription = $modal.querySelector('p');


  function findById(list, id){
    return list.find(movie=> movie.id === parseInt(id, 10))
  }
  function findMovie(id, category){
  switch(category){
    case 'action': {
     return findById(actionList, id);
    }
    case 'drama': {
     return  findById(dramaList, id);
    }
    default : {
     return  findById(animationList, id);
    }
    
  }
  
}
function showModal($element){
  $overlay.classList.add('active');
  $modal.style.animation = 'modalIn .8s forwards';
  const id = $element.dataset.id;
  const category = $element.dataset.category;
  const data = findMovie(id, category);

  $modalImage.setAttribute('src', data.medium_cover_image);
  $modalTitle.textContent = data.title;
  $modalDescription.textContent = data.description_full;
}
//console.log(videoItemTemplate('src/images/bitcoin.jpg', 'Bitcoin'));
$hideModal.addEventListener('click', hideModal)   ;
function hideModal(){
  $overlay.classList.remove('active');
  $modal.style.animation = 'modalOut .8s forwards';
}       
})()

