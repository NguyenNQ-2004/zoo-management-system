import React, { useState, useEffect, useCallback } from 'react';
import { serviceApi } from '../../services/api';
import './ServiceManagement.css';
import './AreaManagement.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    code: '', name: '', category: '', description: '', price: 0, duration: 0, isActive: true,
  });

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await serviceApi.getAll();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(''), 3000); return () => clearTimeout(t); }
  }, [success]);

  const filteredServices = services.filter(svc => {
    const matchSearch = !searchTerm ||
      svc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      svc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (svc.category && svc.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchActive = activeFilter === '' || 
      (activeFilter === 'active' && svc.isActive) || 
      (activeFilter === 'inactive' && !svc.isActive);
    return matchSearch && matchActive;
  });

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({ code: '', name: '', category: '', description: '', price: 0, duration: 0, isActive: true });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (svc) => {
    setEditingService(svc);
    setFormData({
      code: svc.code, name: svc.name, category: svc.category || '',
      description: svc.description || '', price: svc.price || 0, duration: svc.duration || 0,
      isActive: svc.isActive,
    });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData, price: parseFloat(formData.price) || 0, duration: parseInt(formData.duration) || 0 };
      if (editingService) {
        await serviceApi.update(editingService._id, submitData);
        setSuccess('Cập nhật dịch vụ thành công!');
      } else {
        await serviceApi.create(submitData);
        setSuccess('Tạo dịch vụ mới thành công!');
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await serviceApi.delete(deleteConfirm._id);
      setSuccess('Xóa dịch vụ thành công!');
      setDeleteConfirm(null);
      fetchServices();
    } catch (err) {
      setError(err.message);
      setDeleteConfirm(null);
    }
  };

  const handleToggleStatus = async (svc) => {
    try {
      await serviceApi.toggleStatus(svc._id);
      setSuccess(`${svc.isActive ? 'Tắt' : 'Bật'} dịch vụ "${svc.name}" thành công!`);
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="service-management">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Quản lý Dịch vụ</h1>
          <p>Quản lý các dịch vụ của sở thú dành cho khách tham quan, bao gồm giá cả và trạng thái hoạt động.</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
          Tạo dịch vụ mới
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>{error}</div>}
      {success && <div className="alert alert-success"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>{success}</div>}

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input type="text" placeholder="Tìm kiếm dịch vụ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="filter-select" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>

      {/* Result Count */}
      <div className="result-count">
        <strong>{filteredServices.length}</strong>
        <span>dịch vụ được tìm thấy</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="loading-container"><div className="spinner"></div>Đang tải dữ liệu...</div>
      ) : filteredServices.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined">room_service</span>
          <p>Không tìm thấy dịch vụ nào.</p>
        </div>
      ) : (
        /* Service Cards Grid */
        <div className="service-grid">
          {filteredServices.map((svc) => (
            <div className="service-card" key={svc._id} style={{ opacity: svc.isActive ? 1 : 0.75 }}>
              <div className="service-card-top">
                <div className="service-card-top-row">
                  <span className="service-name">{svc.name}</span>
                  <span className="service-price">{formatPrice(svc.price)}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="service-category">{svc.category || 'Chưa phân loại'}</span>
                  <span className="area-code" style={{ fontSize: 11 }}>{svc.code}</span>
                </div>
              </div>
              <div className="service-card-body">
                <p>{svc.description || 'Không có mô tả.'}</p>
                <div className="service-meta">
                  <div className="service-meta-item">
                    <span className="material-symbols-outlined">schedule</span>
                    <span>{svc.duration > 0 ? `${svc.duration} phút` : 'Không giới hạn'}</span>
                  </div>
                </div>
              </div>
              <div className="service-card-footer">
                <button className={`active-badge ${svc.isActive ? 'is-active' : 'is-inactive'}`} onClick={() => handleToggleStatus(svc)} title="Bấm để thay đổi trạng thái">
                  <span className="dot"></span>
                  {svc.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </button>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-icon edit" title="Chỉnh sửa" onClick={() => openEditModal(svc)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                  </button>
                  <button className="btn-icon delete" title="Xóa" onClick={() => setDeleteConfirm(svc)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                  </button>
                </div>
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
              <h2>{editingService ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã dịch vụ</label>
                    <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="VD: SV001" />
                  </div>
                  <div className="form-group">
                    <label>Danh mục</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="VD: Trải nghiệm" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tên dịch vụ</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Chụp ảnh cùng động vật" />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Mô tả dịch vụ..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Giá (VNĐ)</label>
                    <input type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Thời lượng (phút)</label>
                    <input type="number" min="0" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                    Dịch vụ đang hoạt động
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary">{editingService ? 'Cập nhật' : 'Tạo mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
                Bạn có chắc muốn xóa dịch vụ <strong style={{ color: 'var(--color-primary)' }}>{deleteConfirm.name}</strong> ({deleteConfirm.code})? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={handleDelete}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>Xóa dịch vụ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
