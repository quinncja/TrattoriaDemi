const express = require("express");
const orderRouter = express.Router();
const { Item, Menu, Section } = require('./Menu');
const { ObjectId } = require('mongoose').Types;

async function loadMenus(req, res, next) {
    try {
        const menuTypes = ['lunch', 'dinner', 'wine'];
        const menus = await Menu.find({ menuType: { $in: menuTypes } });

        // For each menu, get associated sections and items.
        const menuPromises = menus.map(async menu => {
            const sections = await Section.find({ menuId: menu._id });
            const sectionPromises = sections.map(async section => {
                const items = await Item.find({ sectionId: section._id });
                return {
                    ...section.toObject(),
                    items
                };
            });

            const resolvedSections = await Promise.all(sectionPromises);
            return {
                ...menu.toObject(),
                sections: resolvedSections
            };
        });

        const resolvedMenus = await Promise.all(menuPromises);

        req.menus = {};
        resolvedMenus.forEach(menu => {
            req.menus[menu.menuType] = menu;
        });

        next();
    } catch (err) {
        console.error('Error fetching menus:', err);
        return res.status(500).json({ message: "Failed to load the menus." });
    }
}


orderRouter.get('/menus', loadMenus, (req, res) => {
    res.json(req.menus);
});


orderRouter.post('/checkout', async (req, res) => {
    try {
        const serverItemsList = req.body;
        let total = 0;

        for (let serverItem of serverItemsList) {
            const item = await Item.findById(new ObjectId(serverItem.itemId));
            total += item.price;

            if (serverItem.size) {
                const size = item.sizes.find(s => s._id.toString() === serverItem.size);
                if (size) {
                    total += size.price;
                }
            }

            if (serverItem.sauce) {
                const sauce = item.sauces.find(s => s._id.toString() === serverItem.sauce);
                if (sauce) {
                    total += sauce.price;
                }
            }

            if (serverItem.pasta) {
                const pasta = item.pastas.find(p => p._id.toString() === serverItem.pasta);
                if (pasta) {
                    total += pasta.price;
                }
            }
            if (serverItem.platter.length) {
                total += (serverItem.platter.length - 1) * 5
            }
            if (serverItem.options.length) {
                for (let optionId of serverItem.options) {
                    const option = item.options.find(o => o._id.toString() === optionId);
                    if (option) {
                        total += option.price;
                    }
                }
            }
            if (serverItem.dressing) {
                total += serverItem.dressingQty * 0.75;
            }
        }

        res.json({ total: total.toFixed(2) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing the order" });
    }
});

module.exports = orderRouter;
