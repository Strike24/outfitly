import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the Base64 image from the client request
    const { image } = await request.json();

    // // Decode Base64 image
    // const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    // const imageBuffer = Buffer.from(base64Data, 'base64');

    // // Convert the buffer to a Blob
    // const blob = new Blob([imageBuffer], { type: 'image/png' });

    // // Remove background using @imgly/background-removal
    // const resultBlob = await removeBackground(blob);

    // // Convert the result Blob back to Base64
    // const resultBase64 = await new Promise((resolve, reject) => {
    //   const reader = new FileReader();
    //   reader.onloadend = () => resolve(reader.result);
    //   reader.onerror = reject;
    //   reader.readAsDataURL(resultBlob);
    // });

    // Return the processed image - Boilplate code for background removal
    // For now, we will just return the original image
    return NextResponse.json({ image: image }, { status: 200 });
  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
