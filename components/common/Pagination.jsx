// eslint-disable-next-line no-unused-vars
import React from "react";

const Pagination = ({ currentPage, totalRecords, pageSize, onPageChange }) => {
    // Calculate the total number of pages
    console.log("currentPage", currentPage);
    console.log("totalRecords", totalRecords);
    console.log("pageSize", pageSize);
    console.log("onPageChange", onPageChange);
    const totalPages = Math.ceil(totalRecords / pageSize);
    const getPageNumbers = () => {
        const pageNumbers = [];
        const visiblePages = 3; // Number of visible page numbers before and after the current page

        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else if (currentPage <= visiblePages + 1) {
            for (let i = 1; i <= visiblePages + 2; i++) {
                pageNumbers.push(i);
            }
            if (visiblePages + 2 < totalPages) {
                pageNumbers.push("...");
            }
            pageNumbers.push(totalPages);
        } else if (currentPage >= totalPages - visiblePages) {
            pageNumbers.push(1);
            if (totalPages - visiblePages - 1 > 1) {
                pageNumbers.push("...");
            }
            for (let i = totalPages - visiblePages - 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > visiblePages + 1) {
                pageNumbers.push("...");
            }
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pageNumbers.push(i);
            }
            if (currentPage < totalPages - visiblePages) {
                pageNumbers.push("...");
            }
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <nav className="ls-pagination">
            <ul>
                <li className={currentPage === 1 ? "prev disabled" : "prev"}>
                    <a
                        onClick={() => {
                            if (currentPage > 1) {
                                onPageChange(currentPage - 1);
                            }
                        }}
                    >
                        <i className="fa fa-arrow-left"></i>
                    </a>
                </li>
                {getPageNumbers().map((page, index) => (
                    <li
                        key={index}
                        className={page === "..." ? "ellipsis" : ""}
                    >
                        {page === "..." ? (
                            "..."
                        ) : (
                            <a
                                className={
                                    currentPage === page ? "current-page" : ""
                                }
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </a>
                        )}
                    </li>
                ))}
                <li
                    className={
                        currentPage === totalPages ? "next disabled" : "next"
                    }
                >
                    <a
                        onClick={() => {
                            if (currentPage < totalPages) {
                                onPageChange(currentPage + 1);
                            }
                        }}
                    >
                        <i className="fa fa-arrow-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
