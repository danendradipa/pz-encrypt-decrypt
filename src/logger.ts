import * as fs from "node:fs/promises";
import * as path from "node:path";

const logDir = path.join(__dirname, "../logs");
const logFile = path.join(logDir, getLogFileName());

async function logActivity(message: string): Promise<void> {
  const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }); 
  const logMessage = `${timestamp} - ${message}\n`;

  try {
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(logFile, logMessage);
  } catch (error) {
    console.error("Error menulis log:", error);
  }
}

function getLogFileName(): string {
  const date = new Date();
  return `${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}.log`;
}

export { logActivity };
