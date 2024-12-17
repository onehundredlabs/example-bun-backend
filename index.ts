import { serve } from "bun";
import {
  mockInvoices,
  mockInvoicesSummary,
  mockInvoicesWithItems,
} from "./mock-database";

const PORT = 3001;

serve({
  port: PORT,
  async fetch(request: Request) {
    const { method } = request;
    const { pathname } = new URL(request.url);

    if (method === "GET" && pathname === "/api/invoices") {
      console.log("GET: /api/invoices");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      return Response.json(mockInvoices);
    }

    if (method === "GET" && pathname === "/api/invoices/summary") {
      console.log("GET: /api/invoices/summary");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      return Response.json(mockInvoicesSummary);
    }

    if (method === "GET") {
      const pathRegex = /^\/api\/invoices\/(.*)$/;
      const match = pathname.match(pathRegex);
      const id = match && match[1];

      if (id) {
        console.log(`GET: /api/invoices/${id}`);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const dataById = mockInvoicesWithItems.find(
          (invoice) => invoice.invoiceId === id
        );

        if (dataById) {
          return Response.json(dataById);
        }
      }
    }

    if (method === "DELETE") {
      const pathRegex = /^\/api\/invoices\/([^/]+)\/items\/([^/]+)$/;
      const match = pathname.match(pathRegex);
      const invoiceId = match && match[1];
      const itemId = match && match[2];

      if (invoiceId && itemId) {
        console.log(`DELETE: /api/invoices/${invoiceId}/items/${itemId}`);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const invoice = mockInvoicesWithItems.find(
          (invoice) => invoice.invoiceId === invoiceId
        );

        if (invoice) {
          invoice.items = invoice.items.filter(
            (item) => item.invoiceItemId !== itemId
          );

          return Response.json(invoice);
        }
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${PORT}`);
