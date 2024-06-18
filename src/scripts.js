const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart = []

cartBtn.addEventListener('click', () => {
    updateCartModal()

    cartModal.style.display = 'flex'
})


cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (event) => {
    let parentButton = event.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price)
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {

        existingItem.quantity += 1

    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

function updateCartModal() {
    cartItemsContainer.innerHTML = ''
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement('div')

        cartItemElement.innerHTML = `
        
        <div class="mb-2">
            <div class="flex items-center justify-between outline outline-1 rounded px-5 py-2">
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium">R$ ${item.price.toFixed(2)}</p>

                <button class="remove-from-cart-btn" data-name='${item.name}'>Remover</button>
            </div>
        </div>

        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    })

    cartCounter.innerText = cart.length
}

cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const name = event.target.getAttribute('data-name')

        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {

            item.quantity -= 1

        } else {

            cart.splice(index, 1)

        }

        updateCartModal()
    }
}

addressInput.addEventListener('input', (event) => {
    let inputValue = event.target.value

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }
})

checkoutBtn.addEventListener('click', () => {

    const isOpen = checkOpenHour()

    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado no momento, volte das 18h as 22h. Obrigado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast()

        return
    }

    if (cart.length === 0) return

    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join('')

    const message = encodeURIComponent(cartItems)
    const phone = '5511972821988'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, '_blank')

    cart = []
    updateCartModal()
})

function checkOpenHour() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
}

const spanItem = document.getElementById('date-span')
const isOpen = checkOpenHour()

if (isOpen) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}