const collectionEl = document.querySelector('.collection')
const productsWrapperEl = document.querySelector('.products')
const loadingProductEl = document.querySelector('.loading__products')
const loadeingCategory = document.querySelector('.loading__category')
const categoryEl = document.querySelector('.category')
const loadingCategoryListEl = document.querySelector('.loading__category__coll')
const seeMoreBtn = document.querySelector('.seeMoreBtn')
const searchInputEl = document.querySelector('.search input')
const searchDropBoxEl = document.querySelector(".search__drop")
const BASE_URL = 'https://dummyjson.com'

const perPageCount = 4;
let productEndPoint = '/products'
let offset = 0

let mainData = []
let wishList = JSON.parse(localStorage.getItem("wishList")) || []

document.querySelector(".countWishItems").textContent = wishList.length

searchInputEl.addEventListener("keyup", async (e)=>{
    const value = e.target.value.trim()
    if(value){
        searchDropBoxEl.style.display = "block"
        const response = await fetch(`${BASE_URL}/products/search?q=${value}&limit=${perPageCount}`)
        response.json()
        .then(data => {
            searchDropBoxEl.innerHTML= null
            data.products.forEach(item => {
            const searchItemEl = document.createElement('div')
            searchItemEl.className = "search__item"
            searchItemEl.dataset.id = item.id
            searchItemEl.innerHTML =  `
             <img src=${item.thumbnail}>
             <p>${item.title}</p>
            `
            searchDropBoxEl.appendChild(searchItemEl)
            })
        })
        .catch(err => console.log(err))
    }else{
        searchDropBoxEl.style.display = "none"
    }
})

async function fetchCategory(endPoint) {
    try{
        const response = await fetch(`${BASE_URL}${endPoint}`)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        createCategory(data)
    }catch(e){
        console.log(e.message)
    }finally{
        loadeingCategory.style.display = 'none'
        categoryEl.style.display = 'flex'
    }
}

window.addEventListener('load', ()=> {
    createLoadingForCategories()
    createLoadingForProducts(perPageCount)
    fetchCategory('/products/category-list')
    scrollCategories()
    fetchProducts(`${productEndPoint}?limit=${perPageCount}`)
})

function createCategory(categories){
    ["all", ...categories].forEach(category => {
        const listEl = document.createElement('li')
        listEl.className = category === "all" ? "item active" : "item"
        listEl.textContent = category
        listEl.dataset.category =  category === "all" ? "/products" : `/products/category/${category}`  
        collectionEl.appendChild(listEl)
        listEl.addEventListener('click', (e)=> {
            let endpoint = e.target.dataset.category
            productEndPoint = endpoint
            productsWrapperEl.innerHTML= null
            offset = 0
            createLoadingForProducts(perPageCount)
            fetchProducts(`${productEndPoint}?limit=${perPageCount}`)
            document.querySelectorAll('.collection .item').forEach(i=> {
                i.classList.remove('active')
            })
            e.target.classList.add('active')
        })
    })
}

function scrollCategories(){
    const categoryColl = document.querySelector('.collection')
    const leftBtn = document.querySelector('.previusBtn')
    const rightBtn = document.querySelector('.nextBtn')

   function checkButtons(){
        const scrollLeft = categoryColl.scrollLeft
        const scrollWidth = categoryColl.scrollWidth
        const clientWidth = categoryColl.clientWidth

        if(scrollLeft === 0){
            leftBtn.style.display = 'none'
        }else{
            leftBtn.style.display = 'block'
        }

        if(clientWidth + scrollLeft >= scrollWidth - 1){
            rightBtn.style.display = 'none'
        }else{
            rightBtn.style.display = 'block'
        }
    }

    categoryColl.addEventListener('scroll', checkButtons)

    leftBtn.addEventListener('click', ()=> {
        categoryColl.scrollBy({
            left: -200,
            behavior: "smooth",
        })
    })

    rightBtn.addEventListener('click', ()=> {
        categoryColl.scrollBy({
            left: 200,
            behavior: "smooth",
        })
    })
}

function createLoadingForCategories(){
    loadeingCategory.style.display = 'flex'
    Array(12).fill().forEach(()=> {
        const listEl = document.createElement('li')
        listEl.className = "itemLoad to-left"
        listEl.textContent = 'Welcome to this web'
        loadingCategoryListEl.appendChild(listEl)
    })
}

async function fetchProducts(endPoint) {
    try{
        const response = await fetch(`${BASE_URL}${endPoint}`)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        if(data.total <= perPageCount + (offset * perPageCount)){
            seeMoreBtn.style.display = 'none'
        }else{
            seeMoreBtn.style.display = 'block'
        }
        mainData = [...mainData, ...data.products]
        createProductCards(data)
    }catch(e){
        console.log(e.message)
    }finally{
        loadingProductEl.style.display = 'none'
        seeMoreBtn.removeAttribute('disabled')
        seeMoreBtn.textContent = "See more"
    }
}

function createProductCards(productCards){
    
    const fragment = document.createDocumentFragment()
    productCards.products.forEach(card => {
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

function createLoadingForProducts(n){
    loadingProductEl.innerHTML = null
    loadingProductEl.style.display = 'grid'
    Array(n).fill().forEach(()=> {
        const loadingForProduct = document.createElement('div')
        loadingForProduct.className = "loading__products__product"
        loadingForProduct.innerHTML = `
             <div class="loading__products__body">
                        <div class="loading__products__image to-left"></div>
                        <div class="loading__products__info">
                            <h3 class="to-left"></h3>
                            <p class="to-left"></p>
                            <ul class="to-left"></ul>
                        </div>
                    </div>
             <button class="to-left"></button>
        `
        loadingProductEl.appendChild(loadingForProduct)
    })
}

seeMoreBtn.addEventListener('click', ()=>{
    seeMoreBtn.setAttribute('disabled', true)
    seeMoreBtn.textContent = 'Loading...'
    createLoadingForProducts(perPageCount)
    offset++
    fetchProducts(`${productEndPoint}?limit=${perPageCount}&skip=${offset * perPageCount}`)
})

productsWrapperEl.addEventListener('click', (e)=> {
    const element = e.target
    const id = element.closest(".products__card").dataset.id
    if(element.tagName === "IMG"){
       open(`/pages/singleProduct.html?id=${id}`, "_self")
    }else if(element.closest("button")?.name === 'like-btn'){
        const favouriteIcon = element.closest("button").querySelector(".favouriteIcon")
        favouriteIcon.classList.toggle("filled")
        const wish = mainData.find(item => item.id === +id)
        if(favouriteIcon.classList.contains("filled")){
            postWish(wish, id)
        }else{
            removeWish(id)
        }
    }
})

function postWish(wish, id){
    const index = wishList.findIndex(item => item.id === +id)
    if(index === -1){
        wishList.push(wish)
        localStorage.setItem("wishList", JSON.stringify(wishList))
        document.querySelector(".countWishItems").textContent = wishList.length
    }
}

function removeWish(id){
    const index = wishList.findIndex(item => item.id === +id)
    wishList = [...wishList.slice(0, index), ...wishList.slice(index + 1)]
    localStorage.setItem("wishList", JSON.stringify(wishList))
    document.querySelector(".countWishItems").textContent = wishList.length
}

searchDropBoxEl.addEventListener("click", (e)=> {
    if(e.target.closest(".search__item")?.className === "search__item"){
        const id = e.target.closest(".search__item").dataset.id
        open(`/pages/singleProduct.html?id=${e.target.closest(".search__item").dataset.id}`, "_self")
        searchInputEl.value = ""
    }
})