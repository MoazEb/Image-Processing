import React from 'react'
import Card from './Card'
import img1 from '../assets/3.svg'
import img2 from '../assets/8.svg'
import img3 from '../assets/9.svg'
import img4 from '../assets/6.svg'
import img5 from '../assets/11.svg'
import img6 from '../assets/13.svg'

const algorithms = [
    {
        title: "Average Grayscale",
        description: "Converts color images to grayscale by averaging the RGB values of each pixel",
        image: img1,
        onHoverImage: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500&auto=format&fit=crop&q=60&grayscale"
    },
    {
        title: "Negative",
        description: "Converts color images to negative by subtracting each pixel value from 255",
        image: img2,
        onHoverImage: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&auto=format&fit=crop&q=60&negative=1"
    },
    {
        title: "Thresholding",
        description: "Converts images to binary (black and white) by applying a threshold value",
        image: img3,
        onHoverImage: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&auto=format&fit=crop&q=60&threshold=1"
    },
    {
        title: "Average Spatial filter",
        description: "Smooths images by replacing each pixel with the average value of its neighborhood pixels",
        image: img4,
        onHoverImage: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&auto=format&fit=crop&q=60&filtered=1"
    },
    {
        title: "Median Spatial filter",
        description: "Reduces noise in images by replacing each pixel with the median value of its neighborhood pixels",
        image: img5,
        onHoverImage: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&auto=format&fit=crop&q=60&filtered=1"
    },
    {
        title: "Weighted average Spatial filter",
        description: "Similar to average filter but gives different weights to neighborhood pixels",
        image: img6,
        onHoverImage: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500&auto=format&fit=crop&q=60&filtered=1"
    }
]

const List = () => {
    return (
        <div className='flex flex-wrap justify-center md:justify-start'>
            {
                algorithms.map((alg, idx) => {
                    return <Card key={idx} idx={idx} title={alg.title} description={alg.description} image={alg.image} />
                })
            }
        </div>
    )
}

export default List 