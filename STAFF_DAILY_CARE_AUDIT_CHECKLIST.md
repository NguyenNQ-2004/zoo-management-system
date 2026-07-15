# Staff Daily Care Audit Checklist

Owner: Duy

Purpose: Checklist doi chieu code hien tai voi danh sach task 16-30, dung de tiep tuc QA va commit.

## Status Legend

- `Implemented`: da co code frontend/backend tuong ung.
- `Needs Runtime Check`: can chay app va test endpoint/man hinh lai sau moi lan pull/merge.
- `Pass`: da test runtime thanh cong trong lan kiem tra hien tai.

## Frontend Checklist

| ID | Chuc nang | Route UI | API dung | File chinh | Trang thai |
| --- | --- | --- | --- | --- | --- |
| 16 | Staff Dashboard hien thi tong quan cong viec | `/staff` | `GET /api/staff/dashboard` | `frontend/src/pages/staff/StaffDashboard.js` | Implemented, Needs Runtime Check |
| 17 | Danh sach Task duoc giao | `/staff/tasks` | `GET /api/staff/tasks` | `frontend/src/pages/staff/StaffTasksPage.js` | Implemented, Needs Runtime Check |
| 18 | Task Detail | `/staff/tasks/:taskId` | `GET /api/staff/tasks/:id` | `frontend/src/pages/staff/StaffTaskDetailPage.js` | Implemented, Needs Runtime Check |
| 19 | Tim kiem va loc Task theo trang thai | `/staff/tasks` | `GET /api/staff/tasks?status=&search=` | `frontend/src/pages/staff/StaffTasksPage.js` | Implemented, Needs Runtime Check |
| 20 | Cap nhat trang thai Task | `/staff/tasks`, `/staff/tasks/:taskId` | `PUT /api/staff/tasks/:id/status` | `frontend/src/pages/staff/StaffTasksPage.js`, `frontend/src/pages/staff/StaffTaskDetailPage.js` | Implemented, Needs Runtime Check |
| 21 | Danh sach dong vat Staff phu trach | `/staff/animals` | `GET /api/staff/animals` | `frontend/src/pages/staff/StaffAnimalsPage.js` | Implemented, Needs Runtime Check |
| 22 | Daily Care Detail cua dong vat | `/staff/animals/:animalId/care` | `GET /api/staff/animals/:id/care` | `frontend/src/pages/staff/StaffCareDetail.js` | Implemented, Needs Runtime Check |
| 23 | Form ghi nhan hoat dong cham soc hang ngay | `/staff/animals/:animalId/care-logs/new` | `POST /api/staff/animals/:id/care-logs` | `frontend/src/pages/staff/StaffCareLogFormPage.js` | Implemented, Needs Runtime Check |
| 24 | Lich su cham soc dong vat | `/staff/animals/:animalId/care-logs` | `GET /api/staff/animals/:id/care-logs` | `frontend/src/pages/staff/StaffCareHistoryPage.js` | Implemented, Needs Runtime Check |

## Backend Checklist

| ID | Chuc nang | Endpoint | File chinh | Trang thai |
| --- | --- | --- | --- | --- |
| 25 | API Staff Dashboard Summary | `GET /api/staff/dashboard` | `backend/src/routes/staffRoutes.js`, `backend/src/controllers/staffController.js` | Implemented, Needs Runtime Check |
| 26 | API danh sach, chi tiet va filter Task | `GET /api/staff/tasks`, `GET /api/staff/tasks/:id` | `backend/src/routes/staffRoutes.js`, `backend/src/controllers/staffController.js` | Implemented, Needs Runtime Check |
| 27 | Cap nhat Task Status va thoi gian hoan thanh | `PUT /api/staff/tasks/:id/status` | `backend/src/routes/staffRoutes.js`, `backend/src/controllers/staffController.js` | Implemented, Needs Runtime Check |
| 28 | API lay dong vat Staff dang phu trach | `GET /api/staff/animals` | `backend/src/routes/staffRoutes.js`, `backend/src/controllers/staffController.js` | Implemented, Needs Runtime Check |
| 29 | Tao va xem Daily Care Log | `POST /api/staff/animals/:id/care-logs`, `GET /api/staff/animals/:id/care-logs` | `backend/src/routes/staffRoutes.js`, `backend/src/controllers/staffController.js` | Implemented, Needs Runtime Check |
| 30 | Cap nhat trang thai cham soc hang ngay cua dong vat | `PUT /api/staff/animals/:id/care-status` | `backend/src/routes/staffRoutes.js`, `backend/src/controllers/staffController.js` | Implemented, Needs Runtime Check |

## Backend Route Audit

Expected routes currently declared in `backend/src/routes/staffRoutes.js`:

```text
GET  /api/staff/dashboard
GET  /api/staff/tasks
GET  /api/staff/tasks/:id
PUT  /api/staff/tasks/:id/status
GET  /api/staff/animals
GET  /api/staff/animals/:id/care
GET  /api/staff/animals/:id/care-logs
POST /api/staff/animals/:id/care-logs
PUT  /api/staff/animals/:id/care-status
```

## Frontend Route Audit

Expected routes currently declared in `frontend/src/routes/AppRoutes.js`:

```text
/staff
/staff/tasks
/staff/tasks/:taskId
/staff/animals
/staff/animals/:animalId/care
/staff/animals/:animalId/care-logs
/staff/animals/:animalId/care-logs/new
```

## QA Checklist

Run these checks before final commit/push:

```powershell
cd backend
npm.cmd start
```

In another terminal:

```powershell
cd frontend
npm.cmd run build
npm.cmd start
```

Manual browser checks:

- Login with `staff@zoo.com / 123456`.
- Open `/staff`, verify dashboard has real task/care data.
- Open `/staff/tasks`, verify task list displays records.
- Search task by title/animal/area.
- Filter task by `TODO`, `IN_PROGRESS`, `DONE`.
- Change task status and refresh list.
- Open a task detail page.
- Open `/staff/animals`, verify animal cards display DB records.
- Open an animal daily care detail.
- Add a care log.
- Open care history and verify new log appears.
- Update animal care status.

API smoke checks:

```text
POST /api/auth/login
GET  /api/staff/dashboard
GET  /api/staff/tasks
GET  /api/staff/tasks/:id
PUT  /api/staff/tasks/:id/status
GET  /api/staff/animals
GET  /api/staff/animals/:id/care
GET  /api/staff/animals/:id/care-logs
POST /api/staff/animals/:id/care-logs
PUT  /api/staff/animals/:id/care-status
```

## Notes

- Current frontend API client uses `REACT_APP_API_URL || /api`.
- `frontend/package.json` uses proxy `http://localhost:5001`; backend must run before login/API screens.
- If UI shows fewer records than MongoDB, inspect filtering in `backend/src/controllers/staffController.js`. Current staff endpoints may filter by staff email/request context unless deliberately changed to show all records.
