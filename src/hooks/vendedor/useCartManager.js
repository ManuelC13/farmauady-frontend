import { useState, useEffect } from "react";

const CART_STORAGE_KEY = "farmauady_cart";

function getSavedCart() {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function useCartManager(products) {
  const [cart, setCart] = useState(() => getSavedCart());

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  //Ajusta el carrito si el stock cambió
  useEffect(() => {
    if (products.length > 0) {
      setCart((prevCart) => {
        let changed = false;
        const newCart = prevCart
          .map((item) => {
            const product = products.find((prod) => prod.id === item.id);
            if (product && item.quantity > product.stock) {
              changed = true;
              return { ...item, quantity: product.stock };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);

        return changed ? newCart : prevCart;
      });
    }
  }, [products]);

  const cartQty = (productId) => cart.find((item) => item.id === productId)?.quantity ?? 0;

  const addToCart = (product) => {
    const inCart = cartQty(product.id);
    if (inCart >= product.stock) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQty = (item) => {
    if (item.quantity >= item.stock) return;
    setCart((prev) =>
      prev.map((current) =>
        current.id === item.id ? { ...current, quantity: current.quantity + 1 } : current
      )
    );
  };

  const decreaseQty = (item) => {
    setCart((prev) =>
      item.quantity <= 1
        ? prev.filter((current) => current.id !== item.id)
        : prev.map((current) =>
            current.id === item.id ? { ...current, quantity: current.quantity - 1 } : current
          )
    );
  };

  const updateQty = (item, value) => {
    const qty = Math.max(1, Math.min(item.stock, parseInt(value) || 1));
    setCart((prev) =>
      prev.map((current) => (current.id === item.id ? { ...current, quantity: qty } : current))
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    cartQty,
    addToCart,
    increaseQty,
    decreaseQty,
    updateQty,
    removeFromCart,
    clearCart,
    total,
    totalItems,
  };
}
