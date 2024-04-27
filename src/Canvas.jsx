import React, { useState, useEffect, useRef } from "react";
import CanvasManager from "./CanvasManager";
import { SketchPicker } from "react-color";
import star from "./assets/star.svg";
import avatar from "./assets/avatar.svg";

const Editor = ({ templateData }) => {
  const hiddenFileInput = useRef(null);
  const [canvasManager, setCanvasManager] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#0369A1");
  const [colorHistory, setColorHistory] = useState([]);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const [captionText, setCaptionText] = useState(
    "1 & 2 BHK Luxury Apartments at just Rs.34.97Lakhs"
  );
  const [ctaText, setCtaText] = useState("ShopNow");
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Initialize CanvasManager when component mounts
    const canvas = document.getElementById("editor-canvas");
    const ctx = canvas.getContext("2d");
    const canvasManagerInstance = new CanvasManager(
      ctx,
      backgroundColor,
      captionText,
      ctaText,
      image,
      templateData
    );
    setCanvasManager(canvasManagerInstance);
  }, [backgroundColor, captionText, ctaText, image]);

  const handleCaptionChange = (e) => {
    const newText = e.target.value;
    setCaptionText(newText);
  };

  const handleCtaChange = (e) => {
    const newText = e.target.value;
    setCtaText(newText);
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          setImage(image);
          canvasManager.updateImage(image);
        };
      };
      reader.readAsDataURL(file);
    }
  };
  const handleColorChange = (color) => {
    setBackgroundColor(color);
    // Add the selected color to the color history
    setColorHistory((prevColors) => {
      const newColors = [...prevColors, color];
      // Keep only the last 5 colors in the history
      return newColors.slice(-5);
    });
  };
  const handleColorHistoryClick = (color) => {
    setBackgroundColor(color);
  };

  return (
    <div className="flex gap-10">
      <div className="w-1/2 p-10 bg-[url(https://cdn.vectorstock.com/i/preview-2x/35/76/gray-and-white-gradient-diagonal-lines-pattern-vector-19623576.webp)]">
        <canvas
          id="editor-canvas"
          height="1080px"
          width="1080px"
          className="w-full h-full"
          style={{ border: "1px solid #000" }}
        ></canvas>
      </div>
      <div className="w-1/2 p-4">
        <div className=" text-center p-2 mb-10">
          <h1 className="p-1 mt-5 font-semibold text-2xl">Ad customisation</h1>
          <p className="text-gray-500 text-sm">
            Customise your add and get the templates accordingly
          </p>
        </div>
        <div className="border-2 p-3 rounded-xl">
          <div className="flex items-center">
            <img src={avatar} alt="Upload Img" className="h-7 w-7 mr-2" />
            <p className="text-sm">Change the ad create image.</p>
            <p
              className="ml-1 underline text-blue-700 cursor-pointer"
              onClick={handleClick}
            >
              Select file
              <input
                ref={hiddenFileInput}
                className="hidden"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </p>
          </div>
        </div>
        <div className="flex py-5 items-center my-5">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">
            Content
          </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="border-2 py-2 px-4 rounded-xl">
            <p className="text-gray-500 text-sm w-full">Ad content</p>
            <div className="flex">
              <input
                className="text-md w-full focus:border-transparent focus:outline-none"
                type="text"
                value={captionText}
                onChange={handleCaptionChange}
              />
              <img src={star} alt="Gen AI" className="h-6 w-6 cursor-pointer" />
            </div>
          </div>
          <div className="border-2 px-4 py-2 rounded-xl">
            <p className="text-gray-500 text-sm w-full">CTA</p>
            <input
              className="text-md w-full focus:border-transparent focus:outline-none"
              type="text"
              value={ctaText}
              onChange={handleCtaChange}
            />
          </div>
          <div>
            <p className="text-gray-500 text-sm w-full ml-1 mb-2">
              Choose your color
            </p>
            <div className="flex">
              <div className="flex">
                {colorHistory.map((color, index) => (
                  <div
                    key={index}
                    className={`h-8 w-8 rounded-full mr-2 cursor-pointer ${
                      backgroundColor === color
                        ? "border-4 border-blue-800"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorHistoryClick(color)}
                  ></div>
                ))}
                <button
                  className="border-2 h-8 w-8 mr-2 rounded-full"
                  onClick={() => setColorPickerVisible(!colorPickerVisible)}
                >
                  +
                </button>
              </div>
              <div>
                {colorPickerVisible && (
                  // <SketchPicker
                  //   color={backgroundColor}
                  //   onChange={(backgroundColor) =>
                  //     handleColorChange(backgroundColor)
                  //   }
                  // />
                  <input
                    type="color"
                    className="cursor-pointer"
                    id="color-picker"
                    value={backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
