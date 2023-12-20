// Define the Node class for the Huffman tree
class Node {
    constructor(char, frequency) {
      this.char = char;
      this.frequency = frequency;
      this.left = null;
      this.right = null;
    }
  }


  // Function to decompress file content (example, replace with actual decompression logic)
function decompressFileContent(compressedBytes, root) {
  // Convert bytes back to binary string
  const binaryString = Array.from(compressedBytes)
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join('');

  // Traverse the Huffman tree to decode the binary string
  let currentNode = root;
  let decompressedText = '';

  for (const bit of binaryString) {
      currentNode = bit === '0' ? currentNode.left : currentNode.right;

      if (currentNode.char !== null) {
          // Found a leaf node, append the character to the decompressed text
          decompressedText += currentNode.char;
          currentNode = root;  // Reset back to the root for the next character
      }
  }

  return decompressedText;
}


  // Function to convert binary string to text
  function binaryStringToText(binaryString) {
    let text = '';
    for (let i = 0; i < binaryString.length; i += 8) {
      const byte = binaryString.slice(i, i + 8);
      text += String.fromCharCode(parseInt(byte, 2));
    }
    return text;
  }
  

  function createDownloadLink(content,fileName,type) {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download=fileName;
    a.textContent = 'Download Compressed File';
    return a;
}

function createDownloadLink1(content,fileName,type) {
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download=fileName;
  a.textContent = 'Download Decompressed File';
  return a;
}

  

  // Function to build the Huffman tree
  function buildHuffmanTree(text) {
    const frequencyMap = getCharacterFrequencies(text);
    const priorityQueue = Object.entries(frequencyMap).map(([char, freq]) => new Node(char, freq));
  
    while (priorityQueue.length > 1) {
      priorityQueue.sort((a, b) => a.frequency - b.frequency);
      const left = priorityQueue.shift();
      const right = priorityQueue.shift();
      const newNode = new Node(null, left.frequency + right.frequency);
      newNode.left = left;
      newNode.right = right;
      priorityQueue.push(newNode);
    }
  
    return priorityQueue[0];
  }
  
  // Function to get character frequencies
  function getCharacterFrequencies(text) {
    const frequencyMap = {};
  
    for (const char of text) {
      frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }
  
    return frequencyMap;
  }
  
  // Function to generate Huffman codes
  function generateHuffmanCodes(root, currentCode = '', codes = {}) {
    if (root) {
      if (root.char !== null) {
        codes[root.char] = currentCode;
      }
  
      generateHuffmanCodes(root.left, currentCode + '0', codes);
      generateHuffmanCodes(root.right, currentCode + '1', codes);
    }
  
    return codes;
  }
  
  // Function to encode text using Huffman codes
  function encodeText(text, codes) {
    return text.split('').map(char => codes[char]).join('');
  }
  
  // Function to pad the binary string to ensure a multiple of 8
  function padBinaryString(binaryString) {
    const paddingLength = 8 - (binaryString.length % 8);
    return binaryString + '0'.repeat(paddingLength);
  }
  
  // Function to convert a binary string to bytes
  function binaryStringToBytes(binaryString) {
    const byteCount = binaryString.length / 8;
    const bytes = new Uint8Array(byteCount);
  
    for (let i = 0; i < byteCount; i++) {
      bytes[i] = parseInt(binaryString.slice(i * 8, (i + 1) * 8), 2);
    }
  
    return bytes;
  }
  
  // Function to compress file content using Huffman coding
  function compressFileContent(content) {
    const huffmanTree = buildHuffmanTree(content);
    const huffmanCodes = generateHuffmanCodes(huffmanTree);
  
    const encodedText = encodeText(content, huffmanCodes);
    const paddedBinaryString = padBinaryString(encodedText);
  
    const compressedBytes = binaryStringToBytes(paddedBinaryString);
  
    // Return the compressed bytes or any other representation based on your needs
    return compressedBytes;
  }

  // ... (Previous Huffman coding functions)

// Function to handle file upload
// Your existing Huffman coding functions...

// Global variables to store compressed content and Huffman tree
let compressedContent = null;
let huffmanTree = null;
// Function to handle file upload
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const compressedContentDiv = document.getElementById('compressedContent');
    const downloadLink = document.getElementById('downloadLinkCompressed');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // FileReader to read the file content
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;

            // Compress the file content using Huffman coding
            compressedContent = compressFileContent(fileContent);
            huffmanTree = buildHuffmanTree(fileContent);

            // Display the compressed content
            compressedContentDiv.innerHTML = `<p>Compressed Content:</p>`;
            compressedContentDiv.appendChild(createDownloadLink(compressedContent,'compressed.bin', 'text/plain'));

            // Show the download link
            downloadLink.style.display = 'block';
        };

        reader.readAsText(file);
    } else {
        compressedContentDiv.innerHTML = `<p>Please choose a file.</p>`;
        downloadLink.style.display = 'none';
    }
}



// Function to handle file decompression
// Function to handle file decompression
function decompressFile() {
    const compressedContentDiv = document.getElementById('decompressedContent');
    const downloadLink = document.getElementById('downloadLinkDecompressed');

    compressedContentDiv.innerHTML = '';
    downloadLink.style.display = 'none';

    // Check if compressedContent is not null or undefined before decompressing
    if (compressedContent !== null && compressedContent !== undefined) {
        const decompressedContent = decompressFileContent(compressedContent, huffmanTree);

        // Display the decompressed content
        const decompressedDownloadLink = createDownloadLink1(decompressedContent,'decompressed.txt', 'text/plain');
        decompressedDownloadLink.download = 'decompressed.txt';
        compressedContentDiv.innerHTML = `<p>Decompressed Content:</p>`;

        // Append the download link to the compressedContentDiv
        compressedContentDiv.appendChild(decompressedDownloadLink);
        downloadLink.style.display = 'block';

    } else {
        // Handle the case where compressedContent is null or undefined
        compressedContentDiv.innerHTML = `<p>No compressed content available for decompression.</p>`;
    }

    // Hide the download link since we are not dealing with compressed data anymore
}
 
  // Example usage: compress a text file content

  