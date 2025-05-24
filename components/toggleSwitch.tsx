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
  const [isOn, setIsOn] = useState(isActive === 1);

  const toggleSwitch = () => {
    if (useInView) {
      if (!isOn) {
        // Only open modal when turning off
        driverActiveModalRef.current?.openModal();
      } else {
        // Immediately turn on without modal
        setIsOn(true);
        onUpdateStatusDriver?.(driverId, "1");
      }
    } else {
      if (isOn) {
        driverActiveModalRef.current?.openModal();
      } else {
        setIsOn(true);
        onUpdateStatusDriver?.(driverId, "1");
      }
    }
    handleToggleChange?.(driverId);
  };

  // Sync with external isActive changes
  useEffect(() => {
    setIsOn(isActive === 1);
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