import Search from "./models/Search";
import * as searchViews from "./views/searchViews";
import * as recipeViews from "./views/recipeViews";
import {
    elements,
    renderLoader,
    clearLoader
} from "./views/base";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as listViews from './views/listViews'
import Like from "./models/Likes";
import * as likesViews from './views/likesViews'
import Likes from "./models/Likes";

//Global state of the app
/*
 ** Search object
 ** Recipe result object
 ** Shopping list object
 ** Liked recipes object
 */
//State of the app at any given moment.
const state = {};

/*
 ****SEARCH CONTROLLER
 */
const controlSearch = async() => {
    //1. Get the query from views
    const query = searchViews.getInput();

    if (query) {
        //2. Create a Search object in state
        state.search = new Search(query);

        //3. Prepare the UI for the new search
        searchViews.clearField();
        searchViews.clearSearchList();
        renderLoader(elements.searchRes);

        try {
            //4. await for the results of the new Search
            await state.search.getResults();

            //5. Display the search results in the UI
            clearLoader();
            searchViews.renderResults(state.search.result);
        } catch {
            alert("Error in getting search results");
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener("submit", (event) => {
    //Prevent the page from reloading
    event.preventDefault();

    controlSearch();
});

elements.searchResPages.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchViews.clearSearchList();
        searchViews.renderResults(state.search.result, goToPage);
    }
});

/*
 ***RECIPE CONTROLLER
 */

const controlRecipe = async() => {
    //Get id from URL
    const id = window.location.hash.replace("#", "");

    if (id) {
        //1. Prepare the UI
        recipeViews.clearRecipe();
        renderLoader(elements.recipe);

        //2. Create a recipe object
        state.recipe = new Recipe(id);

        if (state.search) searchViews.highlighted(id);

        try {
            //3. Get the recipe and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //4. calcTime and calcServings
            state.recipe.calcTime();
            state.recipe.calcServings();

            //5. Render the recipe
            clearLoader();
            recipeViews.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch {
            alert("Error loading recipe!");
        }
    }
};

//Even when the page reloads we want the same recipe to appear on UI
["hashchange", "load"].forEach((event) =>
    window.addEventListener(event, controlRecipe)
);



/*
 ***LIST CONTROLLER
 */

const controlList = () => {

    //Check if there is NO existing list and make a new one
    if (!state.list) state.list = new List()

    //Add items to the UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listViews.renderItem(item)
    })
}

//Delete item from state and UI
document.querySelector('.shopping__list').addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from the state list;
        state.list.deleteItem(id)

        //Delete from the UI
        listViews.deleteItem(id)
    } else if (e.target.matches('.shopping__count-value, .shopping__count-value *')) {

        //Count update
        state.list.updateCount(id, parseFloat(e.target.value, 10))
    }
})


/*
 ***LIKES CONTROLLER
 */

//TESTING

const controlLikes = () => {

    if (!state.likes) state.likes = new Like()
    const currentID = state.recipe.id

    if (!state.likes.isLiked(currentID)) {

        //Add item to likes
        const newItem = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )


        //Toggle the like button
        likesViews.toggleLikeBtn(true)

        //Display item in the likes
        likesViews.renderLikes(newItem);
    } else {
        //Delete item form likes
        state.likes.deleteLike(currentID)

        //Toggle the like button
        likesViews.toggleLikeBtn(false)

        //Remove item from the likes
        likesViews.deleteLikes(currentID);
    }
    likesViews.toggleLikeMenu(state.likes.getNumLikes())

}

window.addEventListener('load', () => {
    state.likes = new Like()

    //Read from local storage
    state.likes.readLocaldata()

    //Toggle like Menu depening upon the number of likes
    likesViews.toggleLikeMenu(state.likes.getNumLikes())

    //Render the likes
    state.likes.likes.forEach(like => likesViews.renderLikes(like))

})

elements.recipe.addEventListener("click", (event) => {
    if (event.target.matches(".btn-dec,.btn-dec *")) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings("dec");
            recipeViews.updateRecipe(state.recipe);
        }
    } else if (event.target.matches(".btn-inc,.btn-inc *")) {
        state.recipe.updateServings("inc");
        recipeViews.updateRecipe(state.recipe);
    } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        controlList();
    } else if (event.target.matches(".recipe__love , .recipe__love *")) {
        controlLikes();
    }
});