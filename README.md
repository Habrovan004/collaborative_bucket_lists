# Collaborative Bucket List 🎯

A simple and fun collaborative project where users create bucket-list items, upvote others, and leave encouragement comments. Built with **React (frontend)** and **Django REST Framework (backend)**.

---

## 🚀 Project Overview

The Collaborative Bucket List allows multiple users to:
- Add bucket list items
- View all submitted items
- Upvote items they like
- Comment on items
- Mark items as completed

This project is designed for easy contribution and clear separation between frontend and backend.

---

## 🧱 Tech Stack

### **Frontend**
- React + Javascript
- Axios (API calls)
- TailwindCSS (optional)
- Vite (recommended)

### **Backend**
- Django
- Django REST Framework
- PostgreSQL (or SQLite for beginners)

---

## ⚙️ System Workflow

1. User visits the website → React fetches bucket items from Django API  
2. User adds a bucket item → POST `/api/items/`  
3. Other users upvote → POST `/api/items/<id>/vote/`  
4. Users comment → POST `/api/items/<id>/comment/`  
5. Item creator marks as completed → PATCH `/api/items/<id>/`

---

## 🛠 Folder Structure

```
project-root/
│
├── backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │
│   ├── bucketlist/ (Django project)
│   ├── manage.py
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    ├── package.json
```

---


## 🧩 GitHub Collaboration Workflow

1. Fork the repository  
2. Create a new branch:  
   ```
   git checkout -b feature-name
   ```
3. Commit changes:  
   ```
   git commit -m "Added voting component"
   ```
4. Push branch:  
   ```
   git push origin feature-name
   ```
5. Open Pull Request  

---

## 🙌 Contributing

All contributions are welcome!  
Add new features, improve UI, optimize API, or fix bugs.

---


