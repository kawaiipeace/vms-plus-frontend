import { useRef } from "react";
import Image from "next/image";
import SearchDriverModal from "@/components/modal/admin/searchDriverModal";

interface ZeroRecordProps {
  imgSrc: string;
  title: string;
  desc: string | React.ReactNode;
  button?: string;
  reqId?: string;
  onSelectDriver?: (mas_driver_uid: string) => void;
  onCloseParentModal?: () => void;
  onOpenParentModal?: () => void;
}
export default function EmptyDriver({
  imgSrc,
  title,
  desc,
  button,
  reqId,
  onSelectDriver,
  onCloseParentModal,
  onOpenParentModal
}: ZeroRecordProps) {
    const searchDriverModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);


    const handleSelectDriver = (mas_driver_uid: string) => {
      onSelectDriver?.(mas_driver_uid); 
      searchDriverModalRef.current?.closeModal(); // Close modal after selection
    };


  return (
    <div className="zerorecord">
      <div className="emptystate">
        <Image
          src={imgSrc}
          width={100}
          height={100}
          alt=""
        ></Image>
        <div className="emptystate-title">{title}</div>
        <div className="emptystate-text">
        {desc}
        </div>
        { button && 
        <div className="emptystate-action">
          <button className="btn btn-secondary btn-clearsearch"   
            onClick={() => { searchDriverModalRef.current?.openModal()

              onCloseParentModal?.();
            }}
            >
            {button}
          </button>
        </div>
}
      </div>

      <SearchDriverModal ref={searchDriverModalRef} reqId={reqId} onSelectDrivers={handleSelectDriver} onBack={onOpenParentModal} />
    </div>
  );
}
