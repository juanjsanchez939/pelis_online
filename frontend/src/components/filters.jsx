import './Filters.css'
import { useState, useId } from 'react';
import { useFilters } from '../hooks/useFilters';
export function Filters() {
    const { setFilters } = useFilters()
    const [minPrice, setMinPrice] = useState(0);
    const minPriceFilterId = useId()
    const categoryFilterId = useId()

    const handleChangeMinPrice = (event) => {
        const value = Number(event.target.value);
        setMinPrice(value);
        setFilters(prevState => ({
            ...prevState,
            minPrice: value
        }))
    }
    const handleChangeCategory = (event) => {
            setFilters(prevState => ({
                ...prevState,
                category: event.target.value
            }))
    }

    return (
        <section className="filters">
            <div>
                <label htmlFor={minPriceFilterId}>Año a partir de:</label>
                <input 
                    type="range" 
                    id={minPriceFilterId} 
                    name="price" 
                    min="1970" 
                    max="2026" 
                    onChange={handleChangeMinPrice}
                    value={minPrice}
                />
                <span>{minPrice}</span>
            </div>

            <div>
                <label htmlFor={categoryFilterId}>Género</label>
                <select id={categoryFilterId} onChange={handleChangeCategory} name="category">
                    <option value="all">Todas</option>
                    <option value="Acción">Acción</option>
                    <option value="Animadas">Animadas</option>
                    <option value="Aventura">Aventura</option>
                    <option value="Bélicas">Bélicas</option>
                    <option value="Comedias">Comedias</option>
                    <option value="Terror">Terror</option>
                </select>
            </div>
        </section>
    )
}
