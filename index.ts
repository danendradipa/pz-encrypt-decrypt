import { encryptFile, decryptFile } from "./src/encryptDecrypt";

const command = process.argv[2]; 
const filePath = process.argv[3];  
const password = process.argv[4];

async function main() {
  if (command === "encrypt") {
    await encryptFile(filePath, password);
  } else if (command === "decrypt") {
    await decryptFile(filePath, password);
  } else {
    console.error("Perintah tidak valid. Gunakan 'encrypt' atau 'decrypt'.");
  }
}

main().catch(error => console.error("Error:", error));
