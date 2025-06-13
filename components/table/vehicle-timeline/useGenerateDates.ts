import { useEffect, useState } from "react";
import { generateDateObjects } from "@/utils/vehicle-management";
import { VehicleTimelineSearchParams } from "@/app/types/vehicle-management/vehicle-timeline-type";

const useGenerateDates = (params: Partial<VehicleTimelineSearchParams>) => {
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    const fetchDates = async () => {
      const dateObjects = await generateDateObjects(
        params.start_date ?? '', 
        params.end_date ?? ''
      );
      setDates(dateObjects);
    };

    fetchDates();
  }, [params]);

  return dates;
};

export default useGenerateDates;
