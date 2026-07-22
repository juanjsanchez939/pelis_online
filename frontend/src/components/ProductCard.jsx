import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <img src={product.thumbnail} alt={product.title} width="200" />
      <p>{product.year} | {product.category[0]}</p>
      <Link to={`/product/${product.id}`}>Ver más</Link>
    </div>
  );
}
