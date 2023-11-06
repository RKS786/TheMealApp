// Trigger the 'updateTask' function when the document is loaded
document.addEventListener('load', ()=>{
    updateTask();
})


// DOM elements
 const hamburgerMenu = document.getElementById("hamburger-menu");
 const aside = document.getElementById("aside");
 const flexBox = document.getElementById('flex-box');
 const searchbar = document.getElementById('search-bar');
 const favCounter = document.getElementById('total-counter');

// Local storage initialization
 const favMealsDB = "favouritesList";
 if (localStorage.getItem(favMealsDB) == null) {
    localStorage.setItem(favMealsDB, JSON.stringify([]));
}
 
// Function to update the task counter
function updateTask() {

    // Retrieve the list of favorite meals from local storage
    const db = JSON.parse(localStorage.getItem(favMealsDB));

    // Update the favorite meals counter in the UI
    if (favCounter.innerText != null) {
        favCounter.innerText = db.length;
    }

}


// Function to check if an ID is in the list of favorites
 function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}

// Event listener to toggle the aside for favorite meals
hamburgerMenu.addEventListener("click", function () {

    showFavMealList();
    aside.classList.toggle("show");
    flexBox.classList.toggle('shrink');
});



// Function to fetch meals from an API
const fetchMealsFromApi = async (url, value) => {

    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}


// Function to show a list of meals based on search input
async function showMealList() {

    console.log("in the show meal list")
    const list = JSON.parse(localStorage.getItem(favMealsDB));
    const inputValue = document.getElementById("search-input").value;

    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

    const mealsData = await fetchMealsFromApi(url, inputValue);
    console.log('mealsData',mealsData);
    let html = '';
    if (mealsData.meals) {
        html = mealsData.meals.map(element => {

            return `

            <div class="card">
            <div class="card-top"  onclick="showMealDetails(${element.idMeal})">
                <div class="dish-photo" >
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="dish-name">
                    ${element.strMeal}
                </div>
                <div class="dish-details">
                    ${truncate(element.strInstructions, 50)}
                    
                    <span class="button" onclick="showMealDetails(${element.idMeal})">Know More</span>
                 
                </div>
            </div>
            <div class="card-bottom">
                <div class="like">

                <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " onclick="addRemoveToFavList(${element.idMeal})"></i>
                
                </div>
                <div class="play">
                    <a href="${element.strYoutube}">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                </div>
            </div>
        </div>
            `
        }).join('');
        document.getElementById('cards-holder').innerHTML = html;
    }
}


// Scroll event listener for 'flexBox'
flexBox.onscroll = function () {

   console.log('called function onscroll')
    if (flexBox.scrollTop > searchbar.offsetTop) {
        searchbar.classList.add("fixed");

    } else {
        searchbar.classList.remove("fixed");
    }
};


// Function to add or remove a meal from the favorite list
function addRemoveToFavList(id) {
    
    const detailsPageLikeBtn = document.getElementById('like-button');
    let db = JSON.parse(localStorage.getItem(favMealsDB));
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;

        }

    } if (ifExist) {            // If meal already exist in favMealsDB it will delete it from the db
        db.splice(db.indexOf(id), 1);
        document.getElementsByClassName('like')[0].classList.remove('active');


    } else {
        db.push(id);            // If meal is not in the favMealsDB it will add it to the db
        document.getElementsByClassName('like')[0].classList.add('active');
    }

    // Update the local storage and UI
    localStorage.setItem(favMealsDB, JSON.stringify(db));
    if (detailsPageLikeBtn != null) {
        detailsPageLikeBtn.innerHTML = isFav(db, id) ? 'Remove From Favourite' : 'Add To Favourite';
    }
    showFavMealList();
    showMealList();
    updateTask();

}


// Function to show details for a specific meal
async function showMealDetails(itemId) {

    // Smoothly scroll to the top of 'flexBox'
    flexBox.scrollTo({ top: 0, behavior: "smooth" });

    console.log("show Item Details");
    const list = JSON.parse(localStorage.getItem(favMealsDB));

    //url to search particular meal details by id
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";   
 
    let html = '';

    // Fetch the particular meal details using itemId
    const mealDetails = await fetchMealsFromApi(url, itemId);

    console.log('mealdetails:..........',mealDetails);

    if (mealDetails.meals) {
        html = `
        <div class="container remove-top-margin" >
            <div class="fixed" id="search-bar">
                <div class="icon">
                    <i class="fa-solid fa-search "></i>
                </div>
                <div class="new-search-input">
                    <form onkeyup="showMealList()">
                        <input id="search-input" type="text" placeholder="Search food, receipe" />
                    </form>
                </div>
            </div>
        </div>
        <div class="item-details">
        <div class="item-details-left">
        <img src="  ${mealDetails.meals[0].strMealThumb}" alt="">
    </div>
    <div class="item-details-right">
        <div class="item-name">
            <strong>Name: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strMeal}
            </span>
         </div>
        <div class="item-category">
            <strong>Category: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strCategory}
            </span>
        </div>
        <div class="item-ingrident">
            <strong>Ingrident: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strIngredient1},${mealDetails.meals[0].strIngredient2},
            ${mealDetails.meals[0].strIngredient3},${mealDetails.meals[0].strIngredient4}
            </span>
        </div>
        <div class="item-instruction">
            <strong>Instructions: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strInstructions}
            </span>
        </div>
        <div class="item-video">
            <strong>Video Link:</strong>
            <span class="item-text">
            <a href="${mealDetails.meals[0].strYoutube}">Watch Here</a>
          
            </span>
            <div id="like-button" onclick="addRemoveToFavList(${mealDetails.meals[0].idMeal})"> 
             ${isFav(list, mealDetails.meals[0].idMeal) ? 'Remove From Favourite' : 'Add To Favourite'} </div>
        </div>
    </div>
</div> 
        `
    }
    // Set the HTML content of the container with the meal details
    document.getElementsByClassName('container')[0].innerHTML = html;
}

// Function to show the list of favorite meals
async function showFavMealList() {

    let favList = JSON.parse(localStorage.getItem(favMealsDB));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {

        // Display a message when there are no favorite meals
        html = `<div class="fav-item nothing"> <h1> 
        No favourite..</h1> </div>`
    }

    else {

        for (let i = 0; i < favList.length; i++) {

            // Fetch the details of each favorite meal and generate the HTML
            const favMealList = await fetchMealsFromApi(url, favList[i]);

            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
                <div class="fav-item" onclick="showMealDetails(${element.idMeal})">

              
                <div class="fav-item-photo">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <span class="fav-item-text">
                           ${element.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList(${element.idMeal})">
                        Remove
                    </div>

                </div>

            </div>               
                `
            }
        }
    }

// Update the HTML content of the 'fav' element
    document.getElementById('fav').innerHTML = html;
}

// Function to truncate a string to a specified length and add "..." if it's longer
function truncate(str, n) {
    // Check if the length of the input string is greater than the specified truncation length (n)
    if (str?.length > n) {
        // If it's longer, use the `substr` method to take a portion of the string (0 to n-1 characters)
        // and concatenate "..." to indicate that the string has been truncated
        return str.substr(0, n - 1) + "...";
    } else {
        // If the string is shorter than or equal to the specified length, return the original string
        return str;
    }
}

updateTask();