import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRpBF3Rk0iUBuc0h9lZjSnim8eDzox_M4",
  authDomain: "effectivewebapp-465ef.firebaseapp.com",
  projectId: "effectivewebapp-465ef",
  storageBucket: "effectivewebapp-465ef.appspot.com",
  messagingSenderId: "624996519562",
  appId: "1:624996519562:web:9f8e5b9e2411f386fee773",
  measurementId: "G-CQ1EG2KKG1",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);