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

function isInsumo(a: Articulo): a is ArticuloInsumo {
  return 'stock_insumo_sucursales' in a
}

function isManufacturado(a: Articulo): a is ArticuloManufacturado {
  return 'detalles' in a
}

export default function PromoCard({ promo }: Props) {
  const [inStock, setInStock] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false

    async function checkStock() {
      const needed: Record<number, number> = {}
      const actualStock: Record<number, number> = {}

      // Recorremos cada detalle de la promo
      for (const det of promo.detalles ?? []) {
        const art = det.articulo!
        const qtyPromo = det.cantidad

        if (isInsumo(art)) {
          // Insumo directo en la promo
          needed[art.id!] = (needed[art.id!] || 0) + qtyPromo
          actualStock[art.id!] = art.stock_insumo_sucursales?.[0]?.stock_actual ?? 0

        } else if (isManufacturado(art)) {
          // Artículo manufacturado: traemos sus insumos internos
          const full = await getArticuloManufacturadoById(art.id!)
          for (const innerDet of full.detalles!) {
            const ins = innerDet.articulo_insumo!
            // cantidad de insumo = cantidad interna * cantidad en la promo
            const needQty = innerDet.cantidad * qtyPromo
            needed[ins.id!] = (needed[ins.id!] || 0) + needQty
            actualStock[ins.id!] = ins.stock_insumo_sucursales?.[0]?.stock_actual ?? 0
          }

        } else {
          // si aparece un tipo inesperado
          if (!cancelled) setInStock(false)
          return
        }
      }

      // verificamos stock
      for (const insIdStr of Object.keys(needed)) {
        const id = Number(insIdStr)
        const req = needed[id]
        const have = actualStock[id] ?? 0
        if (have < req) {
          if (!cancelled) setInStock(false)
          return
        }
      }

      if (!cancelled) setInStock(true)
    }

    checkStock()
    return () => { cancelled = true }
  }, [promo])

  return (
    <div className={`hp-promo-card-wrapper ${!inStock ? 'disabled' : ''}`}>
      {inStock ? (
        <Link to={`/promociones/${promo.id}`} className="hp-promo-card">
          {!inStock && <div className="hp-promo-overlay">Sin stock</div>}
          {promo.imagen?.src
            ? <img src={promo.imagen.src} alt={promo.denominacion} className="hp-promo-img" />
            : <div className="hp-promo-noimg">Sin imagen</div>
          }
          <div className="hp-promo-body">
            <strong>{promo.denominacion}</strong>
            <p className="hp-promo-desc">{promo.descripcion_descuento}</p>
          </div>
        </Link>
      ) : (
        <div className="hp-promo-card hp-promo-card--disabled">
          <div className="hp-promo-overlay">Sin stock</div>
          {promo.imagen?.src
            ? <img src={promo.imagen.src} alt={promo.denominacion} className="hp-promo-img" />
            : <div className="hp-promo-noimg">Sin imagen</div>
          }
          <div className="hp-promo-body">
            <strong>{promo.denominacion}</strong>
            <p className="hp-promo-desc">{promo.descripcion_descuento}</p>
          </div>
        </div>
      )}
    </div>
  )
}
