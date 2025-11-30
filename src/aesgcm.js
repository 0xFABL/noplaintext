// https://gist.github.com/themikefuller/aca9491f960cbb8d94cdd7236698f0cd
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey

async function deriveKeyMaterialFromPassphrase(passphrase) {
  let encoded = new TextEncoder().encode(passphrase);
  let keyMaterial = crypto.subtle.importKey(
    "raw",
    encoded,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  )
  return keyMaterial
}

async function generateKey(passphrase, salt_from_input) {
  const keyMaterial = await deriveKeyMaterialFromPassphrase(passphrase)

  const salt = salt_from_input ? salt_from_input : crypto.getRandomValues(new Uint8Array(16)); 
  const key =  await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {name: "AES-GCM", length: 256},
    true,
    ["encrypt", "decrypt"]
  );

  return {key: key, salt: salt}
}

// returns dict
async function encrypt(string, passphrase) {
  let encoded = new TextEncoder().encode(string);
  let iv = crypto.getRandomValues(new Uint8Array(12));

  const {key, salt} = generateKey(passphrase);
  let encrypted = await crypto.subtle.encrypt({"name":"AES-GCM","iv":iv}, key, encoded);
  return encrypted = {"encrypted":encrypted, "iv": iv, "salt": salt};
}

async function encrypted_to_base64(string,key) {
    let result = await encrypt(string, key)
    const concatenated_bytes = result.iv + result.salt + result.encrypted;
    const b64_repr = concatenated_bytes.toBase64();
    return b64_repr
}

async function decrypt_from_b64_repr(data, passphrase) {
    const byte_arr = data.fromBase64();
    const iv = byte_arr.slice(0,11);
    const salt = byte_arr.slice(12, 27);
    const encrypted = byte_arr.slice(28);
    return decrypt(encrypted, iv, salt, passphrase);
}

async function decrypt(encrypted, iv, salt, passphrase) {
  const { key } = generateKey(passphrase, salt);
  let decrypted = await crypto.subtle.decrypt({"name":"AES-GCM","iv":iv}, key, encrypted);
  let decoded = new TextDecoder().decode(decrypted);
  return decoded;
}

export {
  encrypted_to_base64,
  decrypt_from_b64_repr,
};

