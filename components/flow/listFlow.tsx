import { RequestListType } from "@/app/types/request-list-type";
import MobileFileBackCard from "@/components/card/mobileFileBackCard"; // Make sure this is imported
import MobileWaitForKeyCard from "@/components/card/mobileWaitForKeyCard";
import MobileWaitingCard from "@/components/card/mobileWaitingCard";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import MobileDriverCard from "../card/mobileDriverCard";
import MobileRejectCard from "../card/mobileRejectCard";
import MobileTravelLogCard from "../card/mobileTravelLogCard";
import MobileWaitForVehicleCard from "../card/mobileWaitForVehicleCard";
import MobileWaitVerifyCard from "../card/mobileWaitVerifyCard";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  requestData: RequestListType[];
}

export default function ListFlow({ requestData }: Props) {
  const pathname = usePathname();

  return (
    <>
      {requestData.map((request, index) => {
        const { ref_request_status_name } = request;

        if (ref_request_status_name === "รออนุมัติ") {
          return (
            <MobileWaitingCard
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              imageSrc="/assets/img/graphic/status_waiting_approval.png"
              imageAlt="Waiting Approval"
              cardTitle={request.ref_request_status_name || "รออนุมัติ"}
              cardSubtitle={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              supportingTexts={[
                request.work_place || "-",
                `${
                  convertToBuddhistDateTime(request?.start_datetime || "")
                    .date || "-"
                } - ${
                  convertToBuddhistDateTime(request.end_datetime || "").date ||
                  "-"
                }`,
              ]}
              cardItemText={request?.ref_request_status_name}
            />
          );
        }

        if (ref_request_status_name === "ถูกตีกลับ") {
          return (
            <MobileFileBackCard
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              imageSrc="/assets/img/graphic/status_reject_request.png"
              imageAlt="Rejected Request"
              cardTitle={request.ref_request_status_name || "ถูกตีกลับ"}
              cardSubtitle={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              supportingTexts={[
                request.work_place || "-",
                `${
                  convertToBuddhistDateTime(request.start_datetime || "")
                    .date || "-"
                } - ${
                  convertToBuddhistDateTime(request.end_datetime || "").date ||
                  "-"
                }`,
              ]}
              cardItemText={request?.ref_request_status_name}
              showEditButton={true}
            />
          );
        }

        if (ref_request_status_name === "ยกเลิกคำขอ") {
          return (
            <MobileFileBackCard
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              imageSrc="/assets/img/graphic/status_reject_request.png"
              imageAlt="Rejected Request"
              cardTitle={request.ref_request_status_name || "-"}
              cardSubtitle={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              supportingTexts={[
                request.work_place || "-",
                `${
                  convertToBuddhistDateTime(request.start_datetime || "")
                    .date || "-"
                } - ${
                  convertToBuddhistDateTime(request.end_datetime || "").date ||
                  "-"
                }`,
              ]}
              cardItemText={request?.ref_request_status_name}
              showEditButton={true}
            />
          );
        }

        if (ref_request_status_name === "รอรับกุญแจ") {
          return (
            <MobileWaitForKeyCard
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              licensePlate={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              location={request?.work_place || ""}
              dateRange={
                convertToBuddhistDateTime(request?.start_datetime || "").date +
                " - " +
                convertToBuddhistDateTime(request?.end_datetime || "").date
              }
              pickupLocation={request?.received_key_place || ""}
              pickupDate={
                convertToBuddhistDateTime(
                  request?.received_key_start_datetime || ""
                ).date
              }
              pickupTime={
                convertToBuddhistDateTime(
                  request?.received_key_start_datetime || ""
                ).time +
                " - " +
                convertToBuddhistDateTime(
                  request?.received_key_end_datetime || ""
                ).time
              }
              is_pea_employee_driver={request?.is_pea_employee_driver?.toString()}
            />
          );
        }

        if (ref_request_status_name === "รอรับยานพาหนะ") {
          return (
            <MobileWaitForVehicleCard
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              licensePlate={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              location={request?.work_place || ""}
              dateRange={
                convertToBuddhistDateTime(request?.start_datetime || "").date +
                " - " +
                convertToBuddhistDateTime(request?.end_datetime || "").date
              }
              pickupLocation={request?.received_key_place || ""}
              pickupDate={
                convertToBuddhistDateTime(
                  request?.received_key_start_datetime || ""
                ).date
              }
              pickupTime={
                convertToBuddhistDateTime(
                  request?.received_key_start_datetime || ""
                ).time +
                " - " +
                convertToBuddhistDateTime(
                  request?.received_key_end_datetime || ""
                ).time
              }
              is_pea_employee_driver={request?.is_pea_employee_driver?.toString()}
            />
          );
        }

        if (ref_request_status_name === "เดินทาง") {
          return (
            <MobileTravelLogCard
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              licensePlate={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              location={request?.work_place || ""}
              dateRange={
                convertToBuddhistDateTime(request?.start_datetime || "").date +
                " - " +
                convertToBuddhistDateTime(request?.end_datetime || "").date
              }
              startDate={
                convertToBuddhistDateTime(request?.start_datetime || "").date
              }
              endDate={
                convertToBuddhistDateTime(request?.end_datetime || "").date
              }
              pickupLocation={request?.received_key_place || ""}
              pickupDate={
                convertToBuddhistDateTime(
                  request?.received_key_start_datetime || ""
                ).date
              }
              pickupTime={
                convertToBuddhistDateTime(
                  request?.received_key_start_datetime || ""
                ).time +
                " - " +
                convertToBuddhistDateTime(
                  request?.received_key_end_datetime || ""
                ).time
              }
              isDriverPEA={request?.is_pea_employee_driver === "1"}
            />
          );
        }

        if (ref_request_status_name === "รอตรวจสอบ") {
          return (
            <MobileWaitVerifyCard
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              licensePlate={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              location={request?.work_place || ""}
              dateRange={
                convertToBuddhistDateTime(request?.start_datetime || "").date +
                " - " +
                convertToBuddhistDateTime(request?.end_datetime || "").date
              }
            />
          );
        }

        if (ref_request_status_name === "ตีกลับยานพาหนะ") {
          return (
            <MobileRejectCard
              title="ตีกลับยานพาหนะ"
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              licensePlate={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              location={request?.work_place || ""}
              dateRange={
                convertToBuddhistDateTime(request?.start_datetime || "").date +
                " - " +
                convertToBuddhistDateTime(request?.end_datetime || "").date
              }
              rating={undefined}
            />
          );
        }

        if (ref_request_status_name === "คืนยานพาหนะไม่สำเร็จ") {
          return (
            <MobileRejectCard
              title="คืนยานพาหนะไม่สำเร็จ"
              key={request.trn_request_uid || index}
              id={request.trn_request_uid}
              licensePlate={
                request?.vehicle_license_plate +
                " " +
                request?.vehicle_license_plate_province_short
              }
              location={request?.work_place || ""}
              dateRange={
                convertToBuddhistDateTime(request?.start_datetime || "").date +
                " - " +
                convertToBuddhistDateTime(request?.end_datetime || "").date
              }
              rating={undefined}
            />
          );
        }

        if (ref_request_status_name === "เสร็จสิ้น") {
          return (
            <Link
              key={request.trn_request_uid || index}
              href={pathname + "/" + request.trn_request_uid}
            >
              <MobileDriverCard
                title={"เสร็จสิ้น"}
                carRegis={
                  request?.vehicle_license_plate +
                  " " +
                  request?.vehicle_license_plate_province_short
                }
                location={request?.work_place || ""}
                date={
                  convertToBuddhistDateTime(request?.start_datetime || "")
                    .date +
                  " - " +
                  convertToBuddhistDateTime(request?.end_datetime || "").date
                }
                cardType="complete"
                rating={undefined}
              />
            </Link>
          );
        }

        return null; // Skip rendering if status code doesn't match
      })}

      {/* <MobileDriverCard
  title="รอรับรถ"
  carRegis="กข 1234 กรุงเทพฯ"
  location="อาคาร A ชั้น 1"
  date="15/04/2025"
  cardType="waitCar"
/>

<MobileWaitForKeyCard
  id={""}
  licensePlate="5กก 1234 กรุงเทพมหานคร"
  location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด"
  dateRange="01/01/2567 - 07/01/2567"
  pickupLocation="อาคาร LED ชั้น 3"
  pickupDate="28/12/2024"
/>

<MobileRecordTravelCard
        id="abc123"
        reviewCarDrive={handleReviewCar}
        returnCarAdd={handleReturnCar}
      />
   {travelLogSubmitted && <p>Travel Log Submitted</p>}
   {carReturned && <p>Car Successfully Returned</p>}

   <MobileFinishVehicleCard
        id="abc123"
        carRegis="5กก 1234"
        location="กรุงเทพมหานคร"
        date="01/01/2567 - 07/01/2567"
      /> */}
    </>
  );
}
