# DOCUMENT TONG HOP - Web Booking Tour Viet Nam
# MyTour - He thong dat tour du lich truc tuyen

---

## MUC LUC

1. [Tong quan he thong](#1-tong-quan-he-thong)
2. [Kien truc he thong](#2-kien-truc-he-thong)
3. [Flow nghiep vu toan bo](#3-flow-nghiep-vu-toan-bo)
4. [Tinh nang hien tai](#4-tinh-nang-hien-tai)
5. [Tinh nang CON THIEU - Can phat trien](#5-tinh-nang-con-thieu)
6. [Cai thien UI/UX](#6-cai-thien-uiux)
7. [Huong dan Docker](#7-huong-dan-docker)
8. [CI/CD - Tu dong deploy mien phi](#8-cicd-tu-dong-deploy-mien-phi)

---

## 1. TONG QUAN HE THONG

```mermaid
graph TB
    subgraph "Client (Browser)"
        FE[React + TypeScript + Tailwind]
    end

    subgraph "Backend"
        BE[Spring Boot 2.7 - REST API]
        JWT[JWT Authentication]
    end

    subgraph "Database"
        DB[(PostgreSQL)]
    end

    subgraph "Storage"
        FS[File System - uploads/images/]
    end

    FE -->|HTTP/JSON| BE
    BE -->|JPA/Hibernate| DB
    BE -->|Save files| FS
    FE -->|Load images| FS
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Spring Boot 2.7, Spring Security, JPA |
| Database | PostgreSQL 12 |
| Auth | JWT (7 ngay) |
| File Storage | Local filesystem |
| Containerize | Docker + Docker Compose |

---

## 2. KIEN TRUC HE THONG

```mermaid
graph LR
    subgraph "Frontend - Port 5173"
        Pages[Pages]
        Components[Components]
        Services[API Services]
        Contexts[Auth + Toast Context]
    end

    subgraph "Backend - Port 8081"
        Controllers[REST Controllers]
        ServiceLayer[Service Layer]
        Repositories[JPA Repositories]
        Security[JWT Security Filter]
    end

    subgraph "Database - Port 5433"
        Users[(users)]
        Tours[(tour_templates)]
        Departures[(tour_departures)]
        Bookings[(bookings)]
        Drivers[(drivers)]
        Categories[(categories)]
    end

    Pages --> Components
    Pages --> Services
    Services -->|Axios + JWT| Security
    Security --> Controllers
    Controllers --> ServiceLayer
    ServiceLayer --> Repositories
    Repositories --> Users
    Repositories --> Tours
    Repositories --> Departures
    Repositories --> Bookings
    Repositories --> Drivers
    Repositories --> Categories
```

### Database Schema (ERD)

```mermaid
erDiagram
    USERS {
        bigint id PK
        string company_id
        string username UK
        string email UK
        string password_hash
        enum role "ADMIN | USER"
        string avatar
        string phone
        string address
    }

    CATEGORIES {
        string id PK
        string company_id
        string name
        string image_url
    }

    TOUR_TEMPLATES {
        string id PK
        string company_id
        string category_id FK
        string name
        string destination
        text description_html
        string image_url
        double default_price
        int discount_percent
    }

    TOUR_DEPARTURES {
        string id PK
        string template_id FK
        string company_id
        date start_date
        date end_date
        double original_price
        int discount_percent
        double price
        int total_slots
        int booked_slots
        string status
    }

    BOOKINGS {
        bigint id PK
        string departure_id FK
        bigint user_id FK
        string driver_id FK
        string company_id
        string customer_name
        string customer_email
        string customer_phone
        int number_of_guests
        double total_price
        date booking_date
        string status
    }

    DRIVERS {
        string id PK
        string company_id
        string name
        string phone
        string license_plate
        string vehicle_info
        string status
    }

    CATEGORIES ||--o{ TOUR_TEMPLATES : has
    TOUR_TEMPLATES ||--o{ TOUR_DEPARTURES : has
    TOUR_DEPARTURES ||--o{ BOOKINGS : has
    USERS ||--o{ BOOKINGS : creates
    DRIVERS ||--o{ BOOKINGS : assigned_to
```

---

## 3. FLOW NGHIEP VU TOAN BO

### 3.1 Flow tong the 3 Role

```mermaid
flowchart TB
    subgraph "USER"
        U1[Dang ky tai khoan] --> U2[Dang nhap]
        U2 --> U3[Xem trang chu - Banner/Poster]
        U3 --> U4[Tim kiem tour theo diem den/danh muc]
        U4 --> U5[Xem chi tiet tour]
        U5 --> U6[Dat tour - Nhap thong tin]
        U6 --> U7[Chon phuong thuc thanh toan]
        U7 --> U8[Xac nhan dat tour]
        U8 --> U9[Theo doi trang thai booking]
        U2 --> U10[Xem/Sua ho so ca nhan]
        U2 --> U11[Xem lich su booking]
    end

    subgraph "ADMIN"
        A1[Dang nhap Admin] --> A2[Dashboard - Thong ke]
        A2 --> A3[Quan ly Tour Template - CRUD]
        A2 --> A4[Quan ly Lich khoi hanh - CRUD]
        A2 --> A5[Quan ly Booking]
        A5 --> A6[Duyet booking - Confirmed]
        A6 --> A7[Gan tai xe - Assigned]
        A7 --> A8[Bat dau tour - InProgress]
        A8 --> A9[Hoan thanh - Completed]
        A5 --> A10[Huy booking - Cancelled]
        A2 --> A11[Quan ly Tai xe - CRUD]
        A2 --> A12[Quan ly User]
        A2 --> A13[Quan ly Danh muc]
        A2 --> A14[Bao cao Doanh thu - Xuat Excel]
    end

    subgraph "TAI XE"
        D1[Duoc Admin gan vao booking]
        D2[Trang thai: Available -> Busy]
        D3[Nhan thong tin tour + khach hang]
        D4[Chay tour]
        D5[Hoan thanh -> Available]
    end

    U8 -->|Tao Pending| A5
    A7 -->|Gan| D1
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> D5
```

### 3.2 Flow Booking chi tiet

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend API
    participant DB as PostgreSQL

    User->>FE: Chon tour, nhap thong tin
    FE->>FE: Validate (SDT 10 so, Email, Ten >= 2 ky tu)
    FE->>BE: POST /api/v1/bookings
    BE->>DB: Kiem tra so cho trong (totalSlots - bookedSlots)

    alt Khong du cho
        DB-->>BE: So cho khong du
        BE-->>FE: 400 - So cho con lai khong du
        FE-->>User: Hien thong bao loi
    else Du cho
        DB-->>BE: OK
        BE->>DB: INSERT booking (status = Pending)
        BE-->>FE: 200 - Booking created
        FE-->>User: Dat tour thanh cong!
        FE->>FE: Chuyen sang My Bookings
    end
```

### 3.3 Flow Trang thai Booking (State Machine)

```mermaid
stateDiagram-v2
    [*] --> Pending: User dat tour

    Pending --> Confirmed: Admin duyet
    Pending --> Cancelled: Admin/User huy

    Confirmed --> Assigned: Admin gan tai xe ranh
    Confirmed --> Cancelled: Huy truoc khi gan tai xe

    Assigned --> InProgress: Tour bat dau
    Assigned --> Cancelled: Huy truoc 24h (tai xe -> available)

    InProgress --> Completed: Tour ket thuc (tai xe -> available)

    Completed --> [*]
    Cancelled --> [*]

    note right of Confirmed: Kiem tra so cho trong
    note right of Assigned: Tai xe tu dong -> BUSY
    note right of Completed: Tai xe tu dong -> AVAILABLE
    note left of Cancelled: Hoan lai bookedSlots\nTai xe -> AVAILABLE\nHoan tien theo quy dinh
```

### 3.4 Flow Huy Tour - Chinh sach hoan tien

```mermaid
flowchart TD
    A[Admin/User yeu cau huy] --> B{Kiem tra thoi gian}

    B -->|Truoc 7 ngay| C[Hoan tien 100%]
    B -->|Truoc 24h - 7 ngay| D[Hoan tien 70%]
    B -->|Trong vong 24h| E[Hoan tien 50%]
    B -->|Tour da bat dau| F[Khong hoan tien]

    C --> G{Booking co tai xe?}
    D --> G
    E --> G
    F --> G

    G -->|Co| H[Tai xe -> Available]
    G -->|Khong| I[Bo qua]

    H --> J[Hoan lai bookedSlots]
    I --> J
    J --> K[Status = Cancelled]
    K --> L[Luu DB + Thong bao]
```

### 3.5 Flow Tai xe

```mermaid
stateDiagram-v2
    [*] --> Available: Admin tao tai xe moi

    Available --> Busy: Duoc gan vao booking (Assigned)
    Busy --> Available: Tour hoan thanh (Completed)
    Busy --> Available: Booking bi huy (Cancelled)
    Busy --> Available: Admin doi tai xe khac (Re-assign)
```

### 3.6 Flow Dang nhap & Phan quyen

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend
    participant JWT as JWT Provider

    User->>FE: Nhap username + password
    FE->>BE: POST /auth/login
    BE->>BE: Verify password (BCrypt)

    alt Sai mat khau
        BE-->>FE: 401 Unauthorized
        FE-->>User: Sai tai khoan hoac mat khau
    else Dung
        BE->>JWT: Tao JWT token (7 ngay)
        JWT-->>BE: Token
        BE-->>FE: {token, user: {id, username, role}}
        FE->>FE: Luu token + user vao localStorage

        alt role = ADMIN
            FE-->>User: Redirect /admin/dashboard
        else role = USER
            FE-->>User: Redirect /
        end
    end
```

---

## 4. TINH NANG HIEN TAI (Da co)

### Frontend
- [x] Trang chu voi Banner Slider (Slick)
- [x] Tim kiem tour theo diem den, danh muc, gia
- [x] Chi tiet tour voi Rich Text
- [x] Dat tour voi form validation
- [x] My Bookings - xem lich su
- [x] Profile - cap nhat thong tin, doi mat khau
- [x] Admin Dashboard
- [x] CRUD Tour Template (voi Rich Text Editor)
- [x] CRUD Lich khoi hanh
- [x] Quan ly Booking voi StatusBadge mau sac
- [x] Quan ly Tai xe (bien so, thong tin xe)
- [x] Quan ly User
- [x] Quan ly Danh muc
- [x] Bao cao Doanh thu + Xuat Excel
- [x] SearchableComboBox chon tai xe
- [x] Nut Zalo + Hotline noi
- [x] Font Be Vietnam Pro cho tieng Viet
- [x] Responsive mobile

### Backend
- [x] JWT Authentication
- [x] CRUD APIs cho tat ca entity
- [x] Booking status flow (Pending -> Completed)
- [x] Tu dong cap nhat trang thai tai xe
- [x] Kiem tra so cho trong khi dat tour
- [x] Upload file anh
- [x] Bao cao doanh thu theo thang

---

## 5. TINH NANG CON THIEU - Can phat trien

### 5.1 Thong bao Real-time (WebSocket) - CHUA CO

```mermaid
flowchart LR
    subgraph "Hien tai"
        A[User dat tour] --> B[API call]
        B --> C[Admin phai F5 de thay]
    end

    subgraph "Can lam - WebSocket"
        D[User dat tour] --> E[API call]
        E --> F[WebSocket push]
        F --> G[Admin nhan thong bao ngay]
        F --> H[Tai xe nhan thong bao ngay]
        F --> I[Icon chuong + so dem]
    end
```

**Can lam:**
- BE: Them Spring WebSocket + STOMP
- FE: Them SockJS client
- Khi co booking moi -> push notification den Admin
- Khi gan tai xe -> push notification den Tai xe
- Icon chuong o Header voi so dem (badge do)

### 5.2 Gui Email tu dong - CHUA CO

```mermaid
flowchart TD
    A[Event xay ra] --> B{Loai event?}

    B -->|Booking moi| C[Email cho Admin: Co booking moi can duyet]
    B -->|Booking confirmed| D[Email cho User: Booking da duoc xac nhan]
    B -->|Gan tai xe| E[Email cho Tai xe: Ban duoc gan tour moi]
    B -->|Tour sap khoi hanh| F[Email nhac nho User: Tour bat dau ngay mai]
    B -->|Huy booking| G[Email cho User: Booking da bi huy + chinh sach hoan tien]
    B -->|Hoan thanh| H[Email cho User: Cam on + Danh gia tour]
```

**Can lam:**
- BE: Them Spring Mail + template email HTML
- Config SMTP (Gmail/SendGrid mien phi)
- Gui email tu dong khi thay doi trang thai booking

### 5.3 Hoa don (Invoice) khi Booking thanh cong - CHUA CO

```mermaid
flowchart TD
    A[Booking thanh cong] --> B[Tao hoa don PDF]
    B --> C[Noi dung hoa don]
    C --> D[Ten cong ty + logo]
    C --> E[Thong tin khach hang]
    C --> F[Chi tiet tour + gia]
    C --> G[Ma booking + ngay]
    C --> H[QR Code]
    B --> I[Gui email kem hoa don PDF]
    B --> J[User tai hoa don tu My Bookings]
```

**Can lam:**
- BE: Dung iText/OpenPDF de tao PDF
- FE: Nut "Tai hoa don" trong My Bookings
- Template hoa don tieng Viet

### 5.4 Danh gia & Binh luan (Review) - CHUA CO

```mermaid
flowchart TD
    A[Tour Completed] --> B[Hien form danh gia]
    B --> C[Chon so sao 1-5]
    C --> D[Viet binh luan]
    D --> E[Gui review]
    E --> F[Hien thi tren trang Chi tiet Tour]
    F --> G[Tinh trung binh rating]
```

**Can lam:**
- DB: Bang `reviews` (user_id, tour_id, rating, comment)
- FE: Component Star Rating + Comment form
- Hien thi reviews tren TourDetailPage

### 5.5 Thanh toan Online - CHUA CO

```mermaid
flowchart TD
    A[User chon thanh toan] --> B{Phuong thuc?}
    B -->|VNPay| C[Redirect sang VNPay Gateway]
    B -->|MoMo| D[Redirect sang MoMo]
    B -->|Chuyen khoan| E[Hien QR Code ngan hang]

    C --> F[Thanh toan thanh cong]
    D --> F
    E --> G[Admin xac nhan thu cong]

    F --> H[Callback -> Cap nhat paymentStatus = Paid]
    G --> H
    H --> I[Gui hoa don email]
```

### 5.6 Role TAI XE - Trang rieng - CHUA CO

```mermaid
flowchart TD
    A[Tai xe dang nhap] --> B[Dashboard Tai xe]
    B --> C[Xem danh sach tour duoc gan]
    B --> D[Xem thong tin khach hang + SDT]
    B --> E[Xem lich trinh chi tiet]
    B --> F[Cap nhat trang thai: Bat dau / Ket thuc tour]
    B --> G[Xem doanh thu ca nhan]
    B --> H[Nhan thong bao khi duoc gan tour moi]
```

### 5.7 Bang tong hop tinh nang con thieu

| # | Tinh nang | Do kho | Uu tien | Thoi gian uoc tinh |
|---|-----------|--------|---------|---------------------|
| 1 | WebSocket Notification | Trung binh | CAO | 2-3 ngay |
| 2 | Gui Email tu dong | De | CAO | 1-2 ngay |
| 3 | Hoa don PDF | Trung binh | CAO | 2 ngay |
| 4 | Review & Rating | De | TRUNG BINH | 2 ngay |
| 5 | Thanh toan VNPay/MoMo | Kho | TRUNG BINH | 3-5 ngay |
| 6 | Trang rieng Tai xe | Trung binh | CAO | 3 ngay |
| 7 | Thong ke nang cao (bieu do) | De | THAP | 1 ngay |
| 8 | Multi-language (EN/VI) | De | THAP | 2 ngay |
| 9 | PWA + Push Notification | Trung binh | THAP | 2 ngay |
| 10 | Chat truc tuyen | Kho | THAP | 3-5 ngay |

---

## 6. CAI THIEN UI/UX

### 6.1 Nhung diem can cai thien

| Trang | Van de | Giai phap |
|-------|--------|-----------|
| TourDetailPage | Chua co gallery anh nhieu | Them Lightbox gallery voi nhieu anh |
| BookingPage | Chua co step wizard ro rang | Lam 3 buoc: Thong tin -> Thanh toan -> Xac nhan |
| MyBookingsPage | Chi co danh sach don gian | Them timeline trang thai, nut huy tour |
| Admin Dashboard | Chi co so lieu co ban | Them bieu do Chart.js (doanh thu, booking theo thang) |
| Mobile | Sidebar filter bi che | Cai thien bottom sheet filter |
| Header | Khong co notification bell | Them icon chuong + badge |
| Footer | Thieu ban do Google Maps | Them embedded map |
| LoginPage | Khong co "Quen mat khau" | Them flow reset password qua email |
| All pages | Khong co loading skeleton deu | Them skeleton cho moi trang |
| Tour card | Thieu so luong cho con lai | Hien "Con X cho" tren card |

### 6.2 Wireframe cai thien Header

```mermaid
graph LR
    A[Logo MyTour] --- B[Trang chu]
    B --- C[Tour]
    C --- D[Chinh sach]
    D --- E[Lien he]
    E --- F["🔔 (3)"]
    F --- G[Avatar + Ten]
    G --- H[Hotline]
```

---

## 7. HUONG DAN DOCKER

### 7.1 Docker Compose (chay toan bo he thong)

Tao file `docker-compose.yml` o thu muc goc:

```yaml
version: '3.8'

services:
  # === DATABASE ===
  postgres:
    image: postgres:12-alpine
    container_name: mytour_db
    environment:
      POSTGRES_DB: mytour_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  # === BACKEND ===
  backend:
    build:
      context: ./travel-be
      dockerfile: Dockerfile
    container_name: mytour_be
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mytour_db
      SPRING_DATASOURCE_USERNAME: user
      SPRING_DATASOURCE_PASSWORD: password
    depends_on:
      - postgres
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped

  # === FRONTEND ===
  frontend:
    build:
      context: ./travel-web
      dockerfile: Dockerfile
    container_name: mytour_fe
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  pgdata:
  uploads:
```

### 7.2 Dockerfile cho Backend

Tao file `travel-be/Dockerfile`:

```dockerfile
FROM maven:3.8-openjdk-8-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

FROM openjdk:8-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p uploads/images
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 7.3 Dockerfile cho Frontend

Tao file `travel-web/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 7.4 Nginx config cho Frontend

Tao file `travel-web/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # React Router - moi route deu tra ve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls den Backend
    location /api/ {
        proxy_pass http://backend:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Proxy upload files
    location /uploads/ {
        proxy_pass http://backend:8081;
    }
}
```

### 7.5 Lenh chay

```bash
# Build va chay toan bo
docker-compose up --build -d

# Xem logs
docker-compose logs -f

# Dung
docker-compose down

# Dung + xoa data
docker-compose down -v
```

---

## 8. CI/CD - TU DONG DEPLOY MIEN PHI

### 8.1 Tong quan

```mermaid
flowchart LR
    A[Developer push code] --> B[GitHub Actions]
    B --> C[Build + Test]
    C --> D[Build Docker Image]
    D --> E[Push to Registry]
    E --> F[Deploy len Server]

    subgraph "Mien phi"
        G[GitHub Actions - CI/CD]
        H[Railway.app - BE + DB]
        I[Vercel - FE]
    end
```

### 8.2 Phuong an MIEN PHI de demo

| Service | Dung cho | Free tier |
|---------|---------|-----------|
| **Vercel** | Frontend React | Unlimited |
| **Railway.app** | Backend Spring Boot + PostgreSQL | $5 credit/thang (du demo) |
| **GitHub Actions** | CI/CD pipeline | 2000 phut/thang |
| **Neon.tech** | PostgreSQL (thay the) | 512MB free |

### 8.3 Deploy Frontend len Vercel (MIEN PHI)

```bash
# 1. Cai Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
cd travel-web
vercel --prod
```

Hoac ket noi GitHub repo -> Vercel dashboard -> Auto deploy khi push.

Cau hinh Environment Variables tren Vercel:
```
VITE_API_URL=https://your-be.railway.app
```

### 8.4 Deploy Backend len Railway (MIEN PHI)

```bash
# 1. Cai Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Init project
cd travel-be
railway init

# 4. Them PostgreSQL
railway add --plugin postgresql

# 5. Deploy
railway up
```

Railway tu dong detect Spring Boot va build.

### 8.5 GitHub Actions - CI/CD Pipeline

Tao file `.github/workflows/deploy.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  # === BUILD & TEST BACKEND ===
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 8
        uses: actions/setup-java@v4
        with:
          java-version: '8'
          distribution: 'temurin'

      - name: Build Backend
        run: |
          cd travel-be
          ./mvnw clean package -DskipTests -B

      - name: Deploy to Railway
        if: success()
        run: |
          npm i -g @railway/cli
          cd travel-be
          railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  # === BUILD & DEPLOY FRONTEND ===
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install & Build
        run: |
          cd travel-web
          npm ci
          npm run build

      - name: Deploy to Vercel
        if: success()
        run: |
          npm i -g vercel
          cd travel-web
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 8.6 Huong dan tung buoc

```mermaid
flowchart TD
    A[1. Push code len GitHub] --> B[2. Tao tai khoan Vercel + Railway]
    B --> C[3. Ket noi GitHub repo]
    C --> D[4. Cau hinh Environment Variables]
    D --> E[5. Push len main branch]
    E --> F[6. GitHub Actions tu dong chay]
    F --> G[7. FE deploy len Vercel]
    F --> H[8. BE deploy len Railway]
    G --> I["9. Web live tai: https://mytour.vercel.app"]
    H --> I
```

### Buoc chi tiet:

**Buoc 1: Tao GitHub repo**
```bash
cd C:/hoang
git init
git add travel-web travel-be
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mytour.git
git push -u origin main
```

**Buoc 2: Dang ky Vercel (FE)**
- Vao https://vercel.com -> Sign up bang GitHub
- Import repo -> Chon folder `travel-web`
- Framework: Vite
- Build command: `npm run build`
- Output: `dist`

**Buoc 3: Dang ky Railway (BE + DB)**
- Vao https://railway.app -> Sign up bang GitHub
- New Project -> Deploy from GitHub
- Chon folder `travel-be`
- Add Plugin -> PostgreSQL
- Set Environment Variables:
  ```
  SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
  SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
  SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
  ```

**Buoc 4: Cap nhat FE de goi API moi**
- Tao file `travel-web/.env.production`:
  ```
  VITE_API_URL=https://your-be.railway.app
  ```
- Cap nhat `apiClient.ts` de dung env variable

**Buoc 5: Moi lan push code -> tu dong deploy!**

---

## 9. BANG TONG HOP PHAN QUYEN

| Chuc nang | User | Admin | Tai xe (tuong lai) |
|-----------|:----:|:-----:|:------------------:|
| Dang ky / Dang nhap | V | V | V |
| Xem tour + Dat tour | V | - | - |
| My Bookings | V | - | - |
| Profile | V | V | V |
| Dashboard thong ke | - | V | - |
| CRUD Tour Template | - | V | - |
| CRUD Lich khoi hanh | - | V | - |
| Duyet / Huy Booking | - | V | - |
| Gan tai xe | - | V | - |
| CRUD Tai xe | - | V | - |
| CRUD Danh muc | - | V | - |
| Quan ly User | - | V | - |
| Bao cao Doanh thu | - | V | - |
| Xuat Excel | - | V | - |
| Xem tour duoc gan | - | - | V |
| Cap nhat trang thai tour | - | - | V |
| Xem doanh thu ca nhan | - | - | V |

---

*Document nay duoc tao tu dong boi Claude Code. Cap nhat lan cuoi: 2026-03-18*
