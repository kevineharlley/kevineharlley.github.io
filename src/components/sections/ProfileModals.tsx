import Modal from "@/components/Modal";
import { modalRegistry, type ModalId } from "@/data";

export function ProfileModals({ activeModal, onClose }: { activeModal: ModalId | null; onClose: () => void }) {
  return (
    <>
      {Object.entries(modalRegistry).map(([key, { title, items }]) => (
        <Modal key={key} isOpen={activeModal === key} onClose={onClose} title={title}>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Modal>
      ))}
    </>
  );
}
