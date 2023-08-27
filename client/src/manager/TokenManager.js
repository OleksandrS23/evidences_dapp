import jwt from 'jsonwebtoken';
import 'dotenv/config';

class TokenManager {
    static setToken(token) {
      localStorage.setItem('authToken', token);
    }
  
    static getToken() {
      return localStorage.getItem('authToken');
    }
  
    static removeToken() {
      localStorage.removeItem('authToken');
    }
  
    static isValid() {
        const token = this.getToken();
    
        if (!token) {
          return false;
        }
    
        try {
          const decodedToken = jwt.verify(token, process.env.AUTH_SECRET); // Replace with your secret key
          const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
          if (decodedToken.exp < currentTime) {
            this.removeToken(); // Token is expired, remove it
            return false;
          }
    
          return true;
        } catch (error) {
          // Invalid token or other error
          return false;
        }
      }
  }
  
  export default TokenManager;
  