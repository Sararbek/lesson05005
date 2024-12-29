let wishList = JSON.parse(localStorage.getItem("wishList")) || []
const productsWrapperEl = document.querySelector('.products')

function createProductCards(productCards){
    document.querySelector(".countWishItems").textContent = `${JSON.parse(localStorage.getItem("wishList")).length}`
    productsWrapperEl.innerHTML = null
    const fragment = document.createDocumentFragment()
    productCards.forEach(card => {
        const productCard = document.createElement('div')
        productCard.className = "products__card"
        const isInWishList = wishList.some(item => item.id === card.id)
        productCard.dataset.id = card.id
        productCard.innerHTML = `
            <div class="products__card__body">
                        <div class="products__card__image">
                            <img src=${card.thumbnail}>
                            <button name="like-btn">
                                <span class="material-symbols-outlined favouriteIcon ${isInWishList ? "filled" : ""}">favorite</span>
                            </button>
                        </div>
                        <div class="products__card__info">
                            <h3>${card.title}</h3>
                            <p class="price">$${card.price}</p>
                            <ul>
                                <li><i class="fa-solid fa-star"></i></li>
                                <li><i class="fa-solid fa-star"></i></li>
                                <li><i class="fa-solid fa-star"></i></li>
                                <li><i class="fa-solid fa-star"></i></li>
                                <li><i class="fa-solid fa-star"></i></li>
                            </ul>
                        </div>
                    </div>
                    <button class="addCart">Add to cart</button>  
        `
        fragment.appendChild(productCard)

    })
    productsWrapperEl.appendChild(fragment)
}

window.onload = () => {
    createProductCards(wishList)
}

productsWrapperEl.addEventListener('click', (e)=> {
    const element = e.target
    const id = element.closest(".products__card").dataset.id
    if(element.tagName === "IMG"){
       open(`/pages/singleProduct.html?id=${id}`, "_self")
    }else if(element.closest("button")?.name === 'like-btn'){
        const favouriteIcon = element.closest("button").querySelector(".favouriteIcon")
        favouriteIcon.classList.toggle("filled")
        if(!favouriteIcon.classList.contains("filled")){
            removeWish(id)
        }
    }
})

function removeWish(id){
    const index = wishList.findIndex(item => item.id === +id)
    wishList = [...wishList.slice(0, index), ...wishList.slice(index + 1)]
    localStorage.setItem("wishList", JSON.stringify(wishList))
    createProductCards(wishList)
}