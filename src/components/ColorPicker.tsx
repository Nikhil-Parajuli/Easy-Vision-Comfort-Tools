import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const colors = [
  '#000000', '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
  '#ced4da', '#adb5bd', '#6c757d', '#495057', '#343a40',
  '#212529', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da',
  '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff',
];

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          className={cn(
            "w-8 h-8 rounded-md border border-gray-200",
            className
          )}
          style={{ backgroundColor: value }}
        />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="z-50 w-[200px] rounded-md border border-gray-200 bg-white p-2 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          sideOffset={5}
        >
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded-md border border-gray-200",
                  value === color && "ring-2 ring-blue-500"
                )}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}