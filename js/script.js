document.getElementById('search-btn').addEventListener('click', function () {
    loadMeals(true);
});

document.getElementById('search-text').addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        loadMeals(true);
    }
});

document.getElementById('show-all').addEventListener('click',function(){
    loadMeals(false);
});

function loadMeals(hasDataLimit) {
    //start spinner
    spinner(true);

    const mealName = document.getElementById('search-text').value;
    if (mealName === '') {
        alert("Food name can not be empty");
        return;
    }
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals, hasDataLimit));
}

function displayMeals(meals, hasDataLimit) {
    const mealList = document.getElementById('meals-list');
    mealList.innerHTML = '';
    
    if (meals == null) {
        //stop spinner
        spinner(false);

        document.getElementById('not-found-message').innerText = "No Result Found.";
        return;
    }

    if (hasDataLimit && meals.length > 6) {
        meals = meals.slice(0, 6);
        document.getElementById('show-all').classList.remove('d-none');
    }
    else {
        document.getElementById('show-all').classList.add('d-none');
    }

    for (const meal of meals) {
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML =
            `
            <div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-5">
                        <img src="${meal.strMealThumb}" class="w-100 h-100 rounded-start" alt="...">
                    </div>
                    <div class="col-md-7 align-self-center">
                        <div class="card-body">
                            <h4 class="card-title">${meal.strMeal}</h4>
                            <h6 class="card-text text-muted ms-1">Top Ingredients</h6>
                            <ul class="small">
                                <li class="text-muted">${meal.strIngredient1}</li>
                                <li class="text-muted">${meal.strIngredient2}</li>
                                <li class="text-muted">${meal.strIngredient3}</li>
                                <li class="text-muted">${meal.strIngredient4}</li>
                            </ul>
                            <div class="card-text">
                                <button onclick="loadMealDetails(${meal.idMeal})"
                                    class="bg-white border-0 text-warning text-decoration-underline"
                                    data-bs-toggle="modal" data-bs-target="#food-details-modal">View
                                    Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

        mealList.appendChild(div);
    }

    //stop spinner
    spinner(false);
}

function spinner(isTrue) {
    if (isTrue) {
        document.getElementById('spinner').classList.remove('d-none');
    }
    else {
        document.getElementById('spinner').classList.add('d-none');
    }
}

function loadMealDetails(idMeal) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        .then(res => res.json())
        .then(data => displayMealDetails(data.meals[0]));
}

function displayMealDetails(meal) {
    document.getElementById('food-details').innerHTML =
        `
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="food-details-modalLabel">${meal.strMeal}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <img class="w-100 rounded mb-4" src="${meal.strMealThumb}" alt="">
            <p>Category : ${meal.strCategory}</p>
            <p>Instruction :
                <span class="text-justify text-muted">${meal.strInstructions}</span>
            </p>
            <p>Area : ${meal.strArea}</p>
            <p>Youtube : <a target="_blank" class="text-warning" href="${meal.strYoutube}">${meal.strYoutube}</a></p>
        </div>
        <div class="text-end mb-3">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
        </div>
        `;
    meal.strMeal;
}