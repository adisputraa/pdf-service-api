# --- TAHAP 1: BUILD STAGE ---
# Tahap ini bertugas menginstal semua dependensi (termasuk dev) dan mengompilasi TypeScript.
FROM node:20-alpine AS builder

WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu untuk caching dependensi
COPY package*.json ./

# Instal semua dependensi
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Jalankan proses build TypeScript
RUN npm run build


# --- TAHAP 2: PRODUCTION STAGE ---
# Tahap ini mengambil hasil kompilasi dari tahap sebelumnya dan hanya menginstal dependensi produksi.
FROM node:20-alpine

WORKDIR /app

# Salin package.json dan package-lock.json lagi
COPY package*.json ./

# Instal HANYA dependensi produksi
RUN npm install --only=production

# Salin hasil build dari tahap 'builder'
# /app/dist dari builder akan disalin ke /app/dist di tahap ini
COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads processed

# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD [ "node", "dist/index.js" ]