import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Card = ({ idx, title, description, image, onHoverImage }) => {
    const [effectClass, setEffectClass] = useState("group-hover:grayscale");
    const [textEffectClass, setTextEffectClass] = useState("");

    useEffect(() => {
        switch (title) {
            case "Average Grayscale":
                setEffectClass("group-hover:grayscale");
                setTextEffectClass("group-hover:text-gray-600");
                break;
            case "Negative":
                setEffectClass("group-hover:invert");
                setTextEffectClass("group-hover:text-blue-800");
                break;
            case "Thresholding":
                setEffectClass("group-hover:grayscale group-hover:invert group-hover:brightness-100");
                setTextEffectClass("group-hover:text-black");
                break;
            case "Average Spatial filter":
            case "Median Spatial filter":
            case "Weighted average Spatial filter":
                setEffectClass("group-hover:blur-[1px]");
                setTextEffectClass("group-hover:group-hover:text-amber-800");
                break;
            default:
                setEffectClass("group-hover:grayscale");
                setTextEffectClass("group-hover:text-gray-600");
        }
    }, [title])

    return (
        <Link
            to={`/effect/${title}`}
            className={`max-w-sm p-2 rounded-xl border-2 border-amber-900 hover:border-amber-300 overflow-hidden bg-gray-50 hover:bg-amber-100 hover:shadow-sm hover:shadow-orange-300 duration-700 transition-all transform m-4 hover:cursor-pointer group`}>
            <div className="overflow-hidden">
                <img
                    className={`w-full h-48 object-center object-cover duration-700 transition-all ${effectClass}`}
                    src={image}
                    alt={title}
                />
            </div>
            <div className="px-6 py-4">
                <div className={`font-bold text-xl text-center mb-2 text-amber-900 duration-700 transition-all ${textEffectClass}`}>{title}</div>
                <p className={`text-gray-700 text-base text-center duration-700 transition-all ${textEffectClass}`}>
                    {description}
                </p>
            </div>
        </Link>
    )
}

export default Card