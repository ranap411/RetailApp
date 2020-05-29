import { LightningElement, track } from 'lwc';

export default class TransactionScreen extends LightningElement {
    @track orders = [
        { "Name": "Product 1", "BatchNo": "P001", "UnitPrice": "1000", "Unit": "3", "Amount": "3000" },
        { "Name": "Product 2", "BatchNo": "P002", "UnitPrice": "500", "Unit": "2", "Amount": "1000" },
        { "Name": "Product 3", "BatchNo": "P003", "UnitPrice": "100", "Unit": "5", "Amount": "500" },
        { "Name": "Product 4", "BatchNo": "P004", "UnitPrice": "1500", "Unit": "2", "Amount": "3000" },
        { "Name": "Product 5", "BatchNo": "P005", "UnitPrice": "700", "Unit": "1", "Amount": "700" },
        { "Name": "Product 6", "BatchNo": "P006", "UnitPrice": "1200", "Unit": "4", "Amount": "4800" }
    ];

}