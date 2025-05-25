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

    useEffect(() => {
        if (searchTerm.length <= 2 && searchTerm.length !== 0) return;

        if (searchTerm != defaultValue) {
            onSearch?.(searchTerm);
        }
    }, [searchTerm, onSearch]);


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
