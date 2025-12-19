export default function VoucherBadge({ key, vcCode, removeHandler }) {
    return (
        <>
            <span key={key} id={`vcCode${key}`} className="select-none inline-flex items-center bg-gray-100 border border-gray-400 text-fg-brand-strong text-sm font-medium ps-1.5 pe-0.5 py-0.5 rounded gap-1">
                <span>{vcCode}</span>
                <button type="button"
                    className="inline-flex items-center p-0.5 text-sm bg-transparent rounded-xs hover:bg-gray-300"
                    data-dismiss-target="#badge-dismiss-brand" aria-label="Remove"
                    onClick={() => removeHandler(vcCode)}>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" /></svg>
                    <span class="sr-only">Remove badge</span>
                </button>
            </span>
        </>
    );
}