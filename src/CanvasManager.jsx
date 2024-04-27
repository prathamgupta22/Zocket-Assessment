class CanvasManager {
  constructor(ctx, backgroundColor, captionText, ctaText, image, templateData) {
    this.ctx = ctx;
    this.backgroundColor = backgroundColor;
    this.captionText = captionText;
    this.ctaText = ctaText;
    this.image = image;
    this.templateData = templateData;

    this.initializeCanvas();
  }
  initializeCanvas() {
    // Clear canvas
    this.ctx.clearRect(0, 0, 1080, 1080);

    // Draw background color
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, 1080, 1080);

    // Draw other elements (design pattern, mask, mask stroke) - Implement based on template data

    // Draw Design Pattern
    const designPatternImage = new Image();
    designPatternImage.src = this.templateData.urls.design_pattern;
    designPatternImage.onload = () => {
      this.ctx.drawImage(designPatternImage, 0, 0, 1080, 1080);
    };

    //draw mask
    //If the image is uploaded than image is displayed in place of mask
    if (this.image) {
      const maskImage = new Image();
      maskImage.src = this.templateData.urls.mask;

      maskImage.onload = () => {
        // Draw the mask
        this.drawImageWithMask(this.image, maskImage, 56, 442, 970, 600);
      };
    } else {
      //otherwise mask is displayed
      const maskImage = new Image();
      maskImage.src = this.templateData.urls.mask;

      maskImage.onload = () => {
        // Draw the mask
        this.ctx.drawImage(
          maskImage,
          this.templateData.image_mask.x,
          this.templateData.image_mask.y,
          this.templateData.image_mask.width,
          this.templateData.image_mask.height
        );
      };
    }
    //Draw mask stroke
    this.drawMaskStroke();
    // Draw text elements
    this.drawText();
  }

  drawImageWithMask = (image, mask, x, y, width, height) => {
    const offScreenCanvas = document.createElement("canvas");
    const offScreenContext = offScreenCanvas.getContext("2d");

    // Set the off-screen canvas size
    offScreenCanvas.width = width;
    offScreenCanvas.height = height;

    // Draw the mask on the off-screen canvas
    offScreenContext.drawImage(mask, 0, 0, width, height);

    // Set 'source-in' for the mask
    offScreenContext.globalCompositeOperation = "source-in";

    // Draw the image on the off-screen canvas
    offScreenContext.drawImage(image, 0, 0, width, height);

    // Reset 'source-over' for subsequent drawings
    offScreenContext.globalCompositeOperation = "source-over";

    // Draw the off-screen canvas onto the main canvas
    this.ctx.drawImage(offScreenCanvas, x, y);
  };

  drawMaskStroke = () => {
    const maskStrokeImage = new Image();
    maskStrokeImage.src = this.templateData.urls.stroke;

    maskStrokeImage.onload = () => {
      // Draw the mask
      this.ctx.drawImage(
        maskStrokeImage,
        this.templateData.image_mask.x,
        this.templateData.image_mask.y,
        this.templateData.image_mask.width,
        this.templateData.image_mask.height
      );
    };
  };

  drawText() {
    const caption = {
      text: this.captionText,
      position: this.templateData.caption.position,
      font_size: this.templateData.caption.font_size,
      alignment: this.templateData.caption.alignment,
      text_color: this.templateData.caption.text_color,
      max_characters_per_line:
        this.templateData.caption.max_characters_per_line,
    };

    this.drawtextElement(caption);

    const cta = {
      text: this.ctaText,
      position: this.templateData.cta.position,
      font_size: this.templateData.cta.font_size,
      text_color: this.templateData.cta.text_color,
      alignment: this.templateData.cta.alignment,
      max_characters_per_line: this.templateData.cta.max_characters_per_line,
      bgColor: this.templateData.cta.background_color,
    };
    this.drawCtaElement(cta);
  }

  drawtextElement({
    text,
    position,
    font_size,
    alignment,
    text_color,
    max_characters_per_line,
  }) {
    this.ctx.fillStyle = text_color;
    this.ctx.font = `${font_size}px Arial`;
    this.ctx.textAlign = alignment;

    let lines = [];
    let currentLine = "";
    const words = text.split(" ");

    words.forEach((word) => {
      const testLine = currentLine + word + " ";
      const testWidth = this.ctx.measureText(testLine).width;

      if (testWidth > max_characters_per_line * (font_size / 2)) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });

    lines.push(currentLine.trim());

    lines.forEach((line, index) => {
      this.ctx.fillText(line, position.x, position.y + index * font_size * 1.2);
    });
  }
  drawCtaElement({
    text,
    position,
    font_size = 30,
    alignment = "center",
    text_color,
    bgColor,
    max_characters_per_line = 20,
  }) {
    // Calculate rectangle dimensions based on text size
    const { rectWidth, rectHeight, lines } =
      this.calculateDynamicRectDimensions(
        text,
        font_size,
        max_characters_per_line
      );
    const offScreenCanvas = document.createElement("canvas");
    const offScreenContext = offScreenCanvas.getContext("2d");

    // Set the off-screen canvas size
    offScreenCanvas.width = rectWidth;
    offScreenCanvas.height = rectHeight;

    // Clear the off-screen canvas
    offScreenContext.clearRect(0, 0, rectWidth, rectHeight);

    // Draw the rounded rectangle on the off-screen canvas
    offScreenContext.roundRect(0, 0, rectWidth, rectHeight, 10);
    offScreenContext.fillStyle = bgColor;
    offScreenContext.fill();

    // Draw text centered within the rectangle
    offScreenContext.fillStyle = text_color;
    offScreenContext.font = `${font_size}px Arial`;
    offScreenContext.textAlign = alignment;
    offScreenContext.textBaseline = "middle"; // Center text vertically

    const lineHeight = font_size;

    // Calculate vertical position for multiline text
    const totalTextHeight = lines.length * lineHeight;
    const startY = rectHeight / 2 - totalTextHeight / 2;

    lines.forEach((line, index) => {
      const textY = startY + index * lineHeight + lineHeight / 2;
      offScreenContext.fillText(line, rectWidth / 2, textY);
    });

    // Draw the off-screen canvas onto the main canvas
    this.ctx.drawImage(
      offScreenCanvas,
      position.x - rectWidth / 2,
      position.y - rectHeight / 2
    );
  }

  calculateDynamicRectDimensions(text, font_size, max_characters_per_line) {
    const words = text.split(" ");

    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + word + " ";
      const testWidth = this.ctx.measureText(testLine).width;

      if (testWidth > max_characters_per_line * (font_size / 2)) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });

    lines.push(currentLine.trim());

    // Calculate total width and height based on the maximum width and number of lines
    const maxLineWidth = max_characters_per_line * (font_size / 2);
    const totalWidth = Math.min(
      this.ctx.measureText(lines[0]).width,
      maxLineWidth + 40
    );
    const totalHeight = lines.length * font_size;

    // Ensure minimum height
    const minHeight = font_size + 20;
    const rectHeight = Math.max(minHeight, totalHeight + 20);

    return { rectWidth: totalWidth + 40, rectHeight, lines };
  }
}

export default CanvasManager;
