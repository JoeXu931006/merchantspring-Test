import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Order } from "./DashBoard";
import { Pagination } from "./Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const StyledTable = styled.table`
  width: 100%;
  font-family: "Roboto", sans-serif;
  text-align: left;
  border-collapse: collapse;
  
  th {
    background-color: #f2f5f9;
    color: #888888;
    font-weight: light;
    font-size: small;
  }
  
  td, th {
    border: 1px solid #f0f0f0;
    border-left: none;
    border-right: none;
    padding: 20px;
  }
  
  .overdueDay {
    color: red;
    padding-left: 4rem;
  }
  
  .items {
    padding-left: 2rem;
  }
  
  .sortButton {
    margin-left: 2px;
    border: none;
    background-color: #f2f5f9;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px; 
`;

type OrdersTableProps = {
    orderItems: Order[];
    itemsPerPage: number;
    handleSort: any;
    sortIcon: IconProp;
};

const countryFlagMap: { [key: string]: string } = {
    AUS: 'au',
    GBR: 'gb',
    USA: 'us',
};

const getFlagIcon = (country?: string): JSX.Element | null => {
    const flagCode = countryFlagMap[country as keyof typeof countryFlagMap];
    const flagSrc = flagCode ? `https://flagcdn.com/w20/${flagCode}.png` : '';
    return flagSrc ? <img src={flagSrc} alt={`${country} flag`} className="flag" style={{ width: '20px', height: 'auto' }} /> : null; // Add styles as necessary
};
export const Table = ({ orderItems, itemsPerPage, handleSort, sortIcon }: OrdersTableProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [subset, setSubset] = useState<Order[]>([]);

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    useEffect(() => {
        setTotalPages(Math.ceil(orderItems.length / itemsPerPage));
        setSubset(orderItems.slice(startIndex, endIndex));
    }, [itemsPerPage, orderItems, endIndex, startIndex]);

    const handlePageChange = (selectedPage: any) => {
        setCurrentPage(selectedPage.selected);
    };

    return (
        <>
            <StyledTable>
                <thead>
                    <tr>
                        <th>MARKETPLACE</th>
                        <th>STORE</th>
                        <th>ORDER ID</th>
                        <th>ORDER VALUE</th>
                        <th>ITEMS</th>
                        <th>DESTINATION</th>
                        <th>DAYS OVERDUE
                            <button
                                className='sortButton'
                                data-testid="sort-btn"
                                onClick={handleSort}
                            >
                                <FontAwesomeIcon icon={sortIcon} />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {subset && subset.map((orderItem, index) => (
                        <tr key={`${orderItem.orderId}_${index}`}>
                            <td>{getFlagIcon(orderItem.country)} {orderItem.marketplace}</td>
                            <td>{orderItem.shopName}</td>
                            <td>{orderItem.orderId}</td>
                            <td>
                                {
                                    new Intl.NumberFormat(
                                        'en-AU',
                                        { style: 'currency', currency: 'AUD' }
                                    ).format(Number(orderItem.orderValue))
                                }
                            </td>
                            <td className="items">{orderItem.items}</td>
                            <td>{orderItem.destination}</td>
                            <td className="overdueDay">{orderItem.daysOverdue}</td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>

            <PaginationWrapper>
                <Pagination totalPages={totalPages} onPageChange={handlePageChange} currentPage={currentPage} />
            </PaginationWrapper>
        </>
    );
}
