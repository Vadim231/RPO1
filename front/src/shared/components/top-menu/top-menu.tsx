export default function TopMenu() {
    return (
        <div className="fixed top-0 left-0 w-full h-6 flex flex-row justify-between [-webkit-app-region:drag] z-100 bg-base-100/50">
            <div></div>
            <div className="join [-webkit-app-region:no-drag]">
                <button className="btn btn-soft btn-success join-item h-full"
                    onClick={() => { window.electronAPI.windowControl('minimize') }}
                >—</button>
                <button className="btn btn-soft btn-warning join-item h-full"
                    onClick={() => { window.electronAPI.windowControl('maximize') }}
                >□</button>
                <button className="btn btn-soft btn-error join-item h-full"
                    onClick={() => { window.electronAPI.windowControl('close') }}
                >✕</button>
            </div>
        </div>
    )
}