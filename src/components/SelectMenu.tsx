'use client';

import {useEffect, useRef, useState, type CSSProperties} from 'react';

export type SelectOption = {
  value: string;
  label: string;
};

export function SelectMenu({
  value,
  options,
  onChange,
  disabled,
  className,
  buttonStyle
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  buttonStyle?: CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!rootRef.current || !(event.target instanceof Node)) return;
      if (!rootRef.current.contains(event.target)) setOpen(false);
    }

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value) ?? options[0];

  return (
    <div className={`select-menu ${className ?? ''}`} ref={rootRef}>
      <button
        type="button"
        className="input-studio select-menu-trigger"
        style={buttonStyle}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        aria-expanded={open}
        disabled={disabled}
      >
        <span>{selected?.label ?? value}</span>
        <i className={`fas ${open ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
      </button>
      {open ? (
        <div className="select-menu-list" role="listbox">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`select-menu-item ${opt.value === value ? 'active' : ''}`}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
