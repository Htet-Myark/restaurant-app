// index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ GET all menu items
app.get('/api/menu', async (req, res) => {
  const items = await prisma.menuItem.findMany();
  res.json(items);
});

// ✅ POST a new order
app.post('/api/order', async (req, res) => {
  const { table, items } = req.body;

  const order = await prisma.order.create({
    data: {
      table,
      items: {
        create: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        }))
      }
    },
    include: { items: true },
  });

  res.json(order);
});

// ✅ GET all orders (admin)
app.get('/api/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { menuItem: true }
      }
    }
  });
  res.json(orders);
});

app.get('/api/orders/:tableId', async (req, res) => {
  const tableId = parseInt(req.params.tableId);

  try {
    const orders = await prisma.order.findMany({
      where: { table: tableId },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (err) {
    console.error('Error loading orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});




// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
