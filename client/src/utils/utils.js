export function isTokenExpired(token) {
    if (!token) return true; 

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const currentTime = Math.floor(Date.now() / 1000);    
        return payload.exp <= currentTime; 
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; 
    }
}

export function decodeJWT(token) {
    const decodeBase64 = (str) => {
      const decoded = atob(str);
      return JSON.parse(decoded);
    };
    const parts = token.split(".");
  
    if (parts.length === 3) {
      const payload = decodeBase64(parts[1]);
      return payload;
    } else {
      throw new Error("Invalid token format");
    }
  }
  