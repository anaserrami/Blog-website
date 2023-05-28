// Function to fetch data from the backend
function fetchData(url) {
    return fetch(url)
      .then(response => response.json())
      .catch(error => console.log(error));
  }
  
// Function to get the articles
function getArticles(take = 10, skip = 0) {
    return fetchData(`http://localhost:3001/articles?skip=${skip}&take=${take}`);
  }
  
// Function to get the categories
function getCategories() {
    return fetchData('http://localhost:3001/categories');
  }
  
// Function to update the DOM with the articles
function updateArticles() {
    getArticles().then(articles => {
        const articlesContainer = document.getElementById('articles');
        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'article';

            const titleElement = document.createElement('h2');
            titleElement.textContent = article.title;

            const contentElement = document.createElement('p');
            contentElement.textContent = article.content;

            articleElement.appendChild(titleElement);
            articleElement.appendChild(contentElement);

            articlesContainer.appendChild(articleElement);
        });
    });
  }
  
// Function to update the DOM with the categories
function updateCategories() {
    getCategories().then(categories => {
        const categoriesContainer = document.getElementById('categories');
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';

            const nameElement = document.createElement('span');
            nameElement.textContent = category.name;

            const countElement = document.createElement('span');
            countElement.textContent = `(${category.articleCount} articles)`;

            categoryElement.appendChild(nameElement);
            categoryElement.appendChild(countElement);

            categoriesContainer.appendChild(categoryElement);
        });
    });
  }
  
updateArticles();
updateCategories();