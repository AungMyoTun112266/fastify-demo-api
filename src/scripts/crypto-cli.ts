import readline from "readline";
import { encryptData, decryptData } from "../shared/utils/crypto";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mode = process.argv[2]; // encrypt | decrypt

if (!mode || !["encrypt", "decrypt"].includes(mode)) {
  console.log("Usage:");
  console.log("npm run crypto encrypt");
  console.log("npm run crypto decrypt");
  process.exit(1);
}

console.log("Enter JSON (paste your JSON and press Ctrl+D when done):\n");

let input = "";

rl.on("line", (line) => {
  input += line + "\n";

  // Try to parse after each line
  try {
    const parsed = JSON.parse(input);
    rl.close();

    if (mode === "encrypt") {
      const encrypted = encryptData(parsed);
      console.log("\nEncrypted Result:");
      console.log(JSON.stringify(encrypted, null, 2));
    }

    if (mode === "decrypt") {
      const decrypted = decryptData(parsed);
      console.log("\nDecrypted Result:");
      console.log(JSON.stringify(decrypted, null, 2));
    }

    process.exit(0);
  } catch (err) {
    // JSON not complete yet, keep reading
  }
});

rl.on("close", () => {
  // Handle if user closes input without valid JSON
  if (input.trim()) {
    try {
      const parsed = JSON.parse(input);
      console.log("Success!");
    } catch {
      console.error("Error: Invalid JSON provided");
      process.exit(1);
    }
  }
});
