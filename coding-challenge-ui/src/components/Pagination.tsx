import React from 'react';
import styled from "styled-components";

const StyledPagination = styled.ul`
  display: flex;
  justify-content: center; 
  align-items: center; 
  list-style: none;
  font-family: "Roboto", sans-serif;
  margin: 20px 0;
  padding: 0;

  li {
    margin: 0 5px;
  }

  button {
    width: 40px; 
    height: 40px; 
    background-color: transparent;
    border: none; 
    cursor: pointer;
    font-weight: bold; 
    color: black;

    &:hover {
      color: #0056b3; 
    }

    &:disabled {
      cursor: not-allowed;
      color: #ccc; 
    }
  }

  .active {
    font-weight: bold; 
    color: #0056b3; 
  }
`;

type PaginationProps = {
    totalPages: number;
    onPageChange: (selectedPage: { selected: number }) => void;
    currentPage: number;
};

export const Pagination: React.FC<PaginationProps> = React.memo(({ totalPages, onPageChange, currentPage }) => {
    return (
        <StyledPagination>
            <li>
                <button
                    disabled={currentPage === 0}
                    onClick={() => onPageChange({ selected: 0 })}
                    aria-label="Go to first page"
                >
                    {"<<"}
                </button>
            </li>
            <li>
                <button
                    disabled={currentPage === 0}
                    onClick={() => onPageChange({ selected: currentPage - 1 })}
                    aria-label="Go to previous page"
                >
                    {"<"}
                </button>
            </li>
            Page
            <li>
                <button className="active" type="button">
                    {currentPage + 1}
                </button>
            </li>
            {currentPage < totalPages - 1 && (
                <li>
                    <button type="button" onClick={() => onPageChange({ selected: currentPage + 1 })}>
                        {currentPage + 2}
                    </button>
                </li>
            )}
            <li>
                <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => onPageChange({ selected: currentPage + 1 })}
                    aria-label="Go to next page"
                >
                    {">"}
                </button>
            </li>
            <li>
                <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => onPageChange({ selected: totalPages - 1 })}
                    aria-label="Go to last page"
                >
                    {">>"}
                </button>
            </li>
        </StyledPagination>
    );
});
