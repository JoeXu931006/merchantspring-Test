import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Table } from "./Table";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faDownLong, faUpLong } from '@fortawesome/free-solid-svg-icons';

const DashBoardBackground = styled.div`
  height: 50vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  background-color: #cccccc;
`;

const DashBoardWrapper = styled.div`
  margin-top: 5rem;
  width: 80vw;
  background-color: white;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
border-radius: 6px;
`;

const DashBoardHeader = styled.header`
  padding: 1.5rem 1.5rem;
  font-family: "Roboto", sans-serif;
  font-weight: bold; 
  font-size:2rem
`;

export type Order = {
    country: string,
    marketplace: string,
    shopName: string,
    orderId: string,
    orderValue: string,
    items: string,
    destination: string,
    daysOverdue: number,
}

export const Dashboard = () => {
    const [overdueOrders, setOverdueOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [sortIcon, setSortIcon] = useState<IconProp>(faDownLong);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/sales");
                if (!response || !response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setOverdueOrders(data);
            } catch (error) {
                console.error("Error fetching overdue orders:", error);
                setError("Failed to fetch overdue orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortedOrders = useMemo(() => {
        return [...overdueOrders].sort((a, b) => {
            if (sortDirection === 'asc') {
                return a.daysOverdue - b.daysOverdue;
            }
            return b.daysOverdue - a.daysOverdue;
        });
    }, [overdueOrders, sortDirection]);

    const handleSort = () => {
        setSortDirection(prev => {
            const newDirection = prev === 'asc' ? 'desc' : 'asc';
            setSortIcon(newDirection === 'asc' ? faUpLong : faDownLong);
            return newDirection;
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <DashBoardBackground>
            <DashBoardWrapper>
                <DashBoardHeader>Overdue Orders</DashBoardHeader>
                <Table
                    orderItems={sortedOrders}
                    itemsPerPage={5}
                    handleSort={handleSort}
                    sortIcon={sortIcon}
                />
            </DashBoardWrapper>
        </DashBoardBackground>
    );
};
