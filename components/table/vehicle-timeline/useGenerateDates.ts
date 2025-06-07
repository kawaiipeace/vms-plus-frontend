import { useEffect, useState } from "react";
import { generateDateObjects } from "@/utils/vehicle-management";

const useGenerateDates = (params: { start_date: string; end_date: string }) => {
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    const fetchDates = async () => {
      const dateObjects = await generateDateObjects(params.start_date, params.end_date);
      setDates(dateObjects);
    };

    fetchDates();
  }, [params]);

  return dates;
};

export default useGenerateDates;
