"use client"
import React, { useState } from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("file", e.target.file.files[0]);
    formData.append("name", e.target.name.value);
    console.log(formData)
    await fetch(`/api/upload`, {
      method: "POST",
      body: formData
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <form id="form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="name">Your name</label>
        <input
          name="name"
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div className="input-group">
        <label htmlFor="file">Select file</label>
        <input id="file" type="file" name="file" onChange={handleFileChange} />
      </div>
      {imageUrl && (
        <div className="input-group">
          <img src={imageUrl} alt="Selected file" />
        </div>
      )}
      <button className="submit-btn" type="submit">
        Upload
      </button>
    </form>
  );
};

export default Page;