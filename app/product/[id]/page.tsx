"use client"

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useLanguage } from "@/contexts/language-context";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, favorites } = useFavorites();
  const { isRTL } = useLanguage();

  // Check if product is in favorites
  const isFavorited = product && favorites.some(f =>
    f.type === "product" && f.id === product.id
  );

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!product) return;

    toggleFavorite({
      ...product,
      type: "product"
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) return notFound();

  // Use language context instead of hardcoded value
  const isArabic = isRTL;

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={`p-4 ${isArabic ? "text-right" : "text-left"}`}>
      <div className="flex justify-between items-center mb-4">
        <Link href="/marketplace">
          <Button variant="outline" type="button">
            {isArabic ? "رجوع" : "Back"}
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="h-10 w-10 rounded-full"
          onClick={handleToggleFavorite}
        >
          <Heart
            className={`h-6 w-6 transition-all duration-300 ${
              isFavorited
                ? "fill-red-500 text-red-500 scale-110"
                : "text-slate-600 hover:scale-110"
            }`}
          />
        </Button>
      </div>

      <h1 className="text-2xl font-bold">{isArabic ? product.name_ar : product.name}</h1>
      <div className="relative mt-4">
        <img
          src={product.image || product.thumbnail || "/placeholder.svg"}
          alt={isArabic ? product.name_ar : product.name}
          className="w-full max-w-md rounded-lg"
        />
      </div>

      <p className="text-gray-700 mt-4">
        {isArabic ? product.description_ar : product.description}
      </p>

      <div className="flex justify-between items-center mt-6">
        <div className="text-xl font-bold">
          ${product.price?.toFixed(2)}
          {product.originalPrice && (
            <span className="text-sm text-slate-500 line-through ml-2">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button type="button" className="bg-primary hover:bg-primary/90">
          {isArabic ? "أضف إلى السلة" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
