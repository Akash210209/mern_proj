import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, IconButton, Typography, Grid } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/Reducers/AuthReducer';

const Homepage = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.auth.products); // Get products from the Redux store

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchProducts()); // Dispatch fetchProducts after a 3-second delay
    }, 3000);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  // Handle Delete action
  const handleDelete = (id) => {
    // Call API to delete product
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => {
        console.log('Product deleted successfully');
        dispatch(fetchProducts()); // Re-fetch products after deletion
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        alert('Failed to delete the product.');
      });
  };

  // Handle Edit action
  const handleEdit = (id) => {
    console.log('Edit product with id:', id);
    // You can navigate to an edit page or open a modal for editing
  };

  return (
    <Grid container spacing={3}>
      {products?.length ? (
        products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <div style={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.image}
                  alt={product.name}
                />
                <IconButton
                  style={{ position: 'absolute', top: 10, right: 10 }}
                  onClick={() => handleEdit(product._id)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  style={{ position: 'absolute', top: 10, right: 40 }}
                  onClick={() => handleDelete(product._id)}
                >
                  <Delete />
                </IconButton>
              </div>
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ₹{product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="h6" color="textSecondary">
          No products found
        </Typography>
      )}
    </Grid>
  );
};

export default Homepage;
