import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import api from '../../services/api'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { SlideModal } from '../../components/common/SlideModal'

export const StudentClasses = () => {
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '')
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeClass, setActiveClass] = useState(null)
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false)
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [materials, setMaterials] = useState([])
  const [selectedSubjectId, setSelectedSubjectId] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/student/classes')
      setClasses(response.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const openSubjects = async (cls) => {
    setActiveClass(cls)
    setIsSubjectsOpen(true)
    const response = await api.get(`/student/class-subjects?class_id=${cls.id}`)
    setSubjects(response.data.data || [])
  }

  const openMaterials = async (cls) => {
    setActiveClass(cls)
    setIsMaterialsOpen(true)
    const response = await api.get(`/student/class-subjects?class_id=${cls.id}`)
    setSubjects(response.data.data || [])
  }

  const closeSubjects = () => {
    setIsSubjectsOpen(false)
    setActiveClass(null)
  }

  const closeMaterials = () => {
    setIsMaterialsOpen(false)
    setActiveClass(null)
    setSelectedSubjectId('')
    setMaterials([])
  }

  const fetchMaterials = async (classId, subjectId) => {
    const response = await api.get(
      `/student/materials?class_id=${classId}&subject_id=${subjectId}`
    )
    setMaterials(response.data.data || [])
  }

  const markRead = async (materialId) => {
    await api.post(`/student/materials/${materialId}/read`)
  }

  return (
    <Layout>
      <style>
        {`
          .page-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 16px;
          }

          .table-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            overflow: hidden;
          }

          .section-title {
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
          }
        `}
      </style>

      {loading ? (
        <LoadingScreen label="Loading classes..." />
      ) : (
        <>
          <div className="page-title">
            <i className="fas fa-book-open mr-2 text-info"></i>
            My Classes
          </div>

          {classes.length === 0 ? (
            <div className="text-muted">No enrolled classes.</div>
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
                        <button className="btn btn-outline-info btn-sm" onClick={() => openSubjects(cls)}>
                          Subjects
                        </button>
                        <button className="btn btn-outline-primary btn-sm ml-2" onClick={() => openMaterials(cls)}>
                          Materials
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
        open={isSubjectsOpen}
        onClose={closeSubjects}
        title={activeClass ? `Subjects - ${activeClass.class_name}` : 'Subjects'}
        width={520}
      >
        <div className="section-title">Subjects</div>
        {subjects.length === 0 ? (
          <div className="text-muted">No subjects assigned yet.</div>
        ) : (
          <ul className="list-group">
            {subjects.map((s) => (
              <li key={s.subject_id} className="list-group-item d-flex justify-content-between align-items-center">
                {s.subject_name}
              </li>
            ))}
          </ul>
        )}
      </SlideModal>

      <SlideModal
        open={isMaterialsOpen}
        onClose={closeMaterials}
        title={activeClass ? `Materials - ${activeClass.class_name}` : 'Materials'}
        width={600}
      >
        <div className="section-title">Select Subject</div>
        <select
          className="form-control mb-3"
          value={selectedSubjectId}
          onChange={(e) => {
            setSelectedSubjectId(e.target.value)
            if (activeClass && e.target.value) {
              fetchMaterials(activeClass.id, e.target.value)
            }
          }}
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
          ))}
        </select>

        {materials.length === 0 ? (
          <div className="text-muted">No materials yet.</div>
        ) : (
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>File</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td>
                    <a href={`${apiBase}${m.file_path}`} target="_blank" rel="noreferrer">View</a>
                  </td>
                  <td className="text-right">
                    <button className="btn btn-outline-success btn-sm" onClick={() => markRead(m.id)}>
                      Mark Read
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
