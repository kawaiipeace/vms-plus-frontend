import React, { createContext, useContext, useState } from "react";
import { LogType } from "@/app/types/log-type";
import { PaginationType } from "@/app/types/request-action-type";
import { fetchLogs } from "@/services/masterService";

interface LogContextProps {
  dataRequest: LogType[];
  pagination: PaginationType;
  params: { page: number; limit: number };
  setParams: React.Dispatch<React.SetStateAction<{ page: number; limit: number }>>;
  loadLogs: (requestId: string) => void;
}

const LogContext = createContext<LogContextProps | undefined>(undefined);

export const useLogContext = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error("useLogContext must be used within a LogProvider");
  }
  return context;
};

export const LogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataRequest, setDataRequest] = useState<LogType[]>([]);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const loadLogs = async (requestId: string) => {
    try {
      const response = await fetchLogs(requestId, params);
      console.log('logs',response);
      const requestList = response.data.logs;
      const { total, totalPages } = response.data;

      setDataRequest(requestList);
      setPagination({
        limit: params.limit,
        page: params.page,
        total,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
    <LogContext.Provider
      value={{ dataRequest, pagination, params, setParams, loadLogs }}
    >
      {children}
    </LogContext.Provider>
  );
};
