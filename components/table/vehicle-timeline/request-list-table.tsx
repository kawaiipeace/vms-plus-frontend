import React, { useMemo, useRef, useState } from "react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { transformApiToTableData } from "@/utils/vehicle-management";
import { VehicleTimelineListTableData, VehicleTimelineSearchParams } from "@/app/types/vehicle-management/vehicle-timeline-type";
import useGenerateDates from "./useGenerateDates";
import { useColumns } from "./columns";
import VehicleTimeLineDetailModal, { VehicleTimelineRef } from "@/components/vehicle-management/vehicle-timeline-detail-modal";
import { DataTable } from "../time-table";

interface RequestListTableProps {
  readonly dataRequest: any[];
  readonly params: Partial<VehicleTimelineSearchParams>;
  readonly selectedOption: string;
  readonly lastMonth: string;
}

export default function RequestListTable({
  dataRequest,
  params,
  selectedOption,
  lastMonth,
}: RequestListTableProps) {
  const [tripDetails, setTripDetails] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState<string | null>(null);
  const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);

  const dates = useGenerateDates(params);
  const dataTransform = useMemo(() => transformApiToTableData(dataRequest, dates), [dataRequest, dates]);
  // console.log('dataTransform', dataTransform)

  const columnHelper = createColumnHelper<VehicleTimelineListTableData>();
  const handleOpenDetailModal = () => vehicleTimelineDetailRef.current?.open();

  const columns = useColumns({
    columnHelper,
    dates,
    selectedOption,
    lastMonth,
    handleOpenDetailModal,
    setTripDetails,
    setDateSelected,
    startDate: params.start_date ?? '',
    endDate: params.end_date ?? '',
  });

  const table = useReactTable({
    data: dataTransform,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: { enableSorting: false },
  });

  return (
    <div className="w-full overflow-x-auto py-4 pt-0">
      <DataTable table={table} />
      <VehicleTimeLineDetailModal
        ref={vehicleTimelineDetailRef}
        detailRequest={tripDetails}
        currentDate={dateSelected ?? ''}
      />
    </div>
  );
}
