import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
    const mockOnPageChange = jest.fn();

    const renderPagination = (currentPage: number, totalPages: number) => {
        render(
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={mockOnPageChange}
            />
        );
    };

    it('disables "First" and "Previous" buttons on the first page', () => {
        renderPagination(0, 5);

        expect(screen.getByLabelText("Go to first page")).toBeDisabled();
        expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
    });

    it('disables "Next" and "Last" buttons on the last page', () => {
        renderPagination(4, 5);

        expect(screen.getByLabelText("Go to next page")).toBeDisabled();
        expect(screen.getByLabelText("Go to last page")).toBeDisabled();
    });

    it('calls onPageChange with the correct page number when buttons are clicked', () => {
        renderPagination(2, 5);

        fireEvent.click(screen.getByLabelText("Go to first page"));
        expect(mockOnPageChange).toHaveBeenCalledWith({ selected: 0 });

        fireEvent.click(screen.getByLabelText("Go to previous page"));
        expect(mockOnPageChange).toHaveBeenCalledWith({ selected: 1 });

        fireEvent.click(screen.getByLabelText("Go to next page"));
        expect(mockOnPageChange).toHaveBeenCalledWith({ selected: 3 });

        fireEvent.click(screen.getByLabelText("Go to last page"));
        expect(mockOnPageChange).toHaveBeenCalledWith({ selected: 4 });
    });

    it('displays the current page and adjacent page correctly', () => {
        renderPagination(1, 3);

        expect(screen.getByText('2')).toHaveClass('active');
        expect(screen.getByText('3')).toBeInTheDocument();
    });
});
