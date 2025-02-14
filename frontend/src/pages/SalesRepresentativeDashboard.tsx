import { useEffect, useState } from "react";
import axios from "axios";

const SalesRepresentativeDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch sales leads and orders when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not authorized to view this page.");
          return;
        }

        // Fetch sales leads
        const leadsResponse = await axios.get("http://localhost:5000/sale/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeads(leadsResponse.data);

        // Fetch sales orders
        const ordersResponse = await axios.get("http://localhost:5000/sale/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred while fetching data.");
      }
    };

    fetchUserData();
  }, []);

  // Render the dashboard
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Sales Representative Dashboard</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Sales Leads Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Sales Leads</h2>
        {leads.length > 0 ? (
          <ul className="space-y-2">
            {leads.map((lead: any) => (
              <li key={lead.id} className="bg-gray-100 p-4 rounded-lg">
                <p><strong>Name:</strong> {lead.customerName}</p>
                <p><strong>Email:</strong> {lead.contactInfo}</p>
                <p><strong>Status:</strong> {lead.pipelineStep}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sales leads found.</p>
        )}
      </div>

      {/* Sales Orders Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Sales Orders</h2>
        {orders.length > 0 ? (
          <ul className="space-y-2">
            {orders.map((order: any) => (
              <li key={order.id} className="bg-gray-100 p-4 rounded-lg">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sales orders found.</p>
        )}
      </div>
    </div>
  );
};

export default SalesRepresentativeDashboard;