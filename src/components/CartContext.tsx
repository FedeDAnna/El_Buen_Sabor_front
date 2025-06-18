import { createContext, useContext, useEffect, useMemo, useState} from 'react'
import type { ReactNode } from 'react'
import  ArticuloManufacturado from '../entidades/ArticuloManufacturado'
import  ArticuloInsumo from '../entidades/ArticuloInsumo'
import Promocion from '../entidades/Promocion'



export type CartItem =
  | {
      kind: 'articulo'
      producto: ArticuloManufacturado | ArticuloInsumo
      cantidad: number
      subtotal: number
    }
  | {
      kind: 'promocion'
      promocion: Promocion  
      cantidad: number
      subtotal: number
    }

export interface CartContextType {
  cartItems: CartItem[]
  total: number
  addToCart: (
    item: ArticuloManufacturado | ArticuloInsumo | Promocion,
    kind: 'articulo' | 'promocion',
    cantidad?: number
  ) => void
  removeFromCart: (id: number, kind: 'articulo' | 'promocion') => void
  updateQuantity: (
    id: number,
    kind: 'articulo' | 'promocion',
    nuevaCantidad: number
  ) => void
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
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const json = localStorage.getItem('cartItems')
      return json ? JSON.parse(json) : []
    } catch {
      return []
    }
  })


  const total = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.subtotal, 0),
    [cartItems]
  )

  
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    } catch {
      console.log("Error en el Local Storage");
    }
  }, [cartItems])

  function addToCart(
    item: ArticuloManufacturado | ArticuloInsumo | Promocion,
    kind: 'articulo' | 'promocion',
    cantidad: number = 1
  ) {
    setCartItems(prev => {
      const idx = prev.findIndex(ci =>
        kind === 'articulo'
          ? ci.kind === 'articulo' && ci.producto.id === (item as any).id
          : ci.kind === 'promocion' && ci.promocion.id === (item as any).id
      )
      // Si ya existe, actualizamos cantidad y subtotal
      if (idx >= 0) {
        // separación clara de casos
        if (kind === 'articulo') {
          // TS sabe que aquí ci.kind==='articulo'
          const oldItem = prev[idx] as Extract<CartItem, { kind: 'articulo' }>
          const newQty = oldItem.cantidad + cantidad
          const updated: CartItem = {
            ...oldItem,
            cantidad: newQty,
            subtotal: newQty * oldItem.producto.precio_venta
          }
          const copy = [...prev]
          copy[idx] = updated
          return copy
        } else {
          // TS sabe que aquí ci.kind==='promocion'
          const oldItem = prev[idx] as Extract<CartItem, { kind: 'promocion' }>
          const newQty = oldItem.cantidad + cantidad
          const updated: CartItem = {
            ...oldItem,
            cantidad: newQty,
            subtotal: newQty * oldItem.promocion.precio_promocional
          }
          console.log("SUBTOTAL:", updated.subtotal)
          const copy = [...prev]
          copy[idx] = updated
          return copy
        }
      }

      // si no existía, insertamos
      if (kind === 'articulo') {
        const prod = item as ArticuloManufacturado | ArticuloInsumo
        return [
          ...prev,
          {
            kind: 'articulo',
            producto: prod,
            cantidad,
            subtotal: prod.precio_venta * cantidad
          }
        ]
      } else {
        const promo = item as Promocion
        return [
          ...prev,
          {
            kind: 'promocion',
            promocion: promo,
            cantidad,
            subtotal: promo.precio_promocional * cantidad
          }
        ]
      }
    })
  }

  

  function removeFromCart(id: number, kind: 'articulo'|'promocion') {
    setCartItems(prev =>
      prev.filter(ci =>
        kind === 'articulo'
          ? !(ci.kind === 'articulo' && ci.producto.id === id)
          : !(ci.kind === 'promocion' && ci.promocion.id === id)
      )
    )
  }

  function updateQuantity(
    id: number,
    kind: 'articulo'|'promocion',
    nuevaCantidad: number
  ) {
    setCartItems(prev =>
      prev.flatMap(ci => {
        if (
          kind === 'articulo' &&
          ci.kind === 'articulo' &&
          ci.producto.id === id
        ) {
          if (nuevaCantidad <= 0) return []
          return [
            {
              ...ci,
              cantidad: nuevaCantidad,
              subtotal: ci.producto.precio_venta * nuevaCantidad,
            },
          ]
        }
        if (
          kind === 'promocion' &&
          ci.kind === 'promocion' &&
          ci.promocion.id === id
        ) {
          if (nuevaCantidad <= 0) return []
          return [
            {
              ...ci,
              cantidad: nuevaCantidad,
              subtotal: ci.promocion.precio_promocional * nuevaCantidad,
            },
          ]
        }
        return [ci]
      })
    )
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart: () => setCartItems([]),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

