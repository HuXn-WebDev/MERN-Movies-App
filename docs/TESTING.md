# Backend Testing Documentation

## Overview

Pada tahap DevOps, dilakukan implementasi automated testing pada backend MERN Movies App menggunakan Jest, Supertest, dan MongoDB Memory Server.

Tujuan utama testing ini adalah memastikan bahwa seluruh endpoint backend berfungsi sesuai perilaku yang diharapkan sebelum proses build dan deployment dijalankan pada pipeline CI/CD.

Testing dijalankan sebagai quality gate sehingga deployment tidak akan dilanjutkan apabila terdapat fitur yang gagal.

---

# Testing Stack

## Jest

Digunakan sebagai test runner.

Fungsi:

- Menjalankan seluruh test case
- Menampilkan hasil pass/fail
- Mengukur coverage apabila diperlukan

## Supertest

Digunakan untuk melakukan HTTP request terhadap Express application tanpa harus menjalankan server secara manual.

Fungsi:

- Testing endpoint REST API
- Validasi response status
- Validasi response body

## MongoDB Memory Server

Digunakan untuk membuat database MongoDB sementara selama testing.

Fungsi:

- Menghindari penggunaan MongoDB Atlas saat testing
- Menjamin test bersifat isolated
- Menghindari perubahan data produksi

---

# Testing Architecture

Struktur test:

```text
backend/tests/
├── setup.js
├── health.test.js
├── genre.test.js
├── movie.test.js
├── auth.test.js
├── admin.test.js
├── review.test.js
└── upload.test.js
```

Helper:

```text
backend/tests/helpers/
└── testData.js
```

Fixtures:

```text
backend/tests/fixtures/
├── test-image.png
└── test.txt
```

---

# Test Coverage

## Health API

File:

```text
backend/tests/health.test.js
```

Endpoint:

```http
GET /api/v1/health
```

Scenario:

- Backend running
- Health endpoint accessible

Expected Result:

- Status 200
- Backend health information returned

Purpose:

Memastikan Express application berhasil berjalan.

---

## Genre API

File:

```text
backend/tests/genre.test.js
```

Endpoints:

```http
GET    /api/v1/genre/genres
GET    /api/v1/genre/:id
POST   /api/v1/genre
PUT    /api/v1/genre/:id
DELETE /api/v1/genre/:id
```

Scenario:

- Get all genres
- Get genre by id
- Invalid genre id
- Create genre as admin
- Create genre without authentication
- Update genre
- Delete genre

Purpose:

Memastikan CRUD genre berjalan sesuai authorization rule.

---

## Movie API

File:

```text
backend/tests/movie.test.js
```

Endpoints:

```http
GET    /api/v1/movies/all-movies
GET    /api/v1/movies/specific-movie/:id
GET    /api/v1/movies/new-movies
GET    /api/v1/movies/top-movies
GET    /api/v1/movies/random-movies
POST   /api/v1/movies/create-movie
PUT    /api/v1/movies/update-movie/:id
DELETE /api/v1/movies/delete-movie/:id
```

Scenario:

- Public movie retrieval
- Movie creation
- Movie update
- Movie deletion
- Authorization validation

Purpose:

Memastikan seluruh endpoint movie dapat digunakan oleh frontend.

---

## Authentication API

File:

```text
backend/tests/auth.test.js
```

Endpoints:

```http
POST /api/v1/users
POST /api/v1/users/auth
POST /api/v1/users/logout
GET  /api/v1/users/profile
PUT  /api/v1/users/profile
GET  /api/v1/users
```

Scenario:

- Register user
- Duplicate registration
- Login
- Invalid login
- Logout
- Get profile
- Update profile
- Admin access

Purpose:

Memastikan authentication dan authorization bekerja dengan benar.

---

## Review API

File:

```text
backend/tests/review.test.js
```

Endpoints:

```http
POST   /api/v1/movies/:id/reviews
DELETE /api/v1/movies/delete-comment
```

Scenario:

- Add review
- Duplicate review prevention
- Unauthorized review
- Delete review
- Admin moderation

Purpose:

Memastikan fitur review berjalan sesuai aturan bisnis.

---

## Admin Authorization

File:

```text
backend/tests/admin.test.js
```

Scenario:

- Admin can create genre
- User cannot create genre
- Guest cannot create movie
- Admin can delete movie
- User cannot delete movie

Purpose:

Memastikan role-based authorization berjalan dengan benar.

---

## Upload API

File:

```text
backend/tests/upload.test.js
```

Endpoint:

```http
POST /api/v1/upload
```

Scenario:

- Upload valid image
- Upload without file
- Invalid file upload

Purpose:

Memastikan file upload hanya menerima gambar yang valid.

---

# Issues Encountered and Resolutions

## 1. Jest Globals Not Recognized

Problem:

ESLint menganggap:

```javascript
describe();
it();
expect();
beforeAll();
afterAll();
```

sebagai undefined.

Cause:

Environment Jest belum didaftarkan pada ESLint.

Resolution:

Menambahkan Jest globals pada konfigurasi ESLint.

---

## 2. Authentication Returning 500 Instead of 401

Problem:

Endpoint protected mengembalikan:

```http
500 Internal Server Error
```

padahal seharusnya:

```http
401 Unauthorized
```

Cause:

Error pada middleware diteruskan sebagai internal error.

Resolution:

- Memperbaiki asyncHandler
- Menambahkan centralized error handler
- Memastikan middleware auth mengembalikan status yang sesuai

---

## 3. Login Test Failed

Problem:

Login selalu gagal.

Cause:

User test dibuat langsung ke database tanpa hash password.

Resolution:

Password test di-hash menggunakan bcrypt sebelum disimpan.

---

## 4. Duplicate Genre Error

Problem:

MongoDB menghasilkan:

```text
E11000 duplicate key error
```

Cause:

Semua test membuat genre dengan nama yang sama.

Resolution:

Generator nama genre dibuat unik untuk setiap test.

---

## 5. Genre Validation Error

Problem:

Nama genre hasil generator melebihi batas maksimal schema.

Cause:

String random terlalu panjang.

Resolution:

Generator nama genre dipersingkat agar sesuai dengan batas schema.

---

## 6. Review Test Failure

Problem:

Review deletion gagal karena review belum berhasil dibuat.

Cause:

Test langsung mengakses review tanpa memverifikasi hasil create review.

Resolution:

Menambahkan validasi bahwa review berhasil dibuat sebelum proses delete dilakukan.

---

## 7. Upload Testing Issues

Problem:

Upload image menghasilkan status code yang tidak sesuai.

Cause:

Perbedaan validasi file upload dan fixture image yang digunakan saat testing.

Resolution:

- Menyesuaikan upload test dengan konfigurasi multer
- Memperbaiki file filter
- Menambahkan validasi upload image

---

# Final Result

Test Summary:

```text
Health API
Genre API
Movie API
Auth API
Review API
Admin Authorization
Upload API
```

Total automated backend tests:

```text
51 test cases
```

Coverage backend dikonfigurasi di `jest.config.cjs` dengan minimum global 60% untuk statements, branches, functions, dan lines. Report coverage dibuat dalam format text, LCOV, dan Cobertura:

```text
coverage/lcov.info
coverage/cobertura-coverage.xml
```

Frontend juga memiliki automated testing menggunakan Vitest dan React Testing Library untuk route guards, form auth, Redux movie filters, RTK Query URL construction, dan halaman search/filter movie. Report frontend dibuat di:

```text
frontend/coverage/lcov.info
frontend/coverage/cobertura-coverage.xml
```

Testing berhasil diintegrasikan ke pipeline CI/CD sehingga setiap perubahan kode akan divalidasi sebelum proses build dan deployment dilakukan. CD pipeline menjalankan validation job terlebih dahulu sehingga deployment tidak berjalan apabila lint, format, test, atau coverage gagal.
