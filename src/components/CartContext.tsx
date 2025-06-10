import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type ArticuloManufacturado from '../entidades/ArticuloManufacturado'


export interface CartItem {
  producto: ArticuloManufacturado
  cantidad: number
  subtotal: number;
} 

/**
 * Interfaz que define qué métodos y valores
 * expone nuestro CartContext para el consumo.
 */
interface CartContextType {
  cartItems: CartItem[]
  total: number
  addToCart: (producto: ArticuloManufacturado, cantidad?: number) => void
  removeFromCart: (productoId: number) => void
  updateQuantity: (productoId: number, nuevaCantidad: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0)

  /**
   * Agrega un producto al carrito.
   * Si ya existía, suma la cantidad; si no, lo inserta.
   */
  function addToCart(producto: ArticuloManufacturado, cantidad: number = 1) {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.producto.id === producto.id)
      if (idx >= 0) {
        // ya existe → actualizo cantidad y subtotal
        const copy = [...prev]
        const updatedQty = copy[idx].cantidad + cantidad
        copy[idx] = {
          producto,
          cantidad: updatedQty,
          subtotal: updatedQty * producto.precio_venta
        }
        return copy
      }
      // nuevo ítem
      return [
        ...prev,
        { producto, cantidad, subtotal: cantidad * producto.precio_venta }
      ]
    })
  }

  /**
   * Elimina por completo un producto del carrito.
   */
  function removeFromCart(productoId: number) {
    setCartItems(prev => prev.filter(item => item.producto.id !== productoId))
  }

  /**
   * Si la nuevaCantidad es 0, se elimina el producto.
   * Si es >0, se reasigna la cantidad.
   */
  function updateQuantity(productoId: number, nuevaCantidad: number) {
    setCartItems(prev => {
      if (nuevaCantidad <= 0) {
        return prev.filter(i => i.producto.id !== productoId)
      }
      return prev.map(i =>
        i.producto.id === productoId
          ? {
              producto: i.producto,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * i.producto.precio_venta
            }
          : i
      )
    })
  }

  /**
   * Vacía todo el carrito (por ejemplo, después de confirmar el pedido).
   */
  function clearCart() {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{ cartItems, total, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
