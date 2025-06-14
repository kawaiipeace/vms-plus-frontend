import React, { useMemo, useRef, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "../time-table";
import VehicleTimeLineDetailModal, {
  VehicleTimelineRef,
} from "../../vehicle-management/vehicle-timeline-detail-modal";
import { transformVehicleApiToTableData } from "./generate-date";
import { VehicleTimelineListTableDataParams } from "@/app/types/carpool-management-type";
import { useColumns } from "./vehicleColumns";
import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import useGenerateDates from "../vehicle-timeline/useGenerateDates";

interface RequestListTableProps {
  readonly dataRequest: any[];
  readonly params: Partial<VehicleTimelineListTableDataParams>;
  readonly selectedOption: string;
  readonly lastMonth: string;
}

export default function CarpoolVehicleListTable({
  dataRequest,
  params,
  selectedOption,
  lastMonth,
}: RequestListTableProps) {
  const [tripDetails, setTripDetails] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState<string | null>(null);
  const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);

  const dates = useGenerateDates(params);
  const dataTransform = useMemo(
    () => transformVehicleApiToTableData(dataRequest, dates),
    [dataRequest, dates]
  );

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
