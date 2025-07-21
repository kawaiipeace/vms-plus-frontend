import { RequestListType } from "@/app/types/request-list-type";
import { DataTable } from "@/components/table/dataTable";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import LicenseCardModal from "../modal/admin/licenseCardModal";
import ReturnCarAddModal from "../modal/returnCarAddModal";
import ReviewCarDriveModal from "../modal/reviewCarDriveModal";

dayjs.extend(isBetween);

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: RequestListType[];
  pagination: PaginationType;
  role?: string;
}

export default function RequestListTable({
  defaultData,
  pagination,
  role,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reqData, setReqData] = useState<RequestListType[]>(defaultData);
  const pathName = usePathname();

  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const licenseCardModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const reviewCarDriveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const viewCarDriveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // Adjusting page index as React Table uses 0-based indexing
    pageSize: pagination.limit,
  });

  useEffect(() => {
    setReqData(defaultData);
  }, [defaultData]);

  useEffect(() => {
    setPagination({
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  const requestListColumns: ColumnDef<RequestListType>[] = [
    {
      accessorKey: "request_no",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">เลขที่คำขอ</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-left">
          <div className="flex flex-col">
            <div>{row.original.request_no}</div>
            <div className="text-left">
              {row.original.is_have_sub_request === "1" &&
                "ปฏิบัติงานต่อเนื่อง"}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "vehicle_user_emp_name",
      header: () => <div className="text-left">ผู้ใช้ยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div>
            {row.original.vehicle_user_emp_name} (
            {row.original.vehicle_user_emp_id})
          </div>
          <div className="text-color-secondary text-xs">
            {row.original.vehicle_user_position +
              " " +
              row.original.vehicle_user_dept_name_short}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "vehicle_license_plate",
      header: () => <div className="text-left">ยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="text-left">
            {row.original.vehicle_license_plate +
              " " +
              row.original.vehicle_license_plate_province_short}
              
          </div>
           <div className="text-color-secondary text-xs">
            {row.original.vehicle_department_dept_sap_short}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "work_place",
      header: () => <div className="text-left">สถานที่ปฏิบัติงาน</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "start_datetime",
      header: () => <div className="text-left">วันที่เดินทาง</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(
          row.original.start_datetime || ""
        );
        const endDateTime = convertToBuddhistDateTime(
          row.original.end_datetime || ""
        );

        if (startDateTime.date === endDateTime.date) {
          return (
            <div className="text-left">
              {startDateTime.date}{" "}
              {startDateTime.time + " - " + endDateTime.time}
            </div>
          );
        }
        return (
          <div className="text-left">
            {startDateTime.date + " " + startDateTime.time} -{" "}
            {endDateTime.date + " " + endDateTime.time}
          </div>
        );
      },
    },

    {
      accessorKey: "action_detail",
      header: () => <div className="text-left">รายละเอียด</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "ref_request_status_name",
      header: () => <div className="text-center">สถานะคำขอ</div>,
      enableSorting: true,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <div className="w-[80px] text-center">
            {value === "เกินวันที่นัดหมาย" || value === "ถูกตีกลับ" || value === "คืนยานพาหนะไม่สำเร็จ" ? (
              <span className="badge badge-pill-outline badge-error whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : (value === "ตีกลับยานพาหนะ" || value === "รออนุมัติ" || value === "รอตรวจสอบ") ? (
              <span className="badge badge-pill-outline badge-warning whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "เสร็จสิ้น" ? (
              <span className="badge badge-pill-outline badge-success whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : (
              <span className="badge badge-pill-outline badge-info whitespace-nowrap">
                {value as React.ReactNode}
              </span>
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
        const statusValue = row.original.ref_request_status_name;
        const id = row.original.trn_request_uid;

        const progressType = {
          "50": "รอรับกุญแจ",
          "51": "รอรับยานพาหนะ",
          "60": "บันทึกการเดินทาง",
          "70": "รอการตรวจสอบ",
          "71": "คืนยานพาหนะไม่สำเร็จ",
          "80": "ภารกิจสำเร็จ",
          "90": "ยกเลิกภารกิจ",
        };

        if (role === "driver") {
          const statusCode = row.original.ref_request_status_code;
          const progress = row.original.ref_request_status_code
            ? progressType[statusCode as keyof typeof progressType]
            : "";

          return (
            <div className="text-left">
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip={statusValue}
                onClick={() =>
                  router.push(
                    "/vehicle-in-use/driver/" +
                      row.original.trn_request_uid +
                      "?progressType=" +
                      progress
                  )
                }
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
            </div>
          );
        }

        const start = dayjs(row.original.start_datetime);
        const end = dayjs(row.original.end_datetime);
        const between = dayjs().isBetween(start, end);
        const traveling = between && dayjs().isSame(end);
        const before = dayjs().isBefore(start);
        const after = dayjs().isAfter(end);
        const isPeaEm = row.original.is_pea_employee_driver;

        return (
          <div className="text-left flex">
            {statusValue == "รออนุมัติ" ||
              (statusValue == "เสร็จสิ้น" && (
                <button
                  className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                  data-tip="ดูรายละเอียดคำขอ"
                  onClick={() =>
                    router.push(pathName + "/" + row.original.trn_request_uid)
                  }
                >
                  <i className="material-symbols-outlined">
                    quick_reference_all
                  </i>
                </button>
              ))}

            {statusValue === "คืนยานพาหนะไม่สำเร็จ" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push(
                    "/vehicle-in-use/user/" + row.original.trn_request_uid
                  )
                }
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
            )}

            {statusValue == "รอรับกุญแจ" && (
              <>
                <button
                  className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                  data-tip="ดูรายละเอียดคำขอ"
                  onClick={() =>
                    router.push(
                      "/vehicle-in-use/user/" + row.original.trn_request_uid
                    )
                  }
                >
                  <i className="material-symbols-outlined">
                    quick_reference_all
                  </i>
                </button>

                <div className="dropdown dropdown-left ">
                  <div
                    className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none"
                    tabIndex={0}
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <i className="material-symbols-outlined">more_vert</i>
                  </div>
                  <ul
                    className="dropdown-menu dropdown-content absolute top-auto bottom-full z-[9999] max-w-[200px] w-[200px]"
                    tabIndex={0}
                  >
                    <Link
                      className="dropdown-item"
                      href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การนัดหมายเดินทาง`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          "/vehicle-in-use/user/" +
                            row.original.trn_request_uid +
                            "?activeTab=การนัดหมายเดินทาง"
                        );
                      }}
                    >
                      <i className="material-symbols-outlined">
                        calendar_clock
                      </i>
                      ดูนัดหมาย
                    </Link>
                    <Link
                      className="dropdown-item"
                      href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การรับกุญแจ`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          "/vehicle-in-use/user/" +
                            row.original.trn_request_uid +
                            "?activeTab=การรับกุญแจ"
                        );
                      }}
                    >
                      <i className="material-symbols-outlined">key</i>
                      การรับกุญแจ
                    </Link>
                  </ul>
                </div>
              </>
            )}

            {statusValue == "รอรับยานพาหนะ" && (
              <>
                <button
                  className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                  data-tip="ดูรายละเอียดคำขอ"
                  onClick={() =>
                    router.push(
                      "/vehicle-in-use/user/" + row.original.trn_request_uid
                    )
                  }
                >
                  <i className="material-symbols-outlined">
                    quick_reference_all
                  </i>
                </button>

                <div className="dropdown dropdown-left ">
                  <div
                    className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none"
                    tabIndex={0}
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <i className="material-symbols-outlined">more_vert</i>
                  </div>
                  <ul
                    className="dropdown-menu dropdown-content absolute top-auto bottom-full z-[9999] max-w-[200px] w-[200px]"
                    tabIndex={0}
                  >
                    <Link
                      className="dropdown-item"
                      href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การนัดหมายเดินทาง`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          "/vehicle-in-use/user/" +
                            row.original.trn_request_uid +
                            "?activeTab=การนัดหมายเดินทาง"
                        );
                      }}
                    >
                      <i className="material-symbols-outlined">
                        calendar_clock
                      </i>
                      ดูนัดหมาย
                    </Link>
                    <Link
                      className="dropdown-item"
                      href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การรับยานพาหนะ`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          "/vehicle-in-use/user/" +
                            row.original.trn_request_uid +
                            "?activeTab=การรับยานพาหนะ"
                        );
                      }}
                    >
                      <i className="material-symbols-outlined">
                        directions_car
                      </i>
                      รับยานพาหนะ
                    </Link>
                  </ul>
                </div>
              </>
            )}

            {statusValue == "เดินทาง" && (
              <>
                <button
                  className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                  data-tip="ดูรายละเอียดคำขอ"
                  onClick={() =>
                    router.push(
                      "/vehicle-in-use/user/" + row.original.trn_request_uid
                    )
                  }
                >
                  <i className="material-symbols-outlined">
                    quick_reference_all
                  </i>
                </button>

                <div className="dropdown dropdown-left">
                  <div
                    className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none"
                    tabIndex={0}
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <i className="material-symbols-outlined">more_vert</i>
                  </div>
                  <ul
                    className="dropdown-menu dropdown-content absolute top-auto bottom-full z-[9999] max-w-[200px] w-[200px]"
                    tabIndex={0}
                  >
                    <Link
                      className="dropdown-item"
                      href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=ข้อมูลการเดินทาง`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          "/vehicle-in-use/user/" +
                            row.original.trn_request_uid +
                            "?activeTab=ข้อมูลการเดินทาง"
                        );
                      }}
                    >
                      <i className="material-symbols-outlined">
                        {" "}
                        add_location_alt
                      </i>
                      ข้อมูลการเดินทาง
                    </Link>
                    <Link
                      className="dropdown-item"
                      href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การเติมเชื้อเพลิง`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(
                          "/vehicle-in-use/user/" +
                            row.original.trn_request_uid +
                            "?activeTab=การเติมเชื้อเพลิง"
                        );
                      }}
                    >
                      <i className="material-symbols-outlined">
                        local_gas_station
                      </i>
                      การเติมเชื้อเพลิง
                    </Link>
                    {isPeaEm && (
                      <Link
                        className="dropdown-item"
                        href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การรับยานพาหนะ`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          licenseCardModalRef.current?.openModal();
                        }}
                      >
                        <i className="material-symbols-outlined">id_card</i>
                        แสดงบัตรเดินทาง
                      </Link>
                    )}
                    {before && !isPeaEm && !traveling && (
                      <Link
                        className="dropdown-item"
                        href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การนัดหมายเดินทาง`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(
                            "/vehicle-in-use/user/" +
                              row.original.trn_request_uid +
                              "?activeTab=การนัดหมายเดินทาง"
                          );
                        }}
                      >
                        <i className="material-symbols-outlined">
                          calendar_clock
                        </i>
                        ดูนัดหมาย
                      </Link>
                    )}
                    {!isPeaEm && traveling && (
                      <Link
                        className="dropdown-item"
                        href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การรับยานพาหนะ`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          reviewCarDriveModalRef.current?.openModal();
                        }}
                      >
                        <i className="material-symbols-outlined">star</i>
                        ให้คะแนนผู้ขับขี่
                      </Link>
                    )}
                    {after && !isPeaEm && !traveling && (
                      <Link
                        className="dropdown-item"
                        href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การรับยานพาหนะ`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          viewCarDriveModalRef.current?.openModal();
                        }}
                      >
                        <i className="material-symbols-outlined">star</i>
                        ดูคะแนนผู้ขับขี่
                      </Link>
                    )}
                    <hr />
                    <Link
                      className="dropdown-item"
                      href={`/vehicle-in-use/user/${row.original.trn_request_uid}?activeTab=การคืนยานพาหนะ`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        returnCarAddModalRef.current?.openModal();
                      }}
                    >
                      <i className="material-symbols-outlined">reply</i>
                      คืนยานพาหนะ
                    </Link>
                  </ul>
                </div>
                <ReviewCarDriveModal ref={reviewCarDriveModalRef} id={id} />
                <ReviewCarDriveModal
                  ref={viewCarDriveModalRef}
                  id={id}
                  displayOn="view"
                />
                <ReturnCarAddModal
                  ref={returnCarAddModalRef}
                  id={id}
                  useBy="user"
                />
                <LicenseCardModal ref={licenseCardModalRef} id={id} />
              </>
            )}

            {statusValue == "ถูกตีกลับ" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="แก้ไข"
                onClick={() =>
                  router.push(
                    "/vehicle-booking/request-list/" +
                      row.original.trn_request_uid +
                      "/edit"
                  )
                }
              >
                <i className="material-symbols-outlined">stylus</i>
              </button>
            )}

            {(statusValue == "ยกเลิกคำขอ" ||
              statusValue == "รอตรวจสอบ" ||
              statusValue == "รออนุมัติ") && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push(
                    "/vehicle-booking/request-list/" +
                      row.original.trn_request_uid
                  )
                }
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: reqData,
    columns: requestListColumns,
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
    
  }, [pagination]);

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
    </div>
  );
}
