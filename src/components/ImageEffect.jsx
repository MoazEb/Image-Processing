import { useState } from 'react'
import React from 'react'
import { useParams } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const ImageEffect = () => {
    const { title } = useParams()
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [processedImage, setProcessedImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [threshold, setThreshold] = useState(128); // Mid-point threshold value

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(file))
            setProcessedImage(null)
        }
    }

    const handleSaveImage = () => {
        if (processedImage) {
            const link = document.createElement('a')
            link.href = processedImage
            const extension = selectedImage.type === 'image/png' ? 'png' : 'jpg'
            link.download = `processed_${title.toLowerCase().replace(/\s+/g, '_')}.${extension}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const handleApplyEffect = async () => {
        if (!selectedImage) return

        setIsLoading(true);
        NProgress.start();
        const chunkSize = 40; // Process 10 rows at a time
        const prevDate = new Date().getTime();
        try {
            // Create canvas and load image
            const img = new Image()
            img.src = imagePreview

            // Wait for image to load
            await new Promise((resolve) => { img.onload = resolve })

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const width = imageData.width
            const height = imageData.height

            if (title === "Average Grayscale") {
                for (let m = 0; m < height; m += chunkSize) {
                    const End = Math.min(height, m + chunkSize);

                    await new Promise(resolve => setTimeout(resolve, 0));
                    NProgress.set(m / height);

                    for (let y = m; y < End; y++) {
                        for (let x = 0; x < width; x++) {
                            const idx = (y * width + x) * 4;
                            const avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                            data[idx] = avg;     // R
                            data[idx + 1] = avg; // G 
                            data[idx + 2] = avg; // B
                        }
                    }
                }
            }

            else if (title === "Thresholding") {
                // Process multiple pixels at once for better performance
                for (let m = 0; m < height; m += chunkSize) {
                    const End = Math.min(height, m + chunkSize);

                    await new Promise(resolve => setTimeout(resolve, 0));
                    NProgress.set(m / height);

                    // Process 4 pixels at a time using array operations
                    for (let y = m; y < End; y++) {
                        for (let x = 0; x < width; x += 4) {
                            const remainingPixels = Math.min(4, width - x);

                            for (let i = 0; i < remainingPixels; i++) {
                                const idx = (y * width + x + i) * 4;
                                const avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                                const value = avg > threshold ? 255 : 0;

                                // Set RGB values in one go
                                data[idx] = data[idx + 1] = data[idx + 2] = value;
                            }
                        }
                    }
                }
            }

            else if (title === "Negative") {
                for (let m = 0; m < height; m += chunkSize) {
                    const End = Math.min(height, m + chunkSize);

                    await new Promise(resolve => setTimeout(resolve, 0));
                    NProgress.set(m / height);

                    for (let y = m; y < End; y++) {
                        for (let x = 0; x < width; x++) {
                            const idx = (y * width + x) * 4;
                            // Convert to binary black or white based on threshold
                            data[idx] = 255 - data[idx];     // R
                            data[idx + 1] = 255 - data[idx + 1]; // G 
                            data[idx + 2] = 255 - data[idx + 2]; // B
                        }
                    }
                }
            }

            else if (title === "Average Spatial filter") {
                // 3x3 average filter

                for (let m = 1; m < height - 1; m += chunkSize) {
                    const End = Math.min(height - 1, m + chunkSize);

                    await new Promise(resolve => setTimeout(resolve, 0));
                    NProgress.set(m / (height - 1));

                    for (let y = m; y < End; y++) {
                        for (let x = 1; x < width - 1; x++) {
                            for (let c = 0; c < 3; c++) {
                                let sum = 0
                                for (let dy = -1; dy <= 1; dy++) {
                                    for (let dx = -1; dx <= 1; dx++) {
                                        const idx = ((y + dy) * width + (x + dx)) * 4 + c
                                        sum += data[idx]
                                    }
                                }
                                const idx = (y * width + x) * 4 + c
                                data[idx] = sum / 9
                            }
                        }
                    }
                }
            } else if (title === "Median Spatial filter") {
                // Pre-allocate arrays to avoid repeated memory allocation
                const values = new Array(9);
                // Create typed array for faster sorting
                const sortBuffer = new Uint8Array(9);

                for (let yStart = 1; yStart < height - 1; yStart += chunkSize) {
                    const yEnd = Math.min(yStart + chunkSize, height - 1);

                    await new Promise(resolve => setTimeout(resolve, 0));
                    NProgress.set(yStart / (height - 1));

                    for (let y = yStart; y < yEnd; y++) {
                        for (let x = 1; x < width - 1; x++) {
                            // Process all channels together to reduce loop overhead
                            const centerIdx = (y * width + x) * 4;

                            for (let c = 0; c < 3; c++) {
                                // Use direct indexing instead of nested loops
                                let valueIdx = 0;
                                sortBuffer[valueIdx++] = data[centerIdx - width * 4 - 4 + c];  // top-left
                                sortBuffer[valueIdx++] = data[centerIdx - width * 4 + c];      // top
                                sortBuffer[valueIdx++] = data[centerIdx - width * 4 + 4 + c];  // top-right
                                sortBuffer[valueIdx++] = data[centerIdx - 4 + c];              // left
                                sortBuffer[valueIdx++] = data[centerIdx + c];                  // center
                                sortBuffer[valueIdx++] = data[centerIdx + 4 + c];              // right
                                sortBuffer[valueIdx++] = data[centerIdx + width * 4 - 4 + c];  // bottom-left
                                sortBuffer[valueIdx++] = data[centerIdx + width * 4 + c];      // bottom
                                sortBuffer[valueIdx++] = data[centerIdx + width * 4 + 4 + c];  // bottom-right

                                // Quick select algorithm for finding median (faster than sorting)
                                data[centerIdx + c] = quickSelect(sortBuffer, 0, 8, 4);
                            }
                        }
                    }
                }
            } else if (title === "Weighted average Spatial filter") {
                // 3x3 weighted average filter with Gaussian-like weights
                const weights = [
                    [1, 2, 1],
                    [2, 4, 2],
                    [1, 2, 1]
                ]
                const weightSum = 16 // sum of all weights
                for (let m = 1; m < height - 1; m += chunkSize) {
                    const End = Math.min(m + chunkSize, height - 1);

                    await new Promise(resolve => setTimeout(resolve, 0));
                    NProgress.set(m / (height - 1));

                    for (let y = m; y < End; y++) {
                        for (let x = 1; x < width - 1; x++) {
                            for (let c = 0; c < 3; c++) {
                                let sum = 0
                                for (let dy = -1; dy <= 1; dy++) {
                                    for (let dx = -1; dx <= 1; dx++) {
                                        const idx = ((y + dy) * width + (x + dx)) * 4 + c
                                        sum += data[idx] * weights[dy + 1][dx + 1]
                                    }
                                }
                                const idx = (y * width + x) * 4 + c
                                data[idx] = sum / weightSum
                            }
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0)
            const imageType = selectedImage.type === 'image/png' ? 'image/png' : 'image/jpeg'
            const processedImageUrl = canvas.toDataURL(imageType)
            setProcessedImage(processedImageUrl)
            alert(`Estimated Time in Seconds ${(new Date().getTime() - prevDate) / 1000}`)

        } catch (error) {
            console.error("Sorry Error Occuried", error);
            alert('Failed to process image. Please try again.')
        }
        finally {
            NProgress.done();
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center my-8">
            <h1 className="text-2xl md:text-4xl text-amber-900 font-bold mb-8">{title} Effect</h1>

            <div className="border-2 border-dashed border-amber-900 rounded-lg p-4 mb-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block text-sm text-amber-900
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-amber-200 file:text-amber-900
                        file:cursor-pointer file:transition-all file:duration-300
                        hover:file:bg-amber-100
                        cursor-pointer"
                />
            </div>

            {
                title === "Thresholding" && (
                    <>
                        <input
                            type="number"
                            className="block text-sm text-amber-900 
                                border-2 border-amber-900 rounded-lg
                                min-w-64
                                px-4 py-2 mb-4
                                focus:outline-none focus:ring-2 focus:ring-amber-600
                                bg-amber-50"
                            placeholder="Enter threshold value (0-255)"
                            min={0}
                            max={255}
                            value={threshold}
                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                        />
                    </>
                )
            }
            {imagePreview && (
                <>
                    <h2 className="text-xl md:text-2xl text-amber-900 font-bold mb-4">Your Image</h2>
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-md w-full rounded-lg shadow-lg mb-4"
                    />
                </>
            )}

            {isLoading && (
                <h2 className='text-xl md:text-2xl text-amber-900 font-bold my-4 text-center'>Please Wait while Effect is Processing...</h2>
            )}

            {processedImage && !isLoading && (
                <>
                    <h2 className="text-xl md:text-2xl text-amber-900 font-bold mb-4">Processed Image</h2>
                    <img
                        src={processedImage}
                        alt="Processed"
                        className="max-w-md w-full rounded-lg shadow-lg mb-4"
                    />
                    <button
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 mb-4"
                        onClick={handleSaveImage}>
                        Save Image
                    </button>
                </>
            )}
            <button
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedImage || isLoading}
                onClick={handleApplyEffect}>
                Apply Effect
            </button>
        </div>
    )
}

// Add this helper function outside the main function
function quickSelect(arr, left, right, k) {
    if (left === right) return arr[left];

    let pivotIndex = partition(arr, left, right);

    if (k === pivotIndex) return arr[k];
    else if (k < pivotIndex) return quickSelect(arr, left, pivotIndex - 1, k);
    else return quickSelect(arr, pivotIndex + 1, right, k);
}

function partition(arr, left, right) {
    let pivot = arr[right];
    let i = left;

    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
        }
    }
    [arr[i], arr[right]] = [arr[right], arr[i]];
    return i;
}

export default ImageEffect