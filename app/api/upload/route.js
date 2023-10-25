export const POST = async (req, res) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: file,
    });

    if (!response.ok) {
      return res.status(500).json({
        error: "Error uploading file",
      });
    }

    const result = await response.json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error uploading file",
    });
  }
};
