const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client'); // Import PrismaClient
const prisma = new PrismaClient();

// POST /inventory/create - To create a new inventory item
router.post('/create', async (req, res) => {
  try {
    const { name, quantity, price, description } = req.body;

    // Use Prisma to create a new inventory item
    const inventoryItem = await prisma.inventory.create({
      data: {
        name,
        quantity,
        price,
        description,
      },
    });

    res.status(200).json({ message: 'Inventory item created successfully!', data: inventoryItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /inventory/edit/:id - To edit an existing inventory item
router.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, price, description } = req.body;
    const currentDate = new Date();
    currentDate.setUTCHours(12, 0, 0, 0); // Set time to midnight (00:00:00)
    // Use Prisma to update the inventory item by its ID
    const updatedItem = await prisma.inventory.update({
      where: { id: parseInt(id) },
      data: {
        name,
        quantity,
        price,
        description,
        createdAt: currentDate,
      },
    });

    res.status(200).json({ message: 'Inventory item updated successfully!', data: updatedItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /inventory - Fetch all inventory items
router.get('/all', async (req, res) => {
  try {
    // Use Prisma to get all inventory items
    const inventoryItems = await prisma.inventory.findMany();

    res.status(200).json({ data: inventoryItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /inventory/:id - Fetch a single inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Use Prisma to fetch an inventory item by its ID
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: parseInt(id) },
    });

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json({ data: inventoryItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE /inventory/delete/:id - To delete an inventory item by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Use Prisma to delete the inventory item by its ID
    await prisma.inventory.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Inventory item deleted successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /inventory/allinv
// GET /inventory/allinv
router.get('/searchinv', async (req, res) => {
  const {search}=req.query
  try {
    console.log(search)
    // Use Prisma to get all inventory items
    const inventoryItems = await prisma.inventory.findMany({});

    res.status(200).json({ data: inventoryItems });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

router.get('/allinv', async (req, res) => {
  const { search } = req.query; // Get the search parameter
  try {
    console.log(search)
    const inventories = await prisma.inventory.findMany({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive', // Case-insensitive search
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}, // Return all records if no search query is provided
    });

    res.json({ data: inventories }); // Always return data, even if it's an empty array
  } catch (error) {
    console.error('Error fetching inventories:', error); // Log the error
    res.status(500).json({ error: 'Error fetching inventories', details: error.message });
  }
});






module.exports = router;
