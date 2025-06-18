// src/components/HomePage/PromoCard.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type Promocion from '../../entidades/Promocion'
import { getArticuloManufacturadoById } from '../../services/FuncionesApi'
import '../../estilos/PromoCard.css'
import type ArticuloManufacturado from '../../entidades/ArticuloManufacturado'
import type ArticuloInsumo from '../../entidades/ArticuloInsumo'
import type Articulo from '../../entidades/Articulo'

interface Props {
  promo: Promocion
}

function isInsumo(a: Articulo ): a is ArticuloInsumo {
  return 'stock_insumo_sucursales' in a
}

function isManufacturado(a: Articulo ): a is ArticuloManufacturado {
  return 'detalles' in a
}

export default function PromoCard({ promo }: Props) {
  const [inStock, setInStock] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false

    async function checkStock() {
      // 1) Acumulo necesidades
      const needed: Record<number, number> = {}

      // Voy a ir guardando también el stock “real” que conozca
      const actualStock: Record<number, number> = {}

      for (const art of promo.articulos) {
        if (isInsumo(art)) {
          // la promo incluye un insumo suelto
          needed[art.id!] = (needed[art.id!] || 0) + 1
          actualStock[art.id!] =
            art.stock_insumo_sucursales?.[0]?.stock_actual ?? 0

        } else if (isManufacturado(art)) {
          // traigo sus detalles (cada detalle enlaza a un insumo + cantidad)
          const full = await getArticuloManufacturadoById(art.id!)
          for (const det of full.detalles) {
            const ins = det.articulo_insumo!
            needed[ins.id!] = (needed[ins.id!] || 0) + det.cantidad
            // puede solicitarse el mismo insumo varias veces, pero el stock es el mismo
            actualStock[ins.id!] =
              ins.stock_insumo_sucursales?.[0]?.stock_actual ?? 0
          }
        } else {
          // 🤷‍♂️ si no es ninguno, lo marcamos sin stock
          if (!cancelled) setInStock(false)
          return
        }
      }

      // 2) compruebo cada insumo
      for (const insumoIdStr of Object.keys(needed)) {
        const id = Number(insumoIdStr)
        const req = needed[id]
        const have = actualStock[id] ?? 0
        if (have < req) {
          if (!cancelled) setInStock(false)
          return
        }
      }

      // si llegué acá, todo bien
      if (!cancelled) setInStock(true)
    }

    checkStock()
    return () => { cancelled = true }
  }, [promo])


  const CardWrapper = inStock ? Link : 'div'

  return (
    <div className={`hp-promo-card-wrapper ${!inStock ? 'disabled' : ''}`}>
      <CardWrapper
        to={`/promociones/${promo.id}`}
        className="hp-promo-card"
      >
        {!inStock && <div className="hp-promo-overlay">Sin stock</div>}
        {promo.imagen?.src
          ? <img src={promo.imagen.src} alt={promo.denominacion} className="hp-promo-img" />
          : <div className="hp-promo-noimg">Sin imagen</div>
        }
        <div className="hp-promo-body">
          <strong>{promo.denominacion}</strong>
          <p className="hp-promo-desc">{promo.descripcion_descuento}</p>
        </div>
      </CardWrapper>
    </div>
  )
}
