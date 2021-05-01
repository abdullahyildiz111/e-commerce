import React, { useState, useEffect } from 'react'
import { commerce } from './lib/commerce'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Products from './components/Products/Products'
import Navbar from './components/Navbar/Navbar'
import Cart from './components/Cart/Cart'
import Checkout from './components/CheckoutForm/Checkout/Checkout'

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({})


    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    };

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve())
    };

    const handleAddToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity);

        setCart(cart)
    }

    const handleUpdateCartQty = async (lineItemId, quantity) => {
        const { cart } = await commerce.cart.update(lineItemId, { quantity });

        setCart(cart);
    };

    const handleRemoveFromCart = async (lineItemId) => {
        const { cart } = await commerce.cart.remove(lineItemId);

        setCart(cart);
    };

    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();

        setCart(response.cart);
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, [])


    console.log(cart)

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path="/">
                        <Products products={products} addToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/cart">
                        <Cart cart={cart} handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleEmptyCart={handleEmptyCart} />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout cart={cart}/>
                    </Route>
                </Switch>
            </div>
        </Router>

    )
}

export default App
