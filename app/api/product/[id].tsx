import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL
  interface Product {
    name: string;
    description: string;
    // Add other product properties here if needed
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch product data from your API
      fetch(`/api/products/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Product not found');
          }
          return res.json();
        })
        .then(data => setProduct(data))
        .catch(err => setError(err.message));
    }
  }, [id]);
  console.log(id)
  // Show loading state while fetching
  if (!product && !error) {
    return <div>Loading...</div>;
  }

  // Show error if product isn’t found
  if (error) {
    return <div>{error}</div>;
  }

  // Display product details
  return (
    <div>
      {product && (
        <>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          {/* Add more product details here */}
        </>
      )}
    </div>
  );
}