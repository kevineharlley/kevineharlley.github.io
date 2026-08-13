import Modal from "@/components/Modal";
import { modalData } from "@/data/modalData";

export function ProfileModals({ activeModal, onClose }: { activeModal: string | null; onClose: () => void }) {
  return (
    <>
      {Object.entries(modalData).map(([key, { title, items }]) => (
        <Modal key={key} isOpen={activeModal === key} onClose={onClose} title={title}>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Modal>
      ))}
    </>
  );
}
