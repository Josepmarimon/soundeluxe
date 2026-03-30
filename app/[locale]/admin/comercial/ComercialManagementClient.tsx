'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { format, formatDistanceToNow } from 'date-fns'
import { ca, es, enUS } from 'date-fns/locale'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Plus, Search, Copy, ExternalLink, Mail, Eye, MousePointer, Clock,
  Globe, Smartphone, Monitor, Tablet, Download, Check, TrendingUp,
  Send, CheckCircle2, AlertCircle, BarChart3, ArrowLeft, Trash2,
  Pencil, RotateCcw, Filter,
} from 'lucide-react'
import type {
  CommercialLink, CommercialLinkVisit, CommercialLinkStatus, CommercialLinkStats,
  CreateCommercialLinkInput,
} from '@/lib/types/commercial'
import type { CommercialRecipientType, LinkSection } from '@/lib/comercial/types'
import { getDefaultSectionsForType } from '@/lib/comercial/helpers'
import { TEMPLATES } from '@/lib/comercial/templates'
import RecipientTypeSelector from './RecipientTypeSelector'
import SectionEditor from './SectionEditor'
import ProposalPreview from './ProposalPreview'

const dateFnsLocales: Record<string, typeof ca> = { ca, es, en: enUS }

const statusConfig: Record<CommercialLinkStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Pendent', color: 'bg-gray-500/30 text-gray-200 border-gray-500/30', icon: <AlertCircle className="w-3 h-3" /> },
  SENT: { label: 'Enviat', color: 'bg-blue-500/30 text-blue-300 border-blue-500/30', icon: <Send className="w-3 h-3" /> },
  OPENED: { label: 'Obert', color: 'bg-green-500/30 text-green-300 border-green-500/30', icon: <Eye className="w-3 h-3" /> },
  CONVERTED: { label: 'Convertit', color: 'bg-amber-500/30 text-amber-300 border-amber-500/30', icon: <CheckCircle2 className="w-3 h-3" /> },
}

const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  mobile: <Smartphone className="w-4 h-4" />,
  tablet: <Tablet className="w-4 h-4" />,
  unknown: <Globe className="w-4 h-4" />,
}

interface Props {
  currentUserId: string
}

export default function ComercialManagementClient({ currentUserId }: Props) {
  const locale = useLocale()
  const dfLocale = dateFnsLocales[locale] || ca

  const [links, setLinks] = useState<CommercialLink[]>([])
  const [visits, setVisits] = useState<Record<string, CommercialLinkVisit[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLink, setSelectedLink] = useState<CommercialLink | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [resetConfirmId, setResetConfirmId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [sending, setSending] = useState(false)

  // Form
  const emptyForm: CreateCommercialLinkInput = {
    recipientEmail: '', recipientName: '', recipientCompany: '', notes: '', expiresAt: '', lang: 'CA',
    recipientType: 'VENUE',
    sections: undefined,
  }
  const [form, setForm] = useState<CreateCommercialLinkInput>(emptyForm)
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1)
  const [formSections, setFormSections] = useState<LinkSection[]>(() => getDefaultSectionsForType('VENUE'))

  const handleRecipientTypeChange = (type: CommercialRecipientType) => {
    setForm({ ...form, recipientType: type })
    setFormSections(getDefaultSectionsForType(type))
  }

  const fetchLinks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const res = await fetch(`/api/comercial/links?${params}`)
      if (!res.ok) throw new Error('Error loading links')
      const data = await res.json()
      setLinks(data.links || [])
      setVisits(data.visits || {})
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLinks() }, [statusFilter])

  const filteredLinks = useMemo(() => {
    if (!searchTerm) return links
    const term = searchTerm.toLowerCase()
    return links.filter(l =>
      l.recipientName.toLowerCase().includes(term) ||
      l.recipientEmail.toLowerCase().includes(term) ||
      l.recipientCompany?.toLowerCase().includes(term) ||
      l.notes?.toLowerCase().includes(term)
    )
  }, [links, searchTerm])

  const stats: CommercialLinkStats = useMemo(() => {
    const total = links.length
    const pending = links.filter(l => l.status === 'PENDING').length
    const sent = links.filter(l => l.status === 'SENT').length
    const opened = links.filter(l => l.status === 'OPENED').length
    const converted = links.filter(l => l.status === 'CONVERTED').length
    const openRate = sent + opened + converted > 0
      ? Math.round(((opened + converted) / (sent + opened + converted)) * 100) : 0
    const conversionRate = opened + converted > 0
      ? Math.round((converted / (opened + converted)) * 100) : 0
    return { total, pending, sent, opened, converted, openRate, conversionRate }
  }, [links])

  const handleCreate = async () => {
    if (!form.recipientEmail || !form.recipientName) {
      toast.error('Email i nom són obligatoris')
      return
    }
    try {
      setCreating(true)
      const res = await fetch('/api/comercial/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sections: formSections,
          createdBy: currentUserId,
        }),
      })
      if (!res.ok) throw new Error('Error creant enllaç')
      toast.success('Enllaç creat')
      setCreateOpen(false)
      setForm(emptyForm)
      setFormStep(1)
      setFormSections(getDefaultSectionsForType('VENUE'))
      fetchLinks()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedLink || !form.recipientEmail || !form.recipientName) return
    try {
      setEditing(true)
      const res = await fetch(`/api/comercial/links/${selectedLink.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sections: formSections,
        }),
      })
      if (!res.ok) throw new Error('Error actualitzant')
      toast.success('Enllaç actualitzat')
      setEditOpen(false)
      setDetailsOpen(false)
      setFormStep(1)
      fetchLinks()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setEditing(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/comercial/links/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error eliminant')
      toast.success('Enllaç eliminat')
      setDeleteConfirmId(null)
      setDetailsOpen(false)
      fetchLinks()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleResetStats = async (id: string) => {
    try {
      const res = await fetch('/api/comercial/reset-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: id }),
      })
      if (!res.ok) throw new Error('Error resetejant')
      const data = await res.json()
      toast.success(`Estadístiques resetejades (${data.deletedVisitsCount} visites eliminades)`)
      setResetConfirmId(null)
      setDetailsOpen(false)
      fetchLinks()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleSendEmail = async (id: string) => {
    try {
      setSending(true)
      const res = await fetch('/api/comercial/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: id }),
      })
      if (!res.ok) throw new Error('Error enviant email')
      toast.success('Email enviat!')
      fetchLinks()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleMarkConverted = async (id: string) => {
    try {
      const res = await fetch(`/api/comercial/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONVERTED' }),
      })
      if (!res.ok) throw new Error('Error')
      toast.success('Marcat com a convertit')
      fetchLinks()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const copyUrl = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/comercial/${token}`)
    toast.success('URL copiada')
  }

  const openDetails = (link: CommercialLink) => {
    setSelectedLink(link)
    setDetailsOpen(true)
  }

  const openEdit = (link: CommercialLink) => {
    setSelectedLink(link)
    const type = (link.recipientType || 'VENUE') as CommercialRecipientType
    setForm({
      recipientEmail: link.recipientEmail,
      recipientName: link.recipientName,
      recipientCompany: link.recipientCompany || '',
      notes: link.notes || '',
      expiresAt: link.expiresAt ? link.expiresAt.split('T')[0] : '',
      lang: link.lang as 'CA' | 'ES' | 'EN',
      recipientType: type,
    })
    setFormSections(link.sections || getDefaultSectionsForType(type))
    setFormStep(1)
    setEditOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold">Gestió Comercial</h1>
            </div>
            <p className="text-gray-400">Propostes comercials personalitzades amb tracking</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open('/api/comercial/export', '_blank')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button
              onClick={() => { setForm(emptyForm); setCreateOpen(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#c4a030] transition"
            >
              <Plus className="w-4 h-4" /> Nou Enllaç
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, icon: <BarChart3 className="w-4 h-4" /> },
            { label: 'Pendents', value: stats.pending, icon: <AlertCircle className="w-4 h-4" /> },
            { label: 'Enviats', value: stats.sent, icon: <Send className="w-4 h-4" /> },
            { label: 'Oberts', value: stats.opened, icon: <Eye className="w-4 h-4" /> },
            { label: 'Convertits', value: stats.converted, icon: <CheckCircle2 className="w-4 h-4" /> },
            { label: 'Open Rate', value: `${stats.openRate}%`, icon: <TrendingUp className="w-4 h-4" /> },
            { label: 'Conversió', value: `${stats.conversionRate}%`, icon: <Check className="w-4 h-4" /> },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                {s.icon} {s.label}
              </div>
              <div className="text-xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Cercar per nom, email, empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Tots</option>
            <option value="PENDING">Pendents</option>
            <option value="SENT">Enviats</option>
            <option value="OPENED">Oberts</option>
            <option value="CONVERTED">Convertits</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                  <th className="text-left p-3">Destinatari</th>
                  <th className="text-left p-3">Empresa</th>
                  <th className="text-left p-3">Tipus</th>
                  <th className="text-left p-3">Estat</th>
                  <th className="text-center p-3">Obertures</th>
                  <th className="text-left p-3">Última</th>
                  <th className="text-left p-3">Idioma</th>
                  <th className="text-right p-3">Accions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Cap resultat' : 'Encara no hi ha enllaços comercials'}
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((link) => {
                    const sc = statusConfig[link.status]
                    return (
                      <tr
                        key={link.id}
                        onClick={() => openDetails(link)}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition"
                      >
                        <td className="p-3">
                          <div className="font-medium">{link.recipientName}</div>
                          <div className="text-gray-500 text-xs">{link.recipientEmail}</div>
                        </td>
                        <td className="p-3 text-gray-400">{link.recipientCompany || '—'}</td>
                        <td className="p-3 text-gray-400 text-xs">
                          {link.recipientType ? TEMPLATES[link.recipientType as CommercialRecipientType]?.name.ca || link.recipientType : 'VENUE'}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sc.color}`}>
                            {sc.icon} {sc.label}
                          </span>
                        </td>
                        <td className="text-center p-3">{link.openCount}</td>
                        <td className="p-3 text-gray-400 text-xs">
                          {link.lastOpenedAt
                            ? formatDistanceToNow(new Date(link.lastOpenedAt), { addSuffix: true, locale: dfLocale })
                            : '—'}
                        </td>
                        <td className="p-3 text-gray-400 uppercase text-xs">{link.lang}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => copyUrl(link.token)} className="p-1.5 hover:bg-gray-700 rounded" title="Copiar URL">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {link.status === 'PENDING' && (
                              <button
                                onClick={() => handleSendEmail(link.id)}
                                disabled={sending}
                                className="p-1.5 hover:bg-gray-700 rounded text-blue-400"
                                title="Enviar per email"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {link.status === 'OPENED' && (
                              <button
                                onClick={() => handleMarkConverted(link.id)}
                                className="p-1.5 hover:bg-gray-700 rounded text-amber-400"
                                title="Marcar convertit"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => openEdit(link)} className="p-1.5 hover:bg-gray-700 rounded" title="Editar">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(link.id)}
                              className="p-1.5 hover:bg-gray-700 rounded text-red-400"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Details Slide-over ── */}
        {detailsOpen && selectedLink && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
            <div className="relative w-full max-w-lg bg-[#111] border-l border-gray-800 overflow-y-auto p-6">
              <button onClick={() => setDetailsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">&times;</button>

              <h2 className="text-xl font-bold mb-1">{selectedLink.recipientName}</h2>
              <p className="text-gray-400 text-sm mb-4">{selectedLink.recipientEmail}</p>

              {selectedLink.recipientCompany && (
                <p className="text-gray-300 text-sm mb-4">{selectedLink.recipientCompany}</p>
              )}

              <div className="flex gap-2 mb-6">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${statusConfig[selectedLink.status].color}`}>
                  {statusConfig[selectedLink.status].icon} {statusConfig[selectedLink.status].label}
                </span>
                <span className="text-xs text-gray-500">
                  Creat {format(new Date(selectedLink.createdAt), 'dd/MM/yyyy', { locale: dfLocale })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => copyUrl(selectedLink.token)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">
                  <Copy className="w-3.5 h-3.5" /> Copiar URL
                </button>
                <a href={`/comercial/${selectedLink.token}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">
                  <ExternalLink className="w-3.5 h-3.5" /> Obrir
                </a>
                {selectedLink.status === 'PENDING' && (
                  <button onClick={() => handleSendEmail(selectedLink.id)} disabled={sending}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 rounded-lg text-sm hover:bg-blue-500">
                    <Mail className="w-3.5 h-3.5" /> Enviar Email
                  </button>
                )}
                <button onClick={() => openEdit(selectedLink)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={() => setResetConfirmId(selectedLink.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Stats
                </button>
                <button onClick={() => setDeleteConfirmId(selectedLink.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-800 text-red-400 rounded-lg text-sm hover:bg-red-900/30">
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
              </div>

              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{selectedLink.openCount}</div>
                  <div className="text-xs text-gray-400">Obertures</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">
                    {visits[selectedLink.id]?.length
                      ? Math.round(visits[selectedLink.id].reduce((s, v) => s + (v.timeOnPageSeconds || 0), 0) / visits[selectedLink.id].length)
                      : 0}s
                  </div>
                  <div className="text-xs text-gray-400">Temps Mitjà</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">
                    {visits[selectedLink.id]?.length
                      ? Math.round(visits[selectedLink.id].reduce((s, v) => s + (v.scrollDepthPercent || 0), 0) / visits[selectedLink.id].length)
                      : 0}%
                  </div>
                  <div className="text-xs text-gray-400">Scroll Mitjà</div>
                </div>
              </div>

              {/* Notes */}
              {selectedLink.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Notes</h3>
                  <p className="text-gray-400 text-sm bg-gray-900 rounded-lg p-3">{selectedLink.notes}</p>
                </div>
              )}

              {/* Visits */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Visites ({visits[selectedLink.id]?.length || 0})</h3>
                <div className="space-y-2">
                  {(visits[selectedLink.id] || []).map((visit) => (
                    <div key={visit.id} className="bg-gray-900 rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {deviceIcons[visit.deviceType || 'unknown']}
                          <span className="text-gray-300">{visit.browser} / {visit.os}</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {formatDistanceToNow(new Date(visit.visitedAt), { addSuffix: true, locale: dfLocale })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {visit.country && <span>{visit.country}{visit.city ? `, ${visit.city}` : ''}</span>}
                        {visit.timeOnPageSeconds && <span><Clock className="w-3 h-3 inline" /> {visit.timeOnPageSeconds}s</span>}
                        {visit.scrollDepthPercent && <span><MousePointer className="w-3 h-3 inline" /> {visit.scrollDepthPercent}%</span>}
                      </div>
                      {visit.sectionsViewed?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {visit.sectionsViewed.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 bg-gray-800 rounded text-xs text-gray-400">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!visits[selectedLink.id] || visits[selectedLink.id].length === 0) && (
                    <p className="text-gray-500 text-sm">Encara no hi ha visites</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Create / Edit Modal (Multi-step) ── */}
        {(createOpen || editOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => { setCreateOpen(false); setEditOpen(false); setFormStep(1) }} />
            <div className="relative bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Step indicator */}
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold">{editOpen ? 'Editar Enllaç' : 'Nou Enllaç Comercial'}</h2>
                <div className="flex items-center gap-1 ml-auto">
                  {[1, 2, 3].map((step, i) => (
                    <span key={step}>
                      {i > 0 && <span className="inline-block w-6 h-px bg-gray-600 mx-0.5" />}
                      <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${
                        formStep === step ? 'bg-[#D4AF37] text-black' : formStep > step ? 'bg-gray-600 text-gray-300' : 'bg-gray-700 text-gray-400'
                      }`}>{step}</span>
                    </span>
                  ))}
                </div>
              </div>

              {formStep === 1 && (
                <div className="space-y-4">
                  {/* Recipient Type */}
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Tipus de destinatari</label>
                    <RecipientTypeSelector
                      value={(form.recipientType || 'VENUE') as CommercialRecipientType}
                      onChange={handleRecipientTypeChange}
                      lang={(form.lang?.toLowerCase() || 'ca') as 'ca' | 'es' | 'en'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Nom *</label>
                      <input
                        value={form.recipientName}
                        onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Nom del contacte"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Email *</label>
                      <input
                        type="email"
                        value={form.recipientEmail}
                        onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                        placeholder="email@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Empresa</label>
                      <input
                        value={form.recipientCompany || ''}
                        onChange={(e) => setForm({ ...form, recipientCompany: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Nom de l'empresa"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Data expiració</label>
                      <input
                        type="date"
                        value={form.expiresAt || ''}
                        onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Idioma</label>
                      <select
                        value={form.lang || 'CA'}
                        onChange={(e) => setForm({ ...form, lang: e.target.value as 'CA' | 'ES' | 'EN' })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="CA">Català</option>
                        <option value="ES">Castellà</option>
                        <option value="EN">Anglès</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Notes internes</label>
                      <textarea
                        value={form.notes || ''}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                        rows={2}
                        placeholder="Notes privades..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <SectionEditor
                  sections={formSections}
                  onChange={setFormSections}
                  recipientType={(form.recipientType || 'VENUE') as CommercialRecipientType}
                  lang={(form.lang?.toLowerCase() || 'ca') as 'ca' | 'es' | 'en'}
                />
              )}

              {formStep === 3 && (
                <ProposalPreview
                  recipientType={(form.recipientType || 'VENUE') as CommercialRecipientType}
                  recipientName={form.recipientName}
                  recipientCompany={form.recipientCompany}
                  lang={(form.lang?.toLowerCase() || 'ca') as 'ca' | 'es' | 'en'}
                  sections={formSections}
                />
              )}

              <div className="flex justify-between gap-2 mt-6">
                <div>
                  {formStep > 1 && (
                    <button
                      onClick={() => setFormStep((formStep - 1) as 1 | 2 | 3)}
                      className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800"
                    >
                      ← Enrere
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setCreateOpen(false); setEditOpen(false); setFormStep(1) }}
                    className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">
                    Cancel·lar
                  </button>
                  {formStep === 1 && (
                    <button
                      onClick={() => {
                        if (!form.recipientEmail || !form.recipientName) {
                          toast.error('Email i nom són obligatoris')
                          return
                        }
                        setFormStep(2)
                      }}
                      className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg text-sm hover:bg-[#c4a030]"
                    >
                      Seccions →
                    </button>
                  )}
                  {formStep === 2 && (
                    <button
                      onClick={() => setFormStep(3)}
                      className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg text-sm hover:bg-[#c4a030]"
                    >
                      Preview →
                    </button>
                  )}
                  {formStep === 3 && (
                    <button
                      onClick={editOpen ? handleEdit : handleCreate}
                      disabled={creating || editing}
                      className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg text-sm hover:bg-[#c4a030] disabled:opacity-50"
                    >
                      {creating || editing ? 'Guardant...' : editOpen ? 'Guardar' : 'Crear'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirm ── */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirmId(null)} />
            <div className="relative bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-sm text-center">
              <h3 className="text-lg font-bold mb-2">Eliminar enllaç?</h3>
              <p className="text-gray-400 text-sm mb-4">Aquesta acció és irreversible (soft delete).</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">
                  Cancel·lar
                </button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Reset Confirm ── */}
        {resetConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setResetConfirmId(null)} />
            <div className="relative bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-sm text-center">
              <h3 className="text-lg font-bold mb-2">Resetejar estadístiques?</h3>
              <p className="text-gray-400 text-sm mb-4">S'eliminaran totes les visites i es tornarà l'estat a Pendent.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setResetConfirmId(null)} className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">
                  Cancel·lar
                </button>
                <button onClick={() => handleResetStats(resetConfirmId)} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-500">
                  Resetejar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
