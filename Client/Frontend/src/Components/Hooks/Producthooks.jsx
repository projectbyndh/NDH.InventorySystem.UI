import ProductService from "../Api/Productapi";
import { useState, useEffect } from "react";
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    // 🟦 Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductService.getAll();
        setProducts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return { products, loading, error };
};

    // Return state and actions
    return { products, loading, error };
};
    // 🟩 Create new product
// 🟩 Create new product
const createProduct = async (productData) => {
  setLoading(true);
  try {
    const response = await ProductService.create(productData);
    setProducts((prevProducts) => [...prevProducts, response.data]);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
    return { products, loading, error, createProduct };
    // 🟥 Delete product
const deleteProduct = async (productId) => {
  setLoading(true);
  try {
    await ProductService.remove(productId);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
    return { products, loading, error, createProduct, deleteProduct };
    