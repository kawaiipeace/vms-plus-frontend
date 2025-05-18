import { useEffect, useRef, useState } from "react";
import { DataTable } from "./dataTable";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import ConfirmCancelCreateCarpoolModal from "../modal/confirmCancelCreateCarpoolModal";
import { deleteCarpoolVehicle } from "@/services/carpoolManagement";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: any[];
  pagination: PaginationType;
  setRefetch: (value: boolean) => void;
}

export default function CarpoolVehicleTable({
  defaultData,
  pagination,
  setRefetch,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteId, setDeleteId] = useState<string | undefined>();

  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1,
    pageSize: pagination.limit,
  });

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const response = await deleteCarpoolVehicle(deleteId);
        if (response.request.status === 200) {
          setDeleteId(undefined);
          setRefetch(true);
          cancelCreateModalRef.current?.closeModal();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "vehicle_license_plate",
      header: () => (
        <div className="text-center">เลขทะเบียน / ยี่ห้อ / รุ่น</div>
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <div
          className="text-left font-semibold"
          data-name="เลขทะเบียน / ยี่ห้อ / รุ่น"
        >
          <div>{row.original.vehicle_license_plate}</div>
          <div className="text-xs text-[#475467]">
            {row.original.vehicle_brand} {row.original.vehicle_model}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "CarType",
      header: () => <div className="text-center">ประเภทยานพาหนะ</div>,
      enableSorting: false,
    },
    {
      accessorKey: "ref_fuel_type_id",
      header: () => <div className="text-left">ประเภทเชื้อเพลิง</div>,
      enableSorting: false,
    },
    {
      accessorKey: "owner_dept_name",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">สังกัดยานพาหนะ</div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "fleet_card_no",
      header: () => (
        <div className="text-center">หมายเลขบัตรเติมน้ำมัน / RFID</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "is_tax_credit",
      header: () => <div className="text-center">เครดิตภาษี</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="เครดิตภาษี">
            {row.original.is_tax_credit === "1" ? (
              <div className="w-6 h-6 rounded-full border border-[#ABEFC6] bg-[#ECFDF3] flex items-center justify-center">
                <i className="material-symbols-outlined text-[#ABEFC6">check</i>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border border-[#FECDCA] bg-[#FEF3F2] flex items-center justify-center">
                <i className="material-symbols-outlined text-[#FECDCA">close</i>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "vehicle_mileage",
      header: () => <div className="text-center">เลขไมล์ล่าสุด</div>,
      enableSorting: true,
    },
    {
      accessorKey: "vehicle_registration_date",
      header: () => <div className="text-center">อายุการใช้งาน</div>,
      enableSorting: true,
    },
    {
      accessorKey: "ref_vehicle_status_code",
      header: () => <div className="text-center">สถานะ</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="สถานะ">
            {row.original.ref_vehicle_status_code === "ปกติ" ? (
              <div className="text-[#067647] bg-[#ECFDF3] border border-[#ABEFC6] rounded-full flex items-center justify-center">
                ปกติ
              </div>
            ) : row.original.ref_vehicle_status_code === "บำรุงรักษา" ? (
              <div className="text-[#FEDF89] bg-[#FFFAEB] border border-[#B54708] rounded-full flex items-center justify-center">
                บำรุงรักษา
              </div>
            ) : row.original.ref_vehicle_status_code === "สิ้นสุดสัญญา" ? (
              <div className="text-[#344054] bg-[#F9FAFB] border border-[#EAECF0] rounded-full flex items-center justify-center">
                บำรุงรักษา
              </div>
            ) : row.original.ref_vehicle_status_code === "ส่งซ่อม" ? (
              <div className="text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] rounded-full flex items-center justify-center">
                ส่งซ่อม
              </div>
            ) : row.original.ref_vehicle_status_code === "ใช้ชั่วคราว" ? (
              <div className="text-[#3538CD] bg-[#EEF4FF] border border-[#C7D7FE] rounded-full flex items-center justify-center">
                ใช้ชั่วคราว
              </div>
            ) : (
              <div className="text-[#344054] bg-[#F9FAFB] border border-[#EAECF0] rounded-full flex items-center justify-center">
                {row.original.ref_vehicle_status_code}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => <div className="text-center"></div>,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-left dataTable-action">
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
              data-tip="ลบ"
              onClick={() => {
                cancelCreateModalRef.current?.openModal();
                setDeleteId(row.original.mas_carpool_vehicle_uid);
              }}
            >
              <i className="material-symbols-outlined">delete</i>
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: defaultData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination: paginationState,
    },
    defaultColumn: {
      enableSorting: false,
    },
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="w-full py-4 pt-0">
      {!isLoading && (
        <>
          <DataTable table={table} />
        </>
      )}

      <ConfirmCancelCreateCarpoolModal
        id={""}
        ref={cancelCreateModalRef}
        title={"ยืนยันนำยานพาหนะออกจากกลุ่ม?"}
        desc={
          "คุณต้องการนำยานพาหนะเลขทะเบียน " +
          defaultData.find((item) => item.mas_carpool_approver_uid === deleteId)
            ?.vehicle_license_plate +
          " สังกัด " +
          defaultData.find((item) => item.mas_carpool_approver_uid === deleteId)
            ?.owner_dept_name +
          " ออกจากการให้บริการของกลุ่มใช่หรือไม่?"
        }
        confirmText={"นำยานพาหนะออก"}
        onConfirm={handleDelete}
      />
    </div>
  );
}
