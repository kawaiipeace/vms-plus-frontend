import React, { useMemo, useRef, useState } from "react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
// import { transformApiToTableData } from "@/utils/vehicle-management";
import { transformDriverApiToTableData } from "@/components/table/carpool-timeline/generate-date";
// import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { DriverTimelineListTableData } from "@/app/types/carpool-management-type";
import useGenerateDates from "@/components/table/vehicle-timeline/useGenerateDates";
import { useColumns } from "./columns";
import VehicleTimeLineDetailModal, {
  VehicleTimelineRef,
} from "@/components/vehicle-management/vehicle-timeline-detail-modal";
import { DataTable } from "../time-table";

interface RequestListTableProps {
  readonly dataRequest: any[];
  readonly params: { start_date: string; end_date: string };
  readonly selectedOption: string;
  readonly lastMonth: string;
}

export default function RequestListTable({ dataRequest, params, selectedOption, lastMonth }: RequestListTableProps) {
  const [tripDetails, setTripDetails] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState<string | null>(null);
  const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);

  const dates = useGenerateDates(params);
  const dataTransform = useMemo(() => transformDriverApiToTableData(dataRequest, dates), [dataRequest, dates]);

  const columnHelper = createColumnHelper<DriverTimelineListTableData>();
  const handleOpenDetailModal = () => vehicleTimelineDetailRef.current?.open();

  const columns = useColumns({
    columnHelper,
    dates,
    selectedOption,
    lastMonth,
    handleOpenDetailModal,
    setTripDetails,
    setDateSelected,
    startDate: params.start_date,
    endDate: params.end_date,
  });

  const table = useReactTable({
    data: dataTransform,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: { enableSorting: false },
  });

  console.log("tripDetails", tripDetails);

  return (
    <div className="w-full overflow-x-auto py-4 pt-0">
      <DataTable table={table} />
      <VehicleTimeLineDetailModal
        ref={vehicleTimelineDetailRef}
        detailRequest={tripDetails}
        currentDate={dateSelected ?? ""}
      />
    </div>
  );
}
