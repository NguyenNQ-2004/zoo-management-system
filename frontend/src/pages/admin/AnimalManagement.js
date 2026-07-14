import React, { useState, useEffect, useCallback } from 'react';
import { animalApi, areaApi } from '../../services/api';
import './AnimalManagement.css';
import './AreaManagement.css';

const isNonNegativeNumber = (value) => value === '' || (Number.isFinite(Number(value)) && Number(value) >= 0);

const isValidHttpUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (error) {
    return false;
  }
};

const AnimalManagement = () => {
  const [animals, setAnimals] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');

  const [formData, setFormData] = useState({
    code: '', name: '', species: '', gender: 'Unknown', age: '', healthStatus: 'Healthy',
    behavior: '', origin: '', area: '', status: 'Active', imageUrl: '', notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [animalsData, areasData] = await Promise.all([
        animalApi.getAll({ search: searchTerm, area: areaFilter, status: statusFilter, healthStatus: healthFilter }),
        areaApi.getAll(),
      ]);
      setAnimals(animalsData);
      setAreas(areasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, areaFilter, statusFilter, healthFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(''), 3000); return () => clearTimeout(t); }
  }, [success]);

  const openCreateModal = () => {
    setEditingAnimal(null);
    setFormData({ code: '', name: '', species: '', gender: 'Unknown', age: '', healthStatus: 'Healthy', behavior: '', origin: '', area: areas[0]?._id || '', status: 'Active', imageUrl: '', notes: '' });
    setShowModal(true);
    setError('');
  };

  const openEditModal = (animal) => {
    setEditingAnimal(animal);
    setFormData({
      code: animal.code, name: animal.name, species: animal.species, gender: animal.gender,
      age: animal.age || '', healthStatus: animal.healthStatus, behavior: animal.behavior || '',
      origin: animal.origin || '', area: animal.area?._id || '', status: animal.status, imageUrl: animal.imageUrl || '', notes: animal.notes || '',
    });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const duplicateAnimal = animals.find((animal) => {
        const isSameAnimal = editingAnimal?._id === animal._id;
        const sameName = animal.name?.trim().toLowerCase() === formData.name.trim().toLowerCase();
        const sameSpecies = animal.species?.trim().toLowerCase() === formData.species.trim().toLowerCase();
        const sameArea = animal.area?._id === formData.area;
        return !isSameAnimal && sameName && (sameSpecies || sameArea);
      });

      if (duplicateAnimal) {
        throw new Error('Animal name already exists in the same species or area.');
      }

      if (!formData.area) {
        throw new Error('Area is required.');
      }

      if (!isNonNegativeNumber(formData.age)) {
        throw new Error('Animal age must be a number greater than or equal to 0.');
      }

      if (formData.imageUrl && !isValidHttpUrl(formData.imageUrl.trim())) {
        throw new Error('Image URL must be a valid http or https URL.');
      }

      const submitData = { ...formData, age: formData.age ? parseInt(formData.age) : null };
      if (editingAnimal) {
        await animalApi.update(editingAnimal._id, submitData);
        setSuccess('Cập nhật động vật thành công!');
      } else {
        await animalApi.create(submitData);
        setSuccess('Thêm động vật mới thành công!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await animalApi.delete(deleteConfirm._id);
      setSuccess('Xóa động vật thành công!');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      setError(err.message);
      setDeleteConfirm(null);
    }
  };

  const handleStatusChange = async (animal, newStatus) => {
    try {
      await animalApi.updateStatus(animal._id, newStatus);
      setSuccess(`Cập nhật trạng thái ${animal.name} thành công!`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAreaFilter('');
    setStatusFilter('');
    setHealthFilter('');
  };

  const getHealthClass = (health) => {
    switch (health) {
      case 'Healthy': return 'healthy';
      case 'Sick': return 'sick';
      case 'Under Treatment': return 'under-treatment';
      case 'Quarantine': return 'quarantine';
      case 'Recovered': return 'recovered';
      default: return '';
    }
  };

  return (
    <div className="animal-management">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Quản lý Động vật</h1>
          <p>Theo dõi và quản lý toàn bộ các cá thể động vật trong sở thú, bao gồm thông tin sức khỏe và phân khu.</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
          Thêm động vật
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>{error}</div>}
      {success && <div className="alert alert-success"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>{success}</div>}

      {/* Advanced Filters */}
      <div className="advanced-filters">
        <div className="filter-group" style={{ minWidth: 280 }}>
          <label>Tìm kiếm</label>
          <input type="text" placeholder="Tìm theo tên, mã hoặc loài..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Khu vực</label>
          <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
            <option value="">Tất cả khu vực</option>
            {areas.map((a) => (<option key={a._id} value={a._id}>{a.name}</option>))}
          </select>
        </div>
        <div className="filter-group">
          <label>Tình trạng sức khỏe</label>
          <select value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="Healthy">Khỏe mạnh</option>
            <option value="Sick">Bệnh</option>
            <option value="Under Treatment">Đang điều trị</option>
            <option value="Quarantine">Cách ly</option>
            <option value="Recovered">Hồi phục</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Trạng thái</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Không hoạt động</option>
            <option value="Transferred">Đã chuyển</option>
          </select>
        </div>
        <div className="filter-actions">
          <button className="btn-secondary" onClick={clearFilters}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_list_off</span>
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Result Count */}
      <div className="result-count">
        <strong>{animals.length}</strong>
        <span>cá thể được tìm thấy</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="loading-container"><div className="spinner"></div>Đang tải dữ liệu...</div>
      ) : animals.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined">pets</span>
          <p>Không tìm thấy động vật nào.</p>
        </div>
      ) : (
        /* Animal Cards Grid */
        <div className="animal-grid">
          {animals.map((animal) => (
            <div className="animal-card" key={animal._id}>
              <div className="animal-card-image">
                {animal.imageUrl ? (
                  <img src={animal.imageUrl} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="material-symbols-outlined animal-icon">pets</span>
                )}
                <div className="health-badge-wrapper" style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span className={`health-badge ${getHealthClass(animal.healthStatus)}`}>
                    <span className="dot"></span>
                    {animal.healthStatus}
                  </span>
                </div>
              </div>
              <div className="animal-card-body">
                <div className="animal-header">
                  <span className="animal-name">{animal.name}</span>
                  <span className="area-code" style={{ fontSize: 11 }}>{animal.code}</span>
                </div>
                <p className="animal-species">{animal.species}</p>
                <div className="animal-info-grid">
                  <div className="animal-info-item">
                    <span className="material-symbols-outlined">location_on</span>
                    <span>{animal.area?.name || 'N/A'}</span>
                  </div>
                  <div className="animal-info-item">
                    <span className="material-symbols-outlined">wc</span>
                    <span>{animal.gender}</span>
                  </div>
                  <div className="animal-info-item">
                    <span className="material-symbols-outlined">calendar_month</span>
                    <span>{animal.age ? `${animal.age} tuổi` : 'N/A'}</span>
                  </div>
                  <div className="animal-info-item">
                    <span className="material-symbols-outlined">public</span>
                    <span>{animal.origin || 'N/A'}</span>
                  </div>
                </div>
                {animal.behavior && (
                  <div className="animal-info-item" style={{ marginBottom: 8 }}>
                    <span className="material-symbols-outlined">psychology</span>
                    <span>Hành vi: {animal.behavior}</span>
                  </div>
                )}
                <div className="animal-card-actions">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`animal-status-tag ${animal.status.toLowerCase()}`}>
                      {animal.status === 'Active' ? 'Hoạt động' : animal.status === 'Inactive' ? 'Không hoạt động' : 'Đã chuyển'}
                    </span>
                    <select
                      value={animal.status}
                      onChange={(e) => handleStatusChange(animal, e.target.value)}
                      style={{ padding: '3px 6px', fontSize: 11, border: '1px solid var(--color-border-light)', borderRadius: 4, background: 'transparent', cursor: 'pointer' }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Transferred">Transferred</option>
                    </select>
                  </div>
                  <div className="animal-card-btns">
                    <button className="btn-icon edit" title="Chỉnh sửa" onClick={() => openEditModal(animal)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                    </button>
                    <button className="btn-icon delete" title="Xóa" onClick={() => setDeleteConfirm(animal)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <h2>{editingAnimal ? 'Chỉnh sửa động vật' : 'Thêm động vật mới'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã động vật</label>
                    <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="VD: AN001" />
                  </div>
                  <div className="form-group">
                    <label>Tên</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Simba" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Loài</label>
                  <input type="text" required value={formData.species} onChange={(e) => setFormData({ ...formData, species: e.target.value })} placeholder="VD: Sư tử châu Phi (Panthera leo)" />
                </div>
                <div className="form-group">
                  <label>Link ảnh</label>
                  <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/animal.jpg" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Giới tính</label>
                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                      <option value="Male">Đực</option>
                      <option value="Female">Cái</option>
                      <option value="Unknown">Không xác định</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tuổi</label>
                    <input type="number" min="0" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="VD: 5" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tình trạng sức khỏe</label>
                    <select value={formData.healthStatus} onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}>
                      <option value="Healthy">Khỏe mạnh</option>
                      <option value="Sick">Bệnh</option>
                      <option value="Under Treatment">Đang điều trị</option>
                      <option value="Quarantine">Cách ly</option>
                      <option value="Recovered">Hồi phục</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Không hoạt động</option>
                      <option value="Transferred">Đã chuyển</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hành vi</label>
                    <input type="text" value={formData.behavior} onChange={(e) => setFormData({ ...formData, behavior: e.target.value })} placeholder="VD: Active, Friendly" />
                  </div>
                  <div className="form-group">
                    <label>Nguồn gốc</label>
                    <input type="text" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} placeholder="VD: Nam Phi" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Khu vực</label>
                  <select required value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}>
                    <option value="">Chọn khu vực...</option>
                    {areas.map((a) => (<option key={a._id} value={a._id}>{a.name} ({a.code})</option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Ghi chú thêm..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary">{editingAnimal ? 'Cập nhật' : 'Thêm mới'}</button>
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
                Bạn có chắc muốn xóa cá thể <strong style={{ color: 'var(--color-primary)' }}>{deleteConfirm.name}</strong> ({deleteConfirm.code})? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="btn-danger" onClick={handleDelete}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalManagement;
