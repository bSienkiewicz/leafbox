export const POST = async (req, res) => {
  const formDataFlag = await req.formData() // this is the formData from the client
    if (formDataFlag) {
      const file = await formDataFlag.get('file')
      const name = await formDataFlag.get('name')
      
      const formDataToSend = new FormData();
      formDataToSend.append('file', file)
      formDataToSend.append('name', name)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/upload`, {
        method: "POST",
        body: formDataToSend,
        redirect: 'follow',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const textResponse = await response.text();
      return new Response(textResponse, { status: 200 });
    }
  }