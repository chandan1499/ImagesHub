import axios from 'axios';


function getSearchResult() {
    let query = document.getElementById('Searchquery');

    if(query.value == ""){
        console.log("empty form components");
        let x = document.getElementById('search-result-box');
        x.style.display = "none";
        return;
    }

    const options = {
        method: 'GET',
        //url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/spelling/AutoComplete',
        params: {text: query.value},
        headers: {
          'x-rapidapi-key': '603c605d78msh02f9c5ed28e5531p1052cfjsnb96c7341d443',
          'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
          console.log("chandan check: ",response.data);
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
        p.innerHTML = str;

        container.append(p);
    })
}


export {getSearchResult}