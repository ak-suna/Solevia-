import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable DataTable Component
 * 
 * @param {Array} columns - Column definitions
 * @param {Array} data - Data array
 * @param {Function} onRowClick - Optional row click handler
 * @param {Boolean} searchable - Enable search (default: true)
 * @param {String} searchPlaceholder - Search input placeholder
 * @param {Number} itemsPerPage - Items per page (default: 10)
 * @param {String} emptyMessage - Message when no data
 * @param {Boolean} loading - Show loading state
 */

const DataTable = ({
    columns = [],
    data = [],
    onRowClick = null,
    searchable = true,
    searchPlaceholder = "Search...",
    itemsPerPage = 10,
    emptyMessage = "No data available",
    loading = false
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);

    // Search functionality
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter(row => {
            return columns.some(column => {
                const value = column.accessor ? column.accessor(row) : row[column.key];
                if (value === null || value === undefined) return false;
                return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerm, columns]);

    // Sorting functionality
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const column = columns.find(col => col.key === sortConfig.key);
            const aValue = column.accessor ? column.accessor(a) : a[sortConfig.key];
            const bValue = column.accessor ? column.accessor(b) : b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig, columns]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Handle sort
    const handleSort = (key, sortable) => {
        if (!sortable) return;

        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Reset to page 1 when search or data changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, data.length]);

    // Loading State
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4873e]"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Search Bar */}
            {searchable && (
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#f4873e] transition-colors"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        onClick={() => handleSort(column.key, column.sortable)}
                                        className={`
                                            text-left py-4 px-4 font-bold text-gray-700 dark:text-gray-300
                                            ${column.sortable ? 'cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 select-none' : ''}
                                            transition-colors
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{column.label}</span>
                                            {column.sortable && (
                                                <div className="flex flex-col">
                                                    <ChevronUp
                                                        className={`w-3 h-3 -mb-1 ${sortConfig.key === column.key && sortConfig.direction === 'asc'
                                                                ? 'text-[#f4873e]'
                                                                : 'text-gray-400'
                                                            }`}
                                                    />
                                                    <ChevronDown
                                                        className={`w-3 h-3 ${sortConfig.key === column.key && sortConfig.direction === 'desc'
                                                                ? 'text-[#f4873e]'
                                                                : 'text-gray-400'
                                                            }`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="py-12 text-center">
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, rowIndex) => (
                                    <tr
                                        key={row._id || row.id || rowIndex}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={`
                                            border-t border-gray-200 dark:border-gray-600 
                                            hover:bg-orange-50 dark:hover:bg-orange-900/10 
                                            transition-colors
                                            ${onRowClick ? 'cursor-pointer' : ''}
                                        `}
                                    >
                                        {columns.map((column) => (
                                            <td key={column.key} className="py-4 px-4">
                                                {column.render
                                                    ? column.render(
                                                        column.accessor ? column.accessor(row) : row[column.key],
                                                        row
                                                    )
                                                    : column.accessor
                                                        ? column.accessor(row)
                                                        : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} results
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`
                                p-2 rounded-full transition-all
                                ${currentPage === 1
                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            `}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show first, last, current, and adjacent pages
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`
                                                px-3 py-1 rounded-full font-semibold transition-all
                                                ${pageNumber === currentPage
                                                    ? 'bg-gradient-to-r from-[#f4873e] to-[#ff9e5e] text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }
                                            `}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                    return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`
                                p-2 rounded-full transition-all
                                ${currentPage === totalPages
                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            `}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;