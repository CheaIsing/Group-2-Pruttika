const QRcode = require("qrcode")

// Generate QR Code
async function generateQRCodeImg(token) {
    try {
        const qrCodeDataURL = await QRcode.toDataURL(`${token}`);
    // console.log('QR Code generated successfully');
    // console.log(qrCodeDataURL);
    
    return qrCodeDataURL;
    } catch (error) {
        console.log(error);
        return null
    }
    
  }

// QR Code
const qrCodeGet = async (req, res) => {
    const qrCodeData = await generateSharedAttendanceQRCode();
    res.json({
        result: true,
        data: qrCodeData,
    });
};

module.exports = {
    qrCodeGet,
    generateQRCodeImg
};
