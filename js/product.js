const collectionEl = document.querySelector('.collection')
const productsWrapperEl = document.querySelector('.products')
const loadingProductEl = document.querySelector('.loading__products')
const loadeingCategory = document.querySelector('.loading__category')
const categoryEl = document.querySelector('.category')
const loadingCategoryListEl = document.querySelector('.loading__category__coll')
const seeMoreBtn = document.querySelector('.seeMoreBtn')
const BASE_URL = 'https://dummyjson.com'

const perPageCount = 4;
let total = 0

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
    fetchProducts(`/products?limit=${perPageCount}`)
})

function createCategory(categories){
    categories.forEach(category => {
        const listEl = document.createElement('li')
        listEl.className = "item"
        listEl.textContent = category

        collectionEl.appendChild(listEl)
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

        if(clientWidth + scrollLeft >= scrollWidth){
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
        const btnCategory = document.createElement('button')
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
        total = data.total
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
    productCards.products.forEach(card => {
        const productCard = document.createElement('div')
        productCard.className = "products__card"
        productCard.innerHTML = `
            <div class="products__card__body">
                        <div class="products__card__image">
                            <img src=${card.thumbnail}>
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
        productsWrapperEl.appendChild(productCard)

    })
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

let offset = 0
seeMoreBtn.addEventListener('click', ()=>{
    seeMoreBtn.setAttribute('disabled', true)
    seeMoreBtn.textContent = 'Loading...'
    createLoadingForProducts(perPageCount)
    offset++
    if(total <= perPageCount + (offset * perPageCount)){
        seeMoreBtn.style.display = 'none'
    }
    fetchProducts(`/products?limit=${perPageCount}&skip=${offset * perPageCount}`)
})