"use client";

import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactElement;
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean;
  toggleOpen: () => void;
  close: () => void;
} | null>(null);

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  React.useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, toggleOpen, close }}>
      <div className="relative inline-block" ref={menuRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuTrigger must be used within a DropdownMenu");
  }

  // Clone the trigger element to inject onClick handler
  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent) => {
      event.preventDefault();
      context.toggleOpen();
      if (children.props.onClick) {
        children.props.onClick(event);
      }
    },
    "aria-haspopup": "menu",
    "aria-expanded": context.isOpen,
  });
}

export function DropdownMenuContent({
  children,
  className = "",
  align = "start",
  ...props
}: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuContent must be used within a DropdownMenu");
  }

  if (!context.isOpen) return null;

  let alignmentClasses = "left-0";
  if (align === "end") alignmentClasses = "right-0";
  else if (align === "center") alignmentClasses = "left-1/2 transform -translate-x-1/2";

  return (
    <div
      role="menu"
      tabIndex={-1}
      className={`absolute mt-2 z-50 min-w-[160px] rounded-md bg-white dark:bg-gray-800 shadow-lg focus:outline-none ${alignmentClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  className = "",
  ...props
}: DropdownMenuItemProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuItem must be used within a DropdownMenu");
  }

  return (
    <button
      role="menuitem"
      type="button"
      tabIndex={-1}
      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none ${className}`}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        context.close();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
