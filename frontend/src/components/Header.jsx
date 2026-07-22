import { Filters } from "./filters.jsx"
import "./Header.css"

export function Header() {
  return (
    <header className="header-catalog">
      <h1>Catálogo de Películas</h1>
      <Filters/>
    </header>
  )
}
