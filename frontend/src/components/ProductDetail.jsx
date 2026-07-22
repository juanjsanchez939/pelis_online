import React from 'react';

export default function ProductDetail({ product }) {
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="product-detail">
      <h1>{product.title}</h1>
      <img src={product.thumbnail} alt={product.title} width="400" />
      <p><strong>Precio:</strong> {product.price ? `$${product.price}` : 'Próximamente'}</p>
      <p><strong>Desarrollador:</strong> {product.developer}</p>
      <p><strong>Categorías:</strong> {product.category.join(', ')}</p>
      <p>{product.description}</p>
    </div>
  );
}
