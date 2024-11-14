import React, { useState } from 'react';

const createproduct = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Getting the file object
    setProductImage(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productImage) {
      alert('Please provide all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('image', productImage); // Appending the file

    try {
      // Make a POST request to the backend to upload the product
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData, // Sending form data
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Product uploaded:', data);
        alert('Product uploaded successfully');
      } else {
        console.error('Error uploading product:', data);
        alert('Error uploading product');
      }
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Error uploading product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Product Price"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={handleFileChange}
        required
      />
      <button type="submit">Upload Product</button>
    </form>
  );
};

export default createproduct;
