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
  putCarpoolSetDriverActive,
} from "@/services/carpoolManagement";
import ConfirmCancelCreateCarpoolModal from "../modal/confirmCancelCreateCarpoolModal";
import DriverInfoCarpoolModal from "../modal/driverInfoCarpoolModal";
import ToastCustom from "../toastCustom";
import { useFormContext } from "@/contexts/carpoolFormContext";
import Image from "next/image";
import BadgeStatus from "../carpool-management/modal/status";

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
  setLastDeleted: (value: boolean) => void;
}

interface ToastProps {
  title: string;
  desc: string | React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}

export default function CarpoolDriverTable({
  defaultData,
  pagination,
  setRefetch,
  setLastDeleted,
}: Props) {
  const id = useSearchParams().get("id");
  const active = useSearchParams().get("active");
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [driverId, setDriverId] = useState<string | undefined>();
  const [toast, setToast] = useState<ToastProps | undefined>();

  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const detailsModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1,
    pageSize: pagination.limit,
  });

  const { formData, updateFormData } = useFormContext();

  useEffect(() => {
    setPagination({
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    });
  }, [pagination]);

  const handleDelete = async () => {
    if (deleteId) {
      if (id) {
        try {
          const response = await deleteCarpoolDriver(deleteId);
          if (response.request.status === 200) {
            setDeleteId(undefined);
            if (defaultData.length === 1) {
              setTimeout(() => {
                setLastDeleted(true);
              }, 500);
            } else {
              setRefetch(true);
            }
            cancelCreateModalRef.current?.closeModal();
            setToast({
              title: "ลบพนักงานขับรถสำเร็จ",
              desc: (
                <>
                  พนักงานขับรถ{" "}
                  <span className="font-bold">
                    {
                      defaultData.find(
                        (item) => item.mas_carpool_driver_uid === deleteId
                      )?.driver_name
                    }
                  </span>{" "}
                  ถูกลบออกจากกลุ่มเรียบร้อยแล้ว
                </>
              ),
              status: "success",
            });
          }
        } catch (error: any) {
          console.error(error);
          setToast({
            title: "Error",
            desc: (
              <div>
                <div>{error.response.data.error}</div>
                <div>{error.response.data.message}</div>
              </div>
            ),
            status: "error",
          });
        }
      } else {
        updateFormData({
          ...formData,
          carpool_drivers: formData.carpool_drivers?.filter(
            (item) => item.mas_driver_uid !== deleteId
          ),
        });
        setDeleteId(undefined);
        cancelCreateModalRef.current?.closeModal();
        setToast({
          title: "ลบพนักงานขับรถสำเร็จ",
          desc: (
            <>
              พนักงานขับรถ{" "}
              <span className="font-bold">
                {
                  defaultData.find((item) => item.mas_driver_uid === deleteId)
                    ?.driver_name
                }
              </span>{" "}
              ถูกลบออกจากกลุ่มเรียบร้อยแล้ว
            </>
          ),
          status: "success",
        });
      }
    }
  };

  const handleActive = async (id: string, _active: string, name: string) => {
    if (active === "ปิด" || active === "ไม่พร้อมใช้งาน") return;

    try {
      const response = await putCarpoolSetDriverActive(
        id as string,
        _active === "1" ? "0" : "1"
      );
      if (response.request.status === 200) {
        setRefetch(true);
        setToast({
          title:
            _active === "1"
              ? "ปิดใช้งานพนักงานขับรถสำเร็จ"
              : "เปิดใช้งานพนักงานขับรถสำเร็จ",
          desc: (
            <>
              {_active === "1" ? "ปิดให้บริการพนักงานขับรถ" : "พนักงานขับรถ"}{" "}
              <span className="font-bold">{name}</span>{" "}
              {_active === "1" ? "เรียบร้อยแล้ว" : "พร้อมให้บริการแล้ว"}
            </>
          ),
          status: "success",
        });
      }
    } catch (error: any) {
      console.error(error);
      setToast({
        title: "Error",
        desc: (
          <div>
            <div>{error.response.data.error}</div>
            <div>{error.response.data.message}</div>
          </div>
        ),
        status: "error",
      });
    }
  };

  const columns: ColumnDef<CarpoolDriver>[] = [
    {
      accessorKey: "driver_name",
      header: () => <div className="text-center">ชื่อ - นามสกุล</div>,
      enableSorting: true,
      cell: ({ row }) => (
        <div
          className="flex items-center gap-2 text-left font-semibold"
          data-name="ชื่อ - นามสกุล"
        >
          <Image
            src={row.original.driver_image || "/assets/img/avatar.svg"}
            width={36}
            height={36}
            alt="Profile Avatar"
          ></Image>
          <div>
            {row.original.driver_name}{" "}
            {row.original.driver_nickname
              ? `(${row.original.driver_nickname})`
              : ""}
          </div>
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
      accessorKey: "ref_driver_status_code",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">ค้างคืน</div>
        </div>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="ค้างคืน">
            {Number(row.original.ref_driver_status_code) === 1 ? (
              <div className="w-6 h-6 rounded-full border border-[#ABEFC6] bg-[#ECFDF3] flex items-center justify-center">
                <i className="material-symbols-outlined text-[#ABEFC6]">
                  check
                </i>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border border-[#FECDCA] bg-[#FEF3F2] flex items-center justify-center">
                <i className="material-symbols-outlined text-[#FECDCA]">
                  close
                </i>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "driver_license_end_date",
      header: () => <div className="text-center">วันที่หมดอายุใบขับขี่</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="วันที่หมดอายุใบขับขี่">
            {dayjs(row.original.driver_license_end_date).format("DD/MM/BBBB")}
          </div>
        );
      },
    },
    {
      accessorKey: "approved_job_driver_end_date",
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
            {row.original.driver_average_satisfaction_score ||
              "ยังไม่มีการให้คะแนน"}
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
          <div className="text-left w-40" data-name="สถานะ">
            <BadgeStatus status={row.original.driver_status_name} />
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
                setDeleteId(row.original.mas_driver_uid);
              }}
            >
              <i className="material-symbols-outlined">delete</i>
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
        <div
          className="flex items-center gap-2 text-left font-semibold"
          data-name="ชื่อ - นามสกุล"
        >
          <Image
            src={row.original.driver_image || "/assets/img/avatar.svg"}
            width={36}
            height={36}
            alt="Profile Avatar"
          ></Image>
          <div>
            {row.original.driver_name}{" "}
            {row.original.driver_nickname
              ? `(${row.original.driver_nickname})`
              : ""}
          </div>
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
      accessorKey: "ref_driver_status_code",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">ค้างคืน</div>
        </div>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="ค้างคืน">
            {row.original.ref_driver_status_code === "1" ? (
              <div className="w-6 h-6 rounded-full border border-[#ABEFC6] bg-[#ECFDF3] flex items-center justify-center">
                <i className="material-symbols-outlined text-[#ABEFC6]">
                  check
                </i>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border border-[#FECDCA] bg-[#FEF3F2] flex items-center justify-center">
                <i className="material-symbols-outlined text-[#FECDCA]">
                  close
                </i>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "driver_license_end_date",
      header: () => <div className="text-center">วันที่หมดอายุใบขับขี่</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="วันที่หมดอายุใบขับขี่">
            {dayjs(row.original.driver_license_end_date).format("DD/MM/BBBB")}
          </div>
        );
      },
    },
    {
      accessorKey: "approved_job_driver_end_date",
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
            {row.original.driver_average_satisfaction_score ||
              "ยังไม่มีการให้คะแนน"}
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
          <div className="text-left w-40" data-name="สถานะ">
            <BadgeStatus status={row.original.driver_status_name} />
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
                  defaultChecked={row.original.is_active === "1" ? true : false}
                  checked={row.original.is_active === "1" ? true : false}
                  onChange={() =>
                    handleActive(
                      row.original.mas_carpool_driver_uid,
                      row.original.is_active,
                      row.original.driver_name
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
          <div className="text-left dataTable-action flex">
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
              data-tip="ดูรายละเอียด"
              onClick={() => {
                detailsModalRef.current?.openModal();
                setDriverId(row.original.mas_driver_uid);
              }}
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
    manualPagination: true,
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
        title={"ยืนยันนำพนักงานขับรถออกจากกลุ่ม?"}
        desc={
          <>
            คุณต้องการนำพนักงานขับรถ{" "}
            <span className="font-bold">
              {
                defaultData.find((item) =>
                  id
                    ? item.mas_carpool_driver_uid === deleteId
                    : item.mas_driver_uid === deleteId
                )?.driver_name
              }
            </span>{" "}
            ({" "}
            <span className="font-bold">
              {
                defaultData.find((item) =>
                  id
                    ? item.mas_carpool_driver_uid === deleteId
                    : item.mas_driver_uid === deleteId
                )?.driver_nickname
              }
            </span>{" "}
            ) ออกจากการให้บริการของกลุ่มใช่หรือไม่?
          </>
        }
        confirmText={"นำพนักงานขับรถออก"}
        onConfirm={handleDelete}
      />

      <DriverInfoCarpoolModal
        ref={detailsModalRef}
        id={driverId || ""}
        pickable={false}
      />

      {toast && (
        <ToastCustom
          title={toast.title}
          desc={toast.desc}
          status={toast.status}
          onClose={() => setToast(undefined)}
        />
      )}
    </div>
  );
}
