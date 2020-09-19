import {
    elements
} from './base'

import {
    limitRecipeTitle
} from './searchViews'

export const toggleLikeBtn = (isLiked) => {

    const btn = isLiked ? 'icon-heart' : 'icon-heart-outlined'
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${btn}`)

}

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};


export const renderLikes = item => {

    const markup = `
     <li>
        <a class="likes__link" href="#${item.id}">
            <figure class="likes__fig">
                <img src="${item.img}" alt="${item.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(item.title)}...</h4>
                <p class="likes__author">${item.author}</p>
            </div>
        </a>
    </li>
    `
    elements.likesList.insertAdjacentHTML('beforeend', markup)

}

export const deleteLikes = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`)
    if (el) {
        el.parentElement.removeChild(el)
    }
}