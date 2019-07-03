function _decryptBuffer(bufferData) {
    let binary = '';
    let len = bufferData.length;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bufferData[i]);
    }
    return binary;
}
