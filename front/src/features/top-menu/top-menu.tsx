import { FaWindowClose, FaWindowMaximize } from 'react-icons/fa';
import { FaWindowMinimize } from 'react-icons/fa';

export default function TopMenu() {
  return (
    <div className="fixed top-0 left-0 w-full h-6 flex flex-row justify-between [-webkit-app-region:drag] bg-base-200 backdrop-blur-sm z-50">
      <div></div>
      <div className="join [-webkit-app-region:no-drag]">
        <button
          className="btn btn-soft btn-outline btn-success join-item h-full"
          onClick={() => {
            window.electronAPI.windowControl('minimize');
          }}
        >
          <FaWindowMinimize />
        </button>
        <button
          className="btn btn-soft btn-outline btn-warning join-item h-full"
          onClick={() => {
            window.electronAPI.windowControl('maximize');
          }}
        >
          <FaWindowMaximize />
        </button>
        <button
          className="btn btn-soft btn-outline btn-error join-item h-full"
          onClick={() => {
            window.electronAPI.windowControl('close');
          }}
        >
          <FaWindowClose />
        </button>
      </div>
    </div>
  );
}
