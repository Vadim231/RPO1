import { PropsWithChildren, ReactElement, ReactNode } from 'react';
interface modalProps {
  id: string;
  modalTitle: string;
  modalBody: ReactNode;
}
export default function Modal({
  id,
  modalTitle,
  modalBody,
}: PropsWithChildren<modalProps>): ReactElement {
  return (
    <>
      <div
        id={`${id}`}
        className="overlay modal overlay-open:opacity-100 overlay-open:duration-250 modal-middle hidden"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{modalTitle}</h3>
              <button
                type="button"
                className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                aria-label="Close"
                data-overlay={`#${id}`}
              >
                <span className="icon-[tabler--x] size-4"></span>
              </button>
            </div>
            <div className="modal-body flex flex-row justify-center">
              {modalBody}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
