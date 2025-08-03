import { RequestDetailType } from "@/app/types/request-detail-type";
import Rating from "@/components/rating";
import { fetchReviewDriverDetail } from "@/services/adminService";
import {
  fetchRequestKeyDetail,
  fetchSatisfactionSurveyQuestions,
} from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
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
  role?: string;
}

interface SatisfactionSurveyQuestions {
  mas_satisfaction_survey_questions_code: string;
  mas_satisfaction_survey_questions_title?: string;
  mas_satisfaction_survey_questions_desc?: string;
}

interface ReviewDriverDetail {
  mas_satisfaction_survey_questions_code: string;
  survey_answer: number;
  satisfaction_survey_questions: {
    mas_satisfaction_survey_questions_code: string;
    mas_satisfaction_survey_questions_title?: string;
    mas_satisfaction_survey_questions_desc?: string;
    question_title?: string;
    questions_description?: string;
  };
}

const iconList = [
  "verified_user",
  "sentiment_satisfied",
  "apparel",
  "road",
  "directions",
  "local_car_wash",
];

const ReviewCarDriveDetailModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ displayOn, id, role }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [reviewSubmit, setReviewSubmit] = useState(false);
  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [ratting, setRatting] = useState<ReviewDriverDetail[]>([]);
  const [satisfactionSurveyQuestions, setSatisfactionSurveyQuestions] =
    useState<SatisfactionSurveyQuestions[]>([]);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const fetchRequestDetailfunc = useCallback(async () => {
    try {
      const response = await fetchRequestKeyDetail(id || "");
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  }, [id]);

  const fetchReviewDriverDetailFunc = useCallback(async () => {
    try {
      const response = await fetchReviewDriverDetail(id || "");
      console.log("response", response.data);
      setRatting(response.data);
    } catch (error) {
      console.error("Error fetching review details:", error);
    }
  }, [id]);

  const fetchSatisfactionSurveyQuestionsFunc = useCallback(async () => {
    try {
      const response = await fetchSatisfactionSurveyQuestions();
      setSatisfactionSurveyQuestions(response.data);
    } catch (error) {
      console.error("Error fetching survey questions:", error);
    }
  }, []);

  useEffect(() => {
    fetchSatisfactionSurveyQuestionsFunc();
    fetchRequestDetailfunc();
    fetchReviewDriverDetailFunc(); // Fetch the review data
  }, [
    fetchRequestDetailfunc,
    fetchSatisfactionSurveyQuestionsFunc,
    fetchReviewDriverDetailFunc,
  ]);

  useEffect(() => {
    if (displayOn === "admin" || displayOn === "view") {
      setReviewSubmit(true);
    }
  }, [displayOn]);

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">ให้คะแนนการบริการของผู้ขับขี่</div>

          <form method="dialog">
            <button
              className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
              onClick={() => modalRef.current?.close()}
            >
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto text-center">
          <div className="grid grid-cols-1 gap-3 gap-y-4">
            <div className="flex gap-3 justify-between items-center">
              <div className="flex gap-3 items-center">
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
                  <p className="font-bold text-base">
                    {" "}
                    {requestData?.driver?.driver_name}{" "}
                    {requestData?.driver?.driver_nickname ??
                      "(" + requestData?.driver?.driver_nickname + ")"}
                  </p>
                  <p className="text-sm">
                    {requestData?.driver?.driver_dept_sap}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <i className="material-symbols-outlined text-brand-900">star</i>
                <span className="text-base font-semibold">
                  {Number(
                    requestData?.driver?.driver_average_satisfaction_score
                  ) === (0 || 0.0)
                    ? "ยังไม่มีการให้คะแนน"
                    : requestData?.driver?.driver_average_satisfaction_score}
                </span>
              </div>
            </div>
            <div className="mt-3 space-y-5">
              {ratting.length > 0
                ? ratting.map((item, index) => {
                    const name = `rating-${item.mas_satisfaction_survey_questions_code}`;
                    return (
                      <Rating
                        key={index}
                        name={name}
                        title={
                          item.satisfaction_survey_questions.question_title ||
                          ""
                        }
                        description={
                          item.satisfaction_survey_questions
                            .questions_description || ""
                        }
                        icon={iconList[index]}
                        value={item.survey_answer}
                        disabled={reviewSubmit}
                      />
                    );
                  })
                : // Fallback to satisfactionSurveyQuestions if ratting data is not available yet
                  satisfactionSurveyQuestions.map((item, index) => {
                    const name = `rating-${item.mas_satisfaction_survey_questions_code}`;
                    return (
                      <Rating
                        key={index}
                        name={name}
                        title={
                          item.mas_satisfaction_survey_questions_title || ""
                        }
                        description={
                          item.mas_satisfaction_survey_questions_desc || ""
                        }
                        icon={iconList[index]}
                        value={5} // Default value if no rating data
                        disabled={reviewSubmit}
                      />
                    );
                  })}
            </div>
          </div>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => modalRef.current?.close()}
          >
            ปิด
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

ReviewCarDriveDetailModal.displayName = "ReviewCarDriveDetailModal";

export default ReviewCarDriveDetailModal;
