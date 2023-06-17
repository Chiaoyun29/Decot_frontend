import React, { useState } from 'react';
import { uploadImage } from '../services/api';

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('image, selectedImage');

    fetchImages('/api/images', formData)
    .then(response => {
      console.log(response.data);
        // Image uploaded successfully
    })
      .catch(error => {
        console.error(response.error);
    });
  };

  const fetchWorkspaces = async () => {
    const response = await getWorkspaces(token);
    if (response.status === 200) {
      setWorkspaces(response.workspaces);
    } else {
      console.error(response.error);
    }
  };
  const handleImageSelect= (event) => {
    setSelectedImage(event.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={handleImageSelect} />
      <button onClick={handleImageUpload}>Upload Image</button>
    </div>
  );
}

export default ImageUpload;
