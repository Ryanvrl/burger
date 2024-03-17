import { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { cartProductProps } from "../types/cart";
import { getCep } from "../services/requestApi";

const Home = () => {
  const [cartProduct, setCartProduct] = useState<cartProductProps[]>([])
  const [adress, setAdress] = useState<string>('')
  const [cep, setCep] = useState<any>({})
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)

  const checkRestaurantOpen = (): boolean => {
    const date = new Date()
    const hours = date.getHours()
    const isOpen = hours >= 18 && hours < 22
    if (isOpen) {
      document.getElementById('span-date')?.classList.remove('bg-red-500')
      document.getElementById('span-date')?.classList.add('bg-green-500')
    } else {
      document.getElementById('span-date')?.classList.remove('bg-green-500')
      document.getElementById('span-date')?.classList.add('bg-red-500')
    }
    return isOpen
  }

  const handleClickMenu = (e: any) => {
    let parentButton = e.target.closest('.add-to-cart-btn')
    if (parentButton) {
      const name: string = parentButton.getAttribute('data-name')
      const price: number = parseFloat(parentButton.getAttribute('data-price'))
      addCart(name, price)
    }
  }

  const addCart = (name: string, price: number) => {
    const existingItem = cartProduct.find((item: cartProductProps) => item.name === name)
    if (existingItem) {
      existingItem.quantity += 1
      const newQuantity = [...cartProduct]
      setCartProduct(newQuantity)
      return
    }
    const newProduct = [...cartProduct, {
      name,
      price,
      quantity: 1,
    }]
    setCartProduct(newProduct)
  }

  const handleChangeItems = () => {
    let allTotal = 0
    cartProduct.map((product: cartProductProps) => {
      allTotal += product.price * product.quantity
    })
    setTotal(allTotal)
  }

  const handleClickRemoveBtn = (name: string) => {
    const index = cartProduct.findIndex((item: cartProductProps) => item.name === name)

    if (index !== -1) {
      const item: cartProductProps = cartProduct[index]

      if (item.quantity > 1) {
        item.quantity -= 1
        handleChangeItems()
        return
      }

      cartProduct.splice(index, 1)
      handleChangeItems()
    }
  }

  const handleClickCartModalBtn = (e: EventTarget) => {
    if (e === document.getElementById('close-modal-btn')) {
      document.getElementById('cart-modal')?.classList.remove('flex')
      document.getElementById('cart-modal')?.classList.add('hidden')
    }
  }

  const handleClickCheckout = () => {
    if (!checkRestaurantOpen()) return
    if (cartProduct.length === 0) return
    if (adress == '') {
      document.getElementById('error-cep')?.classList.remove('hidden')
      return
    }
    document.getElementById('error-cep')?.classList.add('hidden')
  }

  const handleSearch = async () => {
    if (!checkRestaurantOpen()) {
      alert('Estamos fora do horário de funcionamento. Volte entre as 18 às 22 horas')
      return
    }

    document.getElementById('error-fetch-cep')?.classList.add('hidden')
    document.getElementById('error-cep')?.classList.add('hidden')
    if (adress == '') {
      document.getElementById('error-cep')?.classList.remove('hidden')
      setAdress('')
      setCep({})
      return
    }
    const response = await getCep(adress).then(data => {
      if (data.erro) {
        throw Error('CEP não encontrado')
      }
      setCep(data)
    }).catch((e) => {
      document.getElementById('error-fetch-cep')?.classList.remove('hidden')
      setCep('')
      setError(e.message)
    })
    response
  }

  const handleClickOutCartModal = (e: EventTarget) => {
    if (e === document.getElementById('cart-modal')) {
      document.getElementById('cart-modal')?.classList.remove('flex')
      document.getElementById('cart-modal')?.classList.add('hidden')
    }
  }

  const handleClickCartBtn = () => {
    document.getElementById('cart-modal')?.classList.remove('hidden')
    document.getElementById('cart-modal')?.classList.add('flex')
  }

  checkRestaurantOpen()
  return (
    <>
      <header className='bg-green-500 w-full h-[420px] bg-home bg-cover bg-center' onLoad={checkRestaurantOpen}>
        <div className='w-full h-full flex justify-center items-center flex-col'>
          <img src="./assets/hamb-3.png" alt="foto logo hamburger" className='w-32 h-32 rounded-full' />
          <h1 className='text-3xl nt-4 sb-2 font-bold text-white'>Burger</h1>

          <span className='text-white font-medium'>
            Rua XYZ 33, João Pessoa - PB
          </span>

          <div className=' px-4 py-1 rounded-lg mt-5 text-white' id="span-date">
            <span>Seg à Dom - 18:00 as 22:00</span>
          </div>
        </div>
      </header>

      <h2 className='text-2xl md:text-3xl font-bold text-center mt-9 mb-6'>
        Conheça o nosso menu
      </h2>

      <div id='menu' onClick={(e) => handleClickMenu(e)}>
        <main className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8 mx-auto max-w-7xl mb-16 px-1 lg:px-0">

          <div className='flex gap-2 '>
            <img src="./assets/hamb-1.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=''>
              <p className='font-bold'>Hamburger Smash</p>
              <p className="text-sm">Cheese Burger Duplo Pão levinho de fermentação natural da Trigou, burger 160g, queijo prato e maionese da casa</p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 18.90</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Hamburger Smash" data-price="18.90">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-2 '>
            <img src="./assets/hamb-2.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=''>
              <p className='font-bold'>Hamburger Duplo</p>
              <p className="text-sm">Cheese Burger Duplo Pão levinho de fermentação natural da Trigou, burger 160g, queijo prato e maionese da casa</p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 32.90</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Hamburger Duplo" data-price="32.90">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-2 '>
            <img src="./assets/hamb-3.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=''>
              <p className='font-bold'>Hamburger Cheddar</p>
              <p className="text-sm">Cheese Burger Duplo Pão levinho de fermentação natural da Trigou, burger 160g, queijo prato e maionese da casa</p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 35.90</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Hamburger Cheddar" data-price="35.90">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-2 '>
            <img src="./assets/hamb-4.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=''>
              <p className='font-bold'>Hamburger da casa</p>
              <p className="text-sm">Cheese Burger Duplo Pão levinho de fermentação natural da Trigou, burger 160g, queijo prato e maionese da casa</p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 30.00</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Hamburger da casa" data-price="30">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-2 '>
            <img src="./assets/hamb-5.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=''>
              <p className='font-bold'>Hamburger Salad</p>
              <p className="text-sm">Cheese Burger Duplo Pão levinho de fermentação natural da Trigou, burger 160g, queijo prato e maionese da casa</p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 20.90</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Hamburger Salad" data-price="20.90">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-2 '>
            <img src="./assets/hamb-6.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=''>
              <p className='font-bold'>Cheese Burger</p>
              <p className="text-sm">Cheese Burger Duplo Pão levinho de fermentação natural da Trigou, burger 160g, queijo prato e maionese da casa</p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 18.90</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Cheese Burger" data-price="18.90">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-2 '>
            <img src="./assets/hamb-7.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=''>
              <p className='font-bold'>Bacon Burger</p>
              <p className="text-sm">Cheese Burger Duplo Pão levinho de fermentação natural da Trigou, burger 160g, queijo prato e maionese da casa</p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 18.90</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Bacon Burger" data-price="18.90">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-2 '>
            <img src="./assets/hamb-8.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=''>
              <p className='font-bold'>Hamburger Salad Duplo</p>
              <p className="text-sm">Cheese Burger Duplo Pão levinho de fermentação natural da Trigou, burger 160g, queijo prato e maionese da casa</p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 35.90</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Hamburger Salad Duplo" data-price="35.90">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>
        </main>


        <div className="mx-auto max-w-7xl px-2 my-2">
          <h2 className="font-bold text-3xl">
            Bedidas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8 mx-auto max-w-7xl mb-16 px-1 lg:px-0">
          <div className='flex gap-2 w-full'>
            <img src="./assets/refri-1.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=' w-full'>
              <p className='font-bold'>Coca lata</p>
              <p className="text-sm"></p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 6</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Coca lata" data-price="6">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>

          <div className='flex gap-2  w-full'>
            <img src="./assets/refri-2.png" alt="Hamburger" className='w-28 h-28 rounded-md hover:scale-110 hover:-rotate-2 duration:-300' />
            <div className=' w-full'>
              <p className='font-bold'>Guaraná lata</p>
              <p className="text-sm"></p>
              <div className='flex items-center justify-between mt-2'>
                <p>R$ 6</p>
                <button className="bg-black p-1.5 rounded-sm add-to-cart-btn" data-name="Guarana lata" data-price="6">
                  <FaCartPlus color="#fff" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/50 z-[99] w-full h-lvh py-3 top-0 left-0 items-center justify-center hidden fixed"
          id="cart-modal" onClick={(e) => handleClickOutCartModal(e.target)}>
          <div className="bg-white p-3 rounded-md max-w-[90%] md:min-w-[600px] max-h-[400px] overflow-auto" id="cart-infos">

            <h2 className="text-center font-bold text-2xl mb-5">Meu carrinho</h2>

            <div className="justify-between mb-2 flex-col overflow-auto" >
              {cartProduct.map((product: cartProductProps) =>
                <div key={product.name} className="flex justify-between items-center mb-2 ">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p>(Quantidade: {product.quantity})</p>
                    <p>R$: {product.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleClickRemoveBtn(product.name)} data-name={product.name} className="text-red-500">Remover</button>
                </div>
              )}
            </div>

            <div>

              <p className="font-bold mb-6">Total: <span id="cart-total">{total.toFixed(2)}
              </span></p>

              <p className="font-bold mt-4">CEP para entrega:</p>
              <input type="text" maxLength={8} placeholder="Digite seu CEP" id="adress" className="w-full border-2 p-1 rounded-sm my-2" value={adress} onChange={e => setAdress(e.target.value)}
              />

              <p className="text-red-500 my-1 text-center hidden" id="error-cep">Não foi possivel encontrar esse CEP</p>

              <p className="text-red-500 my-1 text-center" id="error-fetch-cep">{error}</p>

              <div>
                <p className="mb-2 text-sm">{cep.localidade} {cep.uf}</p>
                <p className="mb-2 text-sm">{cep.logradouro}</p>
                <p className="mb-2 text-sm">{cep.bairro}</p>
              </div>

              <div className="flex justify-between items-center">
                <button id="close-modal-btn" className="bg-red-500 text-white py-1 px-4 rounded-md" onClick={(e) => handleClickCartModalBtn(e.target)}> Fechar</button>
                <button id="checkout-btn" className="bg-green-500 text-white py-1 px-4 rounded-md" onClick={() => {
                  handleClickCheckout()
                  handleSearch()
                }}>Finalizar pedido</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full bg-red-500 fixed bottom-0 z-40 flex items-center justify-center">
        <button className="flex items-center gap-2 py-3 text-white font-bold" id="cart-btn" onClick={() => {
          handleClickCartBtn()
          handleChangeItems()
        }}>
          (<span id="cart-count">{(cartProduct.length)}</span>)
          Veja seu carrinho
          <FaCartPlus color="#fff" />
        </button>
      </footer>
    </>
  )
}

export default Home