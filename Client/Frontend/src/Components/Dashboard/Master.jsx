import React, { useState } from 'react';

function Master() {
  // State management for form fields
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setErrors((prev) => ({ ...prev, image: '' }));
    } else {
      setImage(null);
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image file.' }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!productName.trim()) newErrors.productName = 'Product Name is required.';
    if (!productCode.trim()) newErrors.productCode = 'Product Code is required.';
    if (!category.trim()) newErrors.category = 'Category is required.';
    if (!image) newErrors.image = 'Image is required.';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      console.log({ productName, productCode, category, image });
      // Reset form after submission
      setProductName('');
      setProductCode('');
      setCategory('');
      setImage(null);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-2">Product Name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  setErrors((prev) => ({ ...prev, productName: '' }));
                }}
                placeholder="e.g., Wireless Headphones"
                className={`w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 ${
                  errors.productName ? 'border-red-300' : 'border-gray-200'
                } bg-gray-50 text-gray-800 placeholder-gray-400`}
                required
              />
              {errors.productName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.productName}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-2">Product Code *</label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => {
                  setProductCode(e.target.value);
                  setErrors((prev) => ({ ...prev, productCode: '' }));
                }}
                placeholder="e.g., WH-1000XM5"
                className={`w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 ${
                  errors.productCode ? 'border-red-300' : 'border-gray-200'
                } bg-gray-50 text-gray-800 placeholder-gray-400`}
                required
              />
              {errors.productCode && <p className="mt-1 text-xs text-red-500 font-medium">{errors.productCode}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-2">Category *</label>
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setErrors((prev) => ({ ...prev, category: '' }));
                }}
                placeholder="e.g., Electronics"
                className={`w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all duration-200 ${
                  errors.category ? 'border-red-300' : 'border-gray-200'
                } bg-gray-50 text-gray-800 placeholder-gray-400`}
                required
              />
              {errors.category && <p className="mt-1 text-xs text-red-500 font-medium">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 mb-2">Image *</label>
              <div className="mt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                  required
                />
                <label
                  htmlFor="imageUpload"
                  className={`block w-full p-3 text-sm border rounded-lg text-gray-500 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 ${
                    errors.image ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  {image ? image.name : 'Choose an image...'}
                </label>
                {errors.image && <p className="mt-1 text-xs text-red-500 font-medium">{errors.image}</p>}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Master; 