import React, { useState, useEffect, useCallback } from 'react';
import { areaApi } from '../../services/api';
import './AreaManagement.css';

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    code: '', name: '', description: '', habitatType: '', status: 'Open', location: '', capacity: 0,
  });

  const fetchAreas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await areaApi.getAll();
      setAreas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAreas(); }, [fetchAreas]);

  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(''), 3000); return () => clearTimeout(t); }
  }, [success]);

  const filteredAreas = areas.filter(area => {
    const matchSearch = !searchTerm || 
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || area.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreateModal = () => {
    setEditingArea(null);
    setFormData({ code: '', name: '', description: '', habitatType: '', status: 'Open', location: '', capacity: 0 });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (area) => {
    setEditingArea(area);
    setFormData({
      code: area.code, name: area.name, description: area.description || '',
      habitatType: area.habitatType || '', status: area.status, location: area.location || '',
      capacity: area.capacity || 0,
    });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArea) {
        await areaApi.update(editingArea._id, formData);
        setSuccess('Cập nhật khu vực thành công!');
      } else {
        await areaApi.create(formData);
        setSuccess('Tạo khu vực mới thành công!');
      }
      setShowModal(false);
      fetchAreas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await areaApi.delete(deleteConfirm._id);
      setSuccess('Xóa khu vực thành công!');
      setDeleteConfirm(null);
      fetchAreas();
    } catch (err) {
      setError(err.message);
      setDeleteConfirm(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'open';
      case 'Maintenance': return 'maintenance';
      case 'Closed': return 'closed';
      default: return '';
    }
  };

  return (
    <div className="area-management">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Quản lý Khu vực</h1>
          <p>Quản lý các khu vực trong sở thú, theo dõi trạng thái hoạt động và sức chứa.</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
          Tạo khu vực mới
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>{error}</div>}
      {success && <div className="alert alert-success"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>{success}</div>}

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input type="text" placeholder="Tìm kiếm khu vực..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="Open">Đang mở</option>
          <option value="Maintenance">Bảo trì</option>
          <option value="Closed">Đã đóng</option>
        </select>
      </div>

      {/* Result Count */}
      <div className="result-count">
        <strong>{filteredAreas.length}</strong>
        <span>khu vực được tìm thấy</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="loading-container"><div className="spinner"></div>Đang tải dữ liệu...</div>
      ) : filteredAreas.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined">landscape</span>
          <p>Không tìm thấy khu vực nào.</p>
        </div>
      ) : (
        /* Area Cards Grid */
        <div className="area-grid">
          {filteredAreas.map((area) => (
            <div className="area-card" key={area._id}>
              <div className="area-card-header">
                <div className="area-card-title">
                  <h3>{area.name}</h3>
                  <span className="area-code">{area.code}</span>
                </div>
                <span className={`status-badge ${getStatusClass(area.status)}`}>
                  <span className="dot"></span>
                  {area.status === 'Open' ? 'Đang mở' : area.status === 'Maintenance' ? 'Bảo trì' : 'Đã đóng'}
                </span>
              </div>
              <div className="area-card-body">
                <p>{area.description || 'Không có mô tả.'}</p>
                <div className="area-meta">
                  <div className="area-meta-item">
                    <span className="material-symbols-outlined">park</span>
                    <span>{area.habitatType || 'N/A'}</span>
                  </div>
                  <div className="area-meta-item">
                    <span className="material-symbols-outlined">location_on</span>
                    <span>{area.location || 'N/A'}</span>
                  </div>
                  <div className="area-meta-item">
                    <span className="material-symbols-outlined">groups</span>
                    <span>Sức chứa: {area.capacity}</span>
                  </div>
                </div>
              </div>
              <div className="area-card-footer">
                <button className="btn-icon edit" title="Chỉnh sửa" onClick={() => openEditModal(area)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                </button>
                <button className="btn-icon delete" title="Xóa" onClick={() => setDeleteConfirm(area)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingArea ? 'Chỉnh sửa khu vực' : 'Tạo khu vực mới'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã khu vực</label>
                    <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="VD: A01" />
                  </div>
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      <option value="Open">Đang mở</option>
                      <option value="Maintenance">Bảo trì</option>
                      <option value="Closed">Đã đóng</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tên khu vực</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Khu vực Đồi Sư Tử" />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Mô tả khu vực..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Loại môi trường</label>
                    <input type="text" value={formData.habitatType} onChange={(e) => setFormData({ ...formData, habitatType: e.target.value })} placeholder="VD: Grassland" />
                  </div>
                  <div className="form-group">
                    <label>Vị trí</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="VD: Phía Bắc sở thú" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Sức chứa</label>
                  <input type="number" min="0" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary">{editingArea ? 'Cập nhật' : 'Tạo mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2>Xác nhận xóa</h2>
              <button className="btn-icon" onClick={() => setDeleteConfirm(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)' }}>
                Bạn có chắc muốn xóa khu vực <strong style={{ color: 'var(--color-primary)' }}>{deleteConfirm.name}</strong> ({deleteConfirm.code})? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={handleDelete}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>Xóa khu vực
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaManagement;
