import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PartnerFeed = () => {
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch partner orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://foodshort.onrender.com/api/order/partner/orders", {
          withCredentials: true,
        });

        console.log(res);
        

        const data = res.data.orders;

        setOrders(data);

        // Calculate stats
        const totalOrders = data.length;
        const totalRevenue = data.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingDeliveries = data.filter(order => order.items.some(i => i.status === "Pending")).length;
        const newReviews = 0; // replace with actual logic if you have reviews

        setStats([
          { title: "Today's Orders", value: totalOrders },
          { title: "Total Revenue", value: `$${totalRevenue}` },
          { title: "Pending Deliveries", value: pendingDeliveries },
          { title: "New Reviews", value: newReviews },
        ]);

      } catch (err) {
        if(err.response.data.message === "Unauthorized: Partner login required"){
              navigate("/foodpartner/login")
        }
        console.error("Failed to fetch partner orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Partner Dashboard</h1>
        <button
          onClick={() => navigate("/foodpartner/upload")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          + Add Food Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-gray-500">{stat.title}</h3>
            <p className="text-xl font-bold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Customer</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Items</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{order.user.fullName}</td>
                <td className="px-4 py-3">{order.items.map(i => i.product.name).join(", ")}</td>
                <td className="px-4 py-3">${order.totalAmount}</td>
                <td className={`px-4 py-3 font-semibold ${order.items.some(i => i.status === "Pending") ? "text-yellow-500" : "text-green-500"}`}>
                  {order.items.some(i => i.status === "Pending") ? "Pending" : "Delivered"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerFeed;

