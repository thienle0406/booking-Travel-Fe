# Business Flows - Web Booking Tour (3 Roles)

## 1. TONG QUAN HE THONG

```mermaid
graph TB
    subgraph Roles
        U[User - Khach hang]
        A[Admin - Quan tri]
        D[Driver - Tai xe]
    end

    subgraph Core Features
        F1[Dang ky / Dang nhap]
        F2[Tim kiem & Dat tour]
        F3[Quan ly Booking]
        F4[Quan ly Tai xe]
        F5[Quan ly Tour Template]
        F6[Quan ly Lich khoi hanh]
        F7[Bao cao Doanh thu]
    end

    U --> F1
    U --> F2
    A --> F3
    A --> F4
    A --> F5
    A --> F6
    A --> F7
    D --> F3
```

---

## 2. FLOW DANG KY & DANG NHAP (User)

```mermaid
flowchart TD
    A[User truy cap web] --> B{Da co tai khoan?}
    B -- Chua --> C[Vao trang Dang ky]
    C --> D[Nhap: Ho ten, Email, Mat khau]
    D --> E{Validate form}
    E -- Loi --> F[Hien thi loi: SĐT 10 so, Email hop le, MK >= 6 ky tu]
    F --> D
    E -- OK --> G[Goi API POST /auth/register]
    G --> H{Thanh cong?}
    H -- Loi --> I[Hien thi loi: Email/Username da ton tai]
    I --> D
    H -- OK --> J[Chuyen sang trang Dang nhap]

    B -- Roi --> K[Vao trang Dang nhap]
    K --> L[Nhap Username + Password]
    L --> M[Goi API POST /auth/login]
    M --> N{Thanh cong?}
    N -- Loi --> O[Sai tai khoan hoac mat khau]
    O --> K
    N -- OK --> P[Luu JWT Token + User info vao localStorage]
    P --> Q{Role?}
    Q -- USER --> R[Chuyen ve Trang chu]
    Q -- ADMIN --> S[Chuyen ve Admin Dashboard]
```

---

## 3. FLOW TIM KIEM & DAT TOUR (User)

```mermaid
flowchart TD
    A[User vao Trang chu] --> B[Xem Banner/Poster Slider]
    B --> C[Nhap diem den vao Search Bar]
    C --> D[Nhan Tim Kiem]
    D --> E[Chuyen sang /tours?destination=xxx]

    A --> F[Chon Danh muc tour]
    F --> G[Chuyen sang /tours?categoryId=xxx]

    E --> H[Trang Danh sach Tour]
    G --> H

    H --> I[Loc theo: Danh muc, Gia, Sap xep]
    I --> J[Chon 1 Tour Card]
    J --> K[Xem Chi tiet Tour]
    K --> L{User da dang nhap?}
    L -- Chua --> M[Chuyen sang Dang nhap]
    M --> K
    L -- Roi --> N[Nhan Dat Tour]
    N --> O[Trang Booking Form]
    O --> P[Nhap: Ho ten, Email, SDT, So nguoi, Yeu cau dac biet]
    P --> Q[Chon Phuong thuc thanh toan]
    Q --> R{Validate}
    R -- Loi --> S[Hien loi: SDT 10 so bat dau 0, Email hop le]
    S --> P
    R -- OK --> T[Goi API POST /bookings]
    T --> U{Kiem tra so cho trong?}
    U -- Het cho --> V[Bao loi: So cho khong du]
    V --> K
    U -- Con cho --> W[Tao booking - Status: Pending]
    W --> X[Hien thong bao Dat thanh cong]
    X --> Y[Chuyen sang Trang My Bookings]
```

---

## 4. FLOW TRANG THAI BOOKING (Admin)

```mermaid
stateDiagram-v2
    [*] --> Pending: User dat tour

    Pending --> Confirmed: Admin duyet
    Pending --> Cancelled: Admin/User huy

    Confirmed --> Assigned: Admin gan tai xe
    Confirmed --> Cancelled: Admin huy

    Assigned --> InProgress: Tour bat dau chay
    Assigned --> Cancelled: Admin huy truoc 24h

    InProgress --> Completed: Tour ket thuc

    Completed --> [*]
    Cancelled --> [*]

    note right of Pending
        Cho Admin xac nhan
        Kiem tra so cho trong
    end note

    note right of Assigned
        Tai xe chuyen sang BUSY
        Kiem tra tai xe ranh
    end note

    note right of Completed
        Tai xe chuyen sang AVAILABLE
        Ghi nhan doanh thu
    end note

    note right of Cancelled
        Tai xe chuyen sang AVAILABLE
        Hoan lai so cho (bookedSlots)
        Hoan tien theo quy dinh
    end note
```

---

## 5. FLOW QUAN LY BOOKING CHI TIET (Admin)

```mermaid
flowchart TD
    A[Admin vao Quan ly Booking] --> B[Xem danh sach booking - Table]
    B --> C[Loc theo trang thai: Pending / Confirmed / Assigned / ...]

    C --> D[Chon 1 booking - Nhan Sua]
    D --> E[Mo Modal Chi tiet Booking]
    E --> F[Xem thong tin: Khach hang, SDT, Email, So khach, Tong tien]

    F --> G{Hanh dong?}

    G --> H[Chuyen trang thai]
    H --> H1{Trang thai hien tai?}
    H1 -- Pending --> H2[Chon: Confirmed hoac Cancelled]
    H1 -- Confirmed --> H3[Chon: Assigned hoac Cancelled]
    H1 -- Assigned --> H4[Chon: InProgress hoac Cancelled]
    H1 -- InProgress --> H5[Chon: Completed]

    H2 --> I[Luu thay doi]
    H3 --> I
    H4 --> I
    H5 --> I

    G --> J[Gan tai xe]
    J --> J1{Status = Confirmed?}
    J1 -- Chua --> J2[Phai xac nhan booking truoc]
    J1 -- Roi --> J3[Mo SearchableComboBox - Tim tai xe ranh]
    J3 --> J4[Chon tai xe]
    J4 --> I

    I --> K[Goi API cap nhat]
    K --> L{Thanh cong?}
    L -- OK --> M[Tai lai danh sach]
    L -- Loi --> N[Hien thong bao loi]

    G --> O[Xoa booking]
    O --> P[Hien popup xac nhan]
    P --> Q{Dong y?}
    Q -- Huy --> E
    Q -- OK --> R[Goi API DELETE /bookings/id]
    R --> M
```

---

## 6. FLOW LOGIC HUY TOUR

```mermaid
flowchart TD
    A[Admin chon Cancelled cho booking] --> B{Booking co tai xe?}

    B -- Co --> C[Tu dong chuyen tai xe -> Available]
    B -- Khong --> D[Bo qua]

    C --> E{Tinh thoi gian truoc khoi hanh}
    D --> E

    E --> F{So gio truoc startDate?}
    F -- "> 24h" --> G[Hoan tien 100%]
    F -- "< 24h" --> H[Hoan tien 50%]
    F -- "Tour da bat dau" --> I[Khong hoan tien]

    G --> J[Hoan lai bookedSlots cho TourDeparture]
    H --> J
    I --> J

    J --> K[Cap nhat status = Cancelled]
    K --> L[Luu vao DB]
    L --> M[Hien canh bao hoan tien cho Admin]
```

---

## 7. FLOW QUAN LY TAI XE (Admin)

```mermaid
flowchart TD
    A[Admin vao Quan ly Tai xe] --> B[Xem danh sach tai xe - Table]
    B --> C{Hanh dong?}

    C --> D[Them tai xe moi]
    D --> D1[Nhap: Ten, SDT, Bien so xe, Thong tin xe]
    D1 --> D2{Validate}
    D2 -- Loi --> D3[SDT 10 so / Bien so khong hop le]
    D3 --> D1
    D2 -- OK --> D4[Goi API POST /drivers]
    D4 --> B

    C --> E[Sua tai xe]
    E --> E1[Mo Modal voi thong tin hien tai]
    E1 --> E2[Sua: Ten, SDT, Bien so, Xe, Trang thai]
    E2 --> E3[Goi API PUT /drivers/id]
    E3 --> B

    C --> F[Xoa tai xe]
    F --> F1[Popup xac nhan]
    F1 --> F2[Goi API DELETE /drivers/id]
    F2 --> B

    C --> G[Xem doanh thu tai xe]
    G --> G1[Goi API GET /bookings/by-driver/id]
    G1 --> G2[Hien Modal: Danh sach booking da xac nhan]
    G2 --> G3[Tinh tong doanh thu]
```

---

## 8. FLOW QUAN LY TOUR (Admin)

```mermaid
flowchart TD
    A[Admin] --> B[Quan ly Tour Template]
    A --> C[Quan ly Lich Khoi Hanh]

    B --> B1[Xem danh sach Template]
    B1 --> B2{Hanh dong?}
    B2 --> B3[Them Template moi]
    B3 --> B4[Nhap: Ten, Diem den, Gia goc, Giam gia, Danh muc]
    B4 --> B5[Soan Mo ta bang Rich Text Editor]
    B5 --> B6[Upload anh bia]
    B6 --> B7[Luu]

    B2 --> B8[Sua Template]
    B2 --> B9[Xoa Template]

    C --> C1[Xem danh sach Departure]
    C1 --> C2{Hanh dong?}
    C2 --> C3[Them Lich moi]
    C3 --> C4[Chon Template + Ngay di/ve + Gia + So cho]
    C4 --> C5[Status: Pending]
    C5 --> C6[Luu]

    C2 --> C7[Sua lich]
    C2 --> C8[Xoa lich]
    C2 --> C9[Xuat Manifest Excel]
```

---

## 9. FLOW BAO CAO DOANH THU (Admin)

```mermaid
flowchart TD
    A[Admin vao Bao cao Ke toan] --> B[Chon Thang/Nam]
    B --> C[Goi API POST /bookings/revenue-report]
    C --> D[Nhan danh sach booking da xac nhan trong thang]
    D --> E[Hien thi bang bao cao]
    E --> F[Tinh tong doanh thu]
    F --> G{Xuat bao cao?}
    G -- Co --> H[Xuat file Excel .xlsx]
    G -- Khong --> I[Xem tren web]
```

---

## 10. FLOW USER XEM BOOKING CUA TOI

```mermaid
flowchart TD
    A[User dang nhap] --> B[Vao My Bookings]
    B --> C[Goi API POST /bookings/my-bookings]
    C --> D[Hien danh sach booking cua user]
    D --> E[Xem trang thai tung booking]

    E --> F{Trang thai?}
    F -- Pending --> G[Badge vang - Cho duyet]
    F -- Confirmed --> H[Badge xanh duong - Da xac nhan]
    F -- Assigned --> I[Badge indigo - Da gan tai xe]
    F -- InProgress --> J[Badge cyan - Dang thuc hien]
    F -- Completed --> K[Badge xanh la - Hoan thanh]
    F -- Cancelled --> L[Badge do - Da huy]
```

---

## 11. FLOW TOAN BO HE THONG (Overview)

```mermaid
flowchart LR
    subgraph USER
        U1[Dang ky] --> U2[Dang nhap]
        U2 --> U3[Tim tour]
        U3 --> U4[Dat tour]
        U4 --> U5[Theo doi booking]
    end

    subgraph ADMIN
        A1[Tao Tour Template] --> A2[Tao Lich Khoi Hanh]
        A2 --> A3[Duyet Booking - Confirmed]
        A3 --> A4[Gan tai xe - Assigned]
        A4 --> A5[Bat dau tour - InProgress]
        A5 --> A6[Ket thuc tour - Completed]
        A3 --> A7[Huy booking - Cancelled]
    end

    subgraph DRIVER
        D1[Duoc gan vao booking]
        D2[Trang thai: Available -> Busy]
        D3[Chay tour]
        D4[Hoan thanh -> Available]
    end

    U4 -->|Tao Pending| A3
    A4 -->|Gan| D1
    D1 --> D2
    D2 --> D3
    D3 --> D4
    A6 -->|Hoan thanh| D4
```

---

## 12. BANG PHAN QUYEN (Authorization Matrix)

| Chuc nang | User | Admin | Driver |
|-----------|------|-------|--------|
| Dang ky / Dang nhap | V | V | - |
| Xem trang chu + Tour | V | V | - |
| Dat tour (Booking) | V | - | - |
| Xem My Bookings | V | - | - |
| Cap nhat Profile | V | V | - |
| Quan ly Tour Template | - | V | - |
| Quan ly Lich Khoi Hanh | - | V | - |
| Duyet / Huy Booking | - | V | - |
| Gan tai xe | - | V | - |
| Quan ly Tai xe | - | V | - |
| Quan ly User | - | V | - |
| Quan ly Danh muc | - | V | - |
| Bao cao Doanh thu | - | V | - |
| Xuat Excel | - | V | - |

---

## 13. BANG TRANG THAI TAI XE

```mermaid
stateDiagram-v2
    [*] --> Available: Tao moi tai xe

    Available --> Busy: Duoc gan vao booking (Assigned)
    Busy --> Available: Tour hoan thanh (Completed)
    Busy --> Available: Booking bi huy (Cancelled)
    Busy --> Available: Doi tai xe khac (Re-assign)

    note right of Available
        Co the nhan booking moi
        Hien trong SearchableComboBox
    end note

    note right of Busy
        Dang chay tour
        Khong hien trong danh sach chon
    end note
```
