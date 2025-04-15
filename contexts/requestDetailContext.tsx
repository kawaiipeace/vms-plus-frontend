'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { requestDetail } from '@/services/bookingUser'
import { RequestDetailType } from '@/app/types/request-detail-type'

interface RequestDetailContextType {
  requestData?: RequestDetailType
  fetchRequestData: (request_id: string) => Promise<void>
}

const RequestDetailContext = createContext<RequestDetailContextType | undefined>(undefined)

export function RequestDetailProvider({ children }: { children: ReactNode }) {
  const [requestData, setRequestData] = useState<RequestDetailType>()

  const fetchRequestData = async (request_id: string) => {
    try {
      const res = await requestDetail(request_id)
      if(res)
      setRequestData(res.data)
    } catch (error) {
      console.error('Failed to fetch request detail:', error)
    }
  }

  return (
    <RequestDetailContext.Provider value={{ requestData, fetchRequestData }}>
      {children}
    </RequestDetailContext.Provider>
  )
}

export function useRequestDetailContext() {
  const context = useContext(RequestDetailContext)
  if (!context) throw new Error('useRequestDetailContext must be used within a RequestDetailProvider')
  return context
}
