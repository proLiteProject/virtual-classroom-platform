import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import api from '../../services/api'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { SlideModal } from '../../components/common/SlideModal'

export const TeacherClassSubjects = () => {
  const { id } = useParams()
  const classId = Number(id)
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '')
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState([])
  const [classSubjects, setClassSubjects] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [working, setWorking] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [materialsOpen, setMaterialsOpen] = useState(false)
  const [liveOpen, setLiveOpen] = useState(false)
  const [activeSubject, setActiveSubject] = useState(null)
  const [materials, setMaterials] = useState([])
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialFile, setMaterialFile] = useState(null)
  const [liveClasses, setLiveClasses] = useState([])
  const [liveStart, setLiveStart] = useState('')
  const [liveEnd, setLiveEnd] = useState('')

  useEffect(() => {
    fetchAll()
  }, [classId])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [allSubjects, assigned] = await Promise.all([
        api.get('/teacher/subjects'),
        api.get(`/teacher/class-subjects?class_id=${classId}`)
      ])
      setSubjects(allSubjects.data.data || [])
      setClassSubjects(assigned.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const assignedIds = useMemo(
    () => new Set(classSubjects.map((s) => s.subject_id)),
    [classSubjects]
  )

  const availableSubjects = useMemo(
    () => subjects.filter((s) => !assignedIds.has(s.id)),
    [subjects, assignedIds]
  )

  const toggleSelect = (subjectId) => {
    setSelectedIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    )
  }

  const handleAssignSelected = async () => {
    if (selectedIds.length === 0) return
    setWorking(true)
    try {
      await Promise.all(
        selectedIds.map((subjectId) =>
          api.post('/teacher/class-subjects', { classId, subjectId })
        )
      )
      setSelectedIds([])
      await fetchAll()
    } finally {
      setWorking(false)
    }
  }

  const handleRemove = async () => {
    if (!deleteTarget) return
    setWorking(true)
    try {
      await api.delete(`/teacher/class-subjects/${deleteTarget.id}`)
      await fetchAll()
      setDeleteTarget(null)
    } finally {
      setWorking(false)
    }
  }

  const openMaterials = async (subject) => {
    setActiveSubject(subject)
    setMaterialsOpen(true)
    await fetchMaterials(subject.subject_id)
  }

  const closeMaterials = () => {
    if (working) return
    setMaterialsOpen(false)
    setActiveSubject(null)
    setMaterials([])
    setMaterialTitle('')
    setMaterialFile(null)
  }

  const openLive = async (subject) => {
    setActiveSubject(subject)
    setLiveOpen(true)
    await fetchLiveClasses(subject.subject_id)
  }

  const closeLive = () => {
    if (working) return
    setLiveOpen(false)
    setActiveSubject(null)
    setLiveClasses([])
    setLiveStart('')
    setLiveEnd('')
  }

  const fetchMaterials = async (subjectId) => {
    const response = await api.get(
      `/teacher/materials?class_id=${classId}&subject_id=${subjectId}`
    )
    setMaterials(response.data.data || [])
  }

  const fetchLiveClasses = async (subjectId) => {
    const response = await api.get(`/teacher/live-classes?class_id=${classId}`)
    const list = response.data.data || []
    setLiveClasses(list.filter((l) => Number(l.subject_id) === Number(subjectId)))
  }

  const handleUploadMaterial = async () => {
    if (!activeSubject || !materialTitle || !materialFile) return
    setWorking(true)
    try {
      const form = new FormData()
      form.append('title', materialTitle)
      form.append('classId', classId)
      form.append('subjectId', activeSubject.subject_id)
      form.append('file', materialFile)
      await api.post('/teacher/materials', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await fetchMaterials(activeSubject.subject_id)
      setMaterialTitle('')
      setMaterialFile(null)
    } finally {
      setWorking(false)
    }
  }

  const handleDeleteMaterial = async (id) => {
    setWorking(true)
    try {
      await api.delete(`/teacher/materials/${id}`)
      await fetchMaterials(activeSubject.subject_id)
    } finally {
      setWorking(false)
    }
  }

  const handleCreateLiveClass = async () => {
    if (!activeSubject || !liveStart) return
    setWorking(true)
    try {
      await api.post('/teacher/live-classes', {
        classId,
        subjectId: activeSubject.subject_id,
        startTime: liveStart,
        endTime: liveEnd || null
      })
      await fetchLiveClasses(activeSubject.subject_id)
      setLiveStart('')
      setLiveEnd('')
    } finally {
      setWorking(false)
    }
  }

  const handleDeleteLiveClass = async (id) => {
    setWorking(true)
    try {
      await api.delete(`/teacher/live-classes/${id}`)
      await fetchLiveClasses(activeSubject.subject_id)
    } finally {
      setWorking(false)
    }
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

          .panel {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            padding: 18px;
            margin-bottom: 20px;
          }

          .subject-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 12px;
          }

          .subject-item {
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 10px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
        `}
      </style>

      {loading ? (
        <LoadingScreen label="Loading subjects..." />
      ) : (
        <>
          <div className="page-title">
            <i className="fas fa-book mr-2 text-info"></i>
            Manage Class Subjects
          </div>

          <div className="panel">
            <div className="mb-2 font-weight-bold">Available Subjects</div>
            {availableSubjects.length === 0 ? (
              <div className="text-muted">No unassigned subjects.</div>
            ) : (
              <div className="subject-grid">
                {availableSubjects.map((s) => (
                  <label key={s.id} className="subject-item">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />
                    <span>{s.subject_name}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-3">
              <button
                className="btn btn-info btn-sm"
                onClick={handleAssignSelected}
                disabled={working || selectedIds.length === 0}
              >
                Assign Selected
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="mb-2 font-weight-bold">Assigned Subjects</div>
            {classSubjects.length === 0 ? (
              <div className="text-muted">No subjects assigned yet.</div>
            ) : (
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classSubjects.map((cs) => (
                    <tr key={cs.id}>
                      <td>{cs.subject_name}</td>
                      <td className="text-right">
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => openMaterials(cs)}
                          disabled={working}
                        >
                          Materials
                        </button>
                        <button
                          className="btn btn-outline-dark btn-sm ml-2"
                          onClick={() => openLive(cs)}
                          disabled={working}
                        >
                          Live
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm ml-2"
                          onClick={() => setDeleteTarget(cs)}
                          disabled={working}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Subject"
        message={deleteTarget ? `Remove "${deleteTarget.subject_name}" from this class?` : 'Remove subject?'}
        confirmText="Remove"
        cancelText="Cancel"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleRemove}
        loading={working}
      />

      <SlideModal
        open={materialsOpen}
        onClose={closeMaterials}
        title={activeSubject ? `Materials - ${activeSubject.subject_name}` : 'Materials'}
        width={600}
      >
        <div className="mb-2 font-weight-bold">Upload PDF</div>
        <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Material title"
            value={materialTitle}
            onChange={(e) => setMaterialTitle(e.target.value)}
          />
          <input
            type="file"
            className="form-control"
            accept="application/pdf"
            onChange={(e) => setMaterialFile(e.target.files?.[0] || null)}
          />
          <button
            className="btn btn-warning btn-sm"
            onClick={handleUploadMaterial}
            disabled={working || !materialTitle || !materialFile}
          >
            Upload
          </button>
        </div>

        <div className="mt-3 font-weight-bold">Materials</div>
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
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteMaterial(m.id)} disabled={working}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SlideModal>

      <SlideModal
        open={liveOpen}
        onClose={closeLive}
        title={activeSubject ? `Live - ${activeSubject.subject_name}` : 'Live'}
        width={520}
      >
        <div className="mb-2 font-weight-bold">Schedule Live Class</div>
        <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
          <input
            type="datetime-local"
            className="form-control"
            value={liveStart}
            onChange={(e) => setLiveStart(e.target.value)}
          />
          <input
            type="datetime-local"
            className="form-control"
            value={liveEnd}
            onChange={(e) => setLiveEnd(e.target.value)}
          />
          <button
            className="btn btn-dark btn-sm"
            onClick={handleCreateLiveClass}
            disabled={working || !liveStart}
          >
            Create
          </button>
        </div>

        <div className="mt-3 font-weight-bold">Scheduled</div>
        {liveClasses.length === 0 ? (
          <div className="text-muted">No live classes yet.</div>
        ) : (
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {liveClasses.map((lc) => (
                <tr key={lc.id}>
                  <td>{lc.start_time ? new Date(lc.start_time).toLocaleString() : '-'}</td>
                  <td>{lc.end_time ? new Date(lc.end_time).toLocaleString() : '-'}</td>
                  <td className="text-right">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteLiveClass(lc.id)} disabled={working}>
                      Delete
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
