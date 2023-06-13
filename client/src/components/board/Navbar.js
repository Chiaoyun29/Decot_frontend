import React, {useState} from 'react';
import {  BiAppIndicator, BiX, BiPencil, BiEraser, BiChevronDown, BiBoxArrowInRight } from 'react-icons/bi';

const Navbar=(props)=>{
    const [isSubMenuOpen, setSubMenuOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSubMenu = () => {
        setSubMenuOpen(!isSubMenuOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return(
        <div className={`sidebar fixed top-0 bottom-0 lg:left-0 ${isSidebarOpen ? 'left-[-300px]' : ''} duration-1000 p-2 w-[150px] overflow-y-auto text-center bg-yellow-300 shadow h-100`}>
            <div className="text-gray-950 text-xl">
                <div className="p-2.5 mt-1 flex items-center rounded-md ">
                    <i className="bi bi-app-indicator px-2 py-1 bg-stone-50 rounded-md"></i>
                    <h1 className="text-[15px]  ml-3 text-xl text-gray-950 font-bold">DECOT</h1>
                    <i className="bi bi-x ml-20 cursor-pointer lg:hidden" onClick={toggleSidebar}>
                        <BiX />
                    </i>
                </div>
                <hr className="my-4 text-gray-700" />
                <div className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-stone-50" onClick={props.setToDraw}>
                    <BiPencil />
                    <button className="text-[15px] ml-4 text-gray-950">Draw</button>
                </div>
                <div className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-stone-50" onClick={props.setToErase}>
                    <BiEraser />
                    <span className="text-[15px] ml-4 text-gray-950">Erase</span>
                </div>

                <div className="p-2.5 mt-2 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-stone-50">
                    <i className="bi bi-chat-left-text-fill"></i>
                    <div className="flex justify-between w-full items-center" onClick={toggleSubMenu}>
                        <span className="text-[15px] ml-4 text-gray-950">Chatbox</span>
                        <span className={`text-sm ${isSubMenuOpen ? 'rotate-180' : ''}`} id="arrow">
                            <i className="bi bi-chevron-down"></i>
                        </span>
                    </div>
                </div>
                <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer  hover:bg-stone-50">
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span className="text-[15px] ml-4 text-gray-950">Logout</span>
                </div>
            </div>
        </div>
    );
}
export default Navbar;