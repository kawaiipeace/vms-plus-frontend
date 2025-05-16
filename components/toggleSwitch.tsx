import React, { useState, useEffect } from "react";

const ToggleSwitch = ({
  isActive,
  driverActiveModalRef,
  driverId,
  handleToggleChange,
  onUpdateStatusDriver,
  useInView,
}: {
  isActive: number;
  driverActiveModalRef: React.RefObject<{ openModal: () => void; closeModal: () => void } | null>;
  driverId: string;
  handleToggleChange?: (driverId: string) => void;
  onUpdateStatusDriver?: (driverId: string, isActive: string) => void;
  useInView?: boolean;
}) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    // setIsOn(!isOn);
    console.log("Driver ID:", driverId);
    handleToggleChange?.(driverId);
    if (useInView) {
      driverActiveModalRef.current?.openModal();
    } else {
      if (isActive === 1) {
        driverActiveModalRef.current?.openModal();
      } else {
        onUpdateStatusDriver?.(driverId, "1");
      }
    }
  };

  useEffect(() => {
    if (isActive === 1) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }, [isActive]);

  return (
    <div
      onClick={toggleSwitch}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        isOn ? "bg-purple-700" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
