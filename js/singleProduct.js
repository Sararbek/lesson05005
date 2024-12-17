const detailsPage = document.querySelector('.details__wrapper')
const BASE_URL = 'https://dummyjson.com'

async function fetchSingleProduct() {
    try{
        let params = new URLSearchParams(window.location.search)
        const response = await fetch(`${BASE_URL}/products/${params.get("id")}`)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        creatDetails(data)
    }catch(e){
        console.log(e.message)
    }finally{

    }
}

function creatDetails(data){
    console.log(1)
    detailsPage.innerHTML = `
        <div class="details__images">
                        <div class="details__mainImage">
                            <img src=${data.thumbnail} alt="">
                        </div>
                        <div class="details__extraImages">
                            <div class="details__extraImage">
                                <img src=${data.images[0]} >
                            </div>
                            <div class="details__extraImage">
                                <img src=${data.images[1]} >
                            </div>
                            <div class="details__extraImage">
                                <img src=${data.images[2]} >
                            </div>
                        </div>
                    </div>
                    <div class="details__info">
                        <div class="details__info__header">
                            <p>${data.title}</p>
                            <div class="details__info__rating">
                                <div class="rating">
                                        <div class="rating__stars">
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                            <i class="fa-solid fa-star"></i>
                                        </div>
                                        <span>${data.rating}</span>
                                </div>
                            </div>
                            <div class="details__info__inStock">
                                <i class="fa-solid fa-check"></i>
                                <span>${data.stock} in stock</span>
                            </div>
                        </div>
                            <div class="details__info__desc">
                                <a href="#">${data.brand}</a>
                                <p>${data.description}</p>
                                <ul>
                                    <li>${data.tags[0]}</li>
                                    <li>${data.tags[1]}</li>
                                </ul>
                            </div>
                    </div>
                    <div class="details__extraInfo">
                        <div class="prices">
                            <span>$${Math.ceil(data.price - (data.discountPercentage * data.price) / 100)}</span>
                            <span>$${data.price}</span>
                        </div>
                        <div class="countBtns">
                            <button class="decCountBtn">-</button>
                            <span>1</span>
                            <button class="incCountBtn">+</button>
                        </div>
                        <div class="extraBtns">
                            <button>Add to cart</button>
                            <button>Buy now</button>
                            <p><i class="fa-regular fa-heart"></i> Add to wishlist</p>
                        </div>
                        <hr>
                        <div class="delivery">
                            <ul>
                                <li><i class="fa-solid fa-truck"></i> ${data.shippingInformation}</li>
                                <li><i class="fa-solid fa-lock"></i> Secure payment</li>
                                <li><i class="fa-solid fa-certificate"></i> ${data.warrantyInformation}</li>
                            </ul>
                        </div>
                    </div>
    `
}

window.onload = () => {
    fetchSingleProduct()
}