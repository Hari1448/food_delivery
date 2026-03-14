const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');
const User = require('./models/User');

const seedData = async () => {
    try {
        // Clear existing data
        await Restaurant.deleteMany({});
        await FoodItem.deleteMany({});

        // Find an owner or create one
        let owner = await User.findOne({ role: 'restaurant_owner' });
        if (!owner) {
            owner = await User.create({
                name: "Chef Mario",
                email: "chef@mario.com",
                password: "password123",
                role: "restaurant_owner",
                phone: "1234567890"
            });
        }

        // --- ADMIN ---
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            await User.create({
                name: "Platform Admin",
                email: "admin@foodie.com",
                password: "adminpassword",
                role: "admin",
                phone: "0000000000"
            });
        }

        // --- RESTAURANTS ---

        const restaurants = [
            {
                name: "Hari's Kitchen",
                owner: owner._id,
                description: 'The finest flame-grilled burgers in the city.',
                cuisine: ['Burgers', 'American'],
                rating: 4.8,
                numReviews: 1250,
                deliveryTime: 25,
                images: ['https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=600']
            },
            {
                name: 'Pizza di Napoli',
                owner: owner._id,
                description: 'Authentic wood-fired Neapolitan pizzas.',
                cuisine: ['Pizza', 'Italian'],
                rating: 4.9,
                numReviews: 3400,
                deliveryTime: 20,
                images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600']
            },
            {
                name: 'Sushi Zen',
                owner: owner._id,
                description: 'Fresh sushi and sashimi prepared by master chefs.',
                cuisine: ['Sushi', 'Japanese'],
                rating: 4.7,
                numReviews: 890,
                deliveryTime: 35,
                images: ['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600']
            },
            {
                name: 'Taco Fiesta',
                owner: owner._id,
                description: 'Vibrant Mexican street tacos and margaritas.',
                cuisine: ['Tacos', 'Mexican'],
                rating: 4.6,
                numReviews: 1100,
                deliveryTime: 15,
                images: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600']
            },
            {
                name: 'The Green Bowl',
                owner: owner._id,
                description: 'Healthy salads and organic power bowls.',
                cuisine: ['Salad', 'Healthy'],
                rating: 4.5,
                numReviews: 450,
                deliveryTime: 20,
                images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600']
            },
            {
                name: 'Sweet Tooth Bakery',
                owner: owner._id,
                description: 'Delectable cakes, pastries, and artisanal desserts.',
                cuisine: ['Dessert', 'Bakery'],
                rating: 4.9,
                numReviews: 2100,
                deliveryTime: 30,
                images: ['https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=600']
            }
        ];

        const createdRestaurants = await Restaurant.insertMany(restaurants);

        // --- FOOD ITEMS ---

        const foodItems = [];

        // Burger varieties
        const rBurger = createdRestaurants[0];
        foodItems.push(
            { restaurant: rBurger._id, name: 'Classic Cheeseburger', description: 'Angus beef, cheddar, lettuce, tomato, secret sauce.', price: 299, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rBurger._id, name: 'Truffle Wagyu Burger', description: 'Premium wagyu beef with black truffle aioli and swiss cheese.', price: 549, category: 'Burger', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rBurger._id, name: 'Spicy Zinger Burger', description: 'Crispy fried chicken with peri-peri sauce and jalapeños.', price: 349, category: 'Burger', image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&q=80&w=400' }
        );

        // Pizza varieties
        const rPizza = createdRestaurants[1];
        foodItems.push(
            { restaurant: rPizza._id, name: 'Margherita Classica', description: 'San Marzano tomatoes, fresh buffalo mozzarella, basil.', price: 399, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rPizza._id, name: 'Double Pepperoni Feast', description: 'Loaded with spicy pepperoni and extra mozzarella.', price: 499, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rPizza._id, name: 'Truffle Mushroom Pizza', description: 'Wild mushrooms, truffle oil, goat cheese, and thyme.', price: 649, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400' }
        );

        // Sushi varieties
        const rSushi = createdRestaurants[2];
        foodItems.push(
            { restaurant: rSushi._id, name: 'Dragon Roll', description: 'Shrimp tempura, cucumber, avocado, and unagi sauce.', price: 799, category: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rSushi._id, name: 'Salmon Sashimi (8pcs)', description: 'Freshly sliced premium Atlantic salmon.', price: 899, category: 'Sushi', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rSushi._id, name: 'Crunchy Spicy Tuna', description: 'Tuna, spicy mayo, and tempura flakes.', price: 699, category: 'Sushi', image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&q=80&w=400' }
        );

        // Taco varieties
        const rTaco = createdRestaurants[3];
        foodItems.push(
            { restaurant: rTaco._id, name: 'Carne Asada Tacos', description: '3 tacos with marinated steak, onions, and cilantro.', price: 349, category: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rTaco._id, name: 'Baja Fish Tacos', description: 'Crispy cod with slaw and lime crema.', price: 399, category: 'Tacos', image: 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rTaco._id, name: 'Pull Pork Carnitas', description: 'Slow-cooked pork with pickled onions.', price: 299, category: 'Tacos', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=400' }
        );

        // Salad varieties
        const rSalad = createdRestaurants[4];
        foodItems.push(
            { restaurant: rSalad._id, name: 'Quinoa Power Bowl', description: 'Quinoa, kale, chickpeas, avocado, and lemon tahini.', price: 249, category: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rSalad._id, name: 'Greek Salad', description: 'Assorted greens, feta, olives, and mediterranean dressing.', price: 199, category: 'Salad', image: 'https://images.unsplash.com/photo-1540420753420-319e8b15d669?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rSalad._id, name: 'Ceasar with Grilled Chicken', description: 'Classic ceasar with parmesan and grilled chicken breast.', price: 299, category: 'Salad', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400' }
        );

        // Dessert varieties
        const rDessert = createdRestaurants[5];
        foodItems.push(
            { restaurant: rDessert._id, name: 'Molten Lava Cake', description: 'Warm chocolate cake with a gooey center.', price: 149, category: 'Dessert', image: 'https://images.unsplash.com/photo-1563805042-dfc8d713941d?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rDessert._id, name: 'New York Cheesecake', description: 'Classic creamy cheesecake with berry compote.', price: 199, category: 'Dessert', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rDessert._id, name: 'Tiramisu', description: 'Legacy Italian dessert with espresso and mascarpone.', price: 249, category: 'Dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=400' }
        );

        // --- SPECIALTY LIFESTYLE ITEMS ---

        const rHealthy = createdRestaurants[4]; // The Green Bowl
        foodItems.push(
            // Gym Peoples
            { restaurant: rHealthy._id, name: 'High Protein Chicken Bowl', description: 'Double grilled chicken, quinoa, boiled eggs, and spinach.', price: 349, category: 'Gym Peoples', image: '/images/food/high-protein-chicken-bowl.png' },
            { restaurant: rHealthy._id, name: 'Peanut Butter Protein Shake', description: 'Whey protein, natural peanut butter, oats, and banana.', price: 199, category: 'Gym Peoples', image: '/images/food/peanut-butter-protein-shake.png' },
            { restaurant: rHealthy._id, name: 'Lean Beef & Broccoli', description: 'Grass-fed beef strips with steamed broccoli and brown rice.', price: 399, category: 'Gym Peoples', image: '/images/food/lean-beef-broccoli.png' }
        );

        const rOldAge = createdRestaurants[4];
        foodItems.push(
            // Old Age Peoples - Traditional Village Style
            { restaurant: rOldAge._id, name: 'Traditional Millet Porridge', description: 'Healthy ragi porridge made with buttermilk and small onions. Authentic village style.', price: 99, category: 'Old Age Peoples', image: 'https://images.unsplash.com/photo-1599021456807-25db0f974333?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rOldAge._id, name: 'Steamed Rice Cakes with Herbal Soup', description: 'Soft idlis served with a nutritious "Mudakathan" herbal soup to help with joint pain.', price: 129, category: 'Old Age Peoples', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rOldAge._id, name: 'Soft Steamed Lentils', description: 'Easy-to-digest yellow lentils with mild spices.', price: 149, category: 'Old Age Peoples', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400' }
        );

        const rAdults = createdRestaurants[0];
        foodItems.push(
            // Adults
            { restaurant: rAdults._id, name: 'Executive Steak Platter', description: 'Medium-rare steak with roasted asparagus and red wine reduction.', price: 899, category: 'Adults', image: 'https://images.unsplash.com/photo-1546069901-e5322517f70b?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rAdults._id, name: 'Grilled Salmon Fillet', description: 'Atlantic salmon with baby potatoes and lemon-dill sauce.', price: 749, category: 'Adults', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400' }
        );

        const rKids = createdRestaurants[1]; // Pizza di Napoli
        foodItems.push(
            // Kids
            { restaurant: rKids._id, name: 'Mini Smiley Pizzas', description: '3 bite-sized pizzas with cherry tomato smiley faces.', price: 199, category: 'Kids', image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rKids._id, name: 'Dino Chicken Nuggets', description: 'Dinosaur-shaped crispy chicken with mild dip.', price: 149, category: 'Kids', image: 'https://images.unsplash.com/photo-1562967914-6c82c65e4ff6?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rKids._id, name: 'Rainbow Mac n Cheese', description: 'Colorful cheesy pasta that kids love!', price: 249, category: 'Kids', image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rKids._id, name: 'Teddy Bear Pancakes', description: 'Fluffy pancakes shaped like a teddy bear with fruit decorations.', price: 179, category: 'Kids', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=400' },

            // Chocolates for Kids
            { restaurant: rDessert._id, name: 'Magic Chocolate Box', description: 'A selection of 6 handcrafted milk chocolates with fun shapes.', price: 299, category: 'Kids', image: 'https://images.unsplash.com/photo-1549007994-cb92cf8a7a8d?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rDessert._id, name: 'Giant KitKat Shake', description: 'Thick chocolate milkshake topped with KitKat chunks and whipped cream.', price: 229, category: 'Kids', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rDessert._id, name: 'Nutella Stuffed Cookies', description: 'Soft baked cookies with a gooey hazelnut chocolate center.', price: 149, category: 'Kids', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400' },
            { restaurant: rDessert._id, name: 'Chocolate Dipped Strawberries', description: 'Fresh strawberries dipped in premium Belgian milk chocolate.', price: 199, category: 'Kids', image: 'https://images.unsplash.com/photo-1572451479139-6a308211d8be?auto=format&fit=crop&q=80&w=400' }
        );

        await FoodItem.insertMany(foodItems);

        console.log("Database SeedED with INR varieties successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

module.exports = seedData;
