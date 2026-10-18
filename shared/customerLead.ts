export type CustomerLead = {
  name: string
  email: string
  phone: string
  device?: string
  issue?: string
  intent?: string
  notes?: string
}

export function generateInquiryReference(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `INQ-${y}${m}${d}-${rand}`
}

export function isLeadComplete(lead?: Partial<CustomerLead>): lead is CustomerLead {
  return Boolean(
    lead?.name?.trim() &&
      lead?.email?.trim() &&
      lead?.phone?.trim() &&
      /\S+@\S+\.\S+/.test(lead.email),
  )
}

export function sanitizeLead(lead?: Partial<CustomerLead>): Partial<CustomerLead> | undefined {
  if (!lead) return undefined
  const out: Partial<CustomerLead> = {}
  if (lead.name?.trim()) out.name = lead.name.trim()
  if (lead.email?.trim()) out.email = lead.email.trim()
  if (lead.phone?.trim()) out.phone = lead.phone.trim()
  if (lead.device?.trim()) out.device = lead.device.trim()
  if (lead.issue?.trim()) out.issue = lead.issue.trim()
  if (lead.intent?.trim()) out.intent = lead.intent.trim()
  if (lead.notes?.trim()) out.notes = lead.notes.trim()
  return Object.keys(out).length ? out : undefined
}
