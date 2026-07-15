# Staff Task & Daily Animal Care Operations

Owner: Duy

Scope: Staff Task & Daily Animal Care Operations

## Frontend Tasks

| ID | Feature | Endpoint | Models | Status |
| --- | --- | --- | --- | --- |
| 16 | Lam Staff Dashboard hien thi tong quan cong viec | `GET /api/staff/dashboard` | `StaffTask`, `CareLog` | Done |
| 17 | Lam man hinh danh sach Task duoc giao | `GET /api/staff/tasks` | `StaffTask` | Done |
| 18 | Lam man hinh Task Detail | `GET /api/staff/tasks/:id` | `StaffTask` | Done |
| 19 | Lam chuc nang tim kiem va loc Task theo trang thai | `GET /api/staff/tasks?status=&search=` | `StaffTask` | Done |
| 20 | Lam chuc nang cap nhat trang thai Task | `PUT /api/staff/tasks/:id/status` | `StaffTask` | Done |
| 21 | Lam man hinh danh sach dong vat Staff phu trach | `GET /api/staff/animals` | `Animal`, `StaffTask` | Done |
| 22 | Lam man hinh Daily Care Detail cua dong vat | `GET /api/staff/animals/:id/care` | `Animal`, `CareLog` | Done |
| 23 | Lam form ghi nhan hoat dong cham soc hang ngay | `POST /api/staff/animals/:id/care-logs` | `CareLog`, `Animal` | Done |
| 24 | Hien thi lich su cham soc dong vat | `GET /api/staff/animals/:id/care-logs` | `CareLog` | Done |

## Backend Tasks

| ID | Feature | Endpoint | Models | Status |
| --- | --- | --- | --- | --- |
| 25 | Xay dung API Staff Dashboard Summary | `GET /api/staff/dashboard` | `StaffTask`, `CareLog` | Done |
| 26 | Xay dung API danh sach, chi tiet va filter Task | `GET /api/staff/tasks`; `GET /api/staff/tasks/:id` | `StaffTask`, `User` | Done |
| 27 | Xu ly cap nhat Task Status va thoi gian hoan thanh | `PUT /api/staff/tasks/:id/status` | `StaffTask` | Done |
| 28 | Xay dung API lay dong vat Staff dang phu trach | `GET /api/staff/animals` | `Animal`, `StaffTask` | Done |
| 29 | Xu ly tao va xem Daily Care Log | `POST /api/staff/animals/:id/care-logs`; `GET /api/staff/animals/:id/care-logs` | `CareLog`, `Animal` | Done |
| 30 | Xu ly cap nhat trang thai cham soc hang ngay cua dong vat | `PUT /api/staff/animals/:id/care-status` | `CareLog`, `Animal` | Done |

## Implementation Notes

- Use real MongoDB data from the current project models.
- Do not rely on hardcoded UI-only mock data once the backend APIs are ready.
- Keep Staff frontend routes under `/staff`.
- Keep Staff backend routes under `/api/staff`.
- Staff dashboard and daily care screens should read from `StaffTask`, `Animal`, and `CareLog`.
