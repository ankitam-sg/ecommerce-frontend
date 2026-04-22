type Props = {
    open: boolean,
    title: string,
    msg?: string,
    onConfirm: () => void,
    onCancel: () => void, 
};

const ConfirmModal = ({
    open,
    title,
    msg,
    onConfirm,
    onCancel,
}: Props) => {

    if (!open) return null;

    return (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white p-5 rounded-lg w-[320px] space-y-4 shadow-lg">

                {/* Title */}
                <h2 className="text-lg font-semibold">
                    {title}
                </h2>

                {/* Message */}
                {msg && (
                    <p className="text-sm text-gray-600">
                        {msg}
                    </p>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">

                     {/* Cancel button → subtle hover feedback */}
                    <button
                        onClick={onCancel}
                        className="
                            px-3 py-1 rounded 
                            bg-gray-200
                            hover:bg-gray-300
                            active:scale-95
                        "
                    >
                        Cancel
                    </button>

                    {/* Confirm button → stronger visual feedback */}
                    <button
                        onClick={onConfirm}
                        className="
                            px-3 py-1 rounded 
                            bg-red-600 text-white
                            hover:bg-red-700
                            active:scale-95
                            transition
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ConfirmModal;