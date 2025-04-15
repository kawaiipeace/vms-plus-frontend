import { RequestListType } from "@/app/types/request-list-type";
import MobileWaitingCard from "@/components/card/mobileWaitingCard";
import MobileFileBackCard from "@/components/card/mobileFileBackCard"; // Make sure this is imported
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import MobileDriverCard from "@/components/card/mobileDriverCard";
import MobileWaitForKeyCard from "@/components/card/mobileWaitForKeyCard";
import { useState } from "react";
import MobileRecordTravelCard from "@/components/card/mobileRecordTravelCard";
import MobileFinishVehicleCard from "@/components/card/mobileFinishVehicleCard";

interface Props {
  requestData: RequestListType[];
}

export default function ListFlow({ requestData }: Props) {

    const [travelLogSubmitted, setTravelLogSubmitted] = useState(false);
    const [carReturned, setCarReturned] = useState(false);
  
    const handleReviewCar = () => {
      console.log("Reviewing car drive...");
    };
  
    const handleReturnCar = () => {
      console.log("Returning the car...");
      setCarReturned(true); // Simulate car return
    };
    
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
              cardTitle={request.ref_request_status_name || "สถานะไม่ระบุ"}
              cardSubtitle={request.vehicle_license_plate || ""}
              supportingTexts={[
                request.work_place || "ไม่ทราบสถานที่ปฏิบัติงาน",
                `${convertToBuddhistDateTime(request.start_datetime).date || "-"} - ${convertToBuddhistDateTime(request.end_datetime).date || "-"}`,
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
              cardSubtitle={request.vehicle_license_plate || ""}
              supportingTexts={[
                request.work_place || "ไม่ทราบสถานที่ปฏิบัติงาน",
                `${convertToBuddhistDateTime(request.start_datetime).date || "-"} - ${convertToBuddhistDateTime(request.end_datetime).date || "-"}`,
              ]}
              cardItemText={request?.ref_request_status_name}
              showEditButton={true}
            />
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
