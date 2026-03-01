import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import api from '../../services/api'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { SlideModal } from '../../components/common/SlideModal'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'

export const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeSubject, setActiveSubject] = useState(null)
  const [subjectName, setSubjectName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await api.get('/teacher/subjects')
      setSubjects(response.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setSubjectName('')
    setIsCreateOpen(true)
  }

  const openEdit = (subject) => {
    setActiveSubject(subject)
    setSubjectName(subject.subject_name || '')
    setIsEditOpen(true)
  }

  const openDelete = (subject) => {
    setActiveSubject(subject)
    setIsDeleteOpen(true)
  }

  const closeCreate = () => {
    if (saving) return
    setIsCreateOpen(false)
    setSubjectName('')
  }

  const closeEdit = () => {
    if (saving) return
    setIsEditOpen(false)
    setActiveSubject(null)
    setSubjectName('')
  }

  const closeDelete = () => {
    if (deleting) return
    setIsDeleteOpen(false)
    setActiveSubject(null)
  }

  const handleCreate = async () => {
    if (!subjectName.trim()) return
    setSaving(true)
    try {
      await api.post('/teacher/subjects', { subjectName: subjectName.trim() })
      await fetchSubjects()
      closeCreate()
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!activeSubject || !subjectName.trim()) return
    setSaving(true)
    try {
      await api.put(`/teacher/subjects/${activeSubject.id}`, { subjectName: subjectName.trim() })
      await fetchSubjects()
      closeEdit()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!activeSubject) return
    setDeleting(true)
    try {
      await api.delete(`/teacher/subjects/${activeSubject.id}`)
      await fetchSubjects()
      closeDelete()
    } finally {
      setDeleting(false)
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
        `}
      </style>

      {loading ? (
        <LoadingScreen label="Loading subjects..." />
      ) : (
        <>
          <div className="page-header">
            <div className="page-title">
              <i className="fas fa-book mr-2 text-info"></i>
              Subjects
            </div>
            <button className="btn btn-info btn-sm" onClick={openCreate}>
              <i className="fas fa-plus mr-2"></i>
              New Subject
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="text-muted">No subjects yet.</div>
          ) : (
            <div className="table-card">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.id}>
                      <td>{s.subject_name}</td>
                      <td className="text-right">
                        <button className="btn btn-outline-success btn-sm" onClick={() => openEdit(s)}>
                          <i className="fas fa-pencil"></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm ml-2" onClick={() => openDelete(s)}>
                          <i className="fas fa-trash"></i>
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
        title="Create Subject"
        width={480}
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={closeCreate} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-info btn-sm" onClick={handleCreate} disabled={saving || !subjectName.trim()}>
              {saving ? 'Saving...' : 'Create'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label>Subject Name</label>
          <input
            type="text"
            className="form-control"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Enter subject name"
          />
        </div>
      </SlideModal>

      <SlideModal
        open={isEditOpen}
        onClose={closeEdit}
        title="Edit Subject"
        width={480}
        footer={
          <>
            <button className="btn btn-outline-secondary btn-sm" onClick={closeEdit} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-success btn-sm" onClick={handleUpdate} disabled={saving || !subjectName.trim()}>
              {saving ? 'Saving...' : 'Update'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label>Subject Name</label>
          <input
            type="text"
            className="form-control"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Enter subject name"
          />
        </div>
      </SlideModal>

      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Subject"
        message={activeSubject ? `Delete "${activeSubject.subject_name}"?` : 'Delete this subject?'}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={closeDelete}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Layout>
  )
}
