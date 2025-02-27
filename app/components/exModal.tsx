import React from 'react';
import TimePicker from './timePicker';

const ExModalComponent: React.FC = () => {
  const openModal = () => {
    const modal = document.getElementById('my_modal_s') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      <button className="btn" onClick={openModal}>open modal</button>
      <dialog id="my_modal_s" className="modal">
        <div className="modal-box max-w-[200px]">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <TimePicker />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ExModalComponent;
