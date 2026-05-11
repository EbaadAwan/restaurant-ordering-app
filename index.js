import {menuArray as dataArr} from '/data.js'
import { v4 as uuidv4 } from 'uuid';

const container = document.getElementById('container')
const checkout = document.getElementById('checkout')
const checkoutBtn = document.getElementById('checkout-btn')
const modal = document.getElementById('modal')
const form = document.getElementById('myForm')

let priceT = 0
let arr = []
let checkoutString = []
let name = ""

form.addEventListener('submit', (e) => {
  e.preventDefault()
  
  const formData = new FormData(form)
  name = formData.get('name')
  
  modal.style.display = "none"
  document.querySelector('h5').style.display = 'none'
  checkout.classList.add('hidden')
  
  document.getElementById('underline').style.display = 'none'
  document.getElementById('total-price').classList.add('hidden')
  document.getElementById('checkout-btn').style.display = 'none'
  document.getElementById('thanks').style.display = 'flex'
  document.getElementById('m').textContent = `Thanks, ${name}! Your order is on its way!`

})

checkoutBtn.addEventListener('click', () => {
  modal.style.display = "flex"
})

renderFoodItems()

document.addEventListener('click', function(e){
  if(e.target.dataset.add){
    renderCheckout(e.target.dataset.add)
  }
  else if(e.target.dataset.remove){
    removeItemCheckout(e.target, e.target.dataset.remove)
  }
})

function renderFoodItems(){
    let string = ``
    dataArr.forEach((item) => {
        string += `<div class="item">
                       <p class="logo">${item.emoji}</p>
                       <div class="desc">
                          <p class="item-name">${item.name}</p>
                          <p class="item-desc">${item.ingredients.join(',')}</p>
                          <p class="item-price">$${item.price}</p>
                       </div>
                       <div class="icon">
                         <i class="fa-solid fa-plus" data-add="${item.id}"></i>
                       </div>
                  </div>`
    })
    
    container.innerHTML = string
}

function renderCheckout(food){
  document.querySelector('h5').style.display = 'block'
  const checkoutArr = dataArr.filter((data) => Number(food) === data.id)
  priceT += checkoutArr[0].price
  document.getElementById('total').textContent = `$${priceT}`
  
  let uID = uuidv4()
  checkoutString.push(`<div class="c-item" data-nID="${uID}">
                         <p class="checkout-item">${checkoutArr[0].name}</p>
                         <p class="checkout-remove" data-remove="${uID}">remove</p>
                         <p class="checkout-price">$${checkoutArr[0].price}</p>
                     </div>`)
  
  checkout.innerHTML = checkoutString.join('')
  document.getElementById('underline').style.display = 'block'
  document.getElementById('total-price').classList.remove('hidden')
  document.getElementById('checkout-btn').style.display = 'block'
}

function removeItemCheckout(clickedEl, removeID){
  const parentEl = clickedEl.parentElement

  // Get the price of this item and update the total
  let p = parentEl.querySelector('.checkout-price').textContent
  p = Number(p.replace('$', ''))
  priceT -= p
  if (priceT < 0) priceT = 0
  document.getElementById('total').textContent = `$${priceT}`

  // Remove the matching item from the checkoutString array
  // Each HTML string in checkoutString contains its own data-nID="<uuid>"
  checkoutString = checkoutString.filter(html => !html.includes(`data-nID="${removeID}"`))

  // Re-render the checkout area
  checkout.innerHTML = checkoutString.join('')

  // If cart is now empty, hide the checkout UI bits
  if (checkoutString.length === 0) {
    document.querySelector('h5').style.display = 'none'
    document.getElementById('underline').style.display = 'none'
    document.getElementById('total-price').classList.add('hidden')
    document.getElementById('checkout-btn').style.display = 'none'
  }
}


