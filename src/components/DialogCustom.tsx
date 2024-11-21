import { Dialog, Transition } from '@headlessui/react';
import React, { memo } from 'react';

interface MyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const DialogCustom: React.FC<MyDialogProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog onClose={onClose}>
        <Transition.Child
          enter="ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black" />
        </Transition.Child>

        <Transition.Child
          enter="ease-out"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-4">
            {title && <Dialog.Title>Deactivate account</Dialog.Title>}
            {children}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default memo(DialogCustom);
