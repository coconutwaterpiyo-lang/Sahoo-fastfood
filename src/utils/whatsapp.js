const WA_NUMBER = process.env.REACT_APP_WA_NUMBER || "918249790363";

/**
 * Build and open a WhatsApp order message.
 * @param {object} order - { orderId, items, total, deliveryDetails }
 */
export function sendOrderViaWhatsApp(order) {
  const { orderId, items, total, deliveryDetails: d } = order;

  const itemLines = items
    .map((i) => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`)
    .join("\n");

  const message = encodeURIComponent(
`🍽️ *New Order – Sahoo Family Fastfood*

Order ID: ${orderId}
Customer: ${d.name}
Phone: ${d.phone}

*Items:*
${itemLines}

*Total: ₹${total}*

*Delivery Address:*
${d.address}
${d.notes ? `\nNotes: ${d.notes}` : ""}`
  );

  window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, "_blank");
}

export const WA_CHANNEL = process.env.REACT_APP_WA_CHANNEL ||
  "https://whatsapp.com/channel/0029VbD0z1m7DAWqhCHcUe0u";
