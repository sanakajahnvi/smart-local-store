import { useEffect, useState } from "react";
import localProducts from "../data/products";
import { fetchProducts } from "../services/productApi";

export function useProducts() {
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const liveProducts = await fetchProducts();

        if (mounted && liveProducts.length) {
          setProducts(liveProducts);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Live product API unavailable. Using SmartStore catalog.");
          setProducts(localProducts);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading, error };
}

export default useProducts;