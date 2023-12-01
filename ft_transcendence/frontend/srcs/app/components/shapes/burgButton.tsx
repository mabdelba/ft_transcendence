type newType = {
  setFlag: any;
  val: boolean;
};

function BurgButton(props: newType) {
  return (
    <button
      onClick={() => {
        props.setFlag(!props.val);
      }}
      data-drawer-target="default-sidebar"
      data-drawer-toggle="default-sidebar"
      aria-controls="default-sidebar"
      type="button"
      className=" inline-flex items-center p-2 ml-3 text-sm text-gray-500 outline-none ring-0
                    rounded-lg sm:hidden  "
    >
      <svg
        className="w-6 h-6"
        aria-hidden="true"
        fill="white"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
  );
}

export default BurgButton;
