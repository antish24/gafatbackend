const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch all inventory
router.get('/inventory', async (req, res) => {
    try {
        const inventory = await prisma.inventory.findMany();
        res.json(inventory);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Error fetching inventory' });
    }
});

// Fetch all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await prisma.employee.findMany();
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Error fetching employees', details: error.message });
    }
});

// Create a new request
router.post('/create', async (req, res) => {
    const { inventoryId, employeeId, quantity } = req.body;

    // Validation
    if (!inventoryId || !employeeId || !quantity) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if the inventory has enough quantity
        const inventoryItem = await prisma.inventory.findUnique({
            where: { id: inventoryId },
        });

        if (!inventoryItem || inventoryItem.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient inventory quantity.' });
        }

        // Create the request
        const newRequest = await prisma.request.create({
            data: {
                inventoryId,
                employeeId,
                quantity,
            },
        });

        // Update the inventory quantity after the request is created
        await prisma.inventory.update({
            where: { id: inventoryId },
            data: {
                quantity: {
                    decrement: quantity, // Reduce quantity based on the request
                },
            },
        });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Error creating request' });
    }
});

// Fetch all requests with related inventory and employee data
router.get('/all', async (req, res) => {
    try {
        const requests = await prisma.request.findMany({
            include: {
                inventory: true,  // Include related inventory data
                employee: true,   // Include related employee data
            },
        });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Error fetching requests', details: error.message });
    }
});

// Update a request
router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { inventoryId, employeeId, quantity } = req.body;

    try {
        // Fetch current request details
        const currentRequest = await prisma.request.findUnique({
            where: { id: parseInt(id) },
        });
        
        // If the request exists, adjust inventory accordingly
        if (currentRequest) {
            // Update the inventory quantity based on the current request
            await prisma.inventory.update({
                where: { id: currentRequest.inventoryId },
                data: {
                    quantity: {
                        increment: currentRequest.quantity, // Restore old request quantity
                    },
                },
            });

            // Now proceed to update the request
            const updatedRequest = await prisma.request.update({
                where: { id: parseInt(id) },
                data: { inventoryId, employeeId, quantity },
            });

            // Finally, update the inventory again to reflect new quantity allocation
            await prisma.inventory.update({
                where: { id: inventoryId },
                data: {
                    quantity: {
                        decrement: quantity, // Update inventory based on new request
                    },
                },
            });

            res.json(updatedRequest);
        } else {
            res.status(404).json({ error: 'Request not found' });
        }

    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ error: 'Error updating request', details: error.message });
    }
});

// Delete a request
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the request to get the inventory ID and quantity
        const requestToDelete = await prisma.request.findUnique({
            where: { id: parseInt(id) },
        });

        if (!requestToDelete) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Delete the request
        await prisma.request.delete({
            where: { id: parseInt(id) },
        });

        // Update the inventory quantity after the request is deleted
        await prisma.inventory.update({
            where: { id: requestToDelete.inventoryId },
            data: {
                quantity: {
                    increment: requestToDelete.quantity, // Restore quantity based on the deleted request
                },
            },
        });

        res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ error: 'Error deleting request', details: error.message });
    }
});

// Return an inventory item
// Return an inventory item
router.post('/return', async (req, res) => {
    const { inventoryId, quantity, requestId, employeeId } = req.body;

    //Validation
    if (!inventoryId || typeof quantity !== 'number' || quantity <= 0 || !requestId || !employeeId) {
        return res.status(400).json({ error: 'Inventory ID, valid quantity, request ID, and employee ID are required.' });
    }

    try {
        // First, update the inventory quantity
        await prisma.inventory.update({
            where: { id: inventoryId },
            data: {
                quantity: {
                    increment: quantity, // Increase quantity based on the return
                },
            },
        });

        // Create a new return record
        const newReturn = await prisma.return.create({
            data: {
                inventoryId,
                quantity,
                requestId,
                employeeId, // Save employee ID
            },
        });

        // Update the corresponding request record to reflect the returned item
        await prisma.request.update({
            where: { id: requestId },
            data: {
                quantity: {
                    decrement: quantity, // Increase the request quantity based on return
                },
            },
        });

        res.status(201).json(newReturn);
    } catch (error) {
        console.error('Error creating return:', error);
        res.status(500).json({ error: 'Error creating return', details: error.message });
    }
});





// Fetch all returns
router.get('/returns', async (req, res) => {
    try {
        console.log('Fetching returns...');
        const returns = await prisma.return.findMany({
            include: {
                inventory: true,
                        employee:true, // Include employee details related to the request
                    }
        });
        res.json(returns);
    } catch (error) {
        console.error('Error fetching returns:', error);
        res.status(500).json({ error: 'Error fetching returns', details: error.message });
    }
});



// Create a new return
// router.post('/return', async (req, res) => {
//     const { inventoryId, quantity, requestId } = req.body; // Receive requestId for related request

//     // Validation
//     if (!inventoryId || typeof quantity !== 'number' || quantity <= 0 || !requestId) {
//         return res.status(400).json({ error: 'Inventory ID, valid quantity, and request ID are required.' });
//     }

//     try {
//         // First, update the inventory quantity
//         await prisma.inventory.update({
//             where: { id: inventoryId },
//             data: {
//                 quantity: {
//                     increment: quantity, // Increase quantity based on the return
//                 },
//             },
//         });

//         // Create a new return record
//         const newReturn = await prisma.return.create({
//             data: {
//                 inventoryId,
//                 quantity,
//                 requestId,
//             },
//         });

//         // Update the corresponding request record to reflect the returned item
//         await prisma.request.update({
//             where: { id: requestId },
//             data: {
//                 quantity: {
//                     decrement: quantity, // Decrease the request quantity based on the return
//                 },
//             },
//         });

//         res.status(201).json(newReturn);
//     } catch (error) {
//         console.error('Error creating return:', error);
//         res.status(500).json({ error: 'Error creating return' });
//     }
// });


// Fetch all requests with related inventory and employee data
// Fetch all requests with optional employee name search
router.get('/allemp', async (req, res) => {
    const { employeeName } = req.query; // Get the search parameter

    try {
        const requests = await prisma.request.findMany({
            include: {
                inventory: true,
                employee: true,
            },
            where: employeeName ? {
                employee: {
                    OR: [
                        {
                            fName: {
                                contains: employeeName, // Search by first name
                            },
                        },
                        {
                            lName: {
                                contains: employeeName, // Search by last name
                            },
                        },
                    ],
                },
            } : {},
        });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Error fetching requests', details: error.message });
    }
});



module.exports = router;