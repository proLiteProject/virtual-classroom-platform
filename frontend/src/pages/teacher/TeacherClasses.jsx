import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import api from '../../services/api'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { SlideModal } from '../../components/common/SlideModal'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { useNavigate } from 'react-router-dom'

export const TeacherClasses = () => {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isStudentsOpen, setIsStudentsOpen] = useState(false)
  const [activeClass, setActiveClass] = useState(null)
  const [className, setClassName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [students, setStudents] = useState([])
  const [classStudents, setClassStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [working, setWorking] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/classrooms')
      setClasses(response.data.data || [])
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setClassName('')
    setIsCreateOpen(true)
  }

  const openEdit = (cls) => {
    setActiveClass(cls)
    setClassName(cls.class_name || '')
    setIsEditOpen(true)
  }

  const openDelete = (cls) => {
    setActiveClass(cls)
    setIsDeleteOpen(true)
  }


  const openStudents = async (cls) => {
    setActiveClass(cls)
    setIsStudentsOpen(true)
    await Promise.all([fetchStudents(), fetchClassStudents(cls.id)])
  }

  const closeCreate = () => {
    if (saving) return
    setIsCreateOpen(false)
    setClassName('')
  }

  const closeEdit = () => {
    if (saving) return
    setIsEditOpen(false)
    setActiveClass(null)
    setClassName('')
  }

  const closeDelete = () => {
    if (deleting) return
    setIsDeleteOpen(false)
    setActiveClass(null)
  }


  const closeStudents = () => {
    if (working) return
    setIsStudentsOpen(false)
    setActiveClass(null)
    setSelectedStudentId('')
  }

  const handleCreate = async () => {
    if (!className.trim()) return
    setSaving(true)
    try {
      await api.post('/classrooms', { classRoom: className.trim() })
      await fetchClasses()
      closeCreate()
    } catch (error) {
      console.error('Error creating class:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!activeClass || !className.trim()) return
    setSaving(true)
    try {
      await api.put(`/classrooms/${activeClass.id}`, { classRoom: className.trim() })
      await fetchClasses()
      closeEdit()
    } catch (error) {
      console.error('Error updating class:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!activeClass) return
    setDeleting(true)
    try {
      await api.delete(`/classrooms/${activeClass.id}`)
      await fetchClasses()
      closeDelete()
    } catch (error) {
      console.error('Error deleting class:', error)
    } finally {
      setDeleting(false)
    }
  }


  const fetchStudents = async () => {
    const response = await api.get('/teacher/students')
    setStudents(response.data.data || [])
  }

  const fetchClassStudents = async (classId) => {
    const response = await api.get(`/teacher/class-students?class_id=${classId}`)
    setClassStudents(response.data.data || [])
  }


  const handleAddStudent = async () => {
    if (!activeClass || !selectedStudentId) return
    setWorking(true)
    try {
      await api.post('/teacher/class-students', {
        classId: activeClass.id,
        studentId: Number(selectedStudentId)
      })
      await fetchClassStudents(activeClass.id)
      setSelectedStudentId('')
    } finally {
      setWorking(false)
    }
  }

  const handleRemoveClassStudent = async (id) => {
    setWorking(true)
    try {
      await api.delete(`/teacher/class-students/${id}`)
      await fetchClassStudents(activeClass.id)
    } finally {
      setWorking(false)
    }
  }

  return (
    <Layout>
      <style>
        {`
          .page-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .page-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: #2c3e50;
          }

          .table-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            overflow: hidden;
          }

          .table-card thead {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          }

          .table-card th, .table-card td {
            padding: 14px 16px;
          }

          .empty-state {
            text-align: center;
            padding: 40px;
            color: #6c757d;
          }

          .section-title {
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .inline-actions {
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }
        `}
      </style>

      {loading ? (
        <LoadingScreen label="Loading classes..." />
      ) : (
        <>
          <div className="page-header">
            <div className="page-title">
              <i className="fas fa-chalkboard mr-2 text-info"></i>
              My Classes
            </div>
            <button className="btn btn-info btn-sm" onClick={openCreate}>
              <i className="fas fa-plus mr-2"></i>
              New Class
            </button>
          </div>

          {classes.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-folder-open fa-2x mb-2"></i>
              <div>No classes yet</div>
            </div>
          ) : (
            <div className="table-card">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Created</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls.id}>
                      <td>{cls.class_name}</td>
                      <td>{cls.created_at ? new Date(cls.created_at).toLocaleDateString() : '-'}</td>
                      <td className="text-right">
                        <button className="btn btn-outline-success btn-sm" onClick={() => openEdit(cls)}>
                          <i className="fas fa-pencil"></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm ml-2" onClick={() => openDelete(cls)}>
                          <i className="fas fa-trash"></i>
                        </button>
                        <button className="btn btn-outline-secondary btn-sm ml-2" onClick={() => navigate(`/teacher/classes/${cls.id}/subjects`)}>
                          Manage Subjects
                        </button>
                        <button className="btn btn-outline-primary btn-sm ml-2" onClick={() => openStudents(cls)}>
                          Students
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <SlideModal
        open={isCreateOpen}
        onClose={closeCreate}
        title="Create Class"
        width={480}
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={closeCreate} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-info btn-sm" onClick={handleCreate} disabled={saving || !className.trim()}>
              {saving ? 'Saving...' : 'Create'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label>Class Name</label>
          <input
            type="text"
            className="form-control"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
          />
        </div>
      </SlideModal>

      <SlideModal
        open={isEditOpen}
        onClose={closeEdit}
        title="Edit Class"
        width={480}
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={closeEdit} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={handleUpdate} disabled={saving || !className.trim()}>
              {saving ? 'Saving...' : 'Update'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label>Class Name</label>
          <input
            type="text"
            className="form-control"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
          />
        </div>
      </SlideModal>

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Class"
        message={
          activeClass
            ? `Are you sure you want to delete "${activeClass.class_name}"?`
            : 'Are you sure you want to delete this class?'
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={closeDelete}
        onConfirm={handleDelete}
        loading={deleting}
      />


      <SlideModal
        open={isStudentsOpen}
        onClose={closeStudents}
        title={activeClass ? `Students - ${activeClass.class_name}` : 'Students'}
        width={560}
      >
        <div className="section-title">Enroll Student</div>
        <div className="inline-actions">
          <select
            className="form-control"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.name} ({s.roll_no || s.email})
              </option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm" onClick={handleAddStudent} disabled={working || !selectedStudentId}>
            Enroll
          </button>
        </div>

        <div className="section-title">Class Students</div>
        {classStudents.length === 0 ? (
          <div className="text-muted">No students enrolled yet.</div>
        ) : (
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roll No</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((cs) => (
                <tr key={cs.id}>
                  <td>{cs.name}</td>
                  <td>{cs.email}</td>
                  <td>{cs.roll_no || '-'}</td>
                  <td className="text-right">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveClassStudent(cs.id)} disabled={working}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SlideModal>

    </Layout>
  )
}
