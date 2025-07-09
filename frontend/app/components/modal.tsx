
type ModalProps = {
    show:boolean,
    onClose:() => void,
}



const Modal = ({show, onClose}:ModalProps) => {
    return (
      <div className={`modal ${show ? 'modal-show' : ''}`} >
        <div className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white p-[35px] rounded-[5px] shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            <span className="text-black cursor-pointer text-[32px] absolute top-0 right-[15px]" onClick={onClose}>
                &times;
            </span>
            <h1 className="text-[19px] font-bold">Create New Task</h1>
            <div className="flex items-center gap-2.5 mt-2.5">
                <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                + Create Task
                </button>
                <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                Cancel
                </button>
            </div>
        </div>
      </div>
    );
  };
  
  export default Modal;