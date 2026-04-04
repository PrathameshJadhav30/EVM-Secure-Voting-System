const crypto = require("crypto");
const env = require("../config/env");

// AES-256-GCM provides confidentiality and integrity for stored vote payloads.
const algorithm = "aes-256-gcm";

const getKey = () => {
  const keyMaterial = env.voteEncryptionKey || "default_vote_encryption_key_change_me";
  return crypto.createHash("sha256").update(keyMaterial).digest();
};

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const key = getKey();
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
};

module.exports = { encrypt };
