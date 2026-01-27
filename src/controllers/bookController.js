// In createBook function, you can add:
if (req.isAuthenticated()) {
    // Optionally store who created the book
    bookData.createdBy = req.user.id;
}

// Add a new function for user's books:
const getUserBooks = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    
    try {
        const books = await Book.find({ createdBy: req.user.id });
        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};