import {
  RequestDetailType,
  satisfactionSurveyAnswers,
} from "@/app/types/request-detail-type";
import Rating from "@/components/rating";
import {
  fetchRequestKeyDetail,
  fetchSatisfactionSurveyQuestions,
} from "@/services/masterService";
import { UserUpdateSatisfactionSurvey } from "@/services/vehicleInUseUser";
import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface Props {
  displayOn?: string;
  id?: string;
}

export interface SatisfactionSurveyQuestions {
  mas_satisfaction_survey_questions_uid: string;
  question_title: string;
  questions_description: string;
}

const iconList = [
  "verified_user",
  "sentiment_satisfied",
  "apparel",
  "road",
  "directions",
  "local_car_wash",
];

const ReviewCarDriveModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ displayOn, id }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [reviewSubmit, setReviewSubmit] = useState(false);
  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [ratting, setRatting] =
    useState<
      {
        mas_satisfaction_survey_questions_code: string;
        survey_answer: number;
      }[]
    >();
  const [satisfactionSurveyQuestions, setSatisfactionSurveyQuestions] =
    useState<SatisfactionSurveyQuestions[]>([]);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const fetchRequestDetailfunc = useCallback(async () => {
    try {
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await fetchRequestKeyDetail(id || "");


      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  }, [id]);

  const fetchSatisfactionSurveyQuestionsFunc = useCallback(
    async () => {
      try {
        const response = await fetchSatisfactionSurveyQuestions();

        setSatisfactionSurveyQuestions(response.data);
        const newRatting = response.data.map(
          (item: SatisfactionSurveyQuestions) => {
            const findValue = requestData?.satisfaction_survey_answers?.find(
              (e) =>
                e.mas_satisfaction_survey_questions_uid ===
                item.mas_satisfaction_survey_questions_uid
            );
            return {
              mas_satisfaction_survey_questions_code:
                item.mas_satisfaction_survey_questions_uid,
                survey_answer: findValue?.survey_answer ?? 5,
            };
          }
        );
        setRatting(newRatting);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    },
    [id] // Add requestId to the dependency array,
  );

  useEffect(() => {
    fetchSatisfactionSurveyQuestionsFunc();

    if (id) {
      fetchRequestDetailfunc();
    }
  }, [id]);

  useEffect(() => {
    if (displayOn === "admin" || displayOn === "view") {
      setReviewSubmit(true);
    }
  }, [displayOn]);

  useEffect(() => {
    if (displayOn === "view") {
      const rattingData = requestData?.satisfaction_survey_answers?.map(
        (item: satisfactionSurveyAnswers) => {
          return {
            mas_satisfaction_survey_questions_code:
              item.mas_satisfaction_survey_questions_uid,
            survey_answer: item.survey_answer,
          };
        }
      );
      setRatting(rattingData);
      setReviewSubmit(true);
    }
  }, [displayOn, requestData]);

  // const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const onChangeRatting = (value: string, id: string) => {

    const newRatting = ratting?.map(
      (r: {
        mas_satisfaction_survey_questions_code: string;
        survey_answer: number;
      }) => {
        if (r.mas_satisfaction_survey_questions_code === id) {
          return {
            ...r,
            survey_answer: parseInt(value),
          };
        }
        return r;
      }
    );

    setRatting(newRatting);
  };

  const onSubmit = async () => {
    try {
      const payLoad = ratting?.map(
        (item: {
          mas_satisfaction_survey_questions_code: string;
          survey_answer: number;
        }) => {
          return {
            mas_satisfaction_survey_questions_code:
              item.mas_satisfaction_survey_questions_code,
            survey_answer: item.survey_answer,
          };
        }
      );
  

      const response = await UserUpdateSatisfactionSurvey(id || "", payLoad);
      if (response.status === 200) {
        setReviewSubmit(true);
      }
      // modalRef.current?.close();
      // setReviewSubmit(true);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <div className="modal-body overflow-y-auto text-center">
          <div className="grid grid-cols-1 gap-3 gap-y-4 pt-6">
            <div className="flex gap-3 col-span-12">
              <div className="w-[60px] aspect-square rounded-2xl overflow-hidden">
                <Image
                  className="aspect-square object-cover object-center"
                  src={
                    requestData?.driver?.driver_image ||
                    "/assets/img/sample-driver.png"
                  }
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-xl">
                  ให้คะแนนการบริการของผู้ขับขี่
                </p>
                <p className="text-xl">
                  {requestData?.driver?.driver_name}{" "}
                  {requestData?.driver?.driver_nickname &&
                    `(${requestData?.driver?.driver_nickname})`}
                </p>
              </div>
            </div>
            {satisfactionSurveyQuestions.map((item, index) => {
              const name = `rating-${item.mas_satisfaction_survey_questions_uid}`;
              const onChange = (value: string) => {
                onChangeRatting(
                  value,
                  item.mas_satisfaction_survey_questions_uid
                );
              };
              const findValue = ratting?.find(
                (r: {
                  mas_satisfaction_survey_questions_code: string;
                  survey_answer: number;
                }) =>
                  r.mas_satisfaction_survey_questions_code ===
                  item.mas_satisfaction_survey_questions_uid
              );
              return (
                <Rating
                  key={index}
                  name={name}
                  title={item.question_title}
                  description={item.questions_description}
                  icon={iconList[index]}
                  onChange={onChange}
                  value={findValue?.survey_answer || 5}
                  disabled={reviewSubmit}
                />
              );
            })}
            {/* <Rating
                title="ขับขี่ปลอดภัย"
                description="ขับขี่โดยคำนึงถึงความปลอดภัยของผู้โดยสาร"
                icon="verified_user"
              />
              <Rating
                title="ใส่ใจให้บริการและตรงต่อเวลา"
                description="ให้บริการด้วยกิริยามารยาทที่ดี ตรงต่อเวลาตามที่นัดหมาย"
                icon="sentiment_satisfied"
              />
              <Rating title="แต่งกายเหมาะสม" description="แต่งกายสุภาพเรียบร้อยตามที่ผู้ว่าจ้างกำหนด" icon="apparel" />
              <Rating title="มีความชำนาญในเส้นทาง" description="มีความรู้และความชำนาญในเส้นทาง" icon="road" />
              <Rating
                title="ดูแลบำรุงรักษายานพาหนะ"
                description="ดูแลรักษาความสะอาดของยานพาหนะทั้งภายนอกและภายใน ห้องโดยสาร"
                icon="local_car_wash"
              />
              <Rating
                title="ปฏิบัติตามกฏจราจร"
                description="ปฏิบัติตามกฎระเบียบและข้อบังคับตามกฎหมาย"
                icon="directions"
              /> */}
            {!reviewSubmit && (
              <div className="col-span-12">
                <button
                  type="button"
                  className="btn btn-primary !w-full"
                  onClick={onSubmit}
                >
                  ยืนยัน
                </button>
              </div>
            )}
            {reviewSubmit && (
              <div className="col-span-12">
                <button
                  type="button"
                  className="btn btn-secondary !w-full"
                  onClick={() => modalRef.current?.close()}
                >
                  ปิด
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

ReviewCarDriveModal.displayName = "ReviewCarDriveModal";

export default ReviewCarDriveModal;
