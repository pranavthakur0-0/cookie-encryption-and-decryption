const asciiChars = Array.from(Array(128).keys()).map((x) => String.fromCharCode(x));
const permutation = shuffleArray(asciiChars);
const key = `${process.env.SECRET}`;

function encrypt(text) {
  try {
    if (typeof text !== 'string' || typeof key !== 'string') {
      throw new Error('Invalid input. Expected text and key to be strings.');
    }

    let buffer = Buffer.from(text);
    const keyBuffer = Buffer.from(key);
    if (buffer.length < 200) {
      const salt = Buffer.alloc(200 - buffer.length);
      buffer = Buffer.concat([buffer, salt]);
    }
    const encryptedBuffer = Buffer.alloc(50);

    for (let i = 0; i < 50; i++) {
      const charCode = buffer[i];
      const keyByte = keyBuffer[i % keyBuffer.length];
      const encryptedByte = permutation[(charCode + keyByte) % 128].charCodeAt(0);
      encryptedBuffer[i] = encryptedByte;
    }
    return encryptedBuffer.toString("base64");
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

// Decryption function
function decrypt(encryptedText) {
  try {
    if (typeof encryptedText !== 'string' || typeof key !== 'string') {
      throw new Error('Invalid input. Expected encryptedText and key to be strings.');
    }

    const encryptedBuffer = Buffer.from(encryptedText, "base64");
    const decryptedBuffer = Buffer.alloc(200); 

    for (let i = 0; i < encryptedBuffer.length; i++) {
      const encryptedByte = encryptedBuffer[i];
      const keyByte = key.charCodeAt(i % key.length);
      const decryptedByte = (permutation.indexOf(String.fromCharCode(encryptedByte)) - keyByte + 128) % 128;
      decryptedBuffer[i] = decryptedByte;
    }
    if (decryptedBuffer.length > 200) {
      const originalSize = 200; 
      const decryptedWithoutSalt = decryptedBuffer.slice(0, originalSize);
      return decryptedWithoutSalt.toString();
    }

    return decryptedBuffer.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

function shuffleArray(array) {
  const shuffled = [...array];
  const fixedOrder = [2, 0, 1, 3, 4]; 
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = fixedOrder[i];
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

module.exports = { encrypt, decrypt };
