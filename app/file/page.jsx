"use client";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    
  };

  useEffect(() => {
    console.log(file)
  }, [file])

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
        <input id="file" type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])} />
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
