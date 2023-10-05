import { SHA256, enc } from 'crypto-js';

export async function GetFileHash(file) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  function GetStream(arrayBuffer) {
    const fileStream = new ReadableStream({
        start(controller) {
          const view = new Uint8Array(arrayBuffer);
          let chunkIndex = 0;

          function push() {
            if (chunkIndex >= view.length) {
              controller.close();
              return;
            }

            const chunk = view.slice(chunkIndex, chunkIndex + 1024);
            chunkIndex += chunk.length;
            controller.enqueue(chunk);
            setTimeout(push, 0); // Schedule the next chunk
          }

          push(); // Start pushing chunks
        },
      });
      return fileStream;
  }

  async function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        resolve(event.target.result);
      };
  
      reader.onerror = (event) => {
        reject(event.target.error);
      };
  
      reader.readAsArrayBuffer(file);
    });
  }

  async function readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const fileStream = new ReadableStream({
          start(controller) {
            const view = new Uint8Array(arrayBuffer);
            let chunkIndex = 0;

            function push() {
              if (chunkIndex >= view.length) {
                controller.close();
                return;
              }

              const chunk = view.slice(chunkIndex, chunkIndex + 1024);
              chunkIndex += chunk.length;
              controller.enqueue(chunk);
              setTimeout(push, 0); // Schedule the next chunk
            }

            push(); // Start pushing chunks
          },
        });
        resolve(fileStream);
      };
  
      reader.onerror = (event) => {
        reject(event.target.error);
      };
  
      reader.readAsArrayBuffer(file);
    });
  }


  async function calculateSHA256Hash(stream) {
    return new Promise((resolve, reject) => {
      //const hash = crypto.createHash('sha256');
      let data = '';
      stream.on('data', (chunk) => {
        data += chunk;
      });
  
      stream.on('end', () => {
        const fileHash = 0//hash.update(data).digest('hex');
        resolve(fileHash);
      });
  
      stream.on('error', (error) => {
        reject(error);
      });
    });
  }

//   async function readStreamChunks(stream) {
//     const reader = stream.getReader();
//     let chunks = '';
  
//     try {
//       while (true) {
//         const { done, value } = await reader.read();
        
//         if (done) {
//           break; // End of the stream
//         }
//         chunks += value 
//         //chunks.push(value);
//       }
//     } finally {
//       reader.releaseLock();
//     }
  
//     return chunks;
//   }