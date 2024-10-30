// src/Dashboard.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from './DashBoard';

// Mock the fetch API
global.fetch = jest.fn();

describe('Dashboard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('displays loading state initially', () => {
        render(<Dashboard />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('displays error message when fetch fails', async () => {
        render(<Dashboard />);

        const errorMessage = await screen.findByText(/Failed to fetch overdue orders./i);
        expect(errorMessage).toBeInTheDocument();
    });
    it('renders overdue orders when fetched successfully', async () => {
        const mockOrders = [
            {
                country: 'USA',
                marketplace: 'Amazon',
                shopName: 'Shop A',
                orderId: '12345',
                orderValue: '$100',
                items: 'Item 1, Item 2',
                destination: 'New York',
                daysOverdue: 5,
            },
            {
                country: 'Canada',
                marketplace: 'eBay',
                shopName: 'Shop B',
                orderId: '67890',
                orderValue: '$200',
                items: 'Item 3, Item 4',
                destination: 'Toronto',
                daysOverdue: 2,
            },
        ];


        (fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                json: async () => mockOrders,
            })
        );

        render(<Dashboard />);

        expect(await screen.findByText(/Overdue Orders/i)).toBeInTheDocument();
        expect(await screen.findByText(/Shop A/i)).toBeInTheDocument();
        expect(await screen.findByText(/Shop B/i)).toBeInTheDocument();
    });
});
