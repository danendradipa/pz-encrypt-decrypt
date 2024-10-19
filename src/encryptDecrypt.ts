import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { logActivity } from "./logger";

const algorithm = "aes-192-cbc";
const iv = crypto.randomBytes(16);

export async function encryptFile(filePath: string, password: string): Promise<void> {
  const fileName = path.basename(filePath); 
  const ext = path.extname(filePath); 
  const baseName = path.basename(filePath, ext); 
  const encryptedFilePath = path.join(path.dirname(filePath), `${baseName}_encrypted${ext}`); 

  try {
    logActivity(`Mulai mengenkripsi file ${filePath}`);
    const data = await fs.readFile(filePath);
    const key = crypto.scryptSync(password, "salt", 24);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

    const finalData = Buffer.concat([iv, encryptedData]);
    await fs.writeFile(encryptedFilePath, finalData);
    logActivity(`Berhasil mengenkripsi file ${filePath}`);
    console.log(`File '${fileName}' berhasil dienkripsi menjadi '${path.basename(encryptedFilePath)}'`);
  } catch (error) {
    if (error instanceof Error) {
      logActivity(`Error ketika mengenkripsi file: ${error.message}`);
      console.error("Error:", error.message);
    }
  }
}

export async function decryptFile(filePath: string, password: string): Promise<void> {
  const fileName = path.basename(filePath); 
  const ext = path.extname(filePath); 
  const baseName = path.basename(filePath, ext).replace("_encrypted", ""); 
  const decryptedFilePath = path.join(path.dirname(filePath), `${baseName}_decrypted${ext}`); 

  try {
    logActivity(`Mulai mendekripsi file ${filePath}`);
    const encryptedData = await fs.readFile(filePath);

    const iv = encryptedData.subarray(0, 16);
    const data = encryptedData.subarray(16);

    const key = crypto.scryptSync(password, "salt", 24);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decryptedData = Buffer.concat([decipher.update(data), decipher.final()]);

    await fs.writeFile(decryptedFilePath, decryptedData);
    logActivity(`Berhasil mendekripsi file ${filePath}`);
    console.log(`File '${fileName}' berhasil didekripsi menjadi '${path.basename(decryptedFilePath)}'`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("bad decrypt")) {
        console.error("Error: Password yang dimasukkan salah");
        logActivity("Error: Password yang dimasukkan salah");
      } else {
        logActivity(`Error ketika mendekripsi file: ${error.message}`);
        console.error("Error:", error.message);
      }
    }
  }
}
