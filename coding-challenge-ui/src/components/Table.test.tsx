import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from './Table';
import { Order } from './DashBoard';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSort } from '@fortawesome/free-solid-svg-icons';

describe('Table component', () => {
    const orderItems: Order[] = [
        {
            marketplace: 'Amazon',
            shopName: 'Shop1',
            orderId: '12345',
            orderValue: '100.00',
            items: "2",
            destination: 'Sydney',
            daysOverdue: 5,
            country: 'AUS',
        },
        {
            marketplace: 'Ebay',
            shopName: 'Shop2',
            orderId: '67890',
            orderValue: '200.00',
            items: "1",
            destination: 'Melbourne',
            daysOverdue: 2,
            country: 'GBR',
        },
    ];

    const mockHandleSort = jest.fn();

    beforeEach(() => {
        render(
            <Table
                orderItems={orderItems}
                itemsPerPage={1}
                handleSort={mockHandleSort}
                sortIcon={faSort as IconProp}
            />
        );
    });

    it('calls handleSort when the sort button is clicked', () => {
        const sortButton = screen.getByTestId('sort-btn');
        fireEvent.click(sortButton);
        expect(mockHandleSort).toHaveBeenCalled();
    });

    it('renders the table with order items', () => {
        expect(screen.getByText('Amazon')).toBeInTheDocument();
        expect(screen.getByText('Shop1')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.getByText('Sydney')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });
});
