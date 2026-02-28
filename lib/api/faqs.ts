const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface FAQ {
  id: number
  q: string
  a: string
  order: number
}

export interface AdminFAQ {
  id: number
  question_fr: string
  answer_fr: string
  question_ar?: string
  answer_ar?: string
  order: number
  is_active: boolean
}

// Public API - Get all FAQs
export async function getFaqs(lang: string = 'fr'): Promise<FAQ[]> {
  try {
    const response = await fetch(`${API_URL}/faqs?lang=${lang}`, {
      cache: 'no-store',
    })
    const data = await response.json()
    
    if (data.success) {
      return data.faqs
    }
    return []
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
}

// Public API - Get preview FAQs (first 3)
export async function getFaqsPreview(lang: string = 'fr'): Promise<FAQ[]> {
  try {
    const response = await fetch(`${API_URL}/faqs/preview?lang=${lang}`, {
      cache: 'no-store',
    })
    const data = await response.json()
    
    if (data.success) {
      return data.faqs
    }
    return []
  } catch (error) {
    console.error('Error fetching FAQ preview:', error)
    return []
  }
}

// Admin API - Get all FAQs for management
export async function getAdminFaqs(): Promise<AdminFAQ[]> {
  try {
    const response = await fetch(`${API_URL}/admin/faqs`, {
      cache: 'no-store',
    })
    const data = await response.json()
    
    if (data.success) {
      return data.faqs
    }
    return []
  } catch (error) {
    console.error('Error fetching admin FAQs:', error)
    return []
  }
}

// Admin API - Create FAQ
export async function createFaq(faq: Partial<AdminFAQ>) {
  const response = await fetch(`${API_URL}/admin/faqs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(faq),
  })
  return response.json()
}

// Admin API - Update FAQ
export async function updateFaq(id: number, faq: Partial<AdminFAQ>) {
  const response = await fetch(`${API_URL}/admin/faqs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(faq),
  })
  return response.json()
}

// Admin API - Reorder FAQs
export async function reorderFaqs(faqs: { id: number; order: number }[]) {
  const response = await fetch(`${API_URL}/admin/faqs/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ faqs }),
  })
  return response.json()
}

// Admin API - Delete FAQ
export async function deleteFaq(id: number) {
  const response = await fetch(`${API_URL}/admin/faqs/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}
