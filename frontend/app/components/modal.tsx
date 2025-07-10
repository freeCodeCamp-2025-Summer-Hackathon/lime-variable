

type ModalProps = {
    show:boolean,
    onClose:() => void,
    children:any
}



const TaskModal = ({show, onClose,children}:ModalProps) => {
    return (
      <div className={`modal ${show ? 'modal-show' : ''}`} >
        <div className="w-[500px] h-[600px]  overflow-y-auto absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-white px-[35px] pt-[15px] rounded-[5px] shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            <span className="text-black cursor-pointer text-[32px] absolute -top-[9px] right-[15px]" onClick={onClose}>
                &times;
            </span>
            <h1 className="text-[19px] font-bold">Create New Task</h1>
            {children}
        </div>
      </div>
    );
  };
  
  export default TaskModal;