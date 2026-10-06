// import axios from "axios";
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "/api",
//   withCredentials: true,
// }); 
// export default api;
const mode = process.env.NODE_ENV
let baseURL = "http://localhost:3000/api";
if(mode==="production"){
    baseURL = "https://classmeet-web.onrender.com/api"
}
import axios from "axios";

// const api = axios.create({
//     baseURL: "https://classmeet-web.onrender.com/api",
//     withCredentials: true,
// });

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export default api;