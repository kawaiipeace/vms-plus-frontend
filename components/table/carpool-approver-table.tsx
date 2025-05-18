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

export default function CarpoolApproverTable({
  defaultData,
  pagination,
  setRefetch,
}: Props) {
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

  const handleMain = async (id: string) => {
    try {
      const response = await putCarpoolMainApproverUpdate(id);
      if (response.request.status === 200) {
        setRefetch(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const response = await deleteCarpoolApprover(deleteId);
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
      accessorKey: "approver_emp_name",
      header: () => <div className="text-center">ชื่อ - นามสกุล</div>,
      enableSorting: true,
    },
    {
      accessorKey: "approver_dept_sap_short",
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
                setEditId(row.original.mas_carpool_approver_uid);
              }}
            >
              <i className="material-symbols-outlined">stylus</i>
            </button>
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left disabled:bg-transparent"
              data-tip="กำหนดเป็นผู้รับผิดชอบหลัก"
              disabled={row.original.is_main_approver === "1"}
              onClick={() => handleMain(row.original.mas_carpool_approver_uid)}
            >
              <i className="material-symbols-outlined">social_leaderboard</i>
            </button>
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left disabled:bg-transparent"
              data-tip="ลบ"
              disabled={row.original.is_main_approver === "1"}
              onClick={() => {
                cancelCreateModalRef.current?.openModal();
                setDeleteId(row.original.mas_carpool_approver_uid);
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
          "คุณต้องการยกเลิกผู้อนุมัติ " +
          defaultData.find((item) => item.mas_carpool_approver_uid === deleteId)
            ?.approver_emp_name +
          " ใช่หรือไม่?"
        }
        confirmText={"ยกเลิกผู้อนุมัติ"}
        onConfirm={handleDelete}
      />
    </div>
  );
}
