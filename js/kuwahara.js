(function(imageproc) {
    "use strict";

    /*
     * Apply Kuwahara filter to the input data
     */
    imageproc.kuwahara = function(inputData, outputData, size) {
        console.log("Applying Kuwahara filter...");

        /*
         * TODO: You need to extend the kuwahara function to include different
         * sizes of the filter
         *
         * You need to clearly understand the following code to make
         * appropriate changes
         */

        /*
         * An internal function to find the regional stat centred at (x, y)
         */
        function regionStat(x, y, regionSize) {
            // Find the mean colour and brightness
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;
			var regionLimit = (regionSize - 1) / 2;
            for (var j = -regionLimit; j <= regionLimit; j++) {
                for (var i = -regionLimit; i <= regionLimit; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    // For the mean colour
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    // For the mean brightness
                    meanValue += (pixel.r + pixel.g + pixel.b) / 3;
                }
            }
            meanR /= (regionSize * regionSize);
            meanG /= (regionSize * regionSize);
            meanB /= (regionSize * regionSize);
            meanValue /= (regionSize * regionSize);

            // Find the variance
            var variance = 0;
            for (var j = -regionLimit; j <= regionLimit; j++) {
                for (var i = -regionLimit; i <= regionLimit; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = (pixel.r + pixel.g + pixel.b) / 3;

                    variance += Math.pow(value - meanValue, 2);
                }
            }
            variance /= (regionSize * regionSize);

            // Return the mean and variance as an object
            return {
                mean: {r: meanR, g: meanG, b: meanB},
                variance: variance
            };
        }

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Find the statistics of the four sub-regions
				var kernelLimit = (size - 1) / 2;
				var offset = kernelLimit / 2;
				var chunkSize = kernelLimit + 1;
                var regionA = regionStat(x - offset, y - offset, chunkSize);
                var regionB = regionStat(x + offset, y - offset, chunkSize);
                var regionC = regionStat(x - offset, y + offset, chunkSize);
                var regionD = regionStat(x + offset, y + offset, chunkSize);

                // Get the minimum variance value
                var minV = Math.min(regionA.variance, regionB.variance,
                                    regionC.variance, regionD.variance);

                var i = (x + y * inputData.width) * 4;

                // Put the mean colour of the region with the minimum
                // variance in the pixel
                switch (minV) {
                case regionA.variance:
                    outputData.data[i]     = regionA.mean.r;
                    outputData.data[i + 1] = regionA.mean.g;
                    outputData.data[i + 2] = regionA.mean.b;
                    break;
                case regionB.variance:
                    outputData.data[i]     = regionB.mean.r;
                    outputData.data[i + 1] = regionB.mean.g;
                    outputData.data[i + 2] = regionB.mean.b;
                    break;
                case regionC.variance:
                    outputData.data[i]     = regionC.mean.r;
                    outputData.data[i + 1] = regionC.mean.g;
                    outputData.data[i + 2] = regionC.mean.b;
                    break;
                case regionD.variance:
                    outputData.data[i]     = regionD.mean.r;
                    outputData.data[i + 1] = regionD.mean.g;
                    outputData.data[i + 2] = regionD.mean.b;
                }
            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
