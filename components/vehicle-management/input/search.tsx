import React, { useState, useEffect } from "react";

interface SearchInputProps {
    defaultValue?: string;
    placeholder?: string;
    onSearch?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    defaultValue = "",
    placeholder = "Search...",
    onSearch,
}) => {
    const [searchTerm, setSearchTerm] = useState(defaultValue);

    // Reset search input when defaultValue changes
    useEffect(() => {
        setSearchTerm(defaultValue);
    }, [defaultValue]);

    // Trigger search if input is valid (>=3 or empty)
    useEffect(() => {
        if (searchTerm.length >= 3 || searchTerm.length === 0) {
            onSearch?.(searchTerm);
        }
    }, [searchTerm]);

    return (
        <div className="block">
            <div className="input-group input-group-search">
                <div className="input-group-prepend">
                    <span className="input-group-text search-ico-info">
                        <i className="material-symbols-outlined">search</i>
                    </span>
                </div>
                <input
                    type="text"
                    className="form-control dt-search-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
};

export default SearchInput;
