// src/components/SearchableComboBox.tsx
// ComboBox có ô tìm kiếm nhanh, hỗ trợ phím mũi tên và Enter
import { useState, useRef, useEffect } from 'react';
import { ChevronUpDownIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';

export interface ComboBoxOption {
    value: string;
    label: string;
    sublabel?: string; // Dòng phụ (VD: SĐT, biển số xe...)
}

interface SearchableComboBoxProps {
    options: ComboBoxOption[];
    value: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    emptyText?: string;
}

const SearchableComboBox: React.FC<SearchableComboBoxProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Chon...',
    label,
    disabled = false,
    emptyText = 'Khong tim thay ket qua',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedOption = options.find(o => o.value === value);

    // Lọc options theo search
    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        (o.sublabel && o.sublabel.toLowerCase().includes(search.toLowerCase()))
    );

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input khi mở dropdown
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Scroll item đang highlight vào view
    useEffect(() => {
        if (highlightIndex >= 0 && listRef.current) {
            const item = listRef.current.children[highlightIndex] as HTMLElement;
            item?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightIndex]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
                setIsOpen(true);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightIndex(prev => Math.min(prev + 1, filtered.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightIndex >= 0 && filtered[highlightIndex]) {
                    onChange(filtered[highlightIndex].value);
                    setIsOpen(false);
                    setSearch('');
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSearch('');
                break;
        }
    };

    const handleSelect = (optionValue: string) => {
        onChange(optionValue === value ? null : optionValue);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
            {label && <label className="label">{label}</label>}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`input flex items-center justify-between text-left w-full ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setHighlightIndex(0);
                                }}
                                placeholder="Tim kiem..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <ul ref={listRef} className="max-h-60 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-500 text-center">{emptyText}</li>
                        ) : (
                            filtered.map((option, idx) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                                        idx === highlightIndex
                                            ? 'bg-gradient-to-r from-pink-50 to-orange-50'
                                            : 'hover:bg-gray-50'
                                    } ${option.value === value ? 'font-semibold' : ''}`}
                                >
                                    <div>
                                        <div className="text-sm text-gray-900">{option.label}</div>
                                        {option.sublabel && (
                                            <div className="text-xs text-gray-500">{option.sublabel}</div>
                                        )}
                                    </div>
                                    {option.value === value && (
                                        <CheckIcon className="h-4 w-4 text-primary flex-shrink-0" />
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableComboBox;
