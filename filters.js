/*
 * Project: Milestone 1
 * File Name: filters.js
 * Description: Color-grading filters
 *
 * Created Date: 2024/02/21
 * Author: Liam Jackson
 */

function grayscaleFilter(image) {
		for (let y = 0; y < image.height; y++) {
				for (let x = 0; x < image.width; x++) {
						let idx = (image.width * y + x) << 2;
						let gray =
								0.2126 * image.data[idx] +
								0.7152 * image.data[idx + 1] +
								0.0722 * image.data[idx + 2];
						image.data[idx] = gray;
						image.data[idx + 1] = gray;
						image.data[idx + 2] = gray;
				}
		}
		return image;
}

function sepiaFilter(image) {
		for (let y = 0; y < image.height; y++) {
				for (let x = 0; x < image.width; x++) {
						let idx = (image.width * y + x) << 2;
						let newR =
								0.393 * image.data[idx] +
								0.769 * image.data[idx + 1] +
								0.189 * image.data[idx + 2];
						let newG =
								0.349 * image.data[idx] +
								0.686 * image.data[idx + 1] +
								0.168 * image.data[idx + 2];
						let newB =
								0.272 * image.data[idx] +
								0.534 * image.data[idx + 1] +
								0.131 * image.data[idx + 2];
						image.data[idx] = newR > 255 ? 255 : newR;
						image.data[idx + 1] = newG > 255 ? 255 : newG;
						image.data[idx + 2] = newB > 255 ? 255 : newB;
				}
		}
		return image;
}

module.exports = { grayscaleFilter, sepiaFilter };
