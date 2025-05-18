import React, { useState } from "react";

interface SearchInputProps {
    defaultValue?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ defaultValue, placeholder, onChange }) => {
    const [search, setSearch] = useState(defaultValue || "");

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
                    id="search1"
                    className="form-control dt-search-input"
                    placeholder={placeholder || "Search..."}
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        onChange?.(value);
                    }}
                />
            </div>
        </div>
    );
}

export default SearchInput;