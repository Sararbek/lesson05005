const postsWrapperEl = document.querySelector('.posts')
const loadingPostWrapper = document.querySelector('.loading__posts')
const seeMoreBtn = document.querySelector('.seeMoreBtn')
const BASE_URL = 'https://dummyjson.com'
const wishList = JSON.parse(localStorage.getItem("wishList")) || []
document.querySelector(".countWishItems").textContent = `${wishList.length}`

const perPgeCount = 2
let total = 0

window.addEventListener('load', ()=> {
    fetchPosts(`/posts?limit=${perPgeCount}`)
    creatEloadingForPosts(perPgeCount)
})

async function fetchPosts(endPoint) {
    try{
        const response = await fetch(`${BASE_URL}${endPoint}`)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        total = data.total
        createPostCards(data)
    }catch(e){
        console.log(e.message)
    }finally{
        seeMoreBtn.removeAttribute('disabled')
        seeMoreBtn.textContent = 'See more'
        loadingPostWrapper.style.display = 'none'
    }
}

function createPostCards(postCards){
    postCards.posts.forEach(card => {
        const postCardEl = document.createElement('div')
        postCardEl.className = "posts__card"
        postCardEl.innerHTML = `
                    <ul>
                        <li><a href="#">${card.tags[0]}</a></li>
                        <li><a href="#">${card.tags[1]}</a></li>
                        <li><a href="#">${card.tags[2]}</a></li>
                    </ul>
                    <p>
                        ${card.body}
                    </p>
                    <ul>
                        <li><i class="fa-regular fa-thumbs-up"></i><span>${card.reactions.likes}</span></li>
                        <li><i class="fa-regular fa-thumbs-down"></i><span>${card.reactions.dislikes}</span></li>
                        <li><i class="fa-regular fa-eye"></i><span>${card.views}</span></li>
                    </ul>
        `
        postsWrapperEl.appendChild(postCardEl)
    });
}

function creatEloadingForPosts(n){
    loadingPostWrapper.innerHTML = null
    loadingPostWrapper.style.display = 'grid'
    Array(n).fill().forEach(()=> {
        const postLoadEl = document.createElement('div')
        postLoadEl.className = "loading__post"
        postLoadEl.innerHTML = `
        <ul>
                        <li class="to-left"></li>
                        <li class="to-left"></li>
                        <li class="to-left"></li>
                    </ul>
                    <p class="to-left"></p>
                    <ul>
                        <li class="to-left"></li>
                        <li class="to-left"></li>
                        <li class="to-left"></li>
                    </ul>
        `
        loadingPostWrapper.appendChild(postLoadEl)
    })
}

let offset = 0
seeMoreBtn.addEventListener('click', ()=>{
    seeMoreBtn.setAttribute('disabled', true)
    seeMoreBtn.textContent = 'Loading...'
    creatEloadingForPosts(perPgeCount)
    offset++
    if(total <= perPgeCount + (offset * perPgeCount)){
        seeMoreBtn.style.display = 'none'
    }
    fetchPosts(`/posts?limit=${perPgeCount}&skip=${offset * perPgeCount}`)
})
