const usersWrapperEl = document.querySelector('.users')
const loadingEl = document.querySelector('.loading')
const scrollBtns = document.querySelector('.users__scrollBtns')
const wishList = JSON.parse(localStorage.getItem("wishList")) || []
document.querySelector(".countWishItems").textContent = `${wishList.length}`

const BASE_URL = 'https://dummyjson.com'


async function fetchUsers(endPoint) {
    try{
        const response = await fetch(`${BASE_URL}${endPoint}`)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }
        const data = await response.json()
        createUsers(data)
        
        const usersLength = document.querySelectorAll(".users__card").length
        
        runCarusel(usersLength)
    }catch(e){
        console.log(e.message)
    }finally{
        loadingEl.style.display = 'none'
        scrollBtns.style.display = 'flex'
    }
}

window.addEventListener("load", ()=> {
    createUsersLoading(5)
    fetchUsers('/users')
})

function createUsersLoading(n){
    Array(n).fill().forEach(()=> {
        const loadingCard = document.createElement('div')
        loadingCard.className = "loading__card"
        loadingCard.innerHTML = `
            <div class="loading__imageBox">
                        <div class="loading__image to-left">
                        </div>
                        <div class="loading__info">
                            <p class="to-left"></p>
                            <p class="to-left"></p>
                        </div>
                    </div>
                    <div class="loading__textBox">
                        <div class="loading__text">
                            <p class="to-left"></p>
                            <p class="to-left"></p>
                            <p class="to-left"></p>
                        </div>
                        <div class="loading__btns">
                            <button class="to-left"></button>
                            <button class="to-left"></button>
                        </div>
                    </div>
        `
        loadingEl.appendChild(loadingCard)
    })
}

function createUsers(userCards){
    userCards.users.forEach(card => {
        const divEl = document.createElement('div')
        divEl.className = "users__card"

        divEl.innerHTML = `
                    <div class="users__imageBox">
                        <div class="users__image">
                            <img src=${card.image}>
                        </div>
                        <div class="users__info">
                            <p>${card.firstName} ${card.lastName}</p>
                            <p>${card.company.title}</p>
                        </div>
                    </div>
                    <div class="users__textBox">
                        <div class="users__text">
                        <p>${card.company.name}</p>
                        <p>${card.address.state} ${card.address.country}</p>
                        <p>${card.email}</p>
                        </div>
                        <div class="users__btns">
                            <button>View Cv</button>
                            <button>Make Offer</button>
                        </div>
                    </div>
        `

        usersWrapperEl.appendChild(divEl)
    })
}

function runCarusel(usersLength){
    const previousBtn = document.querySelector('.leftBtn')
    const nextBtn = document.querySelector('.rightBtn')
    let index = 0

    function changeCarusel(){
        if(index > usersLength - 4){
            index = 0
        }else if(index < 0){
            index = usersLength - 4
        }
        usersWrapperEl.style.transform = `translateX(-${index * 256}px)`   
    }

    setInterval(()=> {
        index++
        changeCarusel()
    },2000)

    previousBtn.addEventListener('click', ()=> {
        index++
        changeCarusel()      
    })
    nextBtn.addEventListener('click', ()=> {
        index--
        changeCarusel() 
    })
}

