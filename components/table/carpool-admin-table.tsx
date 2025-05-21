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
import {
  deleteCarpoolAdmin,
  putCarpoolMainAdminUpdate,
} from "@/services/carpoolManagement";
import AddCarpoolAdminModal from "../modal/addCarpoolAdminModal";
import ToastCustom from "../toastCustom";

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

export default function CarpoolAdminTable({
  defaultData,
  pagination,
  setRefetch,
}: Props) {
  const [toast, setToast] = useState<ToastProps | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editId, setEditId] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | undefined>();

  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1,
    pageSize: pagination.limit,
  });

  const addCarpoolAdminModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const handleMainAdmin = async (id: string) => {
    try {
      const response = await putCarpoolMainAdminUpdate(id);
      if (response.request.status === 200) {
        setRefetch(true);
        setToast({
          title: "กำหนดผู้รับผิดชอบหลักสำเร็จ",
          desc:
            "กำหนดให้ " +
            defaultData.find((item) => item.mas_carpool_admin_uid === id)
              ?.admin_emp_name +
            " เป็นผู้รับผิดชอบหลักของกลุ่มเรียบร้อยแล้ว",
          status: "success",
        });
      }
    } catch (error) {
      console.log(error);
      setToast({
        title: "Error",
        desc: <>{error}</>,
        status: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const response = await deleteCarpoolAdmin(deleteId);
        if (response.request.status === 200) {
          setDeleteId(undefined);
          setRefetch(true);
          setToast({
            title: "ลบผู้ดูแลยานพาหนะสำเร็จ",
            desc:
              "ผู้ดูแลยานพาหนะ " +
              defaultData.find(
                (item) => item.mas_carpool_admin_uid === deleteId
              )?.admin_emp_name +
              " ถูกลบออกจากกลุ่มเรียบร้อยแล้ว",
            status: "success",
          });
          cancelCreateModalRef.current?.closeModal();
        }
      } catch (error: any) {
        console.log(error);
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
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "admin_emp_name",
      header: () => <div className="text-center">ชื่อ - นามสกุล</div>,
      enableSorting: true,
    },
    {
      accessorKey: "admin_dept_sap_short",
      header: () => <div className="text-center">ตำแหน่ง / สังกัด</div>,
      enableSorting: false,
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
    },
    {
      accessorKey: "is_main_admin",
      header: () => <div className="text-center">ประเภทผู้ดูแลยานพาหนะ</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="จำนวนยานพาหนะ">
            {row.original.is_main_admin === "1"
              ? "ผู้รับผิดชอบหลัก"
              : "ผู้ดูแลทั่วไป"}
            {row.original.is_main_admin === "1" && (
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
                addCarpoolAdminModalRef.current?.openModal();
                setEditId(row.original.mas_carpool_admin_uid);
              }}
            >
              <i className="material-symbols-outlined">stylus</i>
            </button>
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left disabled:bg-transparent"
              data-tip="กำหนดเป็นผู้รับผิดชอบหลัก"
              disabled={row.original.is_main_admin === "1"}
              onClick={() =>
                handleMainAdmin(row.original.mas_carpool_admin_uid)
              }
            >
              <i className="material-symbols-outlined">social_leaderboard</i>
            </button>
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left disabled:bg-transparent"
              data-tip="ลบ"
              disabled={row.original.is_main_admin === "1"}
              onClick={() => {
                cancelCreateModalRef.current?.openModal();
                setDeleteId(row.original.mas_carpool_admin_uid);
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

      <AddCarpoolAdminModal
        ref={addCarpoolAdminModalRef}
        id={editId}
        setRefetch={setRefetch}
      />

      <ConfirmCancelCreateCarpoolModal
        id={""}
        ref={cancelCreateModalRef}
        title={"ยืนยันยกเลิกผู้ดูแลยานพาหนะ"}
        desc={
          "คุณต้องการยกเลิกผู้ดูแลยานพาหนะ " +
          defaultData.find((item) => item.mas_carpool_admin_uid === deleteId)
            ?.admin_emp_name +
          " ใช่หรือไม่?"
        }
        confirmText={"ยกเลิกผู้ดูแลยานพาหนะ"}
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
