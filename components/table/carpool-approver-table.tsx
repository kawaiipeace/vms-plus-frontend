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
import {
  deleteCarpoolApprover,
  putCarpoolMainApproverUpdate,
} from "@/services/carpoolManagement";
import AddCarpoolApproverModal from "../modal/addCarpoolApproverModal";
import ConfirmCancelCreateCarpoolModal from "../modal/confirmCancelCreateCarpoolModal";
import ToastCustom from "../toastCustom";
import Image from "next/image";
import { useFormContext } from "@/contexts/carpoolFormContext";
import { useSearchParams } from "next/navigation";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

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

interface ToastProps {
  title: string;
  desc: string | React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}

export default function CarpoolApproverTable({
  defaultData,
  pagination,
  setRefetch,
}: Props) {
  const id = useSearchParams().get("id");
  const [toast, setToast] = useState<ToastProps | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editId, setEditId] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | undefined>();

  const addCarpoolApproverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1,
    pageSize: pagination.limit,
  });

  const { formData, updateFormData } = useFormContext();

  const handleMain = async (_id: string) => {
    if (id) {
      try {
        const response = await putCarpoolMainApproverUpdate(_id);
        if (response.request.status === 200) {
          setRefetch(true);
          setToast({
            title: "กำหนดผู้อนุมัติหลักสำเร็จ",
            desc: (
              <>
                กำหนดให้{" "}
                <span className="font-bold">
                  {
                    defaultData.find(
                      (item) => item.mas_carpool_approver_uid === _id
                    )?.approver_emp_name
                  }
                </span>{" "}
                เป็นผู้อนุมัติหลักของกลุ่มเรียบร้อยแล้ว
              </>
            ),
            status: "success",
          });
        }
      } catch (error) {
        console.error(error);
        setToast({
          title: "Error",
          desc: <>{error}</>,
          status: "error",
        });
      }
    } else {
      updateFormData({
        carpool_approvers: formData.carpool_approvers?.map((e) => ({
          ...e,
          is_main_approver: e.approver_emp_no === _id ? "1" : "0",
        })),
      });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      if (id) {
        try {
          const response = await deleteCarpoolApprover(deleteId);
          if (response.request.status === 200) {
            setDeleteId(undefined);
            setRefetch(true);
            cancelCreateModalRef.current?.closeModal();
            setToast({
              title: "ลบผู้อนุมัติสำเร็จ",
              desc: (
                <>
                  ผู้อนุมัติ{" "}
                  <span className="font-bold">
                    {
                      defaultData.find(
                        (item) => item.mas_carpool_approver_uid === deleteId
                      )?.approver_emp_name
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
          carpool_approvers: formData.carpool_approvers?.filter(
            (item) => item.approver_emp_no !== deleteId
          ),
        });
        setDeleteId(undefined);
        setToast({
          title: "ลบผู้อนุมัติสำเร็จ",
          desc: (
            <>
              ผู้อนุมัติ{" "}
              <span className="font-bold">
                {
                  defaultData.find((item) => item.approver_emp_no === deleteId)
                    ?.approver_emp_name
                }
              </span>{" "}
              ถูกลบออกจากกลุ่มเรียบร้อยแล้ว
            </>
          ),
          status: "success",
        });
        cancelCreateModalRef.current?.closeModal();
      }
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "approver_emp_name",
      header: () => <div className="text-center">ชื่อ - นามสกุล</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div className="avatar avatar-sm">
              <Image
                src={row.original.image_url || "/assets/img/avatar.svg"}
                width={36}
                height={36}
                alt="Profile Avatar"
              ></Image>
            </div>
            {row.original.approver_emp_name}
          </div>
        );
      },
    },
    {
      accessorKey: "approver_dept_sap_short",
      header: () => <div className="text-center">ตำแหน่ง / สังกัด</div>,
      enableSorting: false,
      cell: ({ row: { original } }) => {
        return (
          <>
            {original.approver_position} {original.approver_dept_sap_short}
          </>
        );
      },
    },
    {
      accessorKey: "internal_contact_number",
      header: () => <div className="text-left">เบอร์ภายใน</div>,
      enableSorting: false,
    },
    {
      accessorKey: "mobile_contact_number",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">เบอร์โทรศัพท์</div>
        </div>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-left w-40" data-name="เบอร์โทรศัพท์">
            {formatPhoneNumber(row.original.mobile_contact_number)}
          </div>
        );
      },
    },
    {
      accessorKey: "is_main_approver",
      header: () => <div className="text-center">ประเภทผู้อนุมัติ</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="จำนวนยานพาหนะ">
            {row.original.is_main_approver === "1"
              ? "ผู้อนุมัติหลัก"
              : "ผู้อนุมัติทั่วไป"}
            {row.original.is_main_approver === "1" && (
              <i className="material-symbols-outlined text-primary-default ml-2">
                social_leaderboard
              </i>
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
              data-tip="แก้ไข"
              onClick={() => {
                addCarpoolApproverModalRef.current?.openModal();
                setEditId(
                  id
                    ? row.original.mas_carpool_approver_uid
                    : row.original.approver_emp_no
                );
              }}
            >
              <i className="material-symbols-outlined">stylus</i>
            </button>
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left disabled:bg-transparent"
              data-tip="กำหนดเป็นผู้รับผิดชอบหลัก"
              disabled={row.original.is_main_approver === "1"}
              onClick={() =>
                handleMain(
                  id
                    ? row.original.mas_carpool_approver_uid
                    : row.original.approver_emp_no
                )
              }
            >
              <i className="material-symbols-outlined">social_leaderboard</i>
            </button>
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left disabled:bg-transparent"
              data-tip="ลบ"
              disabled={row.original.is_main_approver === "1"}
              onClick={() => {
                cancelCreateModalRef.current?.openModal();
                setDeleteId(
                  id
                    ? row.original.mas_carpool_approver_uid
                    : row.original.approver_emp_no
                );
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

      <AddCarpoolApproverModal
        ref={addCarpoolApproverModalRef}
        id={editId}
        setRefetch={setRefetch}
      />

      <ConfirmCancelCreateCarpoolModal
        id={""}
        ref={cancelCreateModalRef}
        title={"ยืนยันยกเลิกผู้อนุมัติ?"}
        desc={
          <>
            คุณต้องการยกเลิกผู้อนุมัติ{" "}
            <span className="font-bold">
              {
                defaultData.find((item) => {
                  const uid = id
                    ? item.mas_carpool_approver_uid
                    : item.approver_emp_no;
                  return uid === deleteId;
                })?.approver_emp_name
              }
            </span>{" "}
            ใช่หรือไม่?
          </>
        }
        confirmText={"ยกเลิกผู้อนุมัติ"}
        onConfirm={handleDelete}
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
