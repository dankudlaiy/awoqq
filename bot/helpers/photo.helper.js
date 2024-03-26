const sharp = require("sharp");

async function resizeImage(arrayBuffer) {
    return  await sharp(arrayBuffer)
        .resize(512, 512, {
            fit: 'fill'
        })
        .toBuffer();
}

module.exports = { resizeImage }