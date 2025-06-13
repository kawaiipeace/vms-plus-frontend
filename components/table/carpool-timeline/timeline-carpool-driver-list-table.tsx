import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "../time-table";
import VehicleTimeLineDetailModal, {
  VehicleTimelineRef,
} from "../../vehicle-management/vehicle-timeline-detail-modal";
import { transformDriverApiToTableData } from "./generate-date";
import {
  DriverTimelineListTableData,
  DriverTimelineListTableDataParams,
} from "@/app/types/carpool-management-type";
import useGenerateDates from "../vehicle-timeline/useGenerateDates";
import { useColumns } from "./driverColumns";

interface RequestListTableProps {
  readonly dataRequest: any[];
  readonly params: Partial<DriverTimelineListTableDataParams>;
  readonly selectedOption: string;
  readonly lastMonth: string;
}

export default function CarpoolDriverListTable({
  dataRequest,
  params,
  selectedOption,
  lastMonth,
}: RequestListTableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState<string | null>(null);

  const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);
  const dates = useGenerateDates(params);
  const dataTransform = useMemo(
    () => transformDriverApiToTableData(dataRequest, dates),
    [dataRequest, dates]
  );
  const columnHelper = createColumnHelper<DriverTimelineListTableData>();

  const handleOpenDetailModal = () => vehicleTimelineDetailRef.current?.open();

  const columns = useColumns({
    columnHelper,
    dates,
    selectedOption,
    lastMonth,
    setTripDetails,
    handleOpenDetailModal,
    setDateSelected,
    startDate: params.start_date ?? "",
    endDate: params.end_date ?? "",
  });

  const table = useReactTable({
    data: dataTransform,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableSorting: false,
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <div className="w-full overflow-x-auto py-4 pt-0">
      {!isLoading && <DataTable table={table} />}
      <VehicleTimeLineDetailModal
        ref={vehicleTimelineDetailRef}
        detailRequest={tripDetails}
        currentDate={dateSelected ?? ""}
      />
    </div>
  );
}
