// import React, { useRef, useState } from 'react';
// import { createPopper, Placement } from '@popperjs/core';
//
// interface ActionProps {
//   onClick: () => void;
//   href: string;
//   className: string;
//   children: React.ReactNode;
// }
//
// interface DropdownProps {
//   actionProps: ActionProps[];
//   placement: Placement;
// }
//
// const TableDropdown: React.FC<DropdownProps> = ({ actionProps, placement }) => {
//   const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
//   const btnDropdownRef = useRef<HTMLAnchorElement>(null!);
//   const popoverDropdownRef = useRef<HTMLDivElement>(null!);
//
//   const openDropdownPopover = () => {
//     if (btnDropdownRef.current && popoverDropdownRef.current) {
//       createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
//         placement
//       });
//     }
//     setDropdownPopoverShow(true);
//   };
//
//   const closeDropdownPopover = () => {
//     setDropdownPopoverShow(false);
//   };
//
//   return (
//     <>
//       <a
//         className="text-blueGray-500 py-1 px-3"
//         href="#pablo"
//         ref={btnDropdownRef}
//         onClick={(e) => {
//           e.preventDefault();
//           dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
//         }}
//       >
//         <i className="fas fa-ellipsis-v"></i>
//       </a>
//       <div
//         ref={popoverDropdownRef}
//         className={`${
//           dropdownPopoverShow ? 'block ' : 'hidden '
//         }bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
//       >
//         {/*{actionProps.map((action, index) => (*/}
//         {/*  <a*/}
//         {/*    key={index}*/}
//         {/*    href={action.href}*/}
//         {/*    className={action.className}*/}
//         {/*    onClick={(e) => e.preventDefault()}*/}
//         {/*  >*/}
//         {/*    {action.children}*/}
//         {/*  </a>*/}
//         {/*))}*/}
//       </div>
//     </>
//   );
// };
//
// export default TableDropdown;
