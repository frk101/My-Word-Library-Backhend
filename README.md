# 📌 MyEnglish API

## 🚀 Project Description
MyEnglish API is a Node.js-based backend for a language learning application. This API allows users to:
- Register and log in using JWT authentication
- Add new words and track their learning progress
- Generate quizzes with 20 random questions
- Evaluate quiz results and update user scores
- Manage their profile information

---

## 📌 Installation
### **1️⃣ Clone the repository**
```sh
git clone https://github.com/your-repo/MyEnglish-API.git
cd MyEnglish-API
```

### **2️⃣ Install dependencies**
```sh
npm install
```

### **3️⃣ Create a `.env` file and add the following variables:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

### **4️⃣ Start the server**
```sh
npm start
```
The API will run on `http://localhost:5001`

---

## 📌 API Endpoints
### **🔹 Authentication**
| Method | Endpoint        | Description              | Auth Required |
|--------|----------------|--------------------------|--------------|
| POST   | `/api/auth/register` | User registration | ❌ No |
| POST   | `/api/auth/login`    | User login        | ❌ No |

### **🔹 Words Management**
| Method | Endpoint        | Description               | Auth Required |
|--------|----------------|---------------------------|--------------|
| POST   | `/api/words`   | Add a new word            | ✅ Yes |
| GET    | `/api/words`   | Get all user’s words      | ✅ Yes |
| PUT    | `/api/words/:id` | Update a word’s details | ✅ Yes |
| DELETE | `/api/words/:id` | Delete a word           | ✅ Yes |

### **🔹 Quiz**
| Method | Endpoint        | Description                      | Auth Required |
|--------|----------------|----------------------------------|--------------|
| GET    | `/api/quiz`    | Generate a quiz with 20 questions | ✅ Yes |
| POST   | `/api/quiz/submit` | Submit quiz answers and update user scores | ✅ Yes |

### **🔹 User Profile**
| Method | Endpoint        | Description                     | Auth Required |
|--------|----------------|---------------------------------|--------------|
| GET    | `/api/profile/me` | Get user profile details | ✅ Yes |
| PUT    | `/api/profile/update` | Update user profile | ✅ Yes |
| DELETE | `/api/profile/delete` | Delete user account | ✅ Yes |

---

## 📌 Usage Examples
### **🔹 Register User**
```sh
curl -X POST http://localhost:5001/api/auth/register \  
  -H "Content-Type: application/json" \  
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "password": "123456",
    "birthDate": "1990-01-01",
    "nativeLanguage": "English"
  }'
```

### **🔹 Login User**
```sh
curl -X POST http://localhost:5001/api/auth/login \  
  -H "Content-Type: application/json" \  
  -d '{
    "email": "johndoe@example.com",
    "password": "123456"
  }'
```

### **🔹 Get Quiz Questions**
```sh
curl -X GET http://localhost:5001/api/quiz \  
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **🔹 Submit Quiz Answers**
```sh
curl -X POST http://localhost:5001/api/quiz/submit \  
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \  
  -H "Content-Type: application/json" \  
  -d '{
    "answers": [
      { "wordId": "65e0f6b2dc4b5a0012345678", "answer": "elma" },
      { "wordId": "65e0f6b2dc4b5a0012345679", "answer": "masa" }
    ]
  }'
```

---

## 📌 Error Handling
| Status Code | Description |
|-------------|-------------|
| 400 Bad Request | Invalid input or missing fields |
| 401 Unauthorized | Invalid or missing authentication token |
| 403 Forbidden | Access denied |
| 404 Not Found | Resource not found |
| 500 Internal Server Error | Server-side issue |

---

## 📌 License
This project is licensed under the MIT License.

---

## 📌 Author
Developed by **Faruk Albayrak** 🚀
