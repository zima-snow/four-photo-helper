import { MAX_WIDTH, MAX_HEIGHT, MAX_SIZE_OF_IMAGE } from '../consts/common.js';

export const isUploadSupported = () => {
  if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
      return false;
  }

  const elem = document.createElement('input');
  elem.type = 'file';
  return !elem.disabled;
};

export const convertUrlToDataUrl = (url, callback) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const extension = url.substring(url.lastIndexOf('.') + 1);
  const fileType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;

  const baseImage = new Image();
  baseImage.src = url;
  baseImage.crossOrigin = 'anonymous';
  baseImage.onload = () => {
    context.drawImage(baseImage, 1, 1);
    const dataUrl = canvas.toDataURL(fileType);
    callback(dataUrl, fileType);
  }
};

export const compressFile = (dataURL, fileType, callback) => {
	const image = new Image();
  image.src = dataURL;

	image.onload = () => {
		const width = image.width;
		const height = image.height;
		const shouldResize = (width > MAX_WIDTH) || (height > MAX_HEIGHT);

		if (!shouldResize) {
			callback(dataURL);
			return;
		}

		let newWidth;
		let newHeight;

		if (width > height) {
			newHeight = height * (MAX_WIDTH / width);
			newWidth = MAX_WIDTH;
		} else {
			newWidth = width * (MAX_HEIGHT / height);
			newHeight = MAX_HEIGHT;
		}

		const canvas = document.createElement('canvas');

		canvas.width = newWidth;
		canvas.height = newHeight;

		const context = canvas.getContext('2d');
		context.drawImage(image, 0, 0, newWidth, newHeight);
		const newDataUrl = canvas.toDataURL(fileType);

    callback(newDataUrl);
	};

	image.onerror = () => {
		alert('Ошибка при сжатии изображения. Будет загружено исходное изображение');
  };
};

export const isSizeOfBase64LessMax = (src) => {
  let base64Length = src.length - (src.indexOf(',') + 1);
  let padding = (src.charAt(src.length - 2) === '=') ? 2 : ((src.charAt(src.length - 1) === '=') ? 1 : 0);
  let fileSize = base64Length * 0.75 - padding;

  return fileSize <= MAX_SIZE_OF_IMAGE;
}
