import express, { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import zlib from "zlib";
import path from "path";

interface Store {
    storeId: string;
    marketplace: string;
    country: string;
    shopName: string
}

interface Order {
    Id: string;
    storeId: string;
    orderId: string;
    latest_ship_date: string;
    shipment_status: string;
    destination: string;
    items: string;
    orderValue: string
}

interface IResult {
    country: string;
    marketplace: string;
    shopName: string | undefined;
    orderId: string;
    orderValue: string;
    items: string;
    destination: string;
    daysOverdue: number;
}

export function getSales(req: Request, res: Response): void {
    const stores: Record<string, { marketplace: string; country: string; shopName?: string }> = {};
    const results: IResult[] = [];

    // Process with CSV/GZ files
    fs.createReadStream(path.join(__dirname, "../data/stores.csv"))
        .pipe(csv())
        .on("data", (data: Store) => {
            const { storeId, marketplace, country, shopName } = data;
            stores[storeId] = { marketplace, country, shopName };
        })
        .on("end", () => {
            const gunzip = zlib.createGunzip();
            fs.createReadStream(path.join(__dirname, "../data/orders.csv.gz"))
                .pipe(gunzip)
                .pipe(csv())
                .on("data", (data: Order) => {
                    const {
                        storeId,
                        orderId,
                        latest_ship_date,
                        shipment_status,
                        destination,
                        items,
                        orderValue,
                    } = data;

                    if (shipment_status === "Pending" && stores[storeId]) {
                        const storeInfo = stores[storeId];
                        const daysOverdue = calculateDaysOverdue(latest_ship_date);
                        if (daysOverdue > 0) {
                            results.push({
                                country: storeInfo.country,
                                marketplace: storeInfo.marketplace,
                                shopName: storeInfo.shopName,
                                orderId: orderId,
                                orderValue: orderValue,
                                items: items,
                                destination: destination,
                                daysOverdue: daysOverdue,
                            });
                        }
                    }
                })
                .on("end", () => {
                    res.json(results);
                })
                .on("error", (error: Error) => {
                    console.error("Error reading orders:", error);
                    res.status(500).json({ error: "Error reading orders" });
                });
        })
        .on("error", (error: Error) => {
            console.error("Error reading stores:", error);
            res.status(500).json({ error: "Error reading stores" });
        });
}

function calculateDaysOverdue(latestShipDate: string): number {
    const latestDate = new Date(latestShipDate);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - latestDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
