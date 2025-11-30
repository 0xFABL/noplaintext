// https://gist.github.com/themikefuller/aca9491f960cbb8d94cdd7236698f0cd

async function generateKey() {
  return await crypto.subtle.generateKey({
    "name":"AES-GCM",
    "length":256
  },true,['encrypt','decrypt']);
}

async function exportKey(key) {
  return await crypto.subtle.exportKey('jwk', key);
}

async function importKey(jwk) {
  return await crypto.subtle.importKey('jwk', jwk, {
    "name":"AES-GCM"
  }, false, ['encrypt','decrypt']);
}

// returns dict
async function encrypt(string,key) {
  let encoded = new TextEncoder().encode(string);
  let iv = crypto.getRandomValues(new Uint8Array(12));
  let encrypted = await crypto.subtle.encrypt({"name":"AES-GCM","iv":iv}, key, encoded);
  return encrypted = {"encrypted":encrypted, "iv": iv};
}

async function encrypted_to_base64(string,key) {
    let result = await encrypt(string, key)
    const concatenated_bytes = result.encrypted + result.iv
    const b64_repr = concatenated_bytes.toBase64();
    return b64_repr
}

async function decrypt_from_b64_repr(data, key) {
    const byte_arr = data.fromBase64();
    const iv = byte_arr.slice(0,11);
    const encrypted = byte_arr.slice(12);
    return decrypt(encrypted, iv, key);
}

async function decrypt(encrypted,iv, key) {
  let decrypted = await crypto.subtle.decrypt({"name":"AES-GCM","iv":iv}, key, encrypted);
  let decoded = new TextDecoder().decode(decrypted);
  return decoded;
}

export {
  encrypted_to_base64,
  decrypt_from_b64_repr,
};

