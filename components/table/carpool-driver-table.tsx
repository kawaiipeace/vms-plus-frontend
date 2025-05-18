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
import { CarpoolDriver } from "@/app/types/carpool-management-type";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import { useSearchParams } from "next/navigation";
import {
  deleteCarpoolDriver,
  putCarpoolSetVehicleActive,
} from "@/services/carpoolManagement";
import ConfirmCancelCreateCarpoolModal from "../modal/confirmCancelCreateCarpoolModal";

dayjs.extend(buddhistEra);
dayjs.locale("th");

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

export default function CarpoolDriverTable({
  defaultData,
  pagination,
  setRefetch,
}: Props) {
  const id = useSearchParams().get("id");
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
        const response = await deleteCarpoolDriver(deleteId);
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

  const handleActive = async (id: string, active: string) => {
    try {
      const response = await putCarpoolSetVehicleActive(
        id as string,
        active === "1" ? "0" : "1"
      );
      if (response.request.status === 200) {
        setRefetch(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnDef<CarpoolDriver>[] = [
    {
      accessorKey: "driver_name",
      header: () => <div className="text-center">ชื่อ - นามสกุล</div>,
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-left font-semibold" data-name="ชื่อ - นามสกุล">
          {row.original.driver_name}{" "}
          {row.original.driver_nickname
            ? `(${row.original.driver_nickname})`
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "driver_dept_sap_short_name_hire",
      header: () => <div className="text-center">หน่วยงานสังกัด</div>,
      enableSorting: false,
    },
    {
      accessorKey: "driver_contact_number",
      header: () => <div className="text-left">เบอร์โทรศัพท์</div>,
      enableSorting: false,
    },
    {
      accessorKey: "carpool_contact_number",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">ค้างคืน</div>
        </div>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="ค้างคืน">
            {/* {row.original} */}
          </div>
        );
      },
    },
    {
      accessorKey: "approved_job_driver_end_date",
      header: () => <div className="text-center">วันที่หมดอายุใบขับขี่</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="วันที่หมดอายุใบขับขี่">
            {dayjs(row.original.approved_job_driver_end_date).format(
              "DD/MM/BBBB"
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "number_of_vehicles",
      header: () => <div className="text-center">วันที่สิ้นสุดปฏิบัติงาน</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="วันที่สิ้นสุดปฏิบัติงาน">
            {dayjs(row.original.approved_job_driver_end_date).format(
              "DD/MM/BBBB"
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "driver_average_satisfaction_score",
      header: () => <div className="text-center">คะแนน</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="คะแนน">
            {row.original.driver_average_satisfaction_score}
          </div>
        );
      },
    },
    {
      accessorKey: "driver_status_name",
      header: () => <div className="text-center">สถานะ</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="สถานะ">
            {row.original.driver_status_name}
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
              data-tip="ดูรายละเอียด"
              //   onClick={() => router.push("/carpool-management")}
            >
              <i className="material-symbols-outlined">quick_reference_all</i>
            </button>
          </div>
        );
      },
    },
  ];

  const columnsId: ColumnDef<CarpoolDriver>[] = [
    {
      accessorKey: "driver_name",
      header: () => <div className="text-center">ชื่อ - นามสกุล</div>,
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-left font-semibold" data-name="ชื่อ - นามสกุล">
          {row.original.driver_name}{" "}
          {row.original.driver_nickname
            ? `(${row.original.driver_nickname})`
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "driver_dept_sap_short_name_hire",
      header: () => <div className="text-center">หน่วยงานสังกัด</div>,
      enableSorting: false,
    },
    {
      accessorKey: "driver_contact_number",
      header: () => <div className="text-left">เบอร์โทรศัพท์</div>,
      enableSorting: false,
    },
    {
      accessorKey: "carpool_contact_number",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">ค้างคืน</div>
        </div>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="ค้างคืน">
            {/* {row.original} */}
          </div>
        );
      },
    },
    {
      accessorKey: "approved_job_driver_end_date",
      header: () => <div className="text-center">วันที่หมดอายุใบขับขี่</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="วันที่หมดอายุใบขับขี่">
            {dayjs(row.original.approved_job_driver_end_date).format(
              "DD/MM/BBBB"
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "number_of_vehicles",
      header: () => <div className="text-center">วันที่สิ้นสุดปฏิบัติงาน</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="วันที่สิ้นสุดปฏิบัติงาน">
            {dayjs(row.original.approved_job_driver_end_date).format(
              "DD/MM/BBBB"
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "driver_average_satisfaction_score",
      header: () => <div className="text-center">คะแนน</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="คะแนน">
            {row.original.driver_average_satisfaction_score}
          </div>
        );
      },
    },
    {
      accessorKey: "driver_status_name",
      header: () => <div className="text-center">สถานะ</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="สถานะ">
            {row.original.driver_status_name}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: () => <div className="text-center">เปิด/ปิดใช้งาน</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="เปิด/ปิดใช้งาน">
            <div className="custom-group">
              <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                <input
                  type="checkbox"
                  checked={row.original.is_active === "1" ? true : false}
                  onClick={() =>
                    handleActive(
                      row.original.mas_carpool_driver_uid,
                      row.original.is_active
                    )
                  }
                  className="toggle border-[#D0D5DD] [--tglbg:#D0D5DD] text-white checked:border-[#A80689] checked:[--tglbg:#A80689] checked:text-white"
                />
              </div>
            </div>
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
              data-tip="ดูรายละเอียด"
              //   onClick={() => router.push("/carpool-management")}
            >
              <i className="material-symbols-outlined">quick_reference_all</i>
            </button>
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
              data-tip="ลบ"
              onClick={() => {
                cancelCreateModalRef.current?.openModal();
                setDeleteId(row.original.mas_carpool_driver_uid);
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
    columns: id ? columnsId : columns,
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
            ?.vehicle_owner_dept_short +
          " ออกจากการให้บริการของกลุ่มใช่หรือไม่?"
        }
        confirmText={"นำยานพาหนะออก"}
        onConfirm={handleDelete}
      />
    </div>
  );
}
