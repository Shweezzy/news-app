// Custom Http Module
// function customHttp() {
//   return {
//     get(url, cb) {
//       try {
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', url);
//         xhr.addEventListener('load', () => {
//           if (Math.floor(xhr.status / 100) !== 2) {
//             cb(`Error. Status code: ${xhr.status}`, xhr);
//             return;
//           }
//           const response = JSON.parse(xhr.responseText);
//           cb(null, response);
//         });

//         xhr.addEventListener('error', () => {
//           cb(`Error. Status code: ${xhr.status}`, xhr);
//         });

//         xhr.send();
//       } catch (error) {
//         cb(error);
//       }
//     },
//     post(url, body, headers, cb) {
//       try {
//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', url);
//         xhr.addEventListener('load', () => {
//           if (Math.floor(xhr.status / 100) !== 2) {
//             cb(`Error. Status code: ${xhr.status}`, xhr);
//             return;
//           }
//           const response = JSON.parse(xhr.responseText);
//           cb(null, response);
//         });

//         xhr.addEventListener('error', () => {
//           cb(`Error. Status code: ${xhr.status}`, xhr);
//         });

//         if (headers) {
//           Object.entries(headers).forEach(([key, value]) => {
//             xhr.setRequestHeader(key, value);
//           });
//         }

//         xhr.send(JSON.stringify(body));
//       } catch (error) {
//         cb(error);
//       }
//     },
//   };
// }
// Init http module
// const http = customHttp();

// const newsService = (function () {
//   const apiKey = '5bbecffaebc144f6a3efab9467809e39';
//   const apiUrl = 'https://news-api-v2.herokuapp.com';

//   return {
//     topHeadlines(country = 'ua', cb) {
//       http.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`,cb,);
//     },
//     everything(query, cb) {
//       http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
//     },
//   };
// })();

// //  init selects
// document.addEventListener('DOMContentLoaded', function () {
//   M.AutoInit();
// });

// //Load news function
// function loadNews() {
//   newsService.topHeadlines('ua', getResponse);
// }

// //function on get response from server
// function getResponse(err, res) {
//   renderNews(res.articles);
// }

// //Function render news
// function renderNews(news) {
//   const newsContainer = document.querySelector('.news-container .row');
//   let fragment = '';

//   news.forEach(newsItem => {
//     const item = newsTemplate(newsItem);
//     fragment += item;
//   });

//   newsContainer.insertAdjacentHTML('afterbegin', fragment);
// }

// //Function news template
// function newsTemplate({
//   title,
//   url,
//   description,
//   urlToImage
// }) {
//   return `
//   <div class="col s12">
//       <div class="card">
//         <div class="card-image">
//           <img src="${urlToImage}">
//           <span class="card-title">${title || ''}</span>
//         </div>
//         <div class="card-content">
//           <p>${description || ''}</p>
//         </div>
//         <div class="card-action">
//           <a href="${url}">Read more</a>
//         </div>
//       </div>
//     </div>
//   `
// }

function ajaxMethods() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status) / 100 !== 2) {
            console.log(`Error.Status code: ${xhr.status}`);
            return;
          }

          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });
        xhr.addEventListener('error', () => {
          cb(`Error.Status code ${xhr.status}`, xhr);
        })

        xhr.send();

      } catch (error) {
        cb(error)
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest;
        xhr.open('POST', url);

        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status) / 100 !== 2) {
            console.log(`Error.Status code: ${xhr.status}`);
            return;
          }
          const response = JSON.parse(xhr.response);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code ${xhr.status}`, xhr)
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          })
        };

        xhr.send(JSON.stringify(body));

      } catch (error) {
        cb(error);
      }
    }
  }
};

// After load all DOM content
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
  loadNews();
});

const httpsMethods = ajaxMethods();

//Input and submit values
const forms = document.forms['newsControls'];
const countryPick = forms.elements['country'];
const search = forms.elements['search'];
const cathegory = forms.elements['category'];

forms.addEventListener('submit', (e) => {
  e.preventDefault();
  preloader();
  loadNews();
})

console.log(search)
//get NEWS on api
const newsService = (function () {
  const apiKey = '5bbecffaebc144f6a3efab9467809e39';
  const apiUrl = 'https://news-api-v2.herokuapp.com';

  return {
    topHeadlines(country = 'ua', category = 'all', cb) {
      httpsMethods.get(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`, cb);
    },
    everything(query, cb) {
      httpsMethods.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    }
  };
})();

//using GET method
function loadNews() {
  const country = countryPick.value;
  const searchValue = search.value;
  const categoryPick = cathegory.value;

  if (!searchValue) {
    newsService.topHeadlines(country, categoryPick, getResponse);
  } else newsService.everything(searchValue, getResponse);
};

//rendering news 
function getResponse(err, res) {
  if (err) {
    showToasts(err, 'error');
    return;
  };
  if (!res.articles.length) {
    renderNews({})

    deletePreloader();

    alert('Поиск не дал результатов / The search has not given any results!')

    return;
  }
  renderNews(res.articles);
};

//Cleared news after search
function deleteNews(container) {
  container.innerHTML = '';
}
//add news to html
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');

  if (newsContainer.children.length) {
    deleteNews(newsContainer);
  }

  let textFragment = '';

  Object.values(news).forEach(newsItem => {
    const item = addNewsToHtml(newsItem);
    textFragment += item;

    newsContainer.insertAdjacentHTML('afterbegin', textFragment);

    deletePreloader();
  })
};

function addNewsToHtml({
  url,
  urlToImage,
  title,
  description,
  totalResult
}) {
  return `
  <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage || '/dino.jpg'}">
          <span class="card-title">${title || ''}</span>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more</a>
        </div>
      </div>
    </div>
  `
};

//ShowError toasts
function showToasts(msg, type = 'success') {
  M.toast({
    html: msg,
    classes: type
  });
}

//Add preloader
function preloader() {
  const preload = document.body;

  preload.insertAdjacentHTML('afterbegin', `<div class="progress">
    <div class="indeterminate"></div>
   </div>`)
}

//Delete preloader
function deletePreloader() {
  const loader = document.querySelector('.progress');

  if (loader) {
    loader.remove();
  }
}