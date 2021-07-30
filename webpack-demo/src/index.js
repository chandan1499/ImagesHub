import axios from 'axios';


function getSearchResult() {
    let query = document.getElementById('Searchquery');

    if(query.value == ""){
        let x = document.getElementById('search-result-box');
        x.style.display = "none";

        console.log("x: ", x);
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/spelling/AutoComplete',
        params: {text: query.value},
        headers: {
          'x-rapidapi-key': '603c605d78msh02f9c5ed28e5531p1052cfjsnb96c7341d443',
          'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data);
          showSearchResult(response.data);
      }).catch(function (error) {
          console.error(error);
      });
}

function showSearchResult(data) {
    let container = document.getElementById('search-result-box');
    container.innerHTML = null;
    container.style.display = 'block';

    data.forEach((str) => {
        let p = document.createElement('p');
        p.setAttribute('onclick', `getPhotosByquery('${str}')`);
        p.innerHTML = str;

        container.append(p);
    })
}


let query = document.getElementById('Searchquery');

var timerId;

query.addEventListener('input', () =>{
    if(timerId){
        return;
    }

    timerId = setTimeout(() => {
        getSearchResult();
        timerId = undefined;
    },500)
})
  

function getPhotosByquery(query){
    let container = document.getElementById('search-result-box');
    container.style.display = 'none';
    resetButton(1);


    axios.get(`https://api.unsplash.com/search/photos?per_page=20&query=${query}&client_id=yFl4ewgHUoTeo-EX32yuYLlYTjItMLsNlM4TZQsO1IQ`)
    .then((res) => {
        console.log(res);
        let data = res.data.results;
        showImages(data);
        let title = document.getElementById('serach-title');
        title.innerHTML = query;
    }).catch((err) => {
        console.log(err);
    })
}



function getPhotosBypage(n){
    resetButton(n);

    let query = document.getElementById('serach-title').innerHTML;
    //console.log(query, "this is query");
    axios.get(`https://api.unsplash.com/search/photos?page=${n}&per_page=20&query=${query}&client_id=yFl4ewgHUoTeo-EX32yuYLlYTjItMLsNlM4TZQsO1IQ`)
    .then((res) => {
        //console.log("this is res:  ", res);
        let data = res.data.results;
        showImages(data);
    }).catch((err) => {
        console.log(err);
    })
}
window.getPhotosBypage = getPhotosBypage;


function resetButton(id) {
    id = Number(id);
    let container = document.getElementById("pagination");
    container.innerHTML = null;

    if(id >= 9) {
        container.innerHTML = `<button class="temp1" id="6" onclick="getPhotosBypage(id)">6</button>
        <button class="temp2" id="7" onclick="getPhotosBypage(id)">7</button>
        <button class="temp3" id="8" onclick="getPhotosBypage(id)">8</button>
        <button class="temp4" id="9" onclick="getPhotosBypage(id)">9</button>
        <button class="temp5" id="10" onclick="getPhotosBypage(id)">10</button>`;
    }
    else if(id <= 3){
        container.innerHTML = `<button class="temp1" id="1" onclick="getPhotosBypage(id)">1</button>
        <button class="temp2" id="2" onclick="getPhotosBypage(id)">2</button>
        <button class="temp3" id="3" onclick="getPhotosBypage(id)">3</button>
        <button class="temp4" id="4" onclick="getPhotosBypage(id)">4</button>
        <button class="temp5" id="5" onclick="getPhotosBypage(id)">5</button>`;
    }
    else{
        container.innerHTML = `<button class="temp1" id="${id-2}" onclick="getPhotosBypage(id)">${id-2}</button>
        <button class="temp2" id="${id-1}" onclick="getPhotosBypage(id)">${id-1}</button>
        <button class="temp3" id="${id}" onclick="getPhotosBypage(id)">${id}</button>
        <button class="temp4" id="${id+1}" onclick="getPhotosBypage(id)">${id+1}</button>
        <button class="temp5" id="${id+2}" onclick="getPhotosBypage(id)">${id+2}</button>`;
    }
    

    
    let button = document.getElementById(id);
    button.style.background = "black";
    button.style.color = "white";
}



function showImages(arrOfImages) {
   // console.log(arrOfImages);
    let div1 = document.getElementById('img-div1');
    let div2 = document.getElementById('img-div2');
    let div3 = document.getElementById('img-div3');

    div1.innerHTML = null;
    div2.innerHTML = null;
    div3.innerHTML = null;

    arrOfImages.forEach(({urls, id}) => {
        let {small} = urls;
        let tempId = "temp"+id;
        
        let div = document.createElement('div');
        div.setAttribute('id', tempId);
        div.setAttribute('onclick', 'showPopUp(id)');

        let button = document.createElement('button');
        button.setAttribute('class', 'addToLike');
        button.setAttribute('id', `${id}?${small}`);
        button.setAttribute('onclick',`addToFavorites(id, event)`);
        button.innerHTML = `<i class="fas fa-heart"></i>`;

        let img = document.createElement('img');
        img.src = small;

        div.append(button, img);

        
        if(small != "HelloWorld"){
            if(div1.clientHeight > div2.clientHeight){
                if(div2.clientHeight <= div3.clientHeight){
                    div2.append(div);
                }
                else{
                    div3.append(div);
                }
            }
            else{
                if(div1.clientHeight <= div3.clientHeight){
                    div1.append(div);
                }
                else{
                    div3.append(div);
                }
            }
        }

    })
}


function addToFavorites(id, e) {
    e.stopPropagation();
    let div = document.getElementById(id).style;
    let index = -1;
    for(let i=0; i<id.length; i++) {
        if(id[i] == "?"){
            index = i;
            break;
        }
    }

    if(div.color == "" || div.color == "black"){
        div.color = "red";
        let data = JSON.parse(localStorage.getItem('unsplashCollection'));
        if(data == null){
            data = [];
        }

        let temp = {
            id: id.slice(0, index),
            urls: {small : id.slice(index+1)}
        }

        data.push(temp);
        localStorage.setItem('unsplashCollection',JSON.stringify(data));
    }
    else{
        div.color = "black";
        let data = JSON.parse(localStorage.getItem('unsplashCollection'));
        if(data != null){
            data.forEach((el)=>{
                if(el.id == id.slice(0,index)){
                    el.urls = "HelloWorld";
                }
            })
        }

        localStorage.setItem('unsplashCollection',JSON.stringify(data));

    }
}


window.addToFavorites = addToFavorites;  
window.getPhotosByquery = getPhotosByquery;








function hidePopUp() {
    let temp = document.getElementById('selected-img-pop');
    temp.style.display = "none";

    let container = document.querySelector('.container');
    container.style.filter = "blur(0px)";
}

function showPopUp(id) {
    id = id.slice(4);
    console.log(id);
    let temp = document.getElementById('selected-img-pop');
    temp.style.display = "block";

    let container = document.querySelector('.container');
    container.style.filter = "blur(4px)";

    axios.get(`https://api.unsplash.com/photos/${id}?client_id=yFl4ewgHUoTeo-EX32yuYLlYTjItMLsNlM4TZQsO1IQ`)
    .then((res) => {
        console.log(res.data);
        setTimeout(() =>{
            showImageonPopup(res.data);
        },500)
    }).catch((err) => {
        console.error(err);
    })
}

function showImageonPopup({urls, description, alt_description, user}) {
    let mainDiv = document.getElementById('selected-img-pop');
    mainDiv.innerHTML = null;

    if(description == null){
        description = "Information not available!"
    }
    else if(user.twitter_username == null){
        user.twitter_username = "";
    }

    mainDiv.innerHTML = `<div id="close-pop-up" onclick="hidePopUp()"><i class="fas fa-times"></i></div>
    <div id="pop-up-divs">
      <div>
        <div id="profile-img">
          <img src="${user.profile_image.small}" alt="">
          <div>
            <div id="picture-clicker-name">${user.name}</div>
            <div id="twitter-userName">${user.twitter_username}<i class="fab fa-twitter"></i></div>
          </div>
        </div>
        <div id="image-title">${alt_description}</div>
        <div id="image-description">${description}</div>
      </div>
      <div id="image-div">
        <img src="${urls.small}" alt="">
      </div>
    </div>`;

   
}

window.hidePopUp = hidePopUp;
window.showPopUp = showPopUp;



function showCollectionsOfLikedImages() {
    let data = JSON.parse(localStorage.getItem('unsplashCollection'));
    if(data == null) {
        alert('No picture Like for collection');
        return;
    }
    else{
        let x = document.getElementById('serach-title');
        x.innerHTML = "Collections";

        let pagination = document.getElementById('pagination');
        pagination.style.display = "none";
        showImages(data);
    }

}
window.showCollectionsOfLikedImages = showCollectionsOfLikedImages;