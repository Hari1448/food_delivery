// FoodieDash AI Controller
// This will handle natural language queries for food recommendations

exports.getFoodRecommendation = async (req, res) => {
    try {
        const { query, userPreference } = req.body;

        // In a real implementation, this would call OpenAI/Gemini
        // For now, we use a smart heuristic or a template

        const recommendations = [
            {
                id: 1,
                name: "Truffle Burger",
                restaurant: "Gourmet Hub",
                reason: "Matches your craving for something savory and premium."
            },
            {
                id: 2,
                name: "Quinoa Salad",
                restaurant: "Health First",
                reason: "Ideal for a light lunch based on your 'Healthy' profile."
            }
        ];

        res.status(200).json({
            status: 'success',
            answer: `Based on your request "${query}", I recommend checking out the Truffle Burger from Gourmet Hub. It's highly rated today!`,
            recommendations
        });
    } catch (err) {
        res.status(500).json({ message: "AI processing failed" });
    }
};
