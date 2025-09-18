# PDF Toolkit API 📄✨

PDF Toolkit API adalah sebuah layanan mikro (microservice) berbasis Node.js, Express, dan TypeScript yang menyediakan fungsionalitas untuk memanipulasi file PDF. Proyek ini dibangun dengan arsitektur modern yang *stateless*, siap untuk di-containerize dengan Docker, dan menggunakan layanan cloud untuk penyimpanan file dan database.

## Fitur Utama

-   **Gabungkan PDF**: Unggah beberapa file PDF dan dapatkan satu file gabungan yang utuh.
-   **Proses Asinkron**: Permintaan diproses di latar belakang, memungkinkan API memberikan respons cepat tanpa harus menunggu proses yang berpotensi lama selesai.
-   **Penyimpanan Cloud**: File yang diunggah dan diproses disimpan secara aman di **Cloudinary**.
-   **Database Persisten**: Informasi dan status setiap pekerjaan (job) disimpan di database **PostgreSQL** yang dikelola oleh **Supabase**.
-   **Siap Docker**: Dilengkapi dengan `Dockerfile` multi-stage build untuk portabilitas, konsistensi, dan kemudahan deployment.

## Teknologi yang Digunakan

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Persiapan

Sebelum memulai, pastikan Anda memiliki:
-   **Node.js** (v18 atau lebih baru)
-   **NPM** atau package manager lainnya
-   **Docker** (Opsional, untuk menjalankan via container)
-   Akun **Cloudinary** (untuk mendapatkan kunci API)
-   Akun **Supabase** (untuk mendapatkan URL koneksi database)

## Instalasi & Setup Lokal

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/adisputraa/pdf-service-api.git
    cd pdf-service-api
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Buat file `.env` di direktori utama proyek. Salin konten di bawah ini dan isi dengan kredensial dari Cloudinary dan Supabase Anda.
    ```env
    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=NAMA_CLOUD_ANDA
    CLOUDINARY_API_KEY=API_KEY_ANDA
    CLOUDINARY_API_SECRET=API_SECRET_ANDA

    # Supabase Database Credentials
    DATABASE_URL="postgresql://postgres:[PASSWORD_ANDA]@[HOST_ANDA]/postgres"
    ```

4. **Buat tabel database:**
   Jalankan query SQL berikut di **SQL Editor** Supabase Anda untuk membuat tabel `jobs`.
   ```sql
    CREATE TABLE jobs (
      id UUID PRIMARY KEY,
      status TEXT NOT NULL,
      original_files TEXT[],
      result_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
   ```

## Menjalankan Aplikasi

-   **Mode Development (dengan auto-reload):**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000`.

-   **Mode Produksi:**
    ```bash
    npm run build
    npm start
    ```

## Penggunaan API

Gunakan Postman atau *client* API lainnya untuk berinteraksi dengan *endpoint* berikut:

| Metode | Endpoint                       | Deskripsi                               | Body (form-data)               |
| :----- | :----------------------------- | :-------------------------------------- | :----------------------------- |
| `POST` | `/api/jobs/merge`              | Mengirim file PDF untuk digabungkan.    | `files`: (array of files)      |
| `GET`  | `/api/jobs/{jobId}/status`     | Mengecek status pekerjaan.              | -                              |
| `GET`  | `/api/jobs/{jobId}/download`   | Mendapatkan hasil (akan me-redirect).   | -                              |


## Menjalankan dengan Docker

Pastikan Docker sudah terinstal dan berjalan di sistem Anda.

1.  **Build Docker image:**
    Perintah ini akan membaca `Dockerfile` dan membangun image aplikasi Anda.
    ```bash
    docker build -t pdf-service .
    ```

2.  **Run Docker container:**
    Jalankan container dari image yang baru dibuat. Perintah `--env-file .env` akan memuat semua *secrets* Anda dengan aman ke dalam container.
    ```bash
    docker run -p 3000:3000 --env-file .env --name my-pdf-app pdf-service
    ```
    Aplikasi sekarang dapat diakses melalui `http://localhost:3000`.
